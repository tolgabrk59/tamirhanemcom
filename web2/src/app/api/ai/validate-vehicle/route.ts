import { NextResponse } from 'next/server'
import vehicleJson from '@/data/vehicle-data.json'

export const dynamic = 'force-dynamic'

type VehiclePackage = { id: number; paket: string; full_model: string; years?: number[] }
type VehicleJsonData = Record<string, Record<string, VehiclePackage[]>>

const data = vehicleJson as VehicleJsonData

interface ValidationResult {
  valid: boolean
  production_years: { start: number; end: number } | null
  message: string | null
}

/**
 * Araç doğrulama — lokal JSON'dan kontrol eder.
 * LLM veya Strapi'ye gerek yok, 0ms yanıt.
 */
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
    const brandUpper = (brand as string).toUpperCase()
    const modelUpper = (model as string).toUpperCase()

    // Marka kontrolü
    const brandData = data[brandUpper]
    if (!brandData) {
      // FIAT → TOFAS-FIAT fallback
      const altBrand = brandUpper === 'FIAT' ? data['TOFAS-FIAT'] : null
      if (!altBrand) {
        return NextResponse.json({
          valid: false,
          production_years: null,
          message: `${brandUpper} markası veritabanımızda bulunamadı.`,
        } satisfies ValidationResult)
      }
    }

    // Model kontrolü — tam eşleşme veya full_model/paket içinde arama
    const searchBrands = brandData ? { [brandUpper]: brandData } : {}
    if (brandUpper === 'FIAT' && data['TOFAS-FIAT']) searchBrands['TOFAS-FIAT'] = data['TOFAS-FIAT']

    let packages: VehiclePackage[] = []
    let matchedModel = ''

    for (const [, models] of Object.entries(searchBrands)) {
      // 1. Tam model eşleşmesi
      const exactKey = Object.keys(models).find(m => m.toUpperCase() === modelUpper)
      if (exactKey) {
        packages = models[exactKey]
        matchedModel = exactKey
        break
      }

      // 2. Gelen string bir full_model veya paket adı olabilir — model adıyla başlayan eşleşme ara
      for (const [modelName, pkgs] of Object.entries(models)) {
        if (modelUpper.startsWith(modelName.toUpperCase())) {
          // full_model veya paket adında tam eşleşme var mı?
          const exactPkg = pkgs.find(p =>
            p.full_model.toUpperCase() === modelUpper ||
            p.paket.toUpperCase() === modelUpper ||
            `${modelName} ${p.paket}`.toUpperCase() === modelUpper
          )
          if (exactPkg || modelUpper.startsWith(modelName.toUpperCase() + ' ')) {
            packages = pkgs
            matchedModel = modelName
            break
          }
        }
      }
      if (packages.length > 0) break
    }

    if (packages.length === 0) {
      return NextResponse.json({
        valid: false,
        production_years: null,
        message: `${brandUpper} ${model} modeli veritabanımızda bulunamadı.`,
      } satisfies ValidationResult)
    }

    // Yıl bilgisi olan ilk paketten al
    const withYears = packages.find(p => p.years && p.years.length > 0)
    if (!withYears?.years) {
      // Yıl bilgisi yoksa modeli geçerli say (veritabanında var ama yıl bilgisi eksik)
      return NextResponse.json({
        valid: true,
        production_years: null,
        message: `${brandUpper} ${model} veritabanımızda mevcut.`,
      } satisfies ValidationResult)
    }

    const years = withYears.years
    const start = Math.min(...years)
    const end = Math.max(...years)
    const valid = years.includes(yearNum)

    return NextResponse.json({
      valid,
      production_years: { start, end },
      message: valid
        ? `${brandUpper} ${model} ${start}-${end} yılları arasında üretilmiştir. ${yearNum} yılı geçerlidir.`
        : `${brandUpper} ${model} ${start}-${end} yılları arasında üretilmiştir. ${yearNum} yılı bu aralıkta değildir.`,
    } satisfies ValidationResult)
  } catch {
    return NextResponse.json({
      valid: false,
      production_years: null,
      message: 'Araç doğrulaması yapılamadı.',
    })
  }
}
