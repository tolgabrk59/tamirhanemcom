import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const STRAPI_API_URL = (process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api').trim()
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN

const ZAI_API_URL = 'https://api.z.ai/api/anthropic/v1/messages'
const ZAI_API_KEY = process.env.ZAI_API_KEY || '042213d5518349509f67b0dcabb054d2.CrALf2SAl4jKXBgw'

async function callAI(prompt: string): Promise<string> {
  const res = await fetch(ZAI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ZAI_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'glm-4.5-air',
      max_tokens: 400,
      messages: [{ role: 'user', content: prompt }],
    }),
    cache: 'no-store',
    signal: AbortSignal.timeout(15000),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`AI API hatası: ${res.status} - ${err}`)
  }
  const data = await res.json()
  const text = data.content?.[0]?.text?.trim()
  if (!text) throw new Error('AI boş yanıt döndü')
  return text
}

// Her iki Strapi format'ını destekle: flat {id, name} veya {id, attributes: {name}}
function flatField(item: any, field: string): any {
  return item?.[field] ?? item?.attributes?.[field]
}

function extractLocTokens(location: string): string[] {
  return (location || '')
    .split(',')
    .map(s => s.trim().toLowerCase())
    .filter(s => s && s !== 'türkiye' && s.length > 2 && !/^\d/.test(s))
}

function locationsOverlap(a: string[], b: string[]): boolean {
  return a.some(t => b.some(u => u.includes(t) || t.includes(u)))
}

// car_wash_pricing içindeki aktif fiyatların ortalamasını hesapla
function computeAvgPrice(pricing: any): number | null {
  if (!pricing || typeof pricing !== 'object') return null
  let total = 0, count = 0
  for (const svcType of Object.values(pricing)) {
    if (typeof svcType !== 'object' || svcType === null) continue
    for (const vehType of Object.values(svcType as any)) {
      const vt = vehType as any
      if (vt?.active && typeof vt?.price === 'number' && vt.price > 0) {
        total += vt.price
        count++
      }
    }
  }
  return count > 0 ? Math.round(total / count) : null
}

