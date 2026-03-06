import { NextResponse } from 'next/server';
import IORedis from 'ioredis';
import { createLogger } from '@/lib/logger';

const logger = createLogger('API_BRANDS');

export const dynamic = 'force-dynamic';

const STRAPI_URL = process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api';
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

// Türkiye pazarında olmayan veya pasif edilecek OTOMOBİL markaları
const EXCLUDED_CAR_BRANDS = [
    'BUGATTI', 'CADILLAC', 'DAF', 'DFM', 'DODGE', 'GMC', 'INFINITI',
    'LANCIA', 'LINCOLN', 'LOTUS', 'MAYBACH', 'MCLAREN', 'OTOKAR/MAGIRUS',
    'OTOYOLIVECOFIAT', 'PIAGGIO', 'PROTON', 'RAM', 'ROLLS-ROYCE', 'SAAB',
    'SETRA', 'SMART', 'TEMSA', 'VOYAH', 'HARLEY-DAVIDSON', 'RAMZEY',
    'BMC', 'ISUZU', 'MAN', 'DFSK', 'MAXUS', 'TATA', 'TOFAS-FIAT',
];

// Türkiye'de aktif olan MOTORSİKLET markaları (whitelist)
const ACTIVE_MOTORCYCLE_BRANDS = [
    'APRILIA', 'ARORA', 'ASKOLL', 'ASYA', 'AYTIMUR', 'BAJAJ', 'BENDA',
    'BENELLI', 'BENLING', 'BETA', 'BISAN', 'BMW', 'BRIXTON', 'BRP',
    'CAN-AM', 'CAGIVA', 'CFMOTO', 'DAELIM', 'DERBI', 'DUCATI', 'ECOOTER',
    'ENERGICA', 'EVOKE', 'FALCON', 'FANTIC', 'GASGAS', 'GILERA', 'HAOJUE',
    'HARLEY-DAVIDSON', 'HERO', 'HONDA', 'HORWIN', 'HUSQVARNA', 'HYOSUNG',
    'INDIAN', 'ITALJET', 'JAWA', 'KANUNI', 'KAWASAKI', 'KEEWAY', 'KOVE',
    'KRAL', 'KTM', 'KUBA', 'KYMCO', 'LAMBRETTA', 'LIFAN', 'LINHAI',
    'LONCIN', 'MALAGUTI', 'MIKU', 'MONDIAL', 'MOTOGUZZI', 'MOTOLUX',
    'MOTORAN', 'MUTT', 'MV', 'MVAGUSTO', 'NIU', 'NOVA', 'PGO', 'PIAGGIO',
    'POLARIS', 'QJ', 'RAMZEY', 'REVOLT', 'RIEJU', 'RKS', 'ROYAL', 'RVM',
    'SALCANO', 'SHERCO', 'SHINERAY', 'SILENCE', 'SPADA', 'STELVIO',
    'SUNRA', 'SUPER', 'SUZUKI', 'SWM', 'SYM', 'TGB', 'TM', 'TOMOTO',
    'TRIUMPH', 'TROMOX', 'TVS', 'URAL', 'VESPA', 'VICTORY', 'VITELLO',
    'VMOTO', 'VOGE', 'VOLTA', 'XEV', 'YAMAHA', 'YUKI', 'ZAFFERANO', 'ZD',
    'ZEEHO', 'ZERO', 'ZONGSHEN', 'ZONTES', 'ZORRO',
];

interface StrapiVehicle {
    id: number;
    brand: string;
    model: string;
}

interface StrapiResponse {
    data: StrapiVehicle[];
    meta: {
        pagination: {
            total: number;
        };
    };
}

// Local Redis client (singleton)
let redisClient: IORedis | null = null;

function getRedis(): IORedis | null {
    if (redisClient) return redisClient;

    const host = process.env.REDIS_HOST || 'localhost';
    const port = parseInt(process.env.REDIS_PORT || '6379');

    try {
        redisClient = new IORedis({ host, port, maxRetriesPerRequest: 1, lazyConnect: true });
        redisClient.on('error', (err) => {
            logger.warn({ err }, 'Redis connection error');
        });
        return redisClient;
    } catch {
        return null;
    }
}

