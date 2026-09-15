/**
 * AI provider abstraction.
 *
 * Swap Gemini for Claude by editing only this file — every caller
 * (meal analysis, DOCX parsing) imports the two functions below.
 */

const GEMINI_MODEL = "gemini-2.0-flash";
const GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta/models";

function requireKey() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY is not set.");
  return key;
}

export async function analyzeImage(
  base64: string,
  systemPrompt: string,
  userPrompt = "Analyze this meal photo."
): Promise<unknown> {
  const key = requireKey();
  const body = {
    system_instruction: { parts: [{ text: systemPrompt }] },
    contents: [
      {
        parts: [
          { text: userPrompt },
          { inline_data: { mime_type: "image/jpeg", data: base64 } },
        ],
      },
    ],
    generation_config: { response_mime_type: "application/json" },
  };
  const res = await fetch(
    `${GEMINI_BASE}/${GEMINI_MODEL}:generateContent?key=${key}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );
  if (!res.ok) throw new Error(`Gemini error: ${res.status}`);
  const json = await res.json();
  const text: string =
    json?.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}";
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}

export async function analyzeText(
  text: string,
  systemPrompt: string
): Promise<unknown> {
  const key = requireKey();
  const body = {
    system_instruction: { parts: [{ text: systemPrompt }] },
    contents: [{ parts: [{ text }] }],
    generation_config: { response_mime_type: "application/json" },
  };
  const res = await fetch(
    `${GEMINI_BASE}/${GEMINI_MODEL}:generateContent?key=${key}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );
  if (!res.ok) throw new Error(`Gemini error: ${res.status}`);
  const json = await res.json();
  const raw: string =
    json?.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}";
  try {
    return JSON.parse(raw);
  } catch {
    return { raw };
  }
}
