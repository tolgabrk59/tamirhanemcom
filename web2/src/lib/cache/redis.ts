import { Redis } from '@upstash/redis'

let redis: Redis | null = null

export function getRedis(): Redis | null {
  if (redis) return redis

  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN

  if (!url || !token) {
    console.warn('[Cache] UPSTASH_REDIS_REST_URL veya UPSTASH_REDIS_REST_TOKEN tanımlı değil — cache devre dışı')
    return null
  }

  try {
    redis = new Redis({ url, token })
    return redis
  } catch (err) {
    console.error('[Cache] Redis bağlantısı kurulamadı:', err instanceof Error ? err.message : err)
    return null
  }
}
