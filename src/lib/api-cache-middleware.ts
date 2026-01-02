import { NextRequest, NextResponse } from 'next/server';
import { getCached } from './cache';

/**
 * API Cache Middleware
 * Wraps API routes with Redis caching
 */
export function withCache(
  handler: (req: NextRequest) => Promise<NextResponse>,
  options: {
    keyPrefix: string;
    ttl?: number;
    tags?: string[];
    skipCache?: (req: NextRequest) => boolean;
  }
) {
  return async (req: NextRequest) => {
    // Check if we should skip cache
    if (options.skipCache?.(req)) {
      return handler(req);
    }

    // Generate cache key from URL and query params
    const url = new URL(req.url);
    const cacheKey = `${options.keyPrefix}:${url.pathname}${url.search}`;

    try {
      // Try to get cached response
      const cachedResponse = await getCached(
        cacheKey,
        async () => {
          const response = await handler(req);
          const data = await response.json();
          return data;
        },
        {
          ttl: options.ttl || 3600,
          tags: options.tags || [],
        }
      );

      return NextResponse.json(cachedResponse, {
        headers: {
          'Cache-Control': `public, s-maxage=${options.ttl || 3600}, stale-while-revalidate=${(options.ttl || 3600) * 2}`,
          'X-Cache': 'HIT',
        },
      });
    } catch (error) {
      // If caching fails, execute handler normally
      return handler(req);
    }
  };
}

/**
 * Helper to invalidate API cache by tag
 */
export { invalidateByTag as invalidateApiCache } from './cache';
