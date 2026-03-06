import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkRateLimit, getRateLimitConfig } from "@/lib/rate-limit";

// Get client IP
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIP = request.headers.get("x-real-ip");

  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  if (realIP) {
    return realIP;
  }
  return "unknown";
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ariza rehberi kırık linkleri /ariza-bul'a yönlendir (check-engine-lambasi hariç)
  if (pathname.startsWith("/ariza-rehberi/")) {
    const decodedPath = decodeURIComponent(pathname);
    if (decodedPath !== "/ariza-rehberi/check-engine-lambasi") {
      return NextResponse.redirect(new URL("/ariza-bul", request.url));
    }
  }

  // Only process API routes
  if (!pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Skip health check endpoint
  if (pathname === "/api/health") {
    return NextResponse.next();
  }

  // Get client identifier
  const clientIP = getClientIP(request);
  const identifier = `${clientIP}:${pathname.split("/").slice(0, 4).join("/")}`;

  // Check rate limit (now async with Redis support)
  const rateLimitConfig = getRateLimitConfig(pathname);
  const rateLimitResult = await checkRateLimit(identifier, rateLimitConfig);

  // Log for debugging (will show in server logs)
  console.log(`[MIDDLEWARE] ${request.method} ${pathname} - IP: ${clientIP} - Allowed: ${rateLimitResult.allowed} - Remaining: ${rateLimitResult.remaining}`);

  // If rate limited, return 429
  if (!rateLimitResult.allowed) {
    const retryAfter = Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000);

    return NextResponse.json(
      {
        success: false,
        error: {
          message: "Çok fazla istek gönderildi. Lütfen bekleyin.",
          code: "RATE_LIMIT_EXCEEDED",
        },
        meta: {
          timestamp: new Date().toISOString(),
          retryAfter: retryAfter,
        },
      },
      {
        status: 429,
        headers: {
          "Retry-After": retryAfter.toString(),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": new Date(rateLimitResult.resetTime).toISOString(),
        },
      }
    );
  }

  // Create response with rate limit headers
  const response = NextResponse.next();

  // Add rate limit headers
  response.headers.set("X-RateLimit-Remaining", rateLimitResult.remaining.toString());
  response.headers.set("X-RateLimit-Reset", new Date(rateLimitResult.resetTime).toISOString());

  // Add security headers
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

  // Add request ID for tracing
  const requestId = crypto.randomUUID();
  response.headers.set("X-Request-ID", requestId);

  return response;
}

export const config = {
  matcher: ["/", "/api/:path*", "/ariza-rehberi/:path*"],
};
