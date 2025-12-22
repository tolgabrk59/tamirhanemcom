import Redis from 'ioredis';

// Redis client with connection handling
let redis: Redis | null = null;
let isConnected = false;

function getRedisClient(): Redis | null {
  if (!process.env.REDIS_URL && !process.env.REDIS_HOST) {
    return null;
  }

  if (!redis) {
    redis = process.env.REDIS_URL
      ? new Redis(process.env.REDIS_URL, {
          maxRetriesPerRequest: 3,
          lazyConnect: true,
        })
      : new Redis({
          host: process.env.REDIS_HOST || 'localhost',
          port: parseInt(process.env.REDIS_PORT || '6379'),
          password: process.env.REDIS_PASSWORD,
          maxRetriesPerRequest: 3,
          lazyConnect: true,
        });

    redis.on('connect', () => {
      isConnected = true;
      console.log('Redis connected');
    });

    redis.on('error', (err) => {
      isConnected = false;
      console.error('Redis error:', err.message);
    });

    redis.on('close', () => {
      isConnected = false;
    });
  }

  return redis;
}

// Cache configuration
interface CacheOptions {
  ttl?: number; // Time to live in seconds (default: 1 hour)
  tags?: string[]; // Tags for cache invalidation
}

const DEFAULT_TTL = 3600; // 1 hour

/**
 * Get cached value or fetch and cache
 */
export async function getCached<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: CacheOptions = {}
): Promise<T> {
  const client = getRedisClient();

  if (!client || !isConnected) {
    // Redis not available, just fetch
    return fetcher();
  }

  try {
    // Try to get from cache
    const cached = await client.get(`cache:${key}`);

    if (cached) {
      // Track cache hit
      await client.incr('cache:stats:hits').catch(() => { });
      return JSON.parse(cached) as T;
    }

    // Track cache miss
    await client.incr('cache:stats:misses').catch(() => { });

    // Fetch fresh data
    const data = await fetcher();

    // Store in cache
    const ttl = options.ttl || DEFAULT_TTL;
    await client.setex(`cache:${key}`, ttl, JSON.stringify(data));

    // Store tags for invalidation
    if (options.tags?.length) {
      const pipeline = client.pipeline();
      for (const tag of options.tags) {
        pipeline.sadd(`cache:tag:${tag}`, `cache:${key}`);
        pipeline.expire(`cache:tag:${tag}`, ttl * 2); // Tags expire after double TTL
      }
      await pipeline.exec();
    }

    return data;
  } catch (error) {
    console.error('Cache error:', error);
    // Fallback to direct fetch
    return fetcher();
  }
}

/**
 * Invalidate cache by key
 */
export async function invalidateCache(key: string): Promise<boolean> {
  const client = getRedisClient();

  if (!client || !isConnected) {
    return false;
  }

  try {
    await client.del(`cache:${key}`);
    return true;
  } catch (error) {
    console.error('Cache invalidation error:', error);
    return false;
  }
}

/**
 * Invalidate all cache entries with a specific tag
 */
export async function invalidateByTag(tag: string): Promise<number> {
  const client = getRedisClient();

  if (!client || !isConnected) {
    return 0;
  }

  try {
    const keys = await client.smembers(`cache:tag:${tag}`);

    if (keys.length === 0) {
      return 0;
    }

    const pipeline = client.pipeline();
    for (const key of keys) {
      pipeline.del(key);
    }
    pipeline.del(`cache:tag:${tag}`);
    await pipeline.exec();

    return keys.length;
  } catch (error) {
    console.error('Cache tag invalidation error:', error);
    return 0;
  }
}

/**
 * Clear all cache
 */
export async function clearAllCache(): Promise<boolean> {
  const client = getRedisClient();

  if (!client || !isConnected) {
    return false;
  }

  try {
    const keys = await client.keys('cache:*');

    if (keys.length > 0) {
      await client.del(...keys);
    }

    return true;
  } catch (error) {
    console.error('Cache clear error:', error);
    return false;
  }
}

/**
 * Get cache statistics
 */
export async function getCacheStats(): Promise<{
  hits: number;
  misses: number;
  hitRate: number;
} | null> {
  const client = getRedisClient();

  if (!client || !isConnected) {
    return null;
  }

  try {
    const [hits, misses] = await Promise.all([
      client.get('cache:stats:hits'),
      client.get('cache:stats:misses'),
    ]);

    const hitsNum = parseInt(hits || '0');
    const missesNum = parseInt(misses || '0');
    const total = hitsNum + missesNum;

    return {
      hits: hitsNum,
      misses: missesNum,
      hitRate: total > 0 ? (hitsNum / total) * 100 : 0,
    };
  } catch (error) {
    console.error('Cache stats error:', error);
    return null;
  }
}

/**
 * Cache decorator for AI responses
 * Uses a 30-day TTL for AI-generated content
 */
export async function cacheAIResponse<T>(
  brand: string,
  model: string,
  year: number,
  type: string,
  fetcher: () => Promise<T>
): Promise<T> {
  const key = `ai:${type}:${brand}:${model}:${year}`.toLowerCase().replace(/\s+/g, '-');

  return getCached(key, fetcher, {
    ttl: 30 * 24 * 60 * 60, // 30 days
    tags: ['ai', `brand:${brand.toLowerCase()}`, `model:${model.toLowerCase()}`],
  });
}

/**
 * Cache decorator for vehicle data
 * Uses a 1-hour TTL
 */
export async function cacheVehicleData<T>(
  dataType: string,
  identifier: string,
  fetcher: () => Promise<T>
): Promise<T> {
  const key = `vehicle:${dataType}:${identifier}`.toLowerCase().replace(/\s+/g, '-');

  return getCached(key, fetcher, {
    ttl: 3600, // 1 hour
    tags: ['vehicle', dataType],
  });
}

/**
 * Cache decorator for pricing data
 * Uses a 6-hour TTL (prices change less frequently)
 */
export async function cachePricingData<T>(
  brand: string,
  model: string,
  year: number,
  fetcher: () => Promise<T>
): Promise<T> {
  const key = `pricing:${brand}:${model}:${year}`.toLowerCase().replace(/\s+/g, '-');

  return getCached(key, fetcher, {
    ttl: 6 * 60 * 60, // 6 hours
    tags: ['pricing', `brand:${brand.toLowerCase()}`],
  });
}

export { getRedisClient, isConnected };
