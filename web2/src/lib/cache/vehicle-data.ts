import vehicleJson from '@/data/vehicle-data.json'

/**
 * Araç marka/model/paket verisi — lokal JSON dosyasından okunur.
 * Strapi veya Redis bağımlılığı yok, 0ms erişim.
 *
 * Güncelleme: `npm run update-vehicle-data` komutu ile Strapi'den çekilir.
 */

export interface VehicleRecord {
  id: number
  brand: string
  model: string
  full_model: string
  paket: string
  years?: number[]
}

type VehiclePackage = { id: number; paket: string; full_model: string; years?: number[] }
type VehicleJsonData = Record<string, Record<string, VehiclePackage[]>>

const data = vehicleJson as VehicleJsonData

/** Tüm benzersiz markaları döndürür */
export async function getAllBrands(): Promise<string[]> {
  return Object.keys(data).sort()
}

/** Belirli bir markanın tüm modellerini döndürür */
export async function getModelsByBrand(brand: string): Promise<string[]> {
  const normalizedBrand = brand.toUpperCase()
  const models = Object.keys(data[normalizedBrand] || {})

  // FIAT → TOFAS-FIAT modellerini de dahil et
  if (normalizedBrand === 'FIAT' && data['TOFAS-FIAT']) {
    const tofasModels = Object.keys(data['TOFAS-FIAT'])
    const modelSet = new Set([...models, ...tofasModels])
    return Array.from(modelSet).sort()
  }

  return models.sort()
}

/** Belirli bir marka+model'in tüm paketlerini döndürür */
export async function getPackagesByBrandModel(brand: string, model: string): Promise<VehiclePackage[]> {
  const normalizedBrand = brand.toUpperCase()
  const brandData = data[normalizedBrand]
  if (!brandData) return []

  // Case-insensitive model eşleştirme
  const modelKey = Object.keys(brandData).find(m => m.toUpperCase() === model.toUpperCase())
  if (!modelKey) return []

  const packages = brandData[modelKey] || []
  return [...packages].sort((a, b) => a.paket.localeCompare(b.paket, 'tr'))
}

/** Eski API uyumluluğu — getVehicleData hala kullanan varsa */
export async function getVehicleData(): Promise<VehicleRecord[]> {
  const records: VehicleRecord[] = []
  for (const [brand, models] of Object.entries(data)) {
    for (const [model, packages] of Object.entries(models)) {
      for (const pkg of packages) {
        records.push({ id: pkg.id, brand, model, full_model: pkg.full_model, paket: pkg.paket, years: pkg.years })
      }
    }
  }
  return records
}
