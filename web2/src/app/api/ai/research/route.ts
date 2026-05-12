import { NextResponse } from 'next/server'
import { getRedis } from '@/lib/cache/redis'
import { scrapeArabamPrices, formatTL } from '@/lib/pricing/arabam-scraper'

export const dynamic = 'force-dynamic'

const STRAPI_URL = (process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api').trim()
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN

function getStrapiHeaders(contentType = false): Record<string, string> {
  const headers: Record<string, string> = {}
  if (STRAPI_TOKEN) headers['Authorization'] = `Bearer ${STRAPI_TOKEN}`
  if (contentType) headers['Content-Type'] = 'application/json'
  return headers
}

const REDIS_ANALYSIS_PREFIX = 'analyses'
const REDIS_ANALYSIS_TTL = 60 * 60 * 24 * 30 // 30 gün

const ZAI_URL = 'https://api.z.ai/api/anthropic/v1/messages'
const ZAI_KEY = process.env.ZAI_API_KEY || '042213d5518349509f67b0dcabb054d2.CrALf2SAl4jKXBgw'

interface VehicleAnalysisData {
  specs?: {
    engine?: string
    horsepower?: string
    torque?: string
    transmission?: string
    drivetrain?: string
    fuel_economy?: string
  }
  performance?: {
    acceleration_0_100?: string
    top_speed?: string
    braking_100_0?: string
    trunk_volume?: string
    fuel_tank?: string
    curb_weight?: string
  }
  safety?: {
    euro_ncap_stars?: number
    adult_occupant?: string
    child_occupant?: string
    pedestrian?: string
    safety_assist?: string
    test_year?: number
  }
  tires?: {
    standard?: string
    alternative?: string[]
    pressure?: string
  }
  fluids?: {
    coolant_type?: string
    coolant_capacity?: string
    brake_fluid?: string
    transmission_oil?: string
    transmission_capacity?: string
    battery_type?: string
    battery_spec?: string
  }
  chronic_problems?: Array<{
    problem?: string
    description?: string
    severity?: string
    significance_score?: number
  }>
  common_obd_codes?: Array<{
    code?: string
    description?: string
    severity?: string
    common_cause?: string
  }>
  maintenance?: {
    oil_type?: string
    oil_capacity?: string
    intervals?: Array<{ km?: string; action?: string }>
  }
  annual_maintenance_cost?: {
    total?: string
    breakdown?: Array<{ item?: string; cost?: string; frequency?: string }>
  }
  fuel_cost?: {
    fuel_type?: string
    average_consumption?: number
    current_fuel_price?: number
  }
  depreciation?: {
    current_value?: string
    yearly?: Array<{ year?: number; value?: string; loss_pct?: number }>
  }
  competitors?: Array<{
    name?: string
    price_range?: string
    advantage?: string
    disadvantage?: string
  }>
  pros?: string[]
  cons?: string[]
  summary?: string
  estimated_prices?: {
    market_min?: string
    market_max?: string
    average?: string
  }
  image_url?: string
  estimated_prices_source?: string
  estimated_prices_raw?: {
    avgPrice?: number
    minPrice?: number
    maxPrice?: number
    medianPrice?: number
    count?: number
    arabamUrl?: string
  }
}

// ─── Strapi Cache (ÖNCELİK 1) ─────────────────────
const STRAPI_STALE_MS = 30 * 24 * 60 * 60 * 1000 // 30 gün

interface StrapiVehicleAnalysisEntry {
  id: number
  attributes?: StrapiVehicleAnalysisAttributes
  brand?: string
  model?: string
  year?: number
  data?: VehicleAnalysisData
  updatedAt?: string
  createdAt?: string
}

interface StrapiVehicleAnalysisAttributes {
  brand?: string
  model?: string
  year?: number
  data?: VehicleAnalysisData
  updatedAt?: string
  createdAt?: string
}

interface StrapiAnalysisResult {
  data: VehicleAnalysisData
  id: number
  updatedAt: string
}

async function getAnalysisFromStrapi(brand: string, model: string, year: number): Promise<StrapiAnalysisResult | null> {
  try {
    const filters = `filters[brand][$eq]=${encodeURIComponent(brand)}&filters[model][$eq]=${encodeURIComponent(model)}&filters[year][$eq]=${year}`
    const res = await fetch(`${STRAPI_URL}/vehicle-analyses?${filters}`, {
      cache: 'no-store',
      headers: getStrapiHeaders(),
    })

    if (!res.ok) return null

    const result: { data?: StrapiVehicleAnalysisEntry[] } = await res.json()
    const entries: StrapiVehicleAnalysisEntry[] = result.data || []

    // JS tarafında eşleştirme (Strapi filtreleri bazen çalışmaz)
    const entry = entries.find((e: StrapiVehicleAnalysisEntry) => {
      const attrs: StrapiVehicleAnalysisAttributes = e.attributes || e
      return (
        String(attrs.brand).toUpperCase() === brand.toUpperCase() &&
        String(attrs.model).toUpperCase() === model.toUpperCase() &&
        Number(attrs.year) === year
      )
    })

    if (!entry) return null

    const attrs: StrapiVehicleAnalysisAttributes = entry.attributes || entry
    const id = Number(entry.id)
    const updatedAt = String(attrs.updatedAt || attrs.createdAt || '')

    return {
      data: attrs.data as VehicleAnalysisData,
      id,
      updatedAt,
    }
  } catch (err) {
    console.warn('[Strapi] Okuma hatası:', err instanceof Error ? err.message : err)
    return null
  }
}

function isStrapiStale(updatedAt: string): boolean {
  if (!updatedAt) return true
  const updated = new Date(updatedAt).getTime()
  if (isNaN(updated)) return true
  return Date.now() - updated > STRAPI_STALE_MS
}

async function saveAnalysisToStrapi(brand: string, model: string, year: number, data: VehicleAnalysisData): Promise<void> {
  try {
    const existing = await getAnalysisFromStrapi(brand, model, year)
    if (existing) {
      // Kayıt zaten var — güncelle
      await updateAnalysisInStrapi(existing.id, data)
      return
    }

    const payload = { data: { brand: brand.toUpperCase(), model: model.toUpperCase(), year, data } }
    const res = await fetch(`${STRAPI_URL}/vehicle-analyses`, {
      method: 'POST',
      headers: getStrapiHeaders(true),
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const errText = await res.text()
      console.warn('[Strapi] Kayıt hatası:', res.status, errText)
    } else {
      console.log('[Strapi] Kayıt başarılı:', brand, model, year)
    }
  } catch (err) {
    console.warn('[Strapi] Kayıt hatası:', err instanceof Error ? err.message : err)
  }
}

async function updateAnalysisInStrapi(id: number, data: VehicleAnalysisData): Promise<void> {
  try {
    const res = await fetch(`${STRAPI_URL}/vehicle-analyses/${id}`, {
      method: 'PUT',
      headers: getStrapiHeaders(true),
      body: JSON.stringify({ data: { data } }),
    })

    if (!res.ok) {
      const errText = await res.text()
      console.warn('[Strapi] Güncelleme hatası:', res.status, errText)
    } else {
      console.log('[Strapi] ✓ Güncelleme başarılı, id:', id)
    }
  } catch (err) {
    console.warn('[Strapi] Güncelleme hatası:', err instanceof Error ? err.message : err)
  }
}

// ─── Redis Cache (ÖNCELİK 2) ───────────────────────
function analysisKey(brand: string, model: string, year: number): string {
  return `${REDIS_ANALYSIS_PREFIX}:${brand.toUpperCase()}:${model.toUpperCase()}:${year}`
}

async function getCachedAnalysisFromRedis(brand: string, model: string, year: number): Promise<VehicleAnalysisData | null> {
  try {
    const redis = getRedis()
    if (!redis) return null

    const key = analysisKey(brand, model, year)
    const cached = await redis.get<{ data: VehicleAnalysisData; ts: number }>(key)
    return cached?.data || null
  } catch {
    return null
  }
}

async function saveAnalysisToRedis(brand: string, model: string, year: number, data: VehicleAnalysisData): Promise<void> {
  try {
    const redis = getRedis()
    if (!redis) return

    const key = analysisKey(brand, model, year)
    await redis.set(key, { data, ts: Date.now() }, { ex: REDIS_ANALYSIS_TTL })
  } catch (err) {
    console.warn('[Redis] Kayıt hatası:', err instanceof Error ? err.message : err)
  }
}

// ─── JSON Temizleme ──────────────────────────────────
function cleanJsonText(raw: string): string {
  let t = raw.trim()
  // Markdown kod bloklarını kaldır (multiline)
  t = t.replace(/```json\s*/gi, '').replace(/```\s*/g, '')
  // İlk { ile son } arasını al
  const firstBrace = t.indexOf('{')
  const lastBrace = t.lastIndexOf('}')
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    t = t.slice(firstBrace, lastBrace + 1)
  }
  // Trailing comma'ları temizle (,} veya ,])
  t = t.replace(/,\s*([}\]])/g, '$1')
  // Tek tırnakları çift tırnağa çevir (key ve value'larda)
  t = t.replace(/'/g, '"')
  // Kontrol karakterlerini temizle (tab, newline string içinde)
  t = t.replace(/[\x00-\x1F\x7F]/g, (ch) => ch === '\n' || ch === '\r' || ch === '\t' ? ' ' : '')
  // Tırnaksız key'leri düzelt: { key: → { "key":
  t = t.replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":')
  // Çift çift tırnak düzelt: ""key"" → "key"
  t = t.replace(/""([^"]+)""/g, '"$1"')
  // NaN, undefined, Infinity → null
  t = t.replace(/:\s*(NaN|undefined|Infinity|-Infinity)\b/g, ': null')
  // Yorum satırlarını kaldır (// ...)
  t = t.replace(/\/\/[^\n]*/g, '')
  return t.trim()
}

function safeJsonParse(text: string): Record<string, unknown> | null {
  // 1. Doğrudan dene
  const clean = cleanJsonText(text)
  try {
    return JSON.parse(clean)
  } catch { /* devam */ }

  // 2. Satır satır kırparak dene (kesik JSON için)
  // Son kapanmamış obje/array'i kapat
  let t = clean
  let openBraces = 0
  let openBrackets = 0
  for (const ch of t) {
    if (ch === '{') openBraces++
    if (ch === '}') openBraces--
    if (ch === '[') openBrackets++
    if (ch === ']') openBrackets--
  }
  // Eksik kapanışları ekle
  while (openBrackets > 0) { t += ']'; openBrackets-- }
  while (openBraces > 0) { t += '}'; openBraces-- }
  // Trailing comma temizle (yeni eklenen kapanışlar öncesi)
  t = t.replace(/,\s*([}\]])/g, '$1')
  try {
    return JSON.parse(t)
  } catch { /* devam */ }

  // 3. Hata pozisyonundan önceyi al ve kapat
  try {
    const errorMatch = clean.match(/position (\d+)/)
    if (errorMatch) {
      let partial = clean.slice(0, parseInt(errorMatch[1]))
      // Son geçerli value sonuna kadar kırp
      partial = partial.replace(/,\s*$/, '')
      // Kapanışları ekle
      let ob = 0, obk = 0
      for (const ch of partial) {
        if (ch === '{') ob++
        if (ch === '}') ob--
        if (ch === '[') obk++
        if (ch === ']') obk--
      }
      while (obk > 0) { partial += ']'; obk-- }
      while (ob > 0) { partial += '}'; ob-- }
      return JSON.parse(partial)
    }
  } catch { /* devam */ }

  return null
}

// ─── AI Provider (ZAI) ────────────────────────────────
const ZAI_SYSTEM = `Sen uzman bir otomobil teknisyenisin ve veri analistisin.
KRİTİK KURALLAR:
- Yanıtın SADECE geçerli bir JSON nesnesi olmalı, başka hiçbir şey olmamalı.
- Markdown KULLANMA (backtick, bold vb. yok).
- Tüm string değerleri çift tırnak içinde olmalı.
- JSON key'leri çift tırnak içinde olmalı.
- Sayısal değerler tırnak içinde string olarak yazılabilir.
- Trailing comma kullanma.
- Türkçe yanıt ver.`

async function generateWithRetry(prompt: string): Promise<string> {
  const res = await fetch(ZAI_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ZAI_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'glm-4.5-air',
      max_tokens: 8000,
      system: ZAI_SYSTEM,
      messages: [{ role: 'user', content: prompt }],
    }),
    signal: AbortSignal.timeout(120_000),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`ZAI API hatası: ${res.status} - ${err}`)
  }
  const data = await res.json()
  const text = data.content?.[0]?.text?.trim()
  if (!text) throw new Error('ZAI boş yanıt döndü')
  return text
}

