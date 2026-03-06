import Redis from 'ioredis';
import { createLogger } from './logger';

const rateLimitLogger = createLogger('RATE_LIMIT');

// Redis connection - uses env variable or defaults to localhost
const redis = process.env.REDIS_URL
  ? new Redis(process.env.REDIS_URL)
  : new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
      maxRetriesPerRequest: 3,
      lazyConnect: true,
    });

// Handle connection errors gracefully
redis.on('error', (err) => {
  rateLimitLogger.error({ err: err.message }, 'Redis connection error');
});

interface RateLimitConfig {
  windowMs: number;      // Time window in milliseconds
  maxRequests: number;   // Max requests per window
}

interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetTime: number;
  retryAfter?: number;
}

// Predefined rate limit tiers
export const RATE_LIMITS = {
  // AI endpoints - expensive, limit strictly
  ai: { windowMs: 60 * 60 * 1000, maxRequests: 10 },          // 10/hour

  // Chat endpoint - moderate limit
  chat: { windowMs: 60 * 60 * 1000, maxRequests: 20 },        // 20/hour

  // Scraping endpoints - limit to avoid abuse
  scraping: { windowMs: 60 * 60 * 1000, maxRequests: 5 },     // 5/hour

  // Standard API endpoints
  standard: { windowMs: 60 * 1000, maxRequests: 60 },         // 60/minute

  // Admin endpoints
  admin: { windowMs: 60 * 1000, maxRequests: 30 },            // 30/minute

  // Auth endpoints - strict to prevent brute force
  auth: { windowMs: 15 * 60 * 1000, maxRequests: 5 },         // 5/15min

  // Form submissions
  form: { windowMs: 60 * 60 * 1000, maxRequests: 10 },        // 10/hour
} as const;

/**
 * Check rate limit using sliding window algorithm
 */
export async function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const key = `ratelimit:${identifier}`;
  const now = Date.now();
  const windowStart = now - config.windowMs;

  try {
    // Use Redis transaction for atomic operations
    const pipeline = redis.pipeline();

    // Remove old entries outside the window
    pipeline.zremrangebyscore(key, 0, windowStart);

    // Count current requests in window
    pipeline.zcard(key);

    // Add current request
    pipeline.zadd(key, now.toString(), `${now}-${Math.random()}`);

    // Set expiry on key
    pipeline.pexpire(key, config.windowMs);

    const results = await pipeline.exec();

    if (!results) {
      // Redis unavailable - allow request (fail open)
      return { success: true, remaining: config.maxRequests, resetTime: now + config.windowMs };
    }

    const currentCount = (results[1]?.[1] as number) || 0;
    const remaining = Math.max(0, config.maxRequests - currentCount - 1);
    const resetTime = now + config.windowMs;

    if (currentCount >= config.maxRequests) {
      // Remove the request we just added since it's over limit
      await redis.zrem(key, `${now}-${Math.random()}`);

      return {
        success: false,
        remaining: 0,
        resetTime,
        retryAfter: Math.ceil(config.windowMs / 1000),
      };
    }

    return {
      success: true,
      remaining,
      resetTime,
    };
  } catch (error) {
    rateLimitLogger.error({ error }, 'Rate limit check error');
    // Fail open - allow request if Redis is down
    return { success: true, remaining: config.maxRequests, resetTime: now + config.windowMs };
  }
}

/**
 * Get client IP from request headers
 */
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');

  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  if (realIP) {
    return realIP;
  }

  return 'unknown';
}

/**
 * Create rate limit headers for response
 */
export function createRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  const headers: Record<string, string> = {
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': new Date(result.resetTime).toISOString(),
  };

  if (!result.success && result.retryAfter) {
    headers['Retry-After'] = result.retryAfter.toString();
  }

  return headers;
}

// In-memory fallback for when Redis is not available
const memoryStore = new Map<string, { count: number; resetTime: number }>();

/**
 * Simple in-memory rate limiter (fallback when Redis unavailable)
 */
export function checkRateLimitMemory(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now();
  const key = `ratelimit:${identifier}`;

  const record = memoryStore.get(key);

  if (!record || now > record.resetTime) {
    // New window
    memoryStore.set(key, { count: 1, resetTime: now + config.windowMs });
    return { success: true, remaining: config.maxRequests - 1, resetTime: now + config.windowMs };
  }

  if (record.count >= config.maxRequests) {
    return {
      success: false,
      remaining: 0,
      resetTime: record.resetTime,
      retryAfter: Math.ceil((record.resetTime - now) / 1000),
    };
  }

  record.count++;
  return {
    success: true,
    remaining: config.maxRequests - record.count,
    resetTime: record.resetTime,
  };
}

// Clean up expired entries periodically (for memory store)
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of memoryStore.entries()) {
    if (now > record.resetTime) {
      memoryStore.delete(key);
    }
  }
}, 60000); // Every minute

export { redis };
