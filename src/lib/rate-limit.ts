import { Redis } from "@upstash/redis";

// Rate limit configuration per route pattern
export const RATE_LIMIT_CONFIG: Record<string, { windowMs: number; maxRequests: number }> = {
  "/api/ai": { windowMs: 3600000, maxRequests: 10 },
  "/api/chat": { windowMs: 3600000, maxRequests: 20 },
  "/api/arac-degeri": { windowMs: 3600000, maxRequests: 5 },
  "/api/admin/auth": { windowMs: 900000, maxRequests: 5 },
  "/api/randevu": { windowMs: 3600000, maxRequests: 10 },
  "/api/waitlist": { windowMs: 3600000, maxRequests: 10 },
  "/api/otp": { windowMs: 60000, maxRequests: 3 },
  "/api": { windowMs: 60000, maxRequests: 60 },
};

// Find matching rate limit config
export function getRateLimitConfig(pathname: string): { windowMs: number; maxRequests: number } {
  for (const [pattern, config] of Object.entries(RATE_LIMIT_CONFIG)) {
    if (pattern !== "/api" && pathname.startsWith(pattern)) {
      return config;
    }
  }
  return RATE_LIMIT_CONFIG["/api"];
}

// Get Redis client - creates new instance per request (edge-compatible)
function getRedisClient(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  
  if (!url || !token) {
    return null;
  }
  
  return new Redis({ url, token });
}

// Check rate limit using Redis
export async function checkRateLimit(
  identifier: string,
  config: { windowMs: number; maxRequests: number }
): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
  const now = Date.now();
  const resetTime = now + config.windowMs;
  const key = `ratelimit:${identifier}`;
  
  const redis = getRedisClient();
  
  if (redis) {
    try {
      // Use Redis for distributed rate limiting
      const current = await redis.incr(key);
      
      if (current === 1) {
        // First request, set expiry
        await redis.pexpire(key, config.windowMs);
      }
      
      const ttl = await redis.pttl(key);
      const actualResetTime = now + (ttl > 0 ? ttl : config.windowMs);
      
      if (current > config.maxRequests) {
        return {
          allowed: false,
          remaining: 0,
          resetTime: actualResetTime,
        };
      }
      
      return {
        allowed: true,
        remaining: config.maxRequests - current,
        resetTime: actualResetTime,
      };
    } catch (error) {
      console.error("[RateLimit] Redis error:", error);
      // If Redis fails, allow the request (fail open for availability)
      return {
        allowed: true,
        remaining: config.maxRequests - 1,
        resetTime,
      };
    }
  }
  
  // No Redis - allow request but log warning
  console.warn("[RateLimit] Redis not configured, rate limiting disabled");
  return {
    allowed: true,
    remaining: config.maxRequests - 1,
    resetTime,
  };
}
