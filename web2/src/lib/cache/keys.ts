export interface CacheConfig {
  prefix: string
  /** Fresh cache süresi (saniye) — bu süre içinde direkt cache'ten döner */
  ttl: number
  /** Stale süresi (saniye) — TTL aşıldığında stale veriyi dönüp arka planda yeniler */
  stale: number
}

export const CACHE_KEYS = {
  brands: { prefix: 'brands', ttl: 3600, stale: 7200 } as CacheConfig,       // 1 saat fresh, 2 saat stale
  models: { prefix: 'models', ttl: 3600, stale: 7200 } as CacheConfig,       // 1 saat fresh, 2 saat stale
  packages: { prefix: 'packages', ttl: 3600, stale: 7200 } as CacheConfig,   // 1 saat fresh, 2 saat stale
  categories: { prefix: 'categories', ttl: 1800, stale: 3600 } as CacheConfig, // 30 dk fresh, 1 saat stale
  services: { prefix: 'services', ttl: 600, stale: 1200 } as CacheConfig,     // 10 dk fresh, 20 dk stale
  analyses: { prefix: 'analyses', ttl: 86400, stale: 604800 } as CacheConfig,  // 1 gün fresh, 7 gün stale
} as const

/** Cache key oluşturur: "prefix:segment1:segment2" */
export function buildKey(config: CacheConfig, ...segments: string[]): string {
  return [config.prefix, ...segments].filter(Boolean).join(':')
}
