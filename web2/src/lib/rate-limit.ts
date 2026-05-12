import { NextResponse } from 'next/server'
import { getRedis } from './cache/redis'

interface RateLimitConfig {
  maxRequests: number
  windowMs: number
}

const RATE_LIMIT_PRESETS = {
  public: { maxRequests: 60, windowMs: 60_000 },
  auth: { maxRequests: 10, windowMs: 60_000 },
  otp: { maxRequests: 5, windowMs: 300_000 },
  write: { maxRequests: 30, windowMs: 60_000 },
  ai: { maxRequests: 20, windowMs: 60_000 },
} as const

type RateLimitPreset = keyof typeof RATE_LIMIT_PRESETS

const memoryStore = new Map<string, { count: number; resetAt: number }>()

function cleanupMemoryStore() {
  const now = Date.now()
  const keys = Array.from(memoryStore.keys())
  for (let i = 0; i < keys.length; i++) {
    const value = memoryStore.get(keys[i])
    if (value && value.resetAt <= now) {
      memoryStore.delete(keys[i])
    }
  }
}

setInterval(cleanupMemoryStore, 60_000)

function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  const realIp = request.headers.get('x-real-ip')
  if (realIp) return realIp
  return 'unknown'
}

async function checkRateLimitRedis(
  key: string,
  config: RateLimitConfig
): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
  const redis = getRedis()
  if (!redis) return checkRateLimitMemory(key, config)

  try {
    const windowSeconds = Math.ceil(config.windowMs / 1000)
    const count = await redis.incr(key)

    if (count === 1) {
      await redis.expire(key, windowSeconds)
    }

    const ttl = await redis.ttl(key)
    const resetAt = Date.now() + ttl * 1000

    return {
      allowed: count <= config.maxRequests,
      remaining: Math.max(0, config.maxRequests - count),
      resetAt,
    }
  } catch {
    return checkRateLimitMemory(key, config)
  }
}

function checkRateLimitMemory(
  key: string,
  config: RateLimitConfig
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now()
  const entry = memoryStore.get(key)

  if (!entry || entry.resetAt <= now) {
    const resetAt = now + config.windowMs
    memoryStore.set(key, { count: 1, resetAt })
    return { allowed: true, remaining: config.maxRequests - 1, resetAt }
  }

  entry.count++
  return {
    allowed: entry.count <= config.maxRequests,
    remaining: Math.max(0, config.maxRequests - entry.count),
    resetAt: entry.resetAt,
  }
}

export async function rateLimit(
  request: Request,
  preset: RateLimitPreset = 'public'
): Promise<NextResponse | null> {
  const config = RATE_LIMIT_PRESETS[preset]
  const ip = getClientIp(request)
  const path = new URL(request.url).pathname
  const key = `rl:${preset}:${ip}:${path}`

  const result = await checkRateLimitRedis(key, config)

  if (!result.allowed) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'Çok fazla istek gönderildi. Lütfen bekleyip tekrar deneyin.',
        },
      },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': config.maxRequests.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': Math.ceil(result.resetAt / 1000).toString(),
          'Retry-After': Math.ceil((result.resetAt - Date.now()) / 1000).toString(),
        },
      }
    )
  }

  return null
}

export function rateLimitHeaders(
  remaining: number,
  limit: number,
  resetAt: number
): Record<string, string> {
  return {
    'X-RateLimit-Limit': limit.toString(),
    'X-RateLimit-Remaining': remaining.toString(),
    'X-RateLimit-Reset': Math.ceil(resetAt / 1000).toString(),
  }
}
