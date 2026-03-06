import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const STRAPI_URL = (process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api').trim()
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN

const ZAI_URL = 'https://api.z.ai/api/anthropic/v1/messages'
const ZAI_KEY = process.env.ZAI_API_KEY || '042213d5518349509f67b0dcabb054d2.CrALf2SAl4jKXBgw'

function getStrapiHeaders(contentType = false): Record<string, string> {
  const headers: Record<string, string> = {}
  if (STRAPI_TOKEN) headers['Authorization'] = `Bearer ${STRAPI_TOKEN}`
  if (contentType) headers['Content-Type'] = 'application/json'
  return headers
}

interface ValidationResult {
  valid: boolean
  production_years: { start: number; end: number } | null
  message: string | null
}

// In-memory cache (24 saat)
const memoryCache = new Map<string, { result: ValidationResult; timestamp: number }>()
const MEMORY_CACHE_TTL = 24 * 60 * 60 * 1000

// Strapi'den cache'lenmiş doğrulamayı kontrol et
async function getValidationFromStrapi(brand: string, model: string, year: number): Promise<ValidationResult | null> {
  try {
    const url = `${STRAPI_URL}/vehicle-validations?filters[brand][$eq]=${encodeURIComponent(brand)}&filters[model][$eq]=${encodeURIComponent(model)}&filters[year][$eq]=${year}`
    const res = await fetch(url, { cache: 'no-store', headers: getStrapiHeaders() })

    if (!res.ok) return null

    const result = await res.json()
    const entries = result.data || []

    // Strapi filtreleri çalışmayabilir — JS tarafında eşleştirme yap
    const entry = entries.find((e: Record<string, unknown>) => {
      const a = (e.attributes || e) as Record<string, unknown>
      return (
        String(a.brand).toUpperCase() === brand.toUpperCase() &&
        String(a.model).toUpperCase() === model.toUpperCase() &&
        Number(a.year) === year
      )
    })
    if (!entry) return null

    const attrs = (entry as Record<string, unknown>).attributes || entry
    const a = attrs as Record<string, unknown>
    return {
      valid: a.valid as boolean,
      production_years: a.production_start && a.production_end
        ? { start: a.production_start as number, end: a.production_end as number }
        : null,
      message: (a.message as string) || null,
    }
  } catch {
    return null
  }
}

// Doğrulama sonucunu Strapi'ye kaydet
async function saveValidationToStrapi(brand: string, model: string, year: number, result: ValidationResult): Promise<void> {
  try {
    await fetch(`${STRAPI_URL}/vehicle-validations`, {
      method: 'POST',
      headers: getStrapiHeaders(true),
      body: JSON.stringify({
        data: {
          brand: brand.toUpperCase(),
          model: model.toUpperCase(),
          year,
          valid: result.valid,
          production_start: result.production_years?.start || null,
          production_end: result.production_years?.end || null,
          message: result.message || null,
        },
      }),
    })
  } catch {
    // fire-and-forget
  }
}

// AI ile doğrulama (Grok → Z.ai GLM-4.5-air → OpenAI fallback)
function buildValidationPrompt(brand: string, model: string, year: number): string {
  return `Otomobil üretim yılı doğrulaması yap.

ARAÇ: ${brand} ${model}
SORGULANAN YIL: ${year}

GÖREV: "${brand} ${model}" aracının gerçek üretim yılı aralığını belirle ve ${year} yılının bu aralıkta olup olmadığını kontrol et.

KURALLAR:
1. Bu modelin GERÇEK üretim başlangıç ve bitiş yıllarını araştır
2. Eğer model hala üretiliyorsa end=2025 yaz
3. ${year} yılı start-end aralığında İSE valid=true döndür
4. ${year} yılı aralık dışında ise valid=false döndür
5. Birden fazla nesil varsa tüm nesilleri kapsayan en geniş aralığı kullan

SADECE aşağıdaki JSON formatında yanıt ver. Başka bir şey yazma.

{"valid":true_veya_false,"production_years":{"start":BASLANGIC_YILI,"end":BITIS_YILI},"message":"${brand} ${model} BASLANGIC_YILI-BITIS_YILI yılları arasında üretilmiştir."}`
}

function parseValidationResponse(text: string): ValidationResult {
  const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim()
  const parsed = JSON.parse(cleaned)
  return {
    valid: parsed.valid === true,
    production_years: parsed.production_years || null,
    message: parsed.message || null,
  }
}

async function validateWithAI(brand: string, model: string, year: number): Promise<ValidationResult> {
  const prompt = buildValidationPrompt(brand, model, year)
  try {
    const res = await fetch(ZAI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ZAI_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'glm-4.5-air',
        max_tokens: 512,
        system: 'Sen bir otomobil uzmanısın. Sadece istenen JSON formatında yanıt ver.',
        messages: [{ role: 'user', content: prompt }],
      }),
      signal: AbortSignal.timeout(15000),
    })
    if (!res.ok) throw new Error(`ZAI ${res.status}: ${await res.text().catch(() => '')}`)
    const data = await res.json()
    const text = data.content?.[0]?.text?.trim() || ''
    if (text) return parseValidationResponse(text)
  } catch (e) {
    console.warn('[validate-vehicle] ZAI başarısız:', e instanceof Error ? e.message : e)
  }

  return {
    valid: false,
    production_years: null,
    message: 'Araç doğrulaması şu anda yapılamadı.',
  }
}

export async function POST(req: Request) {
  try {
    const { brand, model, year } = await req.json()

    if (!brand || !model || !year) {
      return NextResponse.json(
        { error: 'Brand, model ve year gerekli' },
        { status: 400 }
      )
    }

    const yearNum = parseInt(year)
    const brandUpper = brand.toUpperCase()
    const modelUpper = model.toUpperCase()
    const cacheKey = `${brandUpper}-${modelUpper}-${yearNum}`

    // 1. In-memory cache
    const memoryCached = memoryCache.get(cacheKey)
    if (memoryCached && Date.now() - memoryCached.timestamp < MEMORY_CACHE_TTL) {
      return NextResponse.json(memoryCached.result)
    }

    // 2. Strapi cache
    const strapiCached = await getValidationFromStrapi(brandUpper, modelUpper, yearNum)
    if (strapiCached) {
      memoryCache.set(cacheKey, { result: strapiCached, timestamp: Date.now() })
      return NextResponse.json(strapiCached)
    }

    // 3. AI Proxy
    const result = await validateWithAI(brandUpper, modelUpper, yearNum)

    // 4. Cache'e kaydet
    memoryCache.set(cacheKey, { result, timestamp: Date.now() })
    await saveValidationToStrapi(brandUpper, modelUpper, yearNum, result)

    return NextResponse.json(result)
  } catch {
    return NextResponse.json({
      valid: false,
      production_years: null,
      message: 'Araç doğrulaması şu anda yapılamadı.',
    })
  }
}
