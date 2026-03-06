// ─── Arabam.com Fiyat Scraper ────────────────────────
// Paylaşımlı utility: arac-degeri ve research API'leri tarafından kullanılır

export interface ArabamPriceResult {
  avgPrice: number
  minPrice: number
  maxPrice: number
  medianPrice: number
  count: number
  source: 'arabam.com' | 'estimate'
  arabamUrl: string
}

// ─── Marka Slug Haritası (arabam.com URL formatı) ────
const brandSlugMap: Record<string, string> = {
  BMW: 'bmw',
  MERCEDES: 'mercedes-benz',
  TOYOTA: 'toyota',
  VOLKSWAGEN: 'volkswagen',
  FORD: 'ford',
  RENAULT: 'renault',
  AUDI: 'audi',
  HONDA: 'honda',
  FIAT: 'fiat',
  HYUNDAI: 'hyundai',
  OPEL: 'opel',
  PEUGEOT: 'peugeot',
  CITROEN: 'citroen',
  SKODA: 'skoda',
  VOLVO: 'volvo',
  NISSAN: 'nissan',
  KIA: 'kia',
  SEAT: 'seat',
  DACIA: 'dacia',
  MAZDA: 'mazda',
  SUZUKI: 'suzuki',
  MITSUBISHI: 'mitsubishi',
  JEEP: 'jeep',
  LAND_ROVER: 'land-rover',
  MINI: 'mini',
  PORSCHE: 'porsche',
  ALFA_ROMEO: 'alfa-romeo',
  CHEVROLET: 'chevrolet',
  SSANGYONG: 'ssangyong',
  SUBARU: 'subaru',
  CUPRA: 'cupra',
  DS: 'ds-automobiles',
  MG: 'mg',
  CHERY: 'chery',
  BYD: 'byd',
  TOGG: 'togg',
}

// ─── Bilinen motor tipi kodları ──────────────────────
const ENGINE_TYPES = new Set([
  'ecotsi', 'tsi', 'tdi', 'tfsi', 'fsi',
  'puretech', 'hdi', 'bluehdi',
  'multijet', 'multiair',
  'cdti', 'crdi',
  'vtec', 'ivtec',
  'skyactiv',
  'ecoboost', 'tdci',
  'dci',
  'mpi', 'gdi', 'tgdi',
  'mjet', 'jtd',
  'cng', 'lpg',
])

// ─── Araç kategorileri (arabam.com) ─────────────────
const VEHICLE_CATEGORIES = ['otomobil', 'arazi-suv-pick-up']

// ─── Slug yardımcıları ──────────────────────────────
function toBrandSlug(brand: string): string {
  const upper = brand.toUpperCase().replace(/\s+/g, '_')
  return brandSlugMap[upper] || brand.toLowerCase().replace(/\s+/g, '-')
}

function toSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/ç/g, 'c')
    .replace(/ğ/g, 'g')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ş/g, 's')
    .replace(/ü/g, 'u')
    .replace(/[&/]+/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

/**
 * Model string'inden arabam.com URL slug'ları çıkarır.
 *
 * Örnek: "ARONA 1.0 ECOTSI 110 DSG S&S XCELLENCE"
 *   → engine: "arona-1-0-ecotsi"
 *   → base:   "arona"
 *
 * Örnek: "2008 ACTIVE 1.2 PURETECH 100"
 *   → engine: "2008-1-2-puretech"
 *   → base:   "2008"
 */
function parseModelSlugs(model: string): { engine: string | null; base: string } {
  const parts = model.split(/[\s/&]+/).filter(Boolean)

  const baseWords: string[] = []
  let engineSlug: string | null = null

  for (let i = 0; i < parts.length; i++) {
    // Motor hacmi pattern: X.X (1.0, 1.2, 1.6, 2.0 vs.)
    if (/^\d+\.\d+$/.test(parts[i])) {
      const disp = parts[i].replace('.', '-') // "1.0" → "1-0"
      const nextWord = parts[i + 1]

      if (nextWord && ENGINE_TYPES.has(toSlug(nextWord))) {
        engineSlug = `${disp}-${toSlug(nextWord)}`
      } else {
        engineSlug = disp
      }
      break
    }

    // Motor hacmi bulunana kadar tüm kelimeler base model'e dahil
    // Ama "ACTIVE", "STYLE" gibi trim adları skip edilmeli
    // Bunları ayırt etmek zor, hepsini dahil edip URL'de denenecek
    baseWords.push(parts[i])
  }

  if (baseWords.length === 0 && parts.length > 0) {
    baseWords.push(parts[0])
  }

  const base = toSlug(baseWords.join(' '))

  // engine slug = base model + motor hacmi + motor tipi
  const full = engineSlug ? `${base}-${engineSlug}` : null

  return { engine: full, base }
}

// ─── HTML'den fiyat çıkarma ──────────────────────────
function extractPricesFromHtml(html: string): number[] {
  const prices: number[] = []
  const seen = new Set<number>()

  // Pattern 1: "1.234.567 TL" veya "1.234.567TL"
  const pattern1 = /(\d{1,3}(?:\.\d{3}){1,3})\s*(?:TL|₺)/g
  let match: RegExpExecArray | null
  while ((match = pattern1.exec(html)) !== null) {
    const price = parseInt(match[1].replace(/\./g, ''))
    if (price >= 100000 && price <= 50000000 && !seen.has(price)) {
      seen.add(price)
      prices.push(price)
    }
  }

  // Pattern 2: JSON "price":1234567 veya "listingPrice":1234567
  const pattern2 = /"(?:price|listingPrice|formattedPrice)"\s*:\s*(\d+)/g
  while ((match = pattern2.exec(html)) !== null) {
    const price = parseInt(match[1])
    if (price >= 100000 && price <= 50000000 && !seen.has(price)) {
      seen.add(price)
      prices.push(price)
    }
  }

  return prices
}

// ─── İstatistik hesaplama ────────────────────────────
function calculatePriceStats(prices: number[]): { avg: number; min: number; max: number; median: number } {
  prices.sort((a, b) => a - b)

  // Uç değerleri kırp (%10 alt ve üst)
  const trimStart = Math.floor(prices.length * 0.1)
  const trimEnd = Math.ceil(prices.length * 0.9)
  const trimmed = prices.slice(trimStart, trimEnd)

  if (trimmed.length === 0) {
    throw new Error('Yeterli fiyat verisi yok')
  }

  const sum = trimmed.reduce((a, b) => a + b, 0)
  const avg = Math.round(sum / trimmed.length)
  const median = trimmed[Math.floor(trimmed.length / 2)]

  return {
    avg,
    min: trimmed[0],
    max: trimmed[trimmed.length - 1],
    median,
  }
}

// ─── Tek URL'den fiyat çekme ─────────────────────────
const FETCH_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'tr-TR,tr;q=0.9,en;q=0.8',
  'Cache-Control': 'no-cache',
}