// ─── Euro NCAP Model Adı Sadeleştirme ────────────────────────
function simplifyModelForNcap(model: string): string {
  // "CLIO III HB EXTREME EDITION 1.2 16V" → "Clio"
  // "C5 AIRCROSS SHINEBOLD 1.5 BLUEHDI 130 S&S EAT8" → "C5 Aircross"
  // "COROLLA 1.8 HYBRID FLAME X-PACK" → "Corolla"
  const parts = model.split(/[\s/]+/)
  const baseWords: string[] = []

  for (const part of parts) {
    // Motor hacmi (1.2, 1.5, 2.0 vs.) veya sayısal değere gelince dur
    if (/^\d+\.\d+$/.test(part)) break
    // HP, beygir, motor kodu gibi teknik bilgiler
    if (/^\d+$/.test(part) && parseInt(part) > 10) break
    // Trim/paket adları (genellikle 2+ kelimeden sonra gelen büyük harfli kelimeler)
    const trimNames = new Set(['HB', 'SEDAN', 'SW', 'WAGON', 'COUPE', 'CABRIO', 'EDITION', 'EXTREME', 'STYLE', 'ACTIVE', 'ALLURE', 'SHINE', 'SHINEBOLD', 'FEEL', 'LIFE', 'ZEN', 'INTENS', 'ICONIC', 'RS', 'GT', 'LINE', 'PACK', 'PLUS', 'PREMIUM', 'ELEGANCE', 'COMFORT', 'TITANIUM', 'TREND', 'HIGHLINE', 'COMFORTLINE', 'TRENDLINE'])
    if (baseWords.length >= 1 && trimNames.has(part.toUpperCase())) break
    // Nesil kodları (III, IV, V vs.) atla - Euro NCAP bunları kullanmaz
    if (/^[IVX]+$/.test(part) && baseWords.length >= 1) break
    baseWords.push(part)
  }

  if (baseWords.length === 0 && parts.length > 0) {
    baseWords.push(parts[0])
  }

  // Title case yap
  return baseWords.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')
}

