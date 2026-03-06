import { NextResponse } from 'next/server'
import { getRedis } from '@/lib/cache/redis'

export const dynamic = 'force-dynamic'

const STRAPI_URL = (process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api').trim()
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN

function getStrapiHeaders(contentType = false): Record<string, string> {
  const headers: Record<string, string> = {}
  if (STRAPI_TOKEN) headers['Authorization'] = `Bearer ${STRAPI_TOKEN}`
  if (contentType) headers['Content-Type'] = 'application/json'
  return headers
}

const REDIS_TIRE_PREFIX = 'tires'
const REDIS_TIRE_TTL = 60 * 60 * 24 * 90 // 90 gün

const ZAI_URL = 'https://api.z.ai/api/anthropic/v1/messages'
const ZAI_KEY = process.env.ZAI_API_KEY || '042213d5518349509f67b0dcabb054d2.CrALf2SAl4jKXBgw'

interface TireResearchData {
  standard_size: string
  alternative_sizes: string[]
  recommended_pressure: { front: string; rear: string }
  recommended_brands: {
    name: string
    model: string
    segment: string
    price_per_tire: string
    set_price: string
    price_range: string
    rating: number
    features: string[]
  }[]
  seasonal_recommendations: { summer: string; winter: string; all_season: string }
  maintenance_tips: string[]
}

// ─── Strapi Cache (ÖNCELİK 1) ─────────────────────
async function getTireDataFromStrapi(brand: string, model: string, year: number, season: string): Promise<TireResearchData | null> {
  try {
    const filters = `filters[brand][$eq]=${encodeURIComponent(brand)}&filters[model][$eq]=${encodeURIComponent(model)}&filters[year][$eq]=${year}&filters[season][$eq]=${season}`
    const res = await fetch(`${STRAPI_URL}/tire-researches?${filters}`, {
      cache: 'no-store',
      headers: getStrapiHeaders(),
    })

    if (!res.ok) return null

    const result = await res.json()
    const entries = result.data || []

    // JS tarafında eşleştirme
    const entry = entries.find((e: Record<string, unknown>) => {
      const attrs = (e.attributes || e) as Record<string, unknown>
      return (
        String(attrs.brand).toUpperCase() === brand.toUpperCase() &&
        String(attrs.model).toUpperCase() === model.toUpperCase() &&
        Number(attrs.year) === year &&
        String(attrs.season) === season
      )
    })

    if (!entry) return null

    const attrs = (entry as Record<string, unknown>).attributes || entry
    return (attrs as Record<string, unknown>).data as TireResearchData
  } catch (err) {
    console.warn('[Strapi] Okuma hatası:', err instanceof Error ? err.message : err)
    return null
  }
}

async function saveTireDataToStrapi(brand: string, model: string, year: number, season: string, data: TireResearchData): Promise<void> {
  try {
    // Önce kayıt var mı kontrol et
    const existing = await getTireDataFromStrapi(brand, model, year, season)
    if (existing) {
      console.log('[Strapi] Lastik kaydı zaten var, atlanıyor')
      return
    }

    const payload = { data: { brand: brand.toUpperCase(), model: model.toUpperCase(), year, season, data } }
    const res = await fetch(`${STRAPI_URL}/tire-researches`, {
      method: 'POST',
      headers: getStrapiHeaders(true),
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const errText = await res.text()
      console.warn('[Strapi] Lastik kayıt hatası:', res.status, errText)
    } else {
      console.log('[Strapi] Lastik kayıt başarılı:', brand, model, year, season)
    }
  } catch (err) {
    console.warn('[Strapi] Lastik kayıt hatası:', err instanceof Error ? err.message : err)
  }
}

// ─── Redis Cache (ÖNCELİK 2) ───────────────────────
function tireKey(brand: string, model: string, year: number, season: string): string {
  return `${REDIS_TIRE_PREFIX}:${brand.toUpperCase()}:${model.toUpperCase()}:${year}:${season}`
}

async function getCachedTireData(brand: string, model: string, year: number, season: string): Promise<TireResearchData | null> {
  try {
    const redis = getRedis()
    if (!redis) return null

    const key = tireKey(brand, model, year, season)
    const cached = await redis.get<{ data: TireResearchData; ts: number }>(key)
    return cached?.data || null
  } catch {
    return null
  }
}

async function saveTireDataToRedis(brand: string, model: string, year: number, season: string, data: TireResearchData): Promise<void> {
  try {
    const redis = getRedis()
    if (!redis) return

    const key = tireKey(brand, model, year, season)
    await redis.set(key, { data, ts: Date.now() }, { ex: REDIS_TIRE_TTL })
  } catch (err) {
    console.warn('[Redis] Lastik kayıt hatası:', err instanceof Error ? err.message : err)
  }
}

// ─── AI Provider (ZAI) ────────────────────────────────
async function generateWithRetry(prompt: string): Promise<string> {
  const res = await fetch(ZAI_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ZAI_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'glm-5',
      max_tokens: 4000,
      system: 'Sen uzman bir otomobil teknisyeni ve lastik uzmanısın. Türkçe yanıt ver. Sadece geçerli JSON döndür, markdown kullanma.',
      messages: [{ role: 'user', content: prompt }],
    }),
    signal: AbortSignal.timeout(30000),
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

const FALLBACK_DATA: TireResearchData = {
  standard_size: '205/55 R16 91V',
  alternative_sizes: ['215/50 R17', '195/65 R15'],
  recommended_pressure: { front: '2.2 bar', rear: '2.0 bar' },
  recommended_brands: [
    { name: 'Michelin', model: 'Primacy 4', segment: 'Premium', price_per_tire: '3.200 TL', set_price: '12.800 TL', price_range: '₺₺₺', rating: 4.8, features: ['Uzun ömür', 'Sessiz sürüş', 'İyi kavrama'] },
    { name: 'Continental', model: 'EcoContact 6', segment: 'Premium', price_per_tire: '2.900 TL', set_price: '11.600 TL', price_range: '₺₺₺', rating: 4.7, features: ['Düşük yuvarlanma direnci', 'Sessiz', 'Güvenli'] },
    { name: 'Goodyear', model: 'EfficientGrip Performance 2', segment: 'Üst Orta', price_per_tire: '2.500 TL', set_price: '10.000 TL', price_range: '₺₺₺', rating: 4.6, features: ['Dayanıklı', 'Konforlu', 'Güvenilir'] },
    { name: 'Hankook', model: 'Ventus Prime 4', segment: 'Orta', price_per_tire: '1.800 TL', set_price: '7.200 TL', price_range: '₺₺', rating: 4.4, features: ['Fiyat/performans', 'Kaliteli', 'Sessiz'] },
    { name: 'Yokohama', model: 'BluEarth-GT AE51', segment: 'Orta', price_per_tire: '1.700 TL', set_price: '6.800 TL', price_range: '₺₺', rating: 4.3, features: ['Ekonomik', 'Düşük gürültü', 'Çevreci'] },
    { name: 'Lassa', model: 'Driveways', segment: 'Ekonomik', price_per_tire: '1.200 TL', set_price: '4.800 TL', price_range: '₺', rating: 4.3, features: ['Uygun fiyat', 'Yerli üretim', 'Dayanıklı'] },
    { name: 'Petlas', model: 'Imperium PT515', segment: 'Ekonomik', price_per_tire: '1.050 TL', set_price: '4.200 TL', price_range: '₺', rating: 4.2, features: ['En uygun fiyat', 'Türk markası', 'Güvenilir'] },
  ],
  seasonal_recommendations: {
    summer: 'Michelin Primacy 4 veya Continental EcoContact 6 yaz kullanımı için idealdir.',
    winter: 'Michelin Alpin 6 veya Lassa Snoways 4 kış şartları için uygundur.',
    all_season: 'Michelin CrossClimate 2 veya Goodyear Vector 4Seasons Gen-3 tüm mevsimler için kullanılabilir.',
  },
  maintenance_tips: [
    'Ayda bir kez lastik basıncını kontrol edin',
    'Her 10.000 km\'de lastik rotasyonu yapın',
    'Diş derinliğini düzenli kontrol edin (minimum 1.6mm)',
    'Lastikleri hasarlara karşı görsel olarak inceleyin',
  ],
}

// ─── POST Handler ────────────────────────────────
export async function POST(req: Request) {
  try {
    const { brand, model, package: pkg, year, season } = await req.json()

    if (!brand || !model || !year) {
      return NextResponse.json({ error: 'Brand, model ve year gerekli' }, { status: 400 })
    }

    const yearNum = parseInt(year)
    const seasonType = season || 'summer'
    const brandUpper = brand.toUpperCase()
    const modelUpper = model.toUpperCase()
    const pkgUpper = pkg ? pkg.toUpperCase() : null

    console.log(`[Tire Research] Sorgu: ${brandUpper} ${modelUpper} ${yearNum} (${seasonType})`)

    // 1. ÖNCELİK 1: Strapi'den kontrol et
    console.log('[Tire Research] Adım 1: Strapi\'den kontrol ediliyor...')
    const strapiData = await getTireDataFromStrapi(brandUpper, modelUpper, yearNum, seasonType)
    if (strapiData) {
      console.log('[Tire Research] ✓ Strapi\'den bulundu')
      await saveTireDataToRedis(brandUpper, modelUpper, yearNum, seasonType, strapiData)
      return NextResponse.json(strapiData)
    }
    console.log('[Tire Research] ✗ Strapi\'de bulunamadı')

    // 2. ÖNCELİK 2: Redis'ten kontrol et
    console.log('[Tire Research] Adım 2: Redis\'ten kontrol ediliyor...')
    const redisData = await getCachedTireData(brandUpper, modelUpper, yearNum, seasonType)
    if (redisData) {
      console.log('[Tire Research] ✓ Redis\'ten bulundu')
      await saveTireDataToStrapi(brandUpper, modelUpper, yearNum, seasonType, redisData)
      return NextResponse.json(redisData)
    }
    console.log('[Tire Research] ✗ Redis\'te bulunamadı')

    // 3. ÖNCELİK 3: LLM'den oluştur
    console.log('[Tire Research] Adım 3: LLM\'den oluşturuluyor...')

    const seasonLabels: Record<string, string> = {
      summer: 'yaz lastiği',
      winter: 'kış lastiği',
      all_season: '4 mevsim lastiği',
    }
    const seasonLabel = seasonLabels[seasonType] || 'yaz lastiği'

    const prompt = `
Sen uzman bir lastik teknisyeni ve fiyat araştırmacısısın.
Lütfen google araması yaparak ${year} model ${brand} ${model}${pkg ? ` ${pkg}` : ''} aracı için güncel ${seasonLabel} ebatlarını ve Türkiye piyasasındaki ${seasonLabel} fiyatlarını araştır.

ÖNEMLİ: SADECE ${seasonLabel.toUpperCase()} öner. ${seasonType === 'winter' ? 'Kış lastikleri M+S veya 3PMSF işaretli olmalı.' : seasonType === 'all_season' ? '4 mevsim lastikleri M+S işaretli, tüm yıl kullanıma uygun modeller olmalı.' : 'Yaz lastikleri sıcak hava performansına yönelik modeller olmalı.'}

Fiyatlar için trendyol.com, n11.com, lastikborsasi.com, lastik.com.tr gibi sitelerdeki güncel fiyatları baz al.

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
      "model": "Lastik modeli (tam model adı)",
      "segment": "Premium / Üst Orta / Orta / Ekonomik",
      "price_per_tire": "Adet fiyatı TL (örn: 2.500 TL)",
      "set_price": "4'lü set fiyatı TL (örn: 10.000 TL)",
      "price_range": "₺ / ₺₺ / ₺₺₺",
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

ÖNEMLİ KURALLAR:
- Hiçbir markdown formatı kullanma, sadece saf JSON döndür
- EN AZ 6 FARKLI MARKA öner ve şu segmentleri MUTLAKA dahil et:
  * Premium (2-3 marka): Michelin, Continental, Pirelli, Bridgestone
  * Üst Orta (1-2 marka): Goodyear, Dunlop, Firestone
  * Orta (1-2 marka): Hankook, Yokohama, Kumho, Nexen, Toyo
  * Ekonomik (2-3 marka): Petlas, Lassa, Kormoran, Barum, Tigar, Roadstone
- Fiyatları Türk Lirası (TL) cinsinden yaz
- Adet ve 4'lü set fiyatlarını ayrı ayrı belirt
- Fiyatlar güncel Türkiye piyasa fiyatları olsun (2024-2025 güncel)
- Lastik boyutunu araca özel doğru ebat olarak ver
- recommended_brands dizisini fiyata göre yüksekten düşüğe sırala (premium önce, ekonomik sonda)
- Önerilen tüm lastik modelleri ${seasonLabel.toUpperCase()} kategorisinde olmalı
- Lastik model adlarında ${seasonType === 'winter' ? 'kış serisi (örn: Alpin, WinterContact, Snoways, W190, i*cept)' : seasonType === 'all_season' ? '4 mevsim serisi (örn: CrossClimate, AllSeasonContact, Vector 4Seasons, Kinergy 4S)' : 'yaz serisi (örn: Primacy, EcoContact, Driveways, Ventus)'} kullan
`

    const text = await generateWithRetry(prompt)
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim()

    let data: TireResearchData
    try {
      data = JSON.parse(cleanText)
    } catch {
      console.warn('[Tire Research] JSON parse hatası, fallback veri kullanılıyor')
      data = FALLBACK_DATA
    }

    // 4. Her iki cache'e de kaydet
    console.log('[Tire Research] Adım 4: Cache\'lere kaydediliyor...')
    await Promise.all([
      saveTireDataToStrapi(brandUpper, modelUpper, yearNum, seasonType, data),
      saveTireDataToRedis(brandUpper, modelUpper, yearNum, seasonType, data),
    ])
    console.log('[Tire Research] ✓ Kayıt tamamlandı')

    return NextResponse.json(data)
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Bilinmeyen hata'
    console.error('[Tire Research] Hata:', msg)
    return NextResponse.json({ error: `Lastik verisi oluşturulamadı: ${msg}` }, { status: 500 })
  }
}
