import { GoogleGenerativeAI } from "@google/generative-ai";
import { SERVER_ENV } from "@/lib/env";

let cached: GoogleGenerativeAI | null = null;

export function getGemini() {
  if (cached) return cached;
  const { GOOGLE_GEMINI_API_KEY } = SERVER_ENV();
  if (!GOOGLE_GEMINI_API_KEY) {
    throw new Error("GOOGLE_GEMINI_API_KEY is not set");
  }
  cached = new GoogleGenerativeAI(GOOGLE_GEMINI_API_KEY);
  return cached;
}

export function getGeminiModel(model = "gemini-1.5-flash") {
  return getGemini().getGenerativeModel({ model });
}

export async function generateJSON<T>(prompt: string): Promise<T> {
  const model = getGeminiModel();
  const res = await model.generateContent([
    {
      text:
        prompt +
        "\n\nOnly respond with JSON. Do not include any preamble or code fences.",
    } as any,
  ]);
  const text = res.response.text();
  try {
    return JSON.parse(text) as T;
  } catch (e) {
    // Try to recover JSON substring
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start >= 0 && end > start) {
      const json = text.slice(start, end + 1);
      return JSON.parse(json) as T;
    }
    throw new Error("Failed to parse JSON from Gemini response");
  }
}