// ─── Euro NCAP Veri Çekme (glm-5-turbo modeli) ────────────────────────
async function fetchEuroNcapData(brand: string, model: string, year: number): Promise<VehicleAnalysisData['safety'] | null> {
  try {
    const simpleModel = simplifyModelForNcap(model)
    console.log(`[EuroNCAP] ${year} ${brand} ${simpleModel} sorgulanıyor (glm-5-turbo)...`)
    const ncapPrompt = `${brand} ${simpleModel} aracının Euro NCAP crash test sonuçlarını bildir.
Bu araç veya aynı nesil platformu (${year-3}-${year} arası) Euro NCAP tarafından test edilmiş olabilir.
Örneğin Citroen C5 Aircross 2019'da test edildi ve 4 yıldız aldı, Renault Clio 2019'da test edildi ve 5 yıldız aldı.

Eğer bu araç veya aynı nesil modeli için Euro NCAP testi VARSA:
{"euro_ncap_stars":4,"adult_occupant":"87%","child_occupant":"82%","pedestrian":"65%","safety_assist":"74%","test_year":2019}

Eğer Euro NCAP testi YOKSA veya emin değilsen:
null

SADECE JSON veya null döndür, başka bir şey yazma. Markdown kullanma.`

    const res = await fetch(ZAI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ZAI_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'glm-5-turbo',
        max_tokens: 500,
        system: 'Sen Euro NCAP veritabanı uzmanısın. Araçların Euro NCAP crash test sonuçlarını biliyorsun. Aynı nesil platformdaki test sonuçları sonraki model yılları için de geçerlidir. SADECE gerçek verileri döndür, uydurma. Markdown kullanma.',
        messages: [{ role: 'user', content: ncapPrompt }],
      }),
      signal: AbortSignal.timeout(60_000),
    })

    if (!res.ok) {
      console.warn(`[EuroNCAP] API hatası: ${res.status}`)
      return null
    }
    const data = await res.json()
    const text = data.content?.[0]?.text?.trim()
    if (!text || text.toLowerCase() === 'null') {
      console.log('[EuroNCAP] Veri bulunamadı')
      return null
    }

    const clean = cleanJsonText(text)
    const parsed = JSON.parse(clean)
    if (parsed && parsed.euro_ncap_stars) {
      console.log(`[EuroNCAP] ✓ ${parsed.euro_ncap_stars} yıldız (${parsed.test_year} testi)`)
      return parsed
    }
    console.log('[EuroNCAP] Geçersiz veri döndü')
    return null
  } catch (err) {
    console.warn('[EuroNCAP] Hata:', err instanceof Error ? err.message : err)
    return null
  }
}

