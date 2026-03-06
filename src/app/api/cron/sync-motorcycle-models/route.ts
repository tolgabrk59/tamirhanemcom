import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';
import { createLogger } from '@/lib/logger';

export const maxDuration = 60;

const logger = createLogger('CRON_SYNC_MOTORCYCLE_MODELS');

const STRAPI_URL = process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api';
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;
const CRON_SECRET = process.env.CRON_SECRET;

interface StrapiVehicle {
    full_model?: string;
}

interface StrapiResponse {
    data: StrapiVehicle[];
}

function getRedis(): Redis | null {
    if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
        return null;
    }
    return new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
}

export async function GET(request: Request) {
    const startTime = Date.now();
    const { searchParams } = new URL(request.url);
    const part = parseInt(searchParams.get('part') || '1');

    const authHeader = request.headers.get('authorization');
    const isVercelCron = request.headers.get('x-vercel-cron') === '1';

    if (!isVercelCron && CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const redis = getRedis();
    if (!redis) {
        return NextResponse.json({ error: 'Redis not configured' }, { status: 500 });
    }

    try {
        const motorcycleBrandsData = await redis.get<{ brand: string }[]>('vehicles:brands:motorsiklet');
        if (!motorcycleBrandsData) {
            return NextResponse.json({ error: 'Brands not synced' }, { status: 400 });
        }

        const allBrands = motorcycleBrandsData.map(b => b.brand);
        const BRANDS_PER_PART = 5;
        const startIdx = (part - 1) * BRANDS_PER_PART;
        const brands = allBrands.slice(startIdx, startIdx + BRANDS_PER_PART);

        if (brands.length === 0) {
            return NextResponse.json({ success: true, data: { syncedBrands: 0, part, message: 'No brands in this part' } });
        }

        logger.info(`Part ${part}: Syncing models for ${brands.length} motorcycle brands (${startIdx}-${startIdx + brands.length - 1})`);

        const TTL = 48 * 60 * 60;
        let syncedCount = 0;

        for (const brand of brands) {
            try {
                const controller = new AbortController();
                const timeout = setTimeout(() => controller.abort(), 10000);

                const url = `${STRAPI_URL}/arac-dataveris?filters[brand][$eq]=MOTORSIKLET&filters[model][$eq]=${encodeURIComponent(brand)}&fields[0]=full_model&pagination[pageSize]=10000`;
                const res = await fetch(url, {
                    headers: { 'Authorization': `Bearer ${STRAPI_TOKEN}` },
                    signal: controller.signal,
                });
                clearTimeout(timeout);

                if (!res.ok) continue;

                const data: StrapiResponse = await res.json();
                const models = [...new Set(data.data.map(item => item.full_model).filter((m): m is string => Boolean(m)))].sort();

                if (models.length > 0) {
                    await redis.setex(`vehicles:models:motorsiklet:${brand}`, TTL, JSON.stringify(models.map(m => ({ model: m }))));
                    syncedCount++;
                }
            } catch {}
        }

        const duration = Date.now() - startTime;
        logger.info(`Part ${part}: Synced ${syncedCount} motorcycle brand models in ${duration}ms`);

        return NextResponse.json({
            success: true,
            data: { syncedBrands: syncedCount, part, totalParts: Math.ceil(allBrands.length / BRANDS_PER_PART), duration: `${duration}ms` },
        });
    } catch (error) {
        logger.error({ error }, 'Motorcycle models sync failed');
        return NextResponse.json({ success: false, error: 'Sync failed' }, { status: 500 });
    }
}
