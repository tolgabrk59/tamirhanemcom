import { NextResponse } from 'next/server';
import { healthCheck as dbHealthCheck } from '@/lib/db';
import { getCacheStats, getRedisClient } from '@/lib/cache';
import { features } from '@/lib/env';

export const dynamic = 'force-dynamic';

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  version: string;
  uptime: number;
  services: {
    database: 'up' | 'down' | 'disabled';
    redis: 'up' | 'down' | 'disabled';
    strapi: 'up' | 'down' | 'disabled';
  };
  cache?: {
    hits: number;
    misses: number;
    hitRate: number;
  } | null;
}

const startTime = Date.now();

type ServiceStatus = 'up' | 'down' | 'disabled';

export async function GET(): Promise<NextResponse<HealthStatus>> {
  const services: {
    database: ServiceStatus;
    redis: ServiceStatus;
    strapi: ServiceStatus;
  } = {
    database: 'disabled',
    redis: 'disabled',
    strapi: 'disabled',
  };

  // Check database
  if (features.database) {
    try {
      const dbUp = await dbHealthCheck();
      services.database = dbUp ? 'up' : 'down';
    } catch {
      services.database = 'down';
    }
  }

  // Check Redis
  if (features.redis) {
    try {
      const redis = getRedisClient();
      if (redis) {
        await redis.ping();
        services.redis = 'up';
      } else {
        services.redis = 'down';
      }
    } catch {
      services.redis = 'down';
    }
  }

  // Check Strapi
  if (features.strapi) {
    try {
      const strapiUrl = process.env.STRAPI_API_URL;
      if (strapiUrl) {
        const response = await fetch(`${strapiUrl}/../_health`, {
          method: 'HEAD',
          signal: AbortSignal.timeout(5000),
        });
        services.strapi = response.ok ? 'up' : 'down';
      }
    } catch {
      services.strapi = 'down';
    }
  }

  // Determine overall status
  const criticalServices = [services.database, services.strapi].filter(s => s !== 'disabled');
  const allUp = criticalServices.every(s => s === 'up');
  const allDown = criticalServices.every(s => s === 'down');

  let status: 'healthy' | 'degraded' | 'unhealthy';
  if (criticalServices.length === 0 || allUp) {
    status = 'healthy';
  } else if (allDown) {
    status = 'unhealthy';
  } else {
    status = 'degraded';
  }

  // Get cache stats
  let cache = null;
  if (features.redis) {
    cache = await getCacheStats();
  }

  const healthStatus: HealthStatus = {
    status,
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    uptime: Math.floor((Date.now() - startTime) / 1000),
    services,
    cache,
  };

  return NextResponse.json(healthStatus, {
    status: status === 'unhealthy' ? 503 : 200,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
}