async function fetchPricesFromUrl(url: string): Promise<number[]> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 10000)

  try {
    const response = await fetch(url, {
      headers: FETCH_HEADERS,
      signal: controller.signal,
    })
    clearTimeout(timeout)

    if (!response.ok) return []

    const html = await response.text()
    return extractPricesFromHtml(html)
  } catch {
    clearTimeout(timeout)
    return []
  }
}

// ─── Ana scraping fonksiyonu ─────────────────────────
export async function scrapeArabamPrices(brand: string, model: string, year: number): Promise<ArabamPriceResult> {
  const brandSlug = toBrandSlug(brand)
  const { engine, base } = parseModelSlugs(model)
  const yearFilter = `minYear=${year}&maxYear=${year}`

  const emptyResult = (url: string): ArabamPriceResult => ({
    avgPrice: 0,
    minPrice: 0,
    maxPrice: 0,
    medianPrice: 0,
    count: 0,
    source: 'estimate',
    arabamUrl: url,
  })

  try {
    // Strateji: önce paket bazlı (spesifik), sonra genel model, birden fazla kategoride

    // 1. Paket bazlı slug varsa, her kategoride paralel dene
    if (engine) {
      const specificUrls = VEHICLE_CATEGORIES.map(
        (cat) => `https://www.arabam.com/ikinci-el/${cat}/${brandSlug}-${engine}?${yearFilter}`
      )

      const results = await Promise.all(specificUrls.map(fetchPricesFromUrl))

      // En çok ilan dönen sonucu seç
      let bestIdx = 0
      for (let i = 1; i < results.length; i++) {
        if (results[i].length > results[bestIdx].length) bestIdx = i
      }

      if (results[bestIdx].length >= 3) {
        const stats = calculatePriceStats(results[bestIdx])
        console.log(`[arabam-scraper] ✓ Paket bazlı: ${results[bestIdx].length} ilan (${specificUrls[bestIdx]})`)
        return {
          avgPrice: stats.avg,
          minPrice: stats.min,
          maxPrice: stats.max,
          medianPrice: stats.median,
          count: results[bestIdx].length,
          source: 'arabam.com',
          arabamUrl: specificUrls[bestIdx],
        }
      }
    }

    // 2. Genel model slug'ı ile her kategoride paralel dene
    const baseUrls = VEHICLE_CATEGORIES.map(
      (cat) => `https://www.arabam.com/ikinci-el/${cat}/${brandSlug}-${base}?${yearFilter}`
    )

    const baseResults = await Promise.all(baseUrls.map(fetchPricesFromUrl))

    let bestIdx = 0
    for (let i = 1; i < baseResults.length; i++) {
      if (baseResults[i].length > baseResults[bestIdx].length) bestIdx = i
    }

    if (baseResults[bestIdx].length >= 3) {
      const stats = calculatePriceStats(baseResults[bestIdx])
      console.log(`[arabam-scraper] ✓ Genel model: ${baseResults[bestIdx].length} ilan (${baseUrls[bestIdx]})`)
      return {
        avgPrice: stats.avg,
        minPrice: stats.min,
        maxPrice: stats.max,
        medianPrice: stats.median,
        count: baseResults[bestIdx].length,
        source: 'arabam.com',
        arabamUrl: baseUrls[bestIdx],
      }
    }

    // 3. Hiçbir yerde yeterli sonuç yok
    const fallbackUrl = engine
      ? `https://www.arabam.com/ikinci-el/otomobil/${brandSlug}-${engine}?${yearFilter}`
      : `https://www.arabam.com/ikinci-el/otomobil/${brandSlug}-${base}?${yearFilter}`

    console.warn(`[arabam-scraper] ✗ Yeterli fiyat bulunamadı`)
    return emptyResult(fallbackUrl)
  } catch (error) {
    console.warn('[arabam-scraper] Scraping başarısız:', error instanceof Error ? error.message : error)
    return emptyResult(`https://www.arabam.com/ikinci-el/otomobil/${brandSlug}-${base}?${yearFilter}`)
  }
}

// ─── TL formatı ──────────────────────────────────────
export function formatTL(price: number): string {
  if (price <= 0) return ''
  return new Intl.NumberFormat('tr-TR').format(price) + ' TL'
}