// ─── Helpers ─────────────────────────────────────
function getCarImageUrl(brand: string, model: string, year: number): string {
  const make = encodeURIComponent(brand.toLowerCase().replace(/\s+/g, '-'))
  const modelFamily = encodeURIComponent(model.split(' ')[0].toLowerCase())
  return `https://cdn.imagin.studio/getimage?customer=hrjavascript-mastery&make=${make}&modelFamily=${modelFamily}&modelYear=${year}&angle=1&width=900&zoomType=fullscreen`
}

// ─── POST Handler ────────────────────────────────
export async function POST(req: Request) {
  try {
    const { brand, model, year, force } = await req.json()
    if (!brand || !model || !year) {
      return NextResponse.json({ error: 'Brand, model ve year gerekli' }, { status: 400 })
    }

    const yearNum = parseInt(year)
    const brandUpper = brand.toUpperCase()
    const modelUpper = model.toUpperCase()

    console.log(`[Research] Sorgu: ${brandUpper} ${modelUpper} ${yearNum}`)

    // 1. ÖNCELİK 1: Strapi'den kontrol et (force=true ise atla)
    console.log('[Research] Adım 1: Strapi\'den kontrol ediliyor...')
    const strapiResult = force ? null : await getAnalysisFromStrapi(brandUpper, modelUpper, yearNum)
    if (strapiResult && !isStrapiStale(strapiResult.updatedAt)) {
      console.log('[Research] ✓ Strapi\'den bulundu (güncel)')
      await saveAnalysisToRedis(brandUpper, modelUpper, yearNum, strapiResult.data)
      return NextResponse.json(strapiResult.data)
    }
    if (strapiResult) {
      const ageInDays = Math.floor((Date.now() - new Date(strapiResult.updatedAt).getTime()) / (1000 * 60 * 60 * 24))
      console.log(`[Research] ⚠ Strapi verisi ${ageInDays} günlük, yenileniyor...`)
    } else {
      console.log('[Research] ✗ Strapi\'de bulunamadı')
    }

    // 2. ÖNCELİK 2: Redis'ten kontrol et (sadece Strapi'de hiç yoksa, force=true ise atla)
    if (!strapiResult && !force) {
      console.log('[Research] Adım 2: Redis\'ten kontrol ediliyor...')
      const redisData = await getCachedAnalysisFromRedis(brandUpper, modelUpper, yearNum)
      if (redisData) {
        console.log('[Research] ✓ Redis\'ten bulundu')
        await saveAnalysisToStrapi(brandUpper, modelUpper, yearNum, redisData)
        return NextResponse.json(redisData)
      }
      console.log('[Research] ✗ Redis\'te bulunamadı')
    }

    // 3. ÖNCELİK 3: LLM'den oluştur
    console.log('[Research] Adım 3: LLM\'den oluşturuluyor...')

    const prompt = `
Sen uzman bir otomobil teknisyenisin ve veri analistisin.
Lütfen google araması yaparak '${year} ${brand} ${model}' aracı için güncel teknik verileri araştır.

Araç: ${year} ${brand} ${model}

Hiçbir markdown formatı kullanma, sadece saf JSON döndür.

İstenen JSON Yapısı:
{
  "specs": {
    "engine": "Motor hacmi ve tipi (örn: 1.0L 3 Silindir Turbo)",
    "horsepower": "Beygir gücü (örn: 110 HP)",
    "torque": "Tork (örn: 200 Nm)",
    "transmission": "Mevcut TÜM şanzıman seçenekleri (örn: 5 İleri Manuel / 6 İleri Otomatik DCT)",
    "drivetrain": "Çekiş sistemi (Önden/Arkadan/4x4)",
    "fuel_economy": "Ortalama yakıt tüketimi (örn: 5.8 L/100km)"
  },
  "performance": {
    "acceleration_0_100": "0-100 km/h süresi (örn: 10.2 saniye)",
    "top_speed": "Maksimum hız (örn: 193 km/h)",
    "braking_100_0": "100-0 frenleme mesafesi (örn: 37m)",
    "trunk_volume": "Bagaj hacmi (örn: 400L)",
    "fuel_tank": "Yakıt deposu kapasitesi (örn: 50L)",
    "curb_weight": "Boş ağırlık (örn: 1.250 kg)"
  },
  "safety": {
    "euro_ncap_stars": 5,
    "adult_occupant": "Yetişkin yolcu skoru (örn: 87%)",
    "child_occupant": "Çocuk yolcu skoru (örn: 84%)",
    "pedestrian": "Yaya güvenliği skoru (örn: 70%)",
    "safety_assist": "Güvenlik asistanı skoru (örn: 80%)",
    "test_year": 2021,
    "source_note": "Euro NCAP resmi test verisi - eğer bu araç için GERÇEK Euro NCAP testi yoksa null yaz"
  },
  "tires": {
    "standard": "Standart lastik ebatı (örn: 205/55R16)",
    "alternative": ["Alternatif ebat 1", "Alternatif ebat 2"],
    "pressure": "Önerilen basınç ön/arka (örn: 2.3/2.1 bar)"
  },
  "fluids": {
    "coolant_type": "Antifriz tipi (örn: G12+)",
    "coolant_capacity": "Antifriz kapasitesi (örn: 5.5L)",
    "brake_fluid": "Fren hidroliği tipi (örn: DOT 4)",
    "transmission_oil": "Şanzıman yağı (örn: 75W-80 GL-4)",
    "transmission_capacity": "Şanzıman yağ kapasitesi (örn: 2.2L)",
    "battery_type": "Akü tipi (örn: 12V 60Ah 540A)",
    "battery_spec": "Önerilen akü modeli (örn: Varta Blue Dynamic E11)"
  },
  "chronic_problems": [
    {
      "problem": "Sorun başlığı",
      "description": "Detaylı açıklama ve çözüm önerisi",
      "severity": "Düşük/Orta/Yüksek",
      "significance_score": 7
    }
  ],
  "common_obd_codes": [
    {
      "code": "P0171",
      "description": "Arıza kodunun açıklaması",
      "severity": "Düşük/Orta/Yüksek",
      "common_cause": "Sık karşılaşılan sebebi ve çözümü"
    }
  ],
  "maintenance": {
    "oil_type": "Önerilen yağ tipi (örn: 5W-30)",
    "oil_capacity": "Yağ kapasitesi (örn: 3.8L filtre dahil)",
    "intervals": [
      { "km": "15.000 km", "action": "Yağ + filtre değişimi" }
    ]
  },
  "annual_maintenance_cost": {
    "total": "Yıllık toplam tahmini bakım maliyeti TL (örn: 12.500 TL)",
    "breakdown": [
      { "item": "Yağ + Filtre Değişimi", "cost": "3.500 TL", "frequency": "Yılda 1" }
    ]
  },
  "fuel_cost": {
    "fuel_type": "Benzin/Dizel/LPG",
    "average_consumption": 5.8,
    "current_fuel_price": 43.50
  },
  "depreciation": {
    "current_value": "Güncel piyasa değeri (örn: 1.400.000 TL)",
    "yearly": [
      { "year": 0, "value": "1.400.000 TL", "loss_pct": 0 },
      { "year": 1, "value": "1.190.000 TL", "loss_pct": 15 },
      { "year": 2, "value": "1.035.000 TL", "loss_pct": 26 },
      { "year": 3, "value": "920.000 TL", "loss_pct": 34 },
      { "year": 4, "value": "830.000 TL", "loss_pct": 41 },
      { "year": 5, "value": "750.000 TL", "loss_pct": 46 }
    ]
  },
  "competitors": [
    {
      "name": "Rakip araç adı",
      "price_range": "Fiyat aralığı (örn: 1.300.000 - 1.600.000 TL)",
      "advantage": "Bu rakibin avantajı",
      "disadvantage": "Bu rakibin dezavantajı"
    }
  ],
  "pros": ["Artı 1", "Artı 2", "Artı 3", "Artı 4", "Artı 5"],
  "cons": ["Eksi 1", "Eksi 2", "Eksi 3", "Eksi 4", "Eksi 5"],
  "summary": "Araç hakkında 2-3 cümlelik uzman özeti",
  "estimated_prices": {
    "market_min": "Min fiyat TL",
    "market_max": "Max fiyat TL",
    "average": "Ortalama fiyat TL"
  }
}

ÖNEMLİ NOTLAR:
- Tüm fiyatları Türk Lirası (TL) cinsinden yaz
- Euro NCAP puanları SADECE gerçek, doğrulanmış veriler olsun. Eğer bu araç için Euro NCAP testi yapılmamışsa veya test yılını bilmiyorsan safety alanlarını null yap, KESİNLİKLE UYDURMA
- OBD kodları bu modele özel yaygın arızalar olsun (en az 4 tane)
- Rakip araçlar aynı segment ve fiyat aralığında olsun (en az 3 tane)
- Yıllık bakım maliyetini detaylı kır (en az 5 kalem)
- Değer kaybı 5 yıllık projeksiyon olsun
- Yakıt tüketimi ve fiyatı sayısal (number) olsun
- Şanzıman (transmission) alanında bu aracın TÜM mevcut şanzıman seçeneklerini "/" ile ayırarak yaz (örn: "5 İleri Manuel / 7 İleri DSG Otomatik")
- Türkçe yanıt ver
`

    const text = await generateWithRetry(prompt)

    let data: VehicleAnalysisData | null = safeJsonParse(text) as VehicleAnalysisData | null
    if (!data) {
      console.warn('[Research] JSON parse hatası (1. deneme)')
      console.warn('[Research] Ham metin (ilk 500 karakter):', text.slice(0, 500))
      // Retry with stricter prompt
      const retryPrompt = prompt + '\n\nKRİTİK: Yanıtın SADECE geçerli JSON olmalı. Markdown (```) KULLANMA. İlk karakter { son karakter } olmalı.'
      const retryText = await generateWithRetry(retryPrompt)
      data = safeJsonParse(retryText) as VehicleAnalysisData | null
      if (!data) {
        console.warn('[Research] JSON parse hatası (2. deneme), kısa prompt deneniyor...')
        // 3. deneme: çok kısa prompt
        const shortPrompt = `${year} ${brand} ${model} aracı için JSON döndür. Anahtarlar: specs (engine,horsepower,torque,transmission,drivetrain,fuel_economy), tires (standard,alternative,pressure), chronic_problems (problem,description,severity dizisi), maintenance (oil_type,oil_capacity,intervals), pros (dizi), cons (dizi), summary (string), estimated_prices (market_min,market_max,average). Türkçe yaz. SADECE JSON.`
        const shortText = await generateWithRetry(shortPrompt)
        data = safeJsonParse(shortText) as VehicleAnalysisData | null
        if (!data) {
          console.error('[Research] 3 denemede de JSON parse başarısız')
          throw new Error('AI yanıtı geçerli JSON formatında değil. Lütfen tekrar deneyin.')
        }
      }
    }

    data.image_url = getCarImageUrl(brand, model, yearNum)

    // 3b. Euro NCAP + Arabam.com paralel çek
    const [ncapData] = await Promise.all([
      fetchEuroNcapData(brand, model, yearNum),
    ])
    if (ncapData) {
      data.safety = ncapData
    }

    // 3c. Arabam.com'dan gerçek fiyat çek ve override et
    try {
      const prices = await scrapeArabamPrices(brand, model, yearNum)
      if (prices.source === 'arabam.com' && prices.count >= 3) {
        data.estimated_prices = {
          market_min: formatTL(prices.minPrice),
          market_max: formatTL(prices.maxPrice),
          average: formatTL(prices.avgPrice),
        }
        data.estimated_prices_source = 'arabam.com'
        data.estimated_prices_raw = {
          avgPrice: prices.avgPrice,
          minPrice: prices.minPrice,
          maxPrice: prices.maxPrice,
          medianPrice: prices.medianPrice,
          count: prices.count,
          arabamUrl: prices.arabamUrl,
        }
        console.log(`[Research] ✓ Arabam.com fiyatları: ${prices.count} ilan, ort: ${formatTL(prices.avgPrice)}`)
      } else {
        data.estimated_prices_source = 'estimate'
        console.log('[Research] ✗ Arabam.com fiyat bulunamadı, LLM tahmini korunuyor')
      }
    } catch (err) {
      data.estimated_prices_source = 'estimate'
      console.warn('[Research] Arabam.com scraping hatası:', err instanceof Error ? err.message : err)
    }

    // 4. Her iki cache'e de kaydet
    console.log('[Research] Adım 4: Cache\'lere kaydediliyor...')
    await Promise.all([
      saveAnalysisToStrapi(brandUpper, modelUpper, yearNum, data),
      saveAnalysisToRedis(brandUpper, modelUpper, yearNum, data),
    ])
    console.log('[Research] ✓ Kayıt tamamlandı')

    return NextResponse.json(data)
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Bilinmeyen hata'
    console.error('[Research] Hata:', msg)
    return NextResponse.json({ error: `Analiz oluşturulamadı: ${msg}` }, { status: 500 })
  }
}
