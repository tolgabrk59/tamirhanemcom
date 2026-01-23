import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";
import { NextResponse } from "next/server";
import { createLogger } from '@/lib/logger';
import type {
  VehicleAnalysisData,
  StrapiCollectionResponse,
  VehicleAnalysisAttributes,
  PexelsSearchResponse,
} from '@/types/external-apis';

const logger = createLogger('API_AI_RESEARCH');

const STRAPI_API = "https://api.tamirhanem.com/api";

// Gemini API Keys - Environment Variables'dan okunuyor (6 keys for rotation)
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

// Cache TTL (gün)
const CACHE_TTL_DAYS = 30;




async function fetchCarImage(query: string): Promise<string | null> {
  try {
    const pexelsKey = process.env.PEXELS_API_KEY;
    if (!pexelsKey) return null;

    const res = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1`, {
      headers: {
        Authorization: pexelsKey
      }
    });

    if (!res.ok) return null;

    const data: PexelsSearchResponse = await res.json();
    if (data.photos && data.photos.length > 0) {
      return data.photos[0].src.large2x || data.photos[0].src.large;
    }
    return null;
  } catch (error) {
    logger.error({ error }, "Pexels Image Error");
    return null;
  }
}

interface VehicleCacheResult {
  expired: boolean;
  id: number;
  data: VehicleAnalysisData;
  cacheAge?: number;
}

// Strapi'den cache kontrol
async function getVehicleAnalysisFromStrapi(brand: string, model: string, year: number): Promise<VehicleCacheResult | null> {
  try {
    const url = `${STRAPI_API}/vehicle-analyses?filters[brand][$eq]=${encodeURIComponent(brand)}&filters[model][$eq]=${encodeURIComponent(model)}&filters[year][$eq]=${year}&populate=*`;
    const res = await fetch(url, { next: { revalidate: 0 } });

    if (!res.ok) {
      logger.warn("Strapi vehicle-analyses endpoint not found or error");
      return null;
    }

    const result: StrapiCollectionResponse<VehicleAnalysisAttributes> = await res.json();
    const entry = result.data?.[0];

    if (!entry) return null;

    // Cache expiry kontrolü
    const updatedAt = new Date(entry.attributes.updatedAt);
    const now = new Date();
    const daysSinceUpdate = Math.floor((now.getTime() - updatedAt.getTime()) / (1000 * 60 * 60 * 24));

    if (daysSinceUpdate >= CACHE_TTL_DAYS) {
      logger.info(`Cache expired (${daysSinceUpdate} days old)`);
      return { expired: true, id: entry.id, data: entry.attributes.data };
    }

    return {
      expired: false,
      id: entry.id,
      data: entry.attributes.data,
      cacheAge: daysSinceUpdate
    };
  } catch (error) {
    logger.error({ error }, "Strapi cache lookup error");
    return null;
  }
}

// Strapi'ye kaydet
async function saveVehicleAnalysisToStrapi(brand: string, model: string, year: number, analysisData: VehicleAnalysisData, existingId?: number): Promise<boolean> {
  try {
    const payload = {
      data: {
        brand,
        model,
        year,
        data: analysisData
      }
    };
    
    let res;
    if (existingId) {
      // Update existing entry
      res = await fetch(`${STRAPI_API}/vehicle-analyses/${existingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } else {
      // Double-check for existing entry before creating (prevents race condition duplicates)
      const checkUrl = `${STRAPI_API}/vehicle-analyses?filters[brand][$eq]=${encodeURIComponent(brand)}&filters[model][$eq]=${encodeURIComponent(model)}&filters[year][$eq]=${year}`;
      const checkRes = await fetch(checkUrl);
      const checkData = await checkRes.json();
      
      if (checkData.data && checkData.data.length > 0) {
        // Entry was created by another parallel request, update instead
        const foundId = checkData.data[0].id;
        logger.info(`Found existing entry (id=${foundId}), updating instead of creating`);
        res = await fetch(`${STRAPI_API}/vehicle-analyses/${foundId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        // Create new entry
        res = await fetch(`${STRAPI_API}/vehicle-analyses`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }
    }

    if (!res.ok) {
      const errorText = await res.text();
      logger.error({ errorText }, "Strapi save error");
      return false;
    }

    logger.info(`Saved to Strapi: ${year} ${brand} ${model}`);
    return true;
  } catch (error) {
    logger.error({ error }, "Strapi save error");
    return false;
  }
}

// OpenAI ile generate
async function generateWithOpenAI(prompt: string): Promise<string> {
  if (!openaiKey) {
    throw new Error("OpenAI API key not configured");
  }

  logger.info("Trying OpenAI...");
  const openai = new OpenAI({ apiKey: openaiKey });
  
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "Sen uzman bir otomobil teknisyenisin. Türkçe yanıt ver. Sadece geçerli JSON döndür, markdown kullanma." },
      { role: "user", content: prompt }
    ],
    temperature: 0.7,
    max_tokens: 4000
  });

  const text = completion.choices[0]?.message?.content || "";
  logger.info("OpenAI Success");
  return text;
}

// Grok ile generate (Codefast API - limitsiz)
async function generateWithGrok(prompt: string): Promise<string> {
  if (!grokKey) {
    throw new Error("Grok API key not configured");
  }

  logger.info("Trying Grok (Codefast)...");
  const grok = new OpenAI({ 
    apiKey: grokKey,
    baseURL: grokBaseUrl
  });
  
  const completion = await grok.chat.completions.create({
    model: "grok-4-fast",
    messages: [
      { role: "system", content: "Sen uzman bir otomobil teknisyenisin. Türkçe yanıt ver. Sadece geçerli JSON döndür, markdown kullanma." },
      { role: "user", content: prompt }
    ],
    temperature: 0.7,
    max_tokens: 4000
  });

  const text = completion.choices[0]?.message?.content || "";
  logger.info("Grok Success");
  return text;
}

// Gemini ile generate (primary), Grok ve OpenAI fallback
async function generateWithRetry(prompt: string, modelName: string) {
  let lastError;
  
  // 1-4: Try all Gemini keys
  for (const key of geminiKeys) {
    try {
      logger.debug(`Trying Gemini key ${key.substring(0, 10)}...`);
      const genAI = new GoogleGenerativeAI(key);
      
      // First try with Google Search
      try {
          const modelAI = genAI.getGenerativeModel({ 
              model: modelName,
              tools: [{ googleSearch: {} } as any]
          });


          const result = await modelAI.generateContent(prompt);
          const response = await result.response;
          logger.info(`Gemini Success with key ${key.substring(0, 10)}...`);
          return response.text();
      } catch (toolError: any) {
          logger.warn(`Tool/Search error: ${toolError.message}`);
          
          // Check if it's a quota/rate limit error - if so, try next key
          if (toolError.message?.includes('429') || toolError.message?.includes('quota') || toolError.message?.includes('503')) {
              lastError = toolError;
              continue; // Try next key
          }
          
          // Fallback: Try without tools (Pure AI)
          try {
              const modelAI = genAI.getGenerativeModel({ model: modelName });
              const result = await modelAI.generateContent(prompt + "\n\n(Not: İnternet araması başarısız oldu, lütfen kendi bilgi birikiminle yanıtla ve fiyatlar için tahmini veriler sun.)");
              const response = await result.response;
              logger.info(`Gemini Success (no tools)`);
              return response.text();
          } catch (fallbackError: any) {
              logger.warn(`Fallback also failed: ${fallbackError.message}`);
              if (fallbackError.message?.includes('429') || fallbackError.message?.includes('quota') || fallbackError.message?.includes('503')) {
                  lastError = fallbackError;
                  continue; // Try next key
              }
              throw fallbackError;
          }
      }

    } catch (error: any) {
      logger.error(`Gemini Error: ${error.message}`);
      lastError = error;
      
      // If it's a rate limit error, continue to next key
      if (error.message?.includes('429') || error.message?.includes('quota') || error.message?.includes('503')) {
          continue;
      }
      // For other errors, throw immediately
      throw error;
    }
  }

  // 5: All Gemini keys failed - try Grok as first fallback (limitsiz)
  if (grokKey) {
    logger.warn("All Gemini keys failed, falling back to Grok...");
    try {
      return await generateWithGrok(prompt);
    } catch (grokError: any) {
      logger.error({ message: grokError.message }, "Grok also failed");
      lastError = grokError;
    }
  }

  // 6: Grok failed - try OpenAI as last fallback
  if (openaiKey) {
    logger.warn("Grok failed, falling back to OpenAI...");
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
  try {
    const { brand, model, year } = await req.json();

    if (!brand || !model || !year) {
      return NextResponse.json(
        { error: "Brand, model and year are required" },
        { status: 400 }
      );
    }

    const yearNum = parseInt(year);

    // 1. Check Strapi Cache
    const cached = await getVehicleAnalysisFromStrapi(brand, model, yearNum);

    if (cached && !cached.expired) {
      logger.info(`Cache HIT for ${year} ${brand} ${model} (age: ${cached.cacheAge} days)`);
      return NextResponse.json(cached.data);
    }

    // Log cache status
    if (cached?.expired) {
      logger.info(`Cache EXPIRED for ${year} ${brand} ${model}, refreshing...`);
    } else {
      logger.info(`Cache MISS for ${year} ${brand} ${model}, calling AI...`);
    }

    const prompt = `
      Sen uzman bir otomobil teknisyenisin ve veri analistisin. 
      Lütfen google araması yaparak '${year} ${brand} ${model}' aracı için güncel teknik verileri ve özellikle 'sahibinden.com', 'arabam.com' gibi sitelerdeki GÜNCEL İKİNCİ EL FİYATLARINI araştır.
      ${year} model yılına ait ilanları baz al.

      Aşağıdaki araç için teknik verileri ve analizleri JSON formatında hazırla.
      Hiçbir markdown formatı kullanma, sadece saf JSON döndür.
      
      Araç: ${year} ${brand} ${model}

      İstenen JSON Yapısı:
      {
        "specs": {
          "engine": "Motor hacmi ve tipi (örn: 1.6L 4 Silindir)",
          "horsepower": "Beygir gücü",
          "torque": "Tork",
          "transmission": "Şanzıman tipi",
          "drivetrain": "Çekiş sistemi (Önden/Arkadan/4x4)",
          "fuel_economy": "Ortalama yakıt tüketimi (L/100km)"
        },
        "tires": {
          "standard": "Standart lastik ebatı (örn: 205/55R16)",
          "alternative": "Alternatif ebatlar (array of strings)",
          "pressure": "Önerilen basınç (ön/arka)"
        },
        "chronic_problems": [
          {
            "problem": "Sorun başlığı",
            "description": "Detaylı açıklama",
            "severity": "Risk seviyesi (Düşük/Orta/Yüksek)",
            "significance_score": 1-10 arası puan
          }
        ],
        "maintenance": {
          "oil_type": "Önerilen yağ tipi (örn: 5W-30)",
          "oil_capacity": "Yağ kapasitesi",
          "intervals": [
            { "km": "Bakım kilometresi", "action": "Yapılacak işlem" }
          ]
        },
        "pros": ["Artı özellik 1", "Artı özellik 2"],
        "cons": ["Eksi özellik 1", "Eksi özellik 2"],
        "summary": "Araç hakkında genel bir uzman özeti (max 3 cümle)",
        "estimated_prices": {
            "market_min": "Sahibinden/Arabam.com min fiyat (TL)",
            "market_max": "Sahibinden/Arabam.com max fiyat (TL)",
            "average": "Piyasa ortalaması (TL)"
        }
      }
      
      Lütfen Türkçe yanıt ver. Fiyatlar için mutlaka internette güncel ilanları ara.
    `;

    // Fetch image and AI content in parallel
    const [text, imageUrl] = await Promise.all([
      generateWithRetry(prompt, "gemini-2.5-flash"),
      fetchCarImage(`${brand} ${model} car`)
    ]);
    
    // Clean up markdown code blocks if present
    const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();

    let data: VehicleAnalysisData;
    try {
        data = JSON.parse(cleanText) as VehicleAnalysisData;
    } catch (jsonError) {
        // Fallback: Try without tools (Pure AI)
        logger.error("JSON parse error, retrying...");
        const fallbackGenAI = new GoogleGenerativeAI(geminiKeys[0]);
        const modelAI = fallbackGenAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const result = await modelAI.generateContent(prompt + "\n\n(Not: JSON format hatası alındı, lütfen sadece geçerli JSON döndür.)");
        const response = await result.response;
        const fallbackText = response.text().replace(/```json/g, "").replace(/```/g, "").trim();
        data = JSON.parse(fallbackText) as VehicleAnalysisData;
    }

    // Add image url to data
    data.image_url = imageUrl;

    // 2. Save to Strapi Cache
    await saveVehicleAnalysisToStrapi(brand, model, yearNum, data, cached?.id);

    return NextResponse.json(data);
  } catch (error: any) {
    logger.error({ error }, "AI Research Error");
    return NextResponse.json(
      { error: `Failed to generate research data: ${error.message}` },
      { status: 500 }
    );
  }
}
