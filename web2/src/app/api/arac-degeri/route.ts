import { NextRequest, NextResponse } from 'next/server'
import { scrapeArabamPrices } from '@/lib/pricing/arabam-scraper'

// ─── Fallback: Gerçekçi Taban Fiyatlar (2024 sıfır km, TL) ──
const basePrices: Record<string, Record<string, number>> = {
  BMW: { '3 Serisi': 2850000, '5 Serisi': 4400000, X3: 3600000, X5: 5800000, X1: 2300000, '1 Serisi': 1900000 },
  Mercedes: { 'C Serisi': 3200000, 'E Serisi': 5000000, 'A Serisi': 2500000, GLC: 3900000, GLA: 2700000, CLA: 2900000 },
  Toyota: { Corolla: 1650000, Yaris: 1150000, RAV4: 2300000, Camry: 2500000, 'C-HR': 1850000 },
  Volkswagen: { Golf: 1500000, Passat: 2100000, Tiguan: 2400000, Polo: 1150000, 'T-Roc': 1900000 },
  Ford: { Focus: 1400000, Fiesta: 1050000, Kuga: 2100000, Puma: 1600000, Ranger: 2800000 },
  Renault: { Clio: 1050000, Megane: 1400000, Kadjar: 1700000, Captur: 1350000, Taliant: 950000 },
  Audi: { A3: 2200000, A4: 2800000, Q3: 2600000, Q5: 3500000, A6: 4000000 },
  Honda: { Civic: 1800000, 'CR-V': 2400000, Jazz: 1200000, 'HR-V': 1600000 },
  Fiat: { Egea: 950000, Panda: 750000, '500': 1100000, Tipo: 1000000 },
  Hyundai: { i20: 1050000, i30: 1350000, Tucson: 2000000, Kona: 1500000, Bayon: 1200000 },
  Opel: { Astra: 1350000, Corsa: 1050000, Mokka: 1600000, Crossland: 1400000 },
  Peugeot: { '208': 1150000, '308': 1500000, '2008': 1600000, '3008': 2100000, '5008': 2400000 },
  Citroen: { C3: 1000000, C4: 1350000, 'C5 Aircross': 1800000, Berlingo: 1400000 },
  Skoda: { Octavia: 1500000, Superb: 2200000, Karoq: 1800000, Kodiaq: 2400000, Fabia: 1100000 },
  Volvo: { XC40: 2400000, XC60: 3200000, S60: 2600000, V40: 1800000 },
  Nissan: { Qashqai: 1700000, Juke: 1400000, 'X-Trail': 2200000, Micra: 950000 },
  Kia: { Sportage: 2000000, Ceed: 1400000, Stonic: 1300000, Niro: 1900000 },
}

// ─── Fallback Hesaplama ──────────────────────────────
function calculateFallbackPrice(brand: string, model: string, year: number, km: number) {
  const currentYear = new Date().getFullYear()
  const basePrice = basePrices[brand]?.[model] || 1200000
  const age = currentYear - year

  // Yaş amortismanı: ilk yıl %15, sonraki her yıl %8
  let ageMultiplier = 1
  if (age >= 1) {
    ageMultiplier = 0.85 * Math.pow(0.92, age - 1)
  }

  // Kilometre ayarı: yıllık ortalama 15.000 km üzerinden
  const expectedKm = age * 15000
  const kmDiff = km - expectedKm
  const kmMultiplier = Math.max(0.7, Math.min(1.15, 1 - kmDiff / 400000))

  const adjustedPrice = Math.round(basePrice * ageMultiplier * kmMultiplier)

  return {
    avgPrice: adjustedPrice,
    minPrice: Math.round(adjustedPrice * 0.82),
    maxPrice: Math.round(adjustedPrice * 1.25),
    medianPrice: Math.round(adjustedPrice * 0.97),
    count: 0,
    rangeLow: Math.round(adjustedPrice * 0.90),
    rangeHigh: Math.round(adjustedPrice * 1.10),
    source: 'estimate' as const,
  }
}

// ─── GET Handler ─────────────────────────────────────
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const brand = searchParams.get('brand') || ''
  const model = searchParams.get('model') || ''
  const year = parseInt(searchParams.get('year') || '2022')
  const km = parseInt(searchParams.get('km') || '50000')

  // Paylaşımlı scraper ile arabam.com'dan fiyat çek
  const scraped = await scrapeArabamPrices(brand, model, year)

  if (scraped.source === 'arabam.com' && scraped.count >= 3) {
    return NextResponse.json({
      avgPrice: scraped.avgPrice,
      minPrice: scraped.minPrice,
      maxPrice: scraped.maxPrice,
      medianPrice: scraped.medianPrice,
      count: scraped.count,
      rangeLow: Math.round(scraped.avgPrice * 0.92),
      rangeHigh: Math.round(scraped.avgPrice * 1.08),
      source: 'arabam.com',
      arabamUrl: scraped.arabamUrl,
    })
  }

  // Scraping başarısız veya yetersiz veri — km'li fallback kullan
  const fallback = calculateFallbackPrice(brand, model, year, km)
  return NextResponse.json({ ...fallback, arabamUrl: scraped.arabamUrl })
}
