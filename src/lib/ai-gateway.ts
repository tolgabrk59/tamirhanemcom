import { generateText, streamText } from 'ai';

// Vercel AI Gateway - Simplified Usage
// Dashboard: https://vercel.com/tolgabrk59s-projects/tamirhanem-next/ai-gateway
// Vercel ortamında otomatik olarak çalışır (VERCEL_AI_GATEWAY_SECRET otomatik set edilir)

// Available models through the gateway
export const MODELS = {
  // OpenAI
  GPT4O: 'openai/gpt-4o',
  GPT4O_MINI: 'openai/gpt-4o-mini',
  GPT4_TURBO: 'openai/gpt-4-turbo',

  // Anthropic
  CLAUDE_SONNET: 'anthropic/claude-sonnet-4-20250514',
  CLAUDE_HAIKU: 'anthropic/claude-3-5-haiku-20241022',

  // Google
  GEMINI_FLASH: 'google/gemini-2.0-flash-exp',
  GEMINI_PRO: 'google/gemini-1.5-pro',

  // Meta
  LLAMA_70B: 'meta/llama-3.1-70b-instruct',

  // xAI
  GROK: 'xai/grok-beta',
} as const;

export const DEFAULT_MODEL = MODELS.GPT4O_MINI;

// Simple text generation
export async function generate(prompt: string, model = DEFAULT_MODEL) {
  const { text } = await generateText({
    model,
    prompt,
  });
  return text;
}

// Streaming text generation
export function stream(prompt: string, model = DEFAULT_MODEL) {
  return streamText({
    model,
    prompt,
  });
}

// With system prompt
export async function generateWithSystem(
  prompt: string,
  system: string,
  model = DEFAULT_MODEL
) {
  const { text } = await generateText({
    model,
    system,
    prompt,
  });
  return text;
}

// Streaming with system prompt
export function streamWithSystem(
  prompt: string,
  system: string,
  model = DEFAULT_MODEL
) {
  return streamText({
    model,
    system,
    prompt,
  });
}

// Vehicle research helper
export async function generateVehicleResearch(
  brand: string,
  modelName: string,
  year: number
) {
  const prompt = `
    ${year} ${brand} ${modelName} aracı için teknik verileri JSON formatında hazırla.
    Sadece saf JSON döndür, markdown kullanma.

    {
      "specs": { "engine": "", "horsepower": "", "torque": "", "transmission": "", "fuel_economy": "" },
      "chronic_problems": [{ "problem": "", "description": "", "severity": "Düşük/Orta/Yüksek" }],
      "maintenance": { "oil_type": "", "intervals": [{ "km": "", "action": "" }] },
      "pros": [],
      "cons": [],
      "summary": ""
    }
  `;

  const text = await generateWithSystem(
    prompt,
    'Sen uzman bir otomobil teknisyenisin. Türkçe yanıt ver. Sadece geçerli JSON döndür.',
    MODELS.GPT4O_MINI
  );

  const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
  return JSON.parse(cleanText);
}
