// Vercel serverless function — runs server-side only.
// GEMINI_API_KEY is a Vercel environment variable; it never reaches the browser.
// BYOK: if the client supplies an "x-gemini-key" header, that key is used instead.

const GEMINI_MODEL = "gemini-2.0-flash-lite";
const UPSTREAM = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
const MAX_RETRIES = 3;
const BASE_DELAY_MS = 1000;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Calls Gemini and retries automatically on 429 with exponential backoff.
// Attempt 0 → fail → wait ~1s
// Attempt 1 → fail → wait ~2s
// Attempt 2 → fail → wait ~4s
// Attempt 3 → fail → give up, return the 429 response as-is
async function callGemini(apiKey, body, attempt = 0) {
  const response = await fetch(`${UPSTREAM}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (response.status === 429 && attempt < MAX_RETRIES) {
    // Respect Google's Retry-After header if present, otherwise double the delay
    const retryAfterHeader = response.headers.get("Retry-After");
    const delay = retryAfterHeader
      ? parseInt(retryAfterHeader, 10) * 1000
      : BASE_DELAY_MS * Math.pow(2, attempt) + Math.random() * 500; // jitter
    await sleep(delay);
    return callGemini(apiKey, body, attempt + 1);
  }

  return response;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // BYOK takes precedence over the operator key
  const apiKey = req.headers["x-gemini-key"] || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: "No API key configured. Please enter your own Gemini API key to continue.",
    });
  }

  try {
    const upstream = await callGemini(apiKey, req.body);
    const data = await upstream.json();

    if (!upstream.ok) {
      // On a final 429 (all retries exhausted), return a sentinel string so the
      // client can show a friendly message without parsing Google's error envelope.
      return res.status(upstream.status).json({
        error: upstream.status === 429
          ? "quota_exhausted"
          : data?.error?.message || "Upstream Gemini API error",
      });
    }

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message || "Internal server error" });
  }
}