async function fetchCompetitors(
  serviceId: number,
  location: string,
): Promise<{ name: string; rating: number; avgPrice: number | null }[]> {
  if (!STRAPI_TOKEN) return []
  try {
    const res = await fetch(`${STRAPI_API_URL}/services`, {
      headers: { Authorization: `Bearer ${STRAPI_TOKEN}` },
      cache: 'no-store',
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) return []
    const data = await res.json()
    const all: any[] = data.data || []
    const myTokens = extractLocTokens(location)

    return all
      .filter((s: any) => {
        if (s.id === serviceId) return false
        const r = flatField(s, 'rating')
        if (!r) return false
        const loc = flatField(s, 'location') || ''
        const theirTokens = extractLocTokens(loc)
        if (myTokens.length > 0 && theirTokens.length > 0 && !locationsOverlap(myTokens, theirTokens)) return false
        return true
      })
      .map((s: any) => ({
        name: flatField(s, 'name') || 'Servis',
        rating: flatField(s, 'rating'),
        avgPrice: computeAvgPrice(flatField(s, 'car_wash_pricing')),
      }))
  } catch {
    return []
  }
}

async function fetchReviews(serviceId: number): Promise<string[]> {
  if (!STRAPI_TOKEN) return []
  try {
    const url = `${STRAPI_API_URL}/ratings?filters%5Bservice%5D%5Bid%5D%5B%24eq%5D=${serviceId}`
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${STRAPI_TOKEN}` },
      cache: 'no-store',
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) return []
    const data = await res.json()
    return (data.data || [])
      .map((r: any) => flatField(r, 'comment'))
      .filter(Boolean)
      .slice(0, 8)
      .map((c: string) => `"${c.trim()}"`)
  } catch {
    return []
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      serviceId,
      name,
      rating,
      reviewCount,
      categories,
      features,
      discounts,
      workingHours,
      is24_7,
      location,
      car_wash_pricing,
    } = body

    // Paralel Strapi çağrıları — biri başarısız olsa diğeri devam eder
    const [competitors, reviews] = await Promise.all([
      serviceId ? fetchCompetitors(Number(serviceId), location || '') : Promise.resolve([]),
      serviceId ? fetchReviews(Number(serviceId)) : Promise.resolve([]),
    ])

    const categoryList = (categories || []).map((c: any) => c.name || c).join(', ')

    const FEATURE_TR: Record<string, string> = {
      has_waiting_room: 'bekleme salonu',
      has_tea_coffee: 'çay/kahve ikramı',
      has_wifi: 'ücretsiz WiFi',
      has_tv: 'TV',
      has_ac: 'klima',
      has_toilet: 'tuvalet',
      has_parking: 'otopark',
      accepts_online_payment: 'online ödeme',
      accepts_credit_card: 'kredi kartı',
      has_valet_service: 'vale hizmeti',
      accepts_walk_in: 'randevusuz kabul',
    }
    const featureList = Object.entries(features || {})
      .filter(([, v]) => v)
      .map(([k]) => FEATURE_TR[k] || k)
      .join(', ')

    const activeDiscounts = (discounts || []).filter(
      (d: any) => !d.end_date || new Date(d.end_date) >= new Date(),
    )
    const discountText = activeDiscounts.length > 0
      ? `${activeDiscounts.length} aktif kampanya (${activeDiscounts.map((d: any) => d.title).join(', ')})`
      : ''

    const hoursText = is24_7
      ? '7/24 açık'
      : workingHours
        ? Object.entries(workingHours).filter(([, v]: any) => v?.isOpen).length + ' gün hizmet veriyor'
        : ''

    // Fiyat/kalite karşılaştırması — yalnızca olumlu çerçeveleme
    let priceQualityContext = ''
    const myAvgPrice = computeAvgPrice(car_wash_pricing)
    if (competitors.length > 0) {
      const compPrices = competitors.map(c => c.avgPrice).filter((p): p is number => p !== null)
      const compAvgRating = competitors.reduce((s, c) => s + c.rating, 0) / competitors.length

      if (myAvgPrice && compPrices.length > 0) {
        const compAvgPrice = Math.round(compPrices.reduce((a, b) => a + b, 0) / compPrices.length)
        const priceDiff = myAvgPrice - compAvgPrice

        if (priceDiff < -50) {
          // Bölge ortalamasından belirgin şekilde ucuz
          priceQualityContext = `Fiyat/kalite bağlamı: Ortalama servis fiyatı (${myAvgPrice}₺) bölgedeki diğer servis seçeneklerine göre daha uygun.`
          if (rating && rating >= compAvgRating) {
            priceQualityContext += ` Müşteri puanı da bölge genelinde olumlu.`
          }
        } else if (priceDiff > 50) {
          // Daha pahalı ama yorumlar iyiyse "değer" çerçevesinde sun
          if (rating && rating >= compAvgRating) {
            priceQualityContext = `Fiyat/kalite bağlamı: Fiyatları (ort. ${myAvgPrice}₺) bölgedeki alternatiflere kıyasla biraz daha yüksek, ancak müşteri değerlendirmeleri bu farkı destekler nitelikte.`
          }
          // Aksi halde fiyat karşılaştırması yapma
        }
      } else if (rating && compAvgRating > 0) {
        // Fiyat verisi yoksa sadece puan bağlamını ver (negatif olmayan)
        if (rating >= compAvgRating) {
          priceQualityContext = `Puan bağlamı: Bölgedeki servisler arasında müşteri değerlendirmeleriyle öne çıkıyor.`
        }
      }
    }

    const reviewText = reviews.length > 0
      ? `Müşteri yorumları:\n${reviews.join('\n')}`
      : ''

    const prompt = `TamirHanem platformunda "${name}" adlı araç servisi için araç sahibi müşterilere yönelik 2-3 cümlelik bilgilendirici bir tanıtım metni yaz.

KESIN KURALLAR (ihlal etme):
- Servisi olumsuz çerçevede değerlendirme; sadece araç sahibine yardımcı olacak bilgileri ver
- Aktif kampanya varsa mutlaka ve öncelikli olarak bahset — araç sahibi için çok önemli
- Fiyat/kalite bağlamı verilmişse bunu araç sahibine faydalı bir ipucu olarak sun: "uygun fiyatlı", "fiyatına değer" gibi pozitif ifadeler kullan
- Müşteri yorumlarındaki yalnızca olumlu noktalara değin, olumsuzları tamamen atla
- Puanı varsa olduğu gibi belirt; ekstra yorum ekleme
- Pazarlama dili veya abartı kullanma; sade ve samimi Türkçe yaz
- Kesinlikle 2-3 cümleyi geçme

Servis verileri:
- Puan: ${rating ? `${rating}/5 (${reviewCount} müşteri değerlendirmesi)` : 'henüz değerlendirme yok'}
- Bölge: ${location || 'belirtilmemiş'}
- Sunulan hizmetler: ${categoryList || 'belirtilmemiş'}
${featureList ? `- Müşteri imkanları: ${featureList}` : ''}
${hoursText ? `- Çalışma saatleri: ${hoursText}` : ''}
${discountText ? `- Aktif kampanyalar: ${discountText}` : ''}
${priceQualityContext ? `\n${priceQualityContext}` : competitors.length > 0 ? `- Bölge bilgisi: Bu bölgede ${competitors.length + 1} araç servisi hizmet vermektedir` : ''}
${reviewText ? `\nMüşteri görüşlerinden öne çıkan olumlu noktalar:\n${reviewText}` : ''}

Sadece tanıtım metnini yaz.`

    const summary = await callAI(prompt)
    return NextResponse.json({ success: true, summary })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || 'Özet oluşturulamadı' }, { status: 500 })
  }
}
