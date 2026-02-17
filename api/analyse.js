// Vercel serverless function — runs on the server only.
// GEMINI_API_KEY is a Vercel environment variable; it never reaches the browser.
// BYOK: if the client supplies an "x-gemini-key" header, that key is used instead,
// allowing users to consume their own quota.

const GEMINI_MODEL = "gemini-2.0-flash-lite";
const UPSTREAM = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

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
    const upstream = await fetch(`${UPSTREAM}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });

    const data = await upstream.json();

    if (!upstream.ok) {
      return res.status(upstream.status).json({
        error: data?.error?.message || "Upstream Gemini API error",
      });
    }

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message || "Internal server error" });
  }
}
