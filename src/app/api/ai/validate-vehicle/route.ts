import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const STRAPI_API = "https://api.tamirhanem.net/api";

// Gemini API Keys
const geminiKeys = [
  process.env.GEMINI_API_KEY,
  process.env.GEMINI_API_KEY_2,
  process.env.GEMINI_API_KEY_3,
  process.env.GEMINI_API_KEY_4
].filter(Boolean) as string[];

interface ValidationResult {
  valid: boolean;
  production_years: { start: number; end: number } | null;
  message: string | null;
}

// In-memory cache as backup (24 hours)
const memoryCache = new Map<string, { result: ValidationResult; timestamp: number }>();
const MEMORY_CACHE_TTL = 24 * 60 * 60 * 1000;

// Check Strapi for cached validation
async function getValidationFromStrapi(brand: string, model: string, year: number): Promise<ValidationResult | null> {
  try {
    const url = `${STRAPI_API}/vehicle-validations?filters[brand][$eq]=${encodeURIComponent(brand)}&filters[model][$eq]=${encodeURIComponent(model)}&filters[year][$eq]=${year}`;
    const res = await fetch(url, { next: { revalidate: 0 } });
    
    if (!res.ok) {
      console.log("Strapi vehicle-validations endpoint not available");
      return null;
    }
    
    const result = await res.json();
    const entry = result.data?.[0];
    
    if (!entry) return null;
    
    const attrs = entry.attributes || entry;
    console.log(`✅ Strapi cache HIT: ${year} ${brand} ${model}`);
    
    return {
      valid: attrs.valid,
      production_years: attrs.production_start && attrs.production_end 
        ? { start: attrs.production_start, end: attrs.production_end }
        : null,
      message: attrs.message || null
    };
  } catch (error) {
    console.error("Strapi lookup error:", error);
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
      console.error("Strapi save error:", await res.text());
      return false;
    }
    
    console.log(`💾 Saved to Strapi: ${year} ${brand} ${model}`);
    return true;
  } catch (error) {
    console.error("Strapi save error:", error);
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
      console.error(`Gemini validation error: ${error.message}`);
      if (error.message?.includes('429') || error.message?.includes('quota')) {
        continue;
      }
      continue;
    }
  }
  
  // If all keys fail, return valid by default
  return { valid: true, production_years: null, message: null };
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
      console.log(`⚡ Memory cache HIT: ${year} ${brand} ${model}`);
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
    console.log(`🔍 Calling Gemini: ${year} ${brand} ${model}`);
    const result = await validateWithGemini(brandUpper, modelUpper, yearNum);
    
    // 4. Save to both caches
    memoryCache.set(cacheKey, { result, timestamp: Date.now() });
    saveValidationToStrapi(brandUpper, modelUpper, yearNum, result); // Fire and forget
    
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Validation Error:", error);
    return NextResponse.json({
      valid: true,
      production_years: null,
      message: null
    });
  }
}