// Try to get from Redis cache first
async function getFromRedis(vehicleType: string): Promise<{ brand: string }[] | null> {
    const redis = getRedis();
    if (!redis) return null;

    try {
        const key = `vehicles:brands:${vehicleType}`;
        const cached = await redis.get(key);
        if (cached) {
            logger.info(`Redis cache hit for ${vehicleType} brands`);
            return JSON.parse(cached);
        }
    } catch (error) {
        logger.warn({ error }, 'Redis read error, falling back to Strapi');
    }
    return null;
}

// Save to Redis cache
async function saveToRedis(vehicleType: string, data: { brand: string }[]): Promise<void> {
    const redis = getRedis();
    if (!redis) return;

    try {
        const key = `vehicles:brands:${vehicleType}`;
        await redis.set(key, JSON.stringify(data), 'EX', 3600); // 1 hour TTL
        logger.info(`Saved ${vehicleType} brands to Redis cache`);
    } catch (error) {
        logger.warn({ error }, 'Redis write error');
    }
}

// Fallback: fetch from Strapi
async function fetchBrandsFromStrapi(): Promise<string[]> {
    logger.info('Fetching car brands from Strapi (fallback)...');
    const url = `${STRAPI_URL}/arac-dataveris?fields[0]=brand&pagination[pageSize]=100000`;

    const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${STRAPI_TOKEN}` },
        next: { revalidate: 1800 },
    });

    if (!response.ok) {
        throw new Error(`Strapi API error: ${response.status}`);
    }

    const result: StrapiResponse = await response.json();
    return [...new Set(result.data.map(item => item.brand))].filter(Boolean).sort();
}

async function fetchMotorcycleBrandsFromStrapi(): Promise<string[]> {
    logger.info('Fetching motorcycle brands from Strapi (fallback)...');
    const url = `${STRAPI_URL}/arac-dataveris?filters[brand][$eq]=MOTORSIKLET&fields[0]=model&pagination[pageSize]=100000`;

    const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${STRAPI_TOKEN}` },
        next: { revalidate: 1800 },
    });

    if (!response.ok) {
        throw new Error(`Strapi API error: ${response.status}`);
    }

    const result: StrapiResponse = await response.json();
    return [...new Set(result.data.map(item => item.model))].filter(Boolean).sort();
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const vehicleType = searchParams.get('vehicleType') || undefined;

        // Try Redis cache first (fast path)
        if (vehicleType === 'otomobil' || vehicleType === 'motorsiklet') {
            const cachedBrands = await getFromRedis(vehicleType);
            if (cachedBrands) {
                return NextResponse.json({ success: true, data: cachedBrands });
            }
        }

        // Fallback to Strapi (slow path)
        logger.info('Redis cache miss, fetching from Strapi...');

        let brands: string[] = [];

        if (vehicleType === 'motorsiklet') {
            const allMotorcycleBrands = await fetchMotorcycleBrandsFromStrapi();
            brands = allMotorcycleBrands.filter((b: string) =>
                ACTIVE_MOTORCYCLE_BRANDS.includes(b)
            );
            if (!brands.includes('HARLEY-DAVIDSON')) brands.push('HARLEY-DAVIDSON');
            if (!brands.includes('RAMZEY')) brands.push('RAMZEY');
            brands.sort();
        } else {
            const allBrands = await fetchBrandsFromStrapi();
            if (vehicleType === 'otomobil') {
                brands = allBrands.filter((b: string) =>
                    b !== 'MOTORSIKLET' && !EXCLUDED_CAR_BRANDS.includes(b)
                );
            } else {
                brands = allBrands;
            }
        }

        const formattedBrands = brands.map((b: string) => ({ brand: b }));

        // Save to Redis cache for next time
        if (vehicleType === 'otomobil' || vehicleType === 'motorsiklet') {
            saveToRedis(vehicleType, formattedBrands);
        }

        return NextResponse.json({ success: true, data: formattedBrands });
    } catch (error) {
        logger.error({ error }, 'Brands API Error');
        return NextResponse.json(
            { success: false, error: 'Markalar yüklenemedi' },
            { status: 500 }
        );
    }
}
