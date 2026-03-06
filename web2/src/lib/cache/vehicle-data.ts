import { getRedis } from './redis'

const STRAPI_URL = (process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api').trim()
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN

const REDIS_KEY = 'arac-data:master'
const REDIS_TTL = 60 * 60 * 6 // 6 saat

// ─── In-Memory Cache ────────────────────────────
// Node.js process'i yaşadığı sürece bellekte tutulur → 0ms erişim
let memoryCache: VehicleRecord[] | null = null
let memoryCacheTs = 0
const MEMORY_FRESH_MS = 2 * 60 * 60 * 1000 // 2 saat

// Aynı anda birden fazla fetch olmasını engelle
let fetchPromise: Promise<VehicleRecord[]> | null = null

export interface VehicleRecord {
  id: number
  brand: string
  model: string
  full_model: string
  paket: string
}

interface RedisMasterCache {
  data: VehicleRecord[]
  ts: number
}

/** Strapi'den tüm araç verilerini tek seferde çeker */
async function fetchAllFromStrapi(): Promise<VehicleRecord[]> {
  const headers: HeadersInit = {}
  if (STRAPI_TOKEN) headers['Authorization'] = `Bearer ${STRAPI_TOKEN}`

  const url = `${STRAPI_URL}/arac-dataveris?pagination[pageSize]=100000`
  const response = await fetch(url, { headers, cache: 'no-store' })
  if (!response.ok) throw new Error(`Strapi API error: ${response.status}`)

  const result = await response.json()
  const records: VehicleRecord[] = []

  for (const item of (result.data || []) as Array<Record<string, unknown>>) {
    const brand = ((item.brand as string) || '').toUpperCase()
    const model = (item.model as string) || ''
    const full_model = ((item.full_model as string) || '').replace(/\r/g, '')
    const paket = ((item.paket as string) || '').replace(/\r/g, '')
    const id = item.id as number

    if (brand) {
      records.push({ id, brand, model, full_model, paket })
    }
  }

  return records
}

/** Veriyi hem memory'ye hem Redis'e yazar */
function updateCaches(data: VehicleRecord[]): void {
  memoryCache = data
  memoryCacheTs = Date.now()

  const redis = getRedis()
  if (redis) {
    redis.set(REDIS_KEY, { data, ts: Date.now() } satisfies RedisMasterCache, { ex: REDIS_TTL })
      .catch((err) => console.warn('[VehicleData] Redis SET hatası:', err instanceof Error ? err.message : err))
  }
}

/**
 * Master araç verisini döndürür. 3 katmanlı cache:
 *
 * 1. In-Memory (0ms) — process bellekte tutulur, 2 saat fresh
 * 2. Redis (~100ms) — process restart sonrası devreye girer, 6 saat TTL
 * 3. Strapi (~2s) — ilk çağrı veya her şey expire olduğunda
 *
 * İlk istek Strapi'den çeker → memory + Redis'e yazar
 * Sonraki tüm istekler (markalar, modeller, paketler) memory'den anında döner
 */
export async function getVehicleData(): Promise<VehicleRecord[]> {
  // 1) Memory cache — anında dön
  if (memoryCache && (Date.now() - memoryCacheTs) < MEMORY_FRESH_MS) {
    return memoryCache
  }

  // Eş zamanlı fetch'leri birleştir (thundering herd koruması)
  if (fetchPromise) return fetchPromise

  fetchPromise = loadData()
  try {
    return await fetchPromise
  } finally {
    fetchPromise = null
  }
}

async function loadData(): Promise<VehicleRecord[]> {
  // 2) Redis'ten dene
  const redis = getRedis()
  if (redis) {
    try {
      const cached = await redis.get<RedisMasterCache>(REDIS_KEY)
      if (cached?.data && cached.ts) {
        // Redis'ten gelen veriyi memory'ye de yaz
        memoryCache = cached.data
        memoryCacheTs = Date.now()

        const ageSeconds = (Date.now() - cached.ts) / 1000
        if (ageSeconds > REDIS_TTL / 2) {
          // Yarısından fazla geçmiş — arka planda yenile
          fetchAllFromStrapi()
            .then(updateCaches)
            .catch((err) => console.warn('[VehicleData] Background refresh hatası:', err instanceof Error ? err.message : err))
        }

        return cached.data
      }
    } catch (err) {
      console.warn('[VehicleData] Redis GET hatası:', err instanceof Error ? err.message : err)
    }
  }

  // 3) Strapi'den çek
  const data = await fetchAllFromStrapi()
  updateCaches(data)
  return data
}

/** Tüm benzersiz markaları döndürür */
export async function getAllBrands(): Promise<string[]> {
  const data = await getVehicleData()
  const brandSet = new Set<string>()
  for (const item of data) {
    if (item.brand) brandSet.add(item.brand)
  }
  return Array.from(brandSet).sort()
}

/** Belirli bir markanın tüm modellerini döndürür */
export async function getModelsByBrand(brand: string): Promise<string[]> {
  const data = await getVehicleData()
  const normalizedBrand = brand.toUpperCase()
  const modelSet = new Set<string>()

  for (const item of data) {
    if (item.brand === normalizedBrand && item.model) {
      modelSet.add(item.model)
    }
  }

  // FIAT → TOFAS-FIAT modellerini de dahil et
  if (normalizedBrand === 'FIAT') {
    for (const item of data) {
      if (item.brand === 'TOFAS-FIAT' && item.model) {
        modelSet.add(item.model)
      }
    }
  }

  return Array.from(modelSet).sort()
}

/** Belirli bir marka+model'in tüm paketlerini döndürür */
export async function getPackagesByBrandModel(brand: string, model: string): Promise<{ id: number; paket: string; full_model: string }[]> {
  const data = await getVehicleData()
  const normalizedBrand = brand.toUpperCase()
  const normalizedModel = model.toUpperCase()

  const seen = new Set<string>()
  const packages: { id: number; paket: string; full_model: string }[] = []

  for (const item of data) {
    if (item.brand !== normalizedBrand || item.model.toUpperCase() !== normalizedModel) continue

    if (item.full_model && !seen.has(item.full_model)) {
      seen.add(item.full_model)
      packages.push({
        id: item.id,
        paket: item.paket,
        full_model: item.full_model,
      })
    }
  }

  packages.sort((a, b) => a.paket.localeCompare(b.paket, 'tr'))
  return packages
}
