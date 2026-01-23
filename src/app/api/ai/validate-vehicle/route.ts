import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { createLogger } from '@/lib/logger';
import type {
  ValidationResult,
  StrapiCollectionResponse,
  VehicleValidationAttributes,
} from '@/types/external-apis';

const logger = createLogger('API_VALIDATE_VEHICLE');

const STRAPI_API = "https://api.tamirhanem.com/api";

// Gemini API Keys (6 keys for rotation)
const geminiKeys = [
  process.env.GEMINI_API_KEY,
  process.env.GEMINI_API_KEY_2,
  process.env.GEMINI_API_KEY_3,
  process.env.GEMINI_API_KEY_4,
  process.env.GEMINI_API_KEY_5,
  process.env.GEMINI_API_KEY_7
].filter(Boolean) as string[];

// In-memory cache as backup (24 hours)
const memoryCache = new Map<string, { result: ValidationResult; timestamp: number }>();
const MEMORY_CACHE_TTL = 24 * 60 * 60 * 1000;

// Check Strapi for cached validation
async function getValidationFromStrapi(brand: string, model: string, year: number): Promise<ValidationResult | null> {
  try {
    const url = `${STRAPI_API}/vehicle-validations?filters[brand][$eq]=${encodeURIComponent(brand)}&filters[model][$eq]=${encodeURIComponent(model)}&filters[year][$eq]=${year}`;
    const res = await fetch(url, { next: { revalidate: 0 } });

    if (!res.ok) {
      logger.debug({}, "Strapi vehicle-validations endpoint not available");
      return null;
    }

    const result: StrapiCollectionResponse<VehicleValidationAttributes> = await res.json();
    const entry = result.data?.[0];

    if (!entry) return null;

    const attrs = entry.attributes;
    logger.info({ year, brand, model }, 'Strapi cache HIT');

    return {
      valid: attrs.valid,
      production_years: attrs.production_start && attrs.production_end
        ? { start: attrs.production_start, end: attrs.production_end }
        : null,
      message: attrs.message || null
    };
  } catch (error) {
    logger.error({ error }, "Strapi lookup error");
    return null;
  }
}

// Save validation result to Strapi
async function saveValidationToStrapi(brand: string, model: string, year: number, result: ValidationResult): Promise<boolean> {
  try {
    const payload = {
      data: {
        brand: brand.toUpperCase(),
        model: model.toUpperCase(),
        year,
        valid: result.valid,
        production_start: result.production_years?.start || null,
        production_end: result.production_years?.end || null,
        message: result.message || null
      }
    };
    
    const res = await fetch(`${STRAPI_API}/vehicle-validations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      logger.error({ errorText: await res.text() }, "Strapi save error");
      return false;
    }

    logger.info({ year, brand, model }, 'Saved to Strapi');
    return true;
  } catch (error) {
    logger.error({ error }, "Strapi save error");
    return false;
  }
}

// Validate with Gemini AI
async function validateWithGemini(brand: string, model: string, year: number): Promise<ValidationResult> {
  const prompt = `Otomobil üretim yılı doğrulaması yap.

ARAÇ: ${brand} ${model}
SORGULANAN YIL: ${year}

GÖREV: "${brand} ${model}" aracının hangi yıllarda üretildiğini belirle ve ${year} yılının bu aralıkta olup olmadığını kontrol et.

KURALLAR:
1. Önce bu modelin gerçek üretim başlangıç ve bitiş yıllarını belirle
2. Eğer model hala üretiliyorsa end=2025 kullan
3. ${year} yılı start ile end arasında DEĞİLSE valid=false olmalı
4. ${year} yılı start ile end arasında ise valid=true olmalı

ÖRNEK DOĞRULAMALAR:
- Audi A2, 1999-2005 arası üretildi. 2023 için: valid=false
- Audi A2, 1999-2005 arası üretildi. 2003 için: valid=true  
- BMW 3 Serisi, 1975-2025 arası üretiliyor. 2024 için: valid=true
- Ford Pinto, 1971-1980 arası üretildi. 2020 için: valid=false

ÖNEMLİ: Sadece aşağıdaki JSON formatında yanıt ver. Markdown kullanma, açıklama yapma.

{"valid":false,"production_years":{"start":1999,"end":2005},"message":"${brand} ${model} sadece 1999-2005 yılları arasında üretilmiştir."}`;

  for (const key of geminiKeys) {
    try {
      const genAI = new GoogleGenerativeAI(key);
      const modelAI = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash",
        tools: [{ googleSearch: {} } as any]
      });
      
      const result = await modelAI.generateContent(prompt);
      const response = await result.response;
      let text = response.text().replace(/```json/g, "").replace(/```/g, "").trim();
      
      const parsed = JSON.parse(text);
      return {
        valid: parsed.valid === true,
        production_years: parsed.production_years || null,
        message: parsed.message || null
      };
    } catch (error: any) {
      logger.error({ message: error.message }, 'Gemini validation error');
      if (error.message?.includes('429') || error.message?.includes('quota')) {
        continue;
      }
      continue;
    }
  }
  
  // If all keys fail, return invalid to avoid false positives
  return {
    valid: false,
    production_years: null,
    message: "Araç doğrulaması şu anda yapılamadı."
  };
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
    const brandUpper = brand.toUpperCase();
    const modelUpper = model.toUpperCase();
    const cacheKey = `${brandUpper}-${modelUpper}-${yearNum}`;
    
    // 1. Check in-memory cache first (fastest)
    const memoryCached = memoryCache.get(cacheKey);
    if (memoryCached && Date.now() - memoryCached.timestamp < MEMORY_CACHE_TTL) {
      logger.debug({ year, brand, model }, 'Memory cache HIT');
      return NextResponse.json(memoryCached.result);
    }

    // 2. Check Strapi cache
    const strapiCached = await getValidationFromStrapi(brandUpper, modelUpper, yearNum);
    if (strapiCached) {
      // Save to memory cache too
      memoryCache.set(cacheKey, { result: strapiCached, timestamp: Date.now() });
      return NextResponse.json(strapiCached);
    }

    // 3. Call Gemini API
    logger.info({ year, brand, model }, 'Calling Gemini');
    const result = await validateWithGemini(brandUpper, modelUpper, yearNum);
    
    // 4. Save to both caches
    memoryCache.set(cacheKey, { result, timestamp: Date.now() });
    saveValidationToStrapi(brandUpper, modelUpper, yearNum, result); // Fire and forget

    return NextResponse.json(result);
  } catch (error: any) {
    logger.error({ error }, "Validation Error");
    return NextResponse.json({
      valid: false,
      production_years: null,
      message: "Araç doğrulaması şu anda yapılamadı."
    });
  }
}
