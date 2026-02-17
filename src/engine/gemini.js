import { GEMINI_MODEL } from "../constants";

const EXTRACTION_PROMPT = `
You are an invoice extraction system for a health insurance claims platform.

Analyze the uploaded document and return a JSON object with exactly this structure:
{
  "documentType": "invoice" | "prescription" | "receipt" | "other" | "unreadable",
  "isHandwritten": true | false,
  "fields": {
    "providerName":  { "value": string | null, "confidence": number },
    "invoiceDate":   { "value": string | null, "confidence": number },
    "totalAmount":   { "value": number | null, "confidence": number },
    "lineItems":     { "value": [{ "description": string, "amount": number }] | null, "confidence": number },
    "patientName":   { "value": string | null, "confidence": number }
  },
  "overallNotes": string
}

Confidence scoring rules (0.0 – 1.0):
- 1.0:   Field clearly visible, completely unambiguous
- 0.8–0.99: Field present, very minor uncertainty
- 0.5–0.79: Field present but unclear, partially readable, or uncertain
- 0.0–0.49: Field missing, illegible, or highly uncertain

Additional rules:
- If document is not an invoice or receipt, set documentType accordingly and reduce all confidences
- If image is completely unreadable, set documentType to "unreadable" and all confidences to 0
- lineItems confidence must be low (< 0.5) if only a lump-sum total is present with no breakdown
- Return ONLY valid JSON. No markdown, no backticks, no explanation text.
`;

export async function extractInvoiceData(base64Image, mimeType) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

  const body = {
    contents: [
      {
        parts: [
          { text: EXTRACTION_PROMPT },
          {
            inline_data: {
              mime_type: mimeType,
              data: base64Image,
            },
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.1,
      maxOutputTokens: 1024,
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

  // Strip markdown code fences if Gemini ignores the instruction
  const cleaned = rawText.replace(/```json|```/g, "").trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    throw new Error("Failed to parse Gemini response as JSON");
  }
}
