import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';
import { createLogger } from '@/lib/logger';

const logger = createLogger('API_MODELS');

export const dynamic = 'force-dynamic';

const STRAPI_URL = process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api';
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

interface StrapiVehicle {
    id: number;
    brand: string;
    model: string;
    full_model: string;
}

interface StrapiResponse {
    data: StrapiVehicle[];
    meta: { pagination: { total: number; }; };
}

function getRedis(): Redis | null {
    if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) return null;
    return new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
}

async function getFromRedis(vehicleType: string, brand: string): Promise<{ model: string }[] | null> {
    const redis = getRedis();
    if (!redis) return null;
    try {
        const key = 'vehicles:models:' + vehicleType + ':' + brand;
        const cached = await redis.get<{ model: string }[]>(key);
        if (cached) {
            logger.info('Redis cache hit for ' + vehicleType + '/' + brand + ' models');
            return cached;
        }
    } catch (error) {
        logger.warn({ error }, 'Redis read error');
    }
    return null;
}

async function saveToRedis(vehicleType: string, brand: string, models: { model: string }[]): Promise<void> {
    const redis = getRedis();
    if (!redis) return;
    try {
        const key = 'vehicles:models:' + vehicleType + ':' + brand;
        const TTL = 48 * 60 * 60;
        await redis.setex(key, TTL, JSON.stringify(models));
        logger.info('Cached ' + models.length + ' models for ' + vehicleType + '/' + brand);
    } catch (error) {
        logger.warn({ error }, 'Redis write error');
    }
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const brand = searchParams.get('brand');
        const vehicleType = searchParams.get('vehicleType') || 'otomobil';

        if (!brand) {
            return NextResponse.json({ success: false, error: 'Marka parametresi gerekli' }, { status: 400 });
        }

        const normalizedBrand = brand.toUpperCase();

        // Try Redis cache first
        if (vehicleType === 'otomobil' || vehicleType === 'motorsiklet') {
            const cachedModels = await getFromRedis(vehicleType, normalizedBrand);
            if (cachedModels && cachedModels.length > 0) {
                return NextResponse.json({ success: true, data: cachedModels });
            }
        }

        logger.info('Fetching models from Strapi for ' + vehicleType + '/' + brand);

        let models: string[] = [];

        if (vehicleType === 'motorsiklet') {
            const url = STRAPI_URL + '/arac-dataveris?filters[brand][]=MOTORSIKLET&filters[model][]=' + encodeURIComponent(brand) + '&fields[0]=full_model&pagination[pageSize]=10000';
            const response = await fetch(url, {
                headers: { 'Authorization': 'Bearer ' + STRAPI_TOKEN },
                next: { revalidate: 1800 },
            });
            if (!response.ok) throw new Error('Strapi API error: ' + response.status);
            const result: StrapiResponse = await response.json();
            models = [...new Set(result.data.map(item => item.full_model))].filter(Boolean).sort();
        } else {
            // Otomobil - use exact match filter
            const url = STRAPI_URL + '/arac-dataveris?filters[brand][]=' + encodeURIComponent(normalizedBrand) + '&fields[0]=brand&fields[1]=model&pagination[pageSize]=10000';
            const response = await fetch(url, {
                headers: { 'Authorization': 'Bearer ' + STRAPI_TOKEN },
                next: { revalidate: 1800 },
            });
            if (!response.ok) throw new Error('Strapi API error: ' + response.status);
            const result: StrapiResponse = await response.json();
            
            // Filter by brand name for additional safety
            models = [...new Set(result.data
                .filter(item => item.brand && item.brand.toUpperCase() === normalizedBrand)
                .map(item => item.model)
            )].filter(Boolean).sort();

            // For FIAT, also include TOFAS-FIAT models
            if (normalizedBrand === 'FIAT') {
                const tofasUrl = STRAPI_URL + '/arac-dataveris?filters[brand][]=TOFAS-FIAT&fields[0]=model&pagination[pageSize]=10000';
                const tofasResponse = await fetch(tofasUrl, {
                    headers: { 'Authorization': 'Bearer ' + STRAPI_TOKEN },
                    next: { revalidate: 1800 },
                });
                if (tofasResponse.ok) {
                    const tofasResult: StrapiResponse = await tofasResponse.json();
                    const tofasModels = [...new Set(tofasResult.data.map(item => item.model))].filter(Boolean);
                    models = [...new Set([...models, ...tofasModels])].sort();
                }
            }
        }

        const formattedModels = models.map((m: string) => ({ model: m }));

        // Save to Redis
        if ((vehicleType === 'otomobil' || vehicleType === 'motorsiklet') && formattedModels.length > 0) {
            saveToRedis(vehicleType, normalizedBrand, formattedModels).catch(() => {});
        }

        return NextResponse.json({ success: true, data: formattedModels });
    } catch (error) {
        logger.error({ error }, 'Models API Error');
        return NextResponse.json({ success: false, error: 'Modeller yuklenemedi' }, { status: 500 });
    }
}
