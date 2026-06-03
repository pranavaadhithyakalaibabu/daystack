import { GoogleGenerativeAI } from "@google/generative-ai";

/** Lite first — more reliable on free tier; flash as backup */
const MODELS = [
  "gemini-2.5-flash-lite",
  "gemini-2.5-flash",
  "gemini-flash-latest",
];

function parseJsonResponse<T>(text: string): T {
  const trimmed = text.trim();
  const jsonMatch = trimmed.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("No JSON in Gemini response");
  }
  return JSON.parse(jsonMatch[0]) as T;
}

function extractText(response: {
  response: {
    text: () => string;
    candidates?: Array<{
      content?: { parts?: Array<{ text?: string }> };
    }>;
    promptFeedback?: { blockReason?: string };
  };
}): string {
  const text = response.response.text();
  if (text?.trim()) {
    return text;
  }

  const parts = response.response.candidates?.[0]?.content?.parts ?? [];
  const combined = parts
    .map((p) => ("text" in p ? p.text : ""))
    .join("")
    .trim();

  if (combined) {
    return combined;
  }

  const blockReason = response.response.promptFeedback?.blockReason;
  if (blockReason) {
    throw new Error(`Gemini blocked: ${blockReason}`);
  }

  throw new Error("Empty Gemini response");
}

function isRetryable(err: Error): boolean {
  const msg = err.message;
  if (msg.includes("API key not valid") || msg.includes("401")) {
    return false;
  }
  return true;
}

export async function callGemini<T>(
  system: string,
  user: string,
  maxTokens: number
): Promise<T> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const client = new GoogleGenerativeAI(apiKey);
  let lastError: Error | null = null;

  for (const modelName of MODELS) {
    try {
      const model = client.getGenerativeModel({
        model: modelName,
        systemInstruction: system,
        generationConfig: {
          maxOutputTokens: maxTokens,
          responseMimeType: "application/json",
        },
      });

      const result = await model.generateContent(user);
      const text = extractText(result);
      return parseJsonResponse<T>(text);
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      console.error(`[gemini] ${modelName} failed:`, lastError.message);
      if (!isRetryable(lastError)) {
        throw lastError;
      }
    }
  }

  throw lastError ?? new Error("All Gemini models failed");
}
