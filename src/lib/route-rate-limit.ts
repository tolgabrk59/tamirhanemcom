import { Redis } from "@upstash/redis";

// Get Redis client
function getRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  
  if (!url || !token) return null;
  return new Redis({ url, token });
}

// Rate limit check for API routes
export async function checkRouteRateLimit(
  identifier: string,
  maxRequests: number,
  windowMs: number
): Promise<{ allowed: boolean; remaining: number; retryAfter?: number }> {
  const redis = getRedis();
  const key = `route-limit:${identifier}`;
  const now = Date.now();
  
  if (!redis) {
    // No Redis - allow request
    return { allowed: true, remaining: maxRequests - 1 };
  }
  
  try {
    const current = await redis.incr(key);
    
    if (current === 1) {
      await redis.pexpire(key, windowMs);
    }
    
    const ttl = await redis.pttl(key);
    
    if (current > maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        retryAfter: Math.ceil((ttl > 0 ? ttl : windowMs) / 1000),
      };
    }
    
    return {
      allowed: true,
      remaining: maxRequests - current,
    };
  } catch (error) {
    console.error("[RouteRateLimit] Redis error:", error);
    return { allowed: true, remaining: maxRequests - 1 };
  }
}

// Helper to get client IP from headers
export function getClientIdentifier(
  headers: Headers,
  endpoint: string
): string {
  const forwarded = headers.get("x-forwarded-for");
  const realIP = headers.get("x-real-ip");
  const ip = forwarded?.split(",")[0].trim() || realIP || "unknown";
  return `${ip}:${endpoint}`;
}
