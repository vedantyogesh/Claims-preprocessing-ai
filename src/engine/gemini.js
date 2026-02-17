import { GEMINI_MODEL } from "../constants";
import { compressImage } from "../utils/compressImage";

// Compact prompt — every token in the instruction costs input quota.
// Removed all prose explanations; kept only the schema and scoring rules.
const EXTRACTION_PROMPT = `Extract health invoice data. Output ONLY a JSON object, no markdown.

Schema:
{"documentType":"invoice|prescription|receipt|other|unreadable","isHandwritten":bool,"fields":{"providerName":{"value":str|null,"confidence":0-1},"invoiceDate":{"value":"YYYY-MM-DD"|null,"confidence":0-1},"totalAmount":{"value":num|null,"confidence":0-1},"lineItems":{"value":[{"description":str,"amount":num}]|null,"confidence":0-1},"patientName":{"value":str|null,"confidence":0-1}},"overallNotes":str}

Confidence: 1.0=unambiguous, 0.8-0.99=minor uncertainty, 0.5-0.79=partial/unclear, 0.0-0.49=missing/illegible.
Rules: non-invoice/receipt→lower all confidences. Unreadable→documentType="unreadable",all confidence=0. Lump-sum only (no itemised breakdown)→lineItems.confidence<0.5. invoiceDate must be ISO 8601.`;

export async function extractInvoiceData(file) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

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
      maxOutputTokens: 512,   // longest valid response is ~350 tokens; was 1024
      candidateCount: 1,      // never generate alternatives
    },
  };

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err?.error?.message || "Gemini API error");
  }

  const data = await response.json();
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!rawText) throw new Error("Empty response from Gemini");

  // Strip any code fences the model may add despite instruction
  const cleaned = rawText.replace(/```(?:json)?|```/g, "").trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    throw new Error("Failed to parse Gemini response as JSON");
  }
}
