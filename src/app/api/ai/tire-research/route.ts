import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";
import { NextResponse } from "next/server";
import { createLogger } from '@/lib/logger';
import type { TireResearchData } from '@/types/external-apis';
import { checkRouteRateLimit, getClientIdentifier } from '@/lib/route-rate-limit';

const logger = createLogger('API_TIRE_RESEARCH');

// Gemini API Keys (6 keys for rotation)
const geminiKeys = [
  process.env.GEMINI_API_KEY,
  process.env.GEMINI_API_KEY_2,
  process.env.GEMINI_API_KEY_3,
  process.env.GEMINI_API_KEY_4,
  process.env.GEMINI_API_KEY_5,
  process.env.GEMINI_API_KEY_7
].filter(Boolean) as string[];

// OpenAI API Key
const openaiKey = process.env.OPENAI_API_KEY;

// Grok API (Codefast - limitsiz)
const grokKey = process.env.GROK_API_KEY;
const grokBaseUrl = "https://api12.codefast.app/v1";

// Rate limit: 30 requests per hour per IP
const AI_RATE_LIMIT = 30;
const AI_RATE_WINDOW = 60 * 60 * 1000; // 1 hour

// OpenAI ile generate
async function generateWithOpenAI(prompt: string): Promise<string> {
  if (!openaiKey) throw new Error("OpenAI API key not configured");

  logger.info("Trying OpenAI for tire research");
  const openai = new OpenAI({ apiKey: openaiKey });
  
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "Sen uzman bir otomobil teknisyeni ve lastik uzmanısın. Türkçe yanıt ver. Sadece geçerli JSON döndür, markdown kullanma." },
      { role: "user", content: prompt }
    ],
    temperature: 0.7,
    max_tokens: 3000
  });
  
  const text = completion.choices[0]?.message?.content || "";
  logger.info("OpenAI Success");
  return text;
}

// Grok ile generate
async function generateWithGrok(prompt: string): Promise<string> {
  if (!grokKey) throw new Error("Grok API key not configured");

  logger.info("Trying Grok for tire research");
  const grok = new OpenAI({ 
    apiKey: grokKey,
    baseURL: grokBaseUrl
  });
  
  const completion = await grok.chat.completions.create({
    model: "grok-4-fast",
    messages: [
      { role: "system", content: "Sen uzman bir otomobil teknisyeni ve lastik uzmanısın. Türkçe yanıt ver. Sadece geçerli JSON döndür, markdown kullanma." },
      { role: "user", content: prompt }
    ],
    temperature: 0.7,
    max_tokens: 3000
  });
  
  const text = completion.choices[0]?.message?.content || "";
  logger.info("Grok Success");
  return text;
}

async function generateWithRetry(prompt: string, modelName: string) {
  let lastError;
  
  // 1-4: Try all Gemini keys
  for (const key of geminiKeys) {
    try {
      logger.debug({ keyPrefix: key.substring(0, 10) }, 'Trying Gemini key for tire research');
      const genAI = new GoogleGenerativeAI(key);
      
      try {
          const modelAI = genAI.getGenerativeModel({ model: modelName });
          const result = await modelAI.generateContent(prompt);
          const response = await result.response;
          logger.info('Gemini Success');
          return response.text();
      } catch (error: any) {
          logger.warn({ message: error.message }, 'Gemini error');
          if (error.message?.includes('429') || error.message?.includes('quota') || error.message?.includes('503')) {
              lastError = error;
              continue;
          }
          throw error;
      }
    } catch (error: any) {
      lastError = error;
      if (error.message?.includes('429') || error.message?.includes('quota') || error.message?.includes('503')) {
          continue;
      }
      throw error;
    }
  }

  // 5: Try Grok
  if (grokKey) {
    logger.warn("All Gemini keys failed, trying Grok");
    try {
      return await generateWithGrok(prompt);
    } catch (grokError: any) {
      logger.error({ message: grokError.message }, "Grok also failed");
      lastError = grokError;
    }
  }

  // 6: Try OpenAI
  if (openaiKey) {
    logger.warn("Grok failed, trying OpenAI");
    try {
      return await generateWithOpenAI(prompt);
    } catch (openaiError: any) {
      logger.error({ message: openaiError.message }, "OpenAI also failed");
      throw openaiError;
    }
  }
  
  throw lastError || new Error("All API keys failed");
}

