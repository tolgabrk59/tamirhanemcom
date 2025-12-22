import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rate limit configuration per route pattern
const RATE_LIMIT_CONFIG: Record<string, { windowMs: number; maxRequests: number }> = {
  '/api/ai': { windowMs: 3600000, maxRequests: 10 },      // 10/hour
  '/api/chat': { windowMs: 3600000, maxRequests: 20 },    // 20/hour
  '/api/arac-degeri': { windowMs: 3600000, maxRequests: 5 }, // 5/hour
  '/api/admin/auth': { windowMs: 900000, maxRequests: 5 }, // 5/15min
  '/api/randevu': { windowMs: 3600000, maxRequests: 10 }, // 10/hour
  '/api/waitlist': { windowMs: 3600000, maxRequests: 10 }, // 10/hour
  '/api': { windowMs: 60000, maxRequests: 60 },           // 60/min default
};

// In-memory rate limit store (for edge runtime)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Clean up old entries periodically
function cleanupRateLimitStore() {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

// Get client IP
function getClientIP(request: NextRequest): string {
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

// Find matching rate limit config
function getRateLimitConfig(pathname: string): { windowMs: number; maxRequests: number } {
  for (const [pattern, config] of Object.entries(RATE_LIMIT_CONFIG)) {
    if (pattern !== '/api' && pathname.startsWith(pattern)) {
      return config;
    }
  }
  return RATE_LIMIT_CONFIG['/api'];
}

// Check rate limit
function checkRateLimit(
  identifier: string,
  config: { windowMs: number; maxRequests: number }
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const record = rateLimitStore.get(identifier);

  // Periodic cleanup
  if (Math.random() < 0.01) {
    cleanupRateLimitStore();
  }

  if (!record || now > record.resetTime) {
    // New window
    rateLimitStore.set(identifier, { count: 1, resetTime: now + config.windowMs });
    return { allowed: true, remaining: config.maxRequests - 1, resetTime: now + config.windowMs };
  }

  if (record.count >= config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: record.resetTime,
    };
  }

  record.count++;
  return {
    allowed: true,
    remaining: config.maxRequests - record.count,
    resetTime: record.resetTime,
  };
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only process API routes
  if (!pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // Skip health check endpoint
  if (pathname === '/api/health') {
    return NextResponse.next();
  }

  // Get client identifier
  const clientIP = getClientIP(request);
  const identifier = `${clientIP}:${pathname.split('/').slice(0, 4).join('/')}`;

  // Check rate limit
  const rateLimitConfig = getRateLimitConfig(pathname);
  const rateLimitResult = checkRateLimit(identifier, rateLimitConfig);

  // Log request
  console.log(
    `[API] ${request.method} ${pathname} - IP: ${clientIP} - Remaining: ${rateLimitResult.remaining}`
  );

  // If rate limited, return 429
  if (!rateLimitResult.allowed) {
    const retryAfter = Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000);

    return NextResponse.json(
      {
        success: false,
        error: {
          message: 'Çok fazla istek gönderildi. Lütfen bekleyin.',
          code: 'RATE_LIMIT_EXCEEDED',
        },
        meta: {
          timestamp: new Date().toISOString(),
        },
      },
      {
        status: 429,
        headers: {
          'Retry-After': retryAfter.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': new Date(rateLimitResult.resetTime).toISOString(),
        },
      }
    );
  }

  // Create response with rate limit headers
  const response = NextResponse.next();

  // Add rate limit headers
  response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
  response.headers.set('X-RateLimit-Reset', new Date(rateLimitResult.resetTime).toISOString());

  // Add security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Add request ID for tracing
  const requestId = crypto.randomUUID();
  response.headers.set('X-Request-ID', requestId);

  return response;
}

export const config = {
  matcher: '/api/:path*',
};
