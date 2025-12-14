import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const keys = [
  process.env.GEMINI_API_KEY,
  "AIzaSyBhDz1ohYPnd-EJjW9EQJl1UJYuVhqCGGA",
  "AIzaSyDARmu40CilsH7e7raGds08G_BZ-E64QQ8",
  "AIzaSyDXg03_6P_LNc6KfbnD7E243c-U2-Ejrro"
].filter(Boolean) as string[];

async function fetchCarImage(query: string) {
  try {
    const pexelsKey = process.env.PEXELS_API_KEY;
    if (!pexelsKey) return null;

    const res = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1`, {
      headers: {
        Authorization: pexelsKey
      }
    });

    if (!res.ok) return null;

    const data = await res.json();
    if (data.photos && data.photos.length > 0) {
      return data.photos[0].src.large2x || data.photos[0].src.large;
    }
    return null;
  } catch (error) {
    console.error("Pexels Image Error:", error);
    return null;
  }
}

async function generateWithRetry(prompt: string, modelName: string) {
  let lastError;
  
  for (const key of keys) {
    try {
      const genAI = new GoogleGenerativeAI(key);
      
      // First try with Google Search
      try {
          const modelAI = genAI.getGenerativeModel({ 
              model: modelName,
              tools: [{
                  googleSearch: {} 
              } as any]
          });
          
          const result = await modelAI.generateContent(prompt);
          const response = await result.response;
          return response.text();
      } catch (toolError: any) {
          console.warn(`Tool/Search error with key ${key.substring(0, 10)}... Retrying without tools. Error: ${toolError.message}`);
          
          // Fallback: Try without tools (Pure AI)
          const modelAI = genAI.getGenerativeModel({ model: modelName });
          const result = await modelAI.generateContent(prompt + "\n\n(Not: İnternet araması başarısız oldu, lütfen kendi bilgi birikiminle yanıtla ve fiyatlar için tahmini veriler sun.)");
          const response = await result.response;
          return response.text();
      }

    } catch (error: any) {
      console.error(`Error with key ${key.substring(0, 10)}...:`, error.message);
      lastError = error;
      
      if (!error.message?.includes('429') && !error.message?.includes('Too Many Requests')) {
        // If it's a non-retriable error (like invalid key), continue to next key or throw?
        // Actually for 400/403 we might want to try next key too?
        // Let's safe-guard: if it's NOT 429, we still try next key just in case, 
        // unless we want to fail fast. 
        // But previously logic was: throw if not 429.
        // Let's keep existing logic for outer catch.
         if (!error.message?.includes('429') && !error.message?.includes('Too Many Requests')) {
            throw error;
         }
      }
    }
  }
  
  throw lastError || new Error("All API keys failed");
}

import { getVehicleAnalysis, saveVehicleAnalysis } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { brand, model, year } = await req.json();

    if (!brand || !model || !year) {
      return NextResponse.json(
        { error: "Brand, model and year are required" },
        { status: 400 }
      );
    }

    // 1. Check Cache (Database)
    const cachedData = await getVehicleAnalysis(brand, model, year);
    if (cachedData) {
      console.log(`Cache HIT for ${year} ${brand} ${model}`);
      return NextResponse.json(typeof cachedData === 'string' ? JSON.parse(cachedData) : cachedData);
    }

    console.log(`Cache MISS for ${year} ${brand} ${model}, calling AI...`);

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
    
    let data;
    try {
        data = JSON.parse(cleanText);
    } catch (jsonError) {
        // Fallback: Try without tools (Pure AI)
        const fallbackGenAI = new GoogleGenerativeAI(keys[0]);
        const modelAI = fallbackGenAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const result = await modelAI.generateContent(prompt + "\n\n(Not: JSON format hatası alındı, lütfen sadece geçerli JSON döndür.)");
        const response = await result.response;
        // Try parsing fallback
        const fallbackText = response.text().replace(/```json/g, "").replace(/```/g, "").trim();
        data = JSON.parse(fallbackText);
    }
    
    // Add image url to data
    data.image_url = imageUrl;

    // 2. Save to Cache (Database)
    await saveVehicleAnalysis(brand, model, year, data);

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("AI Research Error:", error);
    return NextResponse.json(
      { error: `Failed to generate research data: ${error.message}` },
      { status: 500 }
    );
  }
}