export async function POST(req: Request) {
  // Rate limiting check
  const identifier = getClientIdentifier(req.headers as Headers, 'ai-tire-research');
  const rateLimit = await checkRouteRateLimit(identifier, AI_RATE_LIMIT, AI_RATE_WINDOW);
  
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { 
        error: 'Cok fazla istek gonderdiniz. Lutfen 1 saat sonra tekrar deneyin.',
        retryAfter: rateLimit.retryAfter 
      },
      { 
        status: 429,
        headers: {
          'Retry-After': String(rateLimit.retryAfter || 3600),
        }
      }
    );
  }

  try {
    const { brand, model, package: pkg, year } = await req.json();

    if (!brand || !model || !year) {
      return NextResponse.json(
        { error: "Brand, model and year are required" },
        { status: 400 }
      );
    }

    const prompt = `
      Sen uzman bir lastik teknisyenisin. 
      ${year} model ${brand} ${model}${pkg ? ` ${pkg}` : ''} aracı için lastik önerisi hazırla.
      
      Aşağıdaki JSON formatında yanıt ver (Türkçe):
      
      {
        "standard_size": "Standart lastik boyutu (örn: 205/55 R16 91V)",
        "alternative_sizes": ["Alternatif boyut 1", "Alternatif boyut 2"],
        "recommended_pressure": {
          "front": "Ön lastik basıncı (örn: 2.2 bar)",
          "rear": "Arka lastik basıncı (örn: 2.0 bar)"
        },
        "recommended_brands": [
          {
            "name": "Marka adı",
            "model": "Lastik modeli",
            "price_range": "Fiyat aralığı (₺₺ veya ₺₺₺)",
            "rating": 4.5,
            "features": ["Özellik 1", "Özellik 2", "Özellik 3"]
          }
        ],
        "seasonal_recommendations": {
          "summer": "Yaz için lastik önerisi ve açıklama",
          "winter": "Kış için lastik önerisi ve açıklama",
          "all_season": "4 mevsim lastik önerisi ve açıklama"
        },
        "maintenance_tips": [
          "Bakım tavsiyesi 1",
          "Bakım tavsiyesi 2",
          "Bakım tavsiyesi 3"
        ]
      }
      
      En az 3 marka öner. Michelin, Continental, Pirelli, Bridgestone, Goodyear, Lassa, Petlas, Hankook gibi popüler markaları dahil et.
      Fiyat/performans dengesi gözet ve Türkiye piyasasına uygun öneriler sun.
    `;

    const text = await generateWithRetry(prompt, "gemini-2.5-flash");

    // Clean up markdown code blocks if present
    const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();

    let data: TireResearchData;
    try {
        data = JSON.parse(cleanText) as TireResearchData;
    } catch (jsonError) {
        logger.error({ error: jsonError }, "JSON parse error");
        // Return a fallback response
        data = {
          standard_size: "205/55 R16 91V",
          alternative_sizes: ["215/50 R17", "195/65 R15"],
          recommended_pressure: {
            front: "2.2 bar",
            rear: "2.0 bar"
          },
          recommended_brands: [
            {
              name: "Michelin",
              model: "Primacy 4",
              price_range: "₺₺₺",
              rating: 4.8,
              features: ["Uzun ömür", "Sessiz sürüş", "İyi kavrama"]
            },
            {
              name: "Lassa",
              model: "Driveways",
              price_range: "₺₺",
              rating: 4.3,
              features: ["Uygun fiyat", "Yerli üretim", "Dayanıklı"]
            },
            {
              name: "Continental",
              model: "EcoContact 6",
              price_range: "₺₺₺",
              rating: 4.7,
              features: ["Düşük yuvarlanma direnci", "Sessiz", "Güvenli"]
            }
          ],
          seasonal_recommendations: {
            summer: "Michelin Primacy 4 veya Continental EcoContact 6 yaz kullanımı için idealdir.",
            winter: "Michelin Alpin 6 veya Lassa Snoways 4 kış şartları için uygundur.",
            all_season: "Michelin CrossClimate 2 veya Goodyear Vector 4Seasons Gen-3 tüm mevsimler için kullanılabilir."
          },
          maintenance_tips: [
            "Ayda bir kez lastik basıncını kontrol edin",
            "Her 10.000 km'de lastik rotasyonu yapın",
            "Diş derinliğini düzenli kontrol edin (minimum 1.6mm)",
            "Lastikleri hasarlara karşı görsel olarak inceleyin"
          ]
        };
    }

    return NextResponse.json(data);
  } catch (error: any) {
    logger.error({ error }, "Tire Research Error");
    return NextResponse.json(
      { error: `Failed to generate tire data: ${error.message}` },
      { status: 500 }
    );
  }
}
