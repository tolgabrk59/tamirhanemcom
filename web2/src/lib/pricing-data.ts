/**
 * Hybrid fiyat veri sistemi
 * 1. Strapi'den gerçek servis fiyatlarını çek (zamanla birikecek)
 * 2. Fallback: Statik piyasa referans tablosu
 */

const STRAPI_API = (process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api').trim()
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN

// ─── Statik Fallback Fiyat Tablosu (2025 Türkiye Piyasası) ─────────
// Strapi'de veri birikene kadar kullanılacak referans değerler
const FALLBACK_PRICING: Record<string, { min: number; max: number; unit: string }> = {
  // Fren Sistemi
  'Fren Balata Değişimi': { min: 800, max: 3000, unit: '₺' },
  'Fren Disk Değişimi': { min: 1500, max: 5000, unit: '₺' },
  'Fren Hidrolik Sistemi': { min: 500, max: 2000, unit: '₺' },

  // Motor
  'Motor Yağı Değişimi': { min: 1000, max: 3500, unit: '₺' },
  'Triger Seti Değişimi': { min: 3000, max: 8000, unit: '₺' },
  'Termostat Değişimi': { min: 500, max: 2000, unit: '₺' },
  'Su Pompası Değişimi': { min: 1500, max: 4000, unit: '₺' },
  'Radyatör Tamiri/Değişimi': { min: 2000, max: 6000, unit: '₺' },
  'Motor Conta Değişimi': { min: 3000, max: 10000, unit: '₺' },
  'Buji Değişimi': { min: 400, max: 2000, unit: '₺' },
  'Hava Filtresi Değişimi': { min: 200, max: 800, unit: '₺' },
  'Yakıt Filtresi Değişimi': { min: 300, max: 1200, unit: '₺' },
  'Turbo Tamiri': { min: 5000, max: 20000, unit: '₺' },

  // Şanzıman
  'Debriyaj Seti Değişimi': { min: 3000, max: 8000, unit: '₺' },
  'Şanzıman Yağı Değişimi': { min: 800, max: 3000, unit: '₺' },
  'Otomatik Şanzıman Tamiri': { min: 5000, max: 25000, unit: '₺' },

  // Süspansiyon
  'Amortisör Değişimi': { min: 1500, max: 5000, unit: '₺' },
  'Rot Balans Ayarı': { min: 300, max: 800, unit: '₺' },
  'Salıncak Değişimi': { min: 1000, max: 3500, unit: '₺' },
  'Viraj Demiri': { min: 800, max: 2500, unit: '₺' },

  // Elektrik
  'Akü Değişimi': { min: 1500, max: 5000, unit: '₺' },
  'Alternatör Tamiri': { min: 1500, max: 4000, unit: '₺' },
  'Marş Motoru Tamiri': { min: 1000, max: 3500, unit: '₺' },
  'Far/Lamba Değişimi': { min: 200, max: 2000, unit: '₺' },

  // Klima
  'Klima Gazı Dolumu': { min: 500, max: 1500, unit: '₺' },
  'Klima Kompresörü Değişimi': { min: 3000, max: 8000, unit: '₺' },
  'Polen Filtresi Değişimi': { min: 200, max: 600, unit: '₺' },

  // Lastik
  'Lastik Değişimi (4 Adet)': { min: 3000, max: 12000, unit: '₺' },
  'Lastik Balans': { min: 200, max: 500, unit: '₺' },
  'Lastik Rotasyon': { min: 150, max: 400, unit: '₺' },

  // Egzoz
  'Egzoz Tamiri': { min: 500, max: 3000, unit: '₺' },
  'Katalitik Konvertör': { min: 3000, max: 15000, unit: '₺' },

  // Periyodik Bakım
  'Periyodik Bakım (Küçük)': { min: 2000, max: 5000, unit: '₺' },
  'Periyodik Bakım (Büyük)': { min: 4000, max: 10000, unit: '₺' },

  // Kaporta / Boya
  'Boya (Tek Panel)': { min: 2000, max: 5000, unit: '₺' },
  'Göçük Düzeltme': { min: 500, max: 3000, unit: '₺' },
  'Cam Değişimi (Ön)': { min: 2000, max: 6000, unit: '₺' },
}

// ─── Strapi'den Fiyat Çekme ─────────────────────────────────────────

interface StrapiPricingEntry {
  category: string
  min_price: number
  max_price: number
  source_count: number
}

// Strapi'den repair-pricings collection'ını çek (varsa)
async function fetchStrapiPricing(): Promise<StrapiPricingEntry[]> {
  try {
    const res = await fetch(`${STRAPI_API}/repair-pricings?pagination[pageSize]=100`, {
      headers: {
        'Content-Type': 'application/json',
        ...(STRAPI_TOKEN ? { Authorization: `Bearer ${STRAPI_TOKEN}` } : {}),
      },
      next: { revalidate: 1800 }, // 30 dk cache
    })

    if (!res.ok) return [] // Collection henüz yoksa boş dön

    const json = await res.json()
    const items = json.data || []

    return items.map((item: { attributes?: Record<string, unknown>; [key: string]: unknown }) => {
      const attrs = item.attributes || item
      return {
        category: String(attrs.category || ''),
        min_price: Number(attrs.min_price || 0),
        max_price: Number(attrs.max_price || 0),
        source_count: Number(attrs.source_count || 0),
      }
    })
  } catch {
    return [] // Strapi erişilemezse fallback'e düş
  }
}

// ─── Servis kampanya/indirim verisi çek ─────────────────────────────

interface CampaignInfo {
  service_name: string
  category: string
  discount_text: string
}

async function fetchActiveCampaigns(): Promise<CampaignInfo[]> {
  try {
    const res = await fetch(
      `${STRAPI_API}/services?filters[has_discount][$eq]=true&populate[0]=categories&populate[1]=campaigns&pagination[pageSize]=20&fields[0]=name&fields[1]=discount_description`,
      {
        headers: {
          'Content-Type': 'application/json',
          ...(STRAPI_TOKEN ? { Authorization: `Bearer ${STRAPI_TOKEN}` } : {}),
        },
        next: { revalidate: 1800 },
      }
    )

    if (!res.ok) return []

    const json = await res.json()
    const items = json.data || []

    return items
      .map((item: { attributes?: Record<string, unknown>; [key: string]: unknown }) => {
        const attrs = item.attributes || item
        const cats = (attrs.categories as { data?: Array<{ attributes?: { name?: string } }> })?.data || []
        return {
          service_name: String(attrs.name || ''),
          category: cats[0]?.attributes?.name || '',
          discount_text: String(attrs.discount_description || ''),
        }
      })
      .filter((c: CampaignInfo) => c.discount_text)
  } catch {
    return []
  }
}

// ─── Ana Export: Fiyat Bağlamı Oluştur ──────────────────────────────

export async function buildPricingContext(): Promise<string> {
  // Paralel çek
  const [strapiPricing, campaigns] = await Promise.all([
    fetchStrapiPricing(),
    fetchActiveCampaigns(),
  ])

  const lines: string[] = []

  // 1. Strapi'den gelen gerçek fiyatlar (öncelikli)
  const strapiMap = new Map<string, StrapiPricingEntry>()
  for (const item of strapiPricing) {
    if (item.category && item.min_price > 0) {
      strapiMap.set(item.category, item)
    }
  }

  // 2. Hybrid tablo oluştur: Strapi varsa Strapi, yoksa fallback
  lines.push('GÜNCEL TAMİR/BAKIM FİYAT REFERANSLARI (2025 Türkiye):')

  for (const [name, fallback] of Object.entries(FALLBACK_PRICING)) {
    const strapi = strapiMap.get(name)
    if (strapi) {
      // Strapi'den gerçek veri (daha güvenilir)
      lines.push(`- ${name}: ${strapi.min_price.toLocaleString('tr-TR')}-${strapi.max_price.toLocaleString('tr-TR')} ₺ (${strapi.source_count} servis verisi)`)
      strapiMap.delete(name) // işlendi
    } else {
      lines.push(`- ${name}: ${fallback.min.toLocaleString('tr-TR')}-${fallback.max.toLocaleString('tr-TR')} ₺`)
    }
  }

  // Strapi'de olup fallback'te olmayan kategoriler
  for (const [name, item] of Array.from(strapiMap.entries())) {
    lines.push(`- ${name}: ${item.min_price.toLocaleString('tr-TR')}-${item.max_price.toLocaleString('tr-TR')} ₺ (${item.source_count} servis verisi)`)
  }

  // 3. Aktif kampanyalar
  if (campaigns.length > 0) {
    lines.push('')
    lines.push('AKTİF KAMPANYALAR:')
    for (const c of campaigns.slice(0, 5)) {
      lines.push(`- ${c.service_name}${c.category ? ` (${c.category})` : ''}: ${c.discount_text}`)
    }
  }

  lines.push('')
  lines.push('NOT: Bu fiyatlar referans değerlerdir. Araç markası, modeli ve hasarın durumuna göre değişir. Premium/lüks markalarda %30-50 daha yüksek olabilir.')

  return lines.join('\n')
}
