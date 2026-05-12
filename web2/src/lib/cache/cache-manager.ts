import { getRedis } from './redis'
import type { CacheConfig } from './keys'

interface CacheEntry<T> {
  data: T
  ts: number // timestamp in ms
}

/**
 * Stale-while-revalidate destekli cache-aside fonksiyonu.
 *
 * 1. Redis'te varsa ve fresh → direkt döner
 * 2. Redis'te varsa ama stale → stale veriyi döner, arka planda fetcher çağırıp günceller
 * 3. Redis'te yoksa → fetcher çağırır, Redis'e yazar, döner
 * 4. Redis erişilemiyorsa → fetcher'a fallback, hata loglar
 */
export async function cachedFetch<T>(
  key: string,
  fetcher: () => Promise<T>,
  config: CacheConfig
): Promise<T> {
  const redis = getRedis()

  // Redis yoksa direkt fetcher'a git
  if (!redis) {
    return fetcher()
  }

  try {
    const cached = await redis.get<CacheEntry<T>>(key)

    if (cached && cached.data !== undefined && cached.ts) {
      const ageSeconds = (Date.now() - cached.ts) / 1000

      // Fresh — direkt dön
      if (ageSeconds < config.ttl) {
        return cached.data
      }

      // Stale — dön ama arka planda yenile
      if (ageSeconds < config.stale) {
        refreshInBackground(key, fetcher, config)
        return cached.data
      }
    }
  } catch (err) {
    console.warn(`[Cache] Redis GET hatası (${key}):`, err instanceof Error ? err.message : err)
    // Redis hatası — fetcher'a devam
  }

  // Cache miss veya expired — fetch et ve kaydet
  const freshData = await fetcher()

  // Redis'e yaz (fire-and-forget, hata olursa logla)
  writeToCache(key, freshData, config)

  return freshData
}

/** Arka planda fetch edip Redis'i günceller. Response'u beklemez. */
function refreshInBackground<T>(
  key: string,
  fetcher: () => Promise<T>,
  config: CacheConfig
): void {
  fetcher()
    .then((data) => writeToCache(key, data, config))
    .catch((err) => {
      console.warn(`[Cache] Background refresh hatası (${key}):`, err instanceof Error ? err.message : err)
    })
}

/** Redis'e veri yazar. Hata olursa sadece loglar. */
function writeToCache<T>(key: string, data: T, config: CacheConfig): void {
  const redis = getRedis()
  if (!redis) return

  const entry: CacheEntry<T> = { data, ts: Date.now() }

  redis
    .set(key, entry, { ex: config.stale })
    .catch((err) => {
      console.warn(`[Cache] Redis SET hatası (${key}):`, err instanceof Error ? err.message : err)
    })
}

/** Belirli bir key'i cache'ten siler. */
export async function invalidateCache(key: string): Promise<void> {
  const redis = getRedis()
  if (!redis) return

  try {
    await redis.del(key)
  } catch (err) {
    console.warn(`[Cache] Redis DEL hatası (${key}):`, err instanceof Error ? err.message : err)
  }
}

/** Belirli bir prefix ile başlayan tüm key'leri siler. */
export async function invalidateByPrefix(prefix: string): Promise<void> {
  const redis = getRedis()
  if (!redis) return

  try {
    let cursor = 0
    do {
      const result = await redis.scan(cursor, { match: `${prefix}:*`, count: 100 })
      cursor = Number(result[0])
      const keys = result[1] as string[]
      if (keys.length > 0) {
        await Promise.all(keys.map((k) => redis.del(k)))
      }
    } while (cursor !== 0)
  } catch (err) {
    console.warn(`[Cache] Redis SCAN/DEL hatası (${prefix}):`, err instanceof Error ? err.message : err)
  }
}
