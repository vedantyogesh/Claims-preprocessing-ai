import { compressImage } from "../utils/compressImage";

// Compact prompt — every token in the instruction costs input quota.
// Removed all prose explanations; kept only the schema and scoring rules.
const EXTRACTION_PROMPT = `Extract health invoice data. Output ONLY a JSON object, no markdown.

Schema:
{"documentType":"invoice|prescription|receipt|other|unreadable","isHandwritten":bool,"fields":{"providerName":{"value":str|null,"confidence":0-1},"invoiceDate":{"value":"YYYY-MM-DD"|null,"confidence":0-1},"totalAmount":{"value":num|null,"confidence":0-1},"lineItems":{"value":[{"description":str,"amount":num}]|null,"confidence":0-1},"patientName":{"value":str|null,"confidence":0-1}},"overallNotes":str}

Confidence: 1.0=unambiguous, 0.8-0.99=minor uncertainty, 0.5-0.79=partial/unclear, 0.0-0.49=missing/illegible.
Rules: non-invoice/receipt→lower all confidences. Unreadable→documentType="unreadable",all confidence=0. Lump-sum only (no itemised breakdown)→lineItems.confidence<0.5. invoiceDate must be ISO 8601.`;

// signal: AbortController signal to cancel in-flight requests on re-upload
// userApiKey: BYOK key from the UI — sent as a header so the proxy uses it instead
//             of the server-side operator key. If empty, the proxy falls back.
export async function extractInvoiceData(file, signal, userApiKey) {
  // Compress/resize before encoding — biggest single lever for token reduction.
  // A typical phone photo (~3MB) shrinks to ~80KB, cutting image tokens by ~95%.
  const { base64, mimeType } = await compressImage(file);

  const body = {
    contents: [
      {
        parts: [
          { text: EXTRACTION_PROMPT },
          { inline_data: { mime_type: mimeType, data: base64 } },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.1,       // deterministic extraction
      maxOutputTokens: 512,   // longest valid response is ~350 tokens
      candidateCount: 1,      // never generate alternatives
    },
  };

  const headers = { "Content-Type": "application/json" };
  if (userApiKey && userApiKey.trim()) {
    headers["x-gemini-key"] = userApiKey.trim();
  }

  // POST to our own Vercel proxy — the actual Gemini key never touches the browser.
  const response = await fetch("/api/analyse", {
    method: "POST",
    headers,
    body: JSON.stringify(body),
    signal,
  });

  // Safely parse JSON — an empty or non-JSON body (network error, cold-start
  // timeout, Vite proxy not running) would otherwise throw "Unexpected end of
  // JSON input" and swallow the real cause.
  let payload;
  try {
    payload = await response.json();
  } catch {
    throw new Error(
      response.ok
        ? "Empty response from server — check that the API proxy is running."
        : `Server error ${response.status} — check that the API proxy is running.`
    );
  }

  if (!response.ok) {
    const isQuota = response.status === 429 || payload?.error === "quota_exhausted";
    throw new Error(
      isQuota
        ? "API quota exceeded. Please wait a moment and try again, or enter your own Gemini API key below."
        : payload?.error || "Gemini API error"
    );
  }

  const rawText = payload.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!rawText) throw new Error("Empty response from Gemini");

  // Strip any code fences the model may add despite instruction
  const cleaned = rawText.replace(/```(?:json)?|```/g, "").trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    throw new Error("Failed to parse Gemini response as JSON");
  }
}
