import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';
import { createLogger } from '@/lib/logger';

export const maxDuration = 60;

const logger = createLogger('CRON_SYNC_VEHICLES');

const STRAPI_URL = process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api';
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;
const CRON_SECRET = process.env.CRON_SECRET;

const EXCLUDED_CAR_BRANDS = [
    'BUGATTI', 'CADILLAC', 'DAF', 'DFM', 'DODGE', 'GMC', 'INFINITI',
    'LANCIA', 'LINCOLN', 'LOTUS', 'MAYBACH', 'MCLAREN', 'OTOKAR/MAGIRUS',
    'OTOYOLIVECOFIAT', 'PIAGGIO', 'PROTON', 'RAM', 'ROLLS-ROYCE', 'SAAB',
    'SETRA', 'SMART', 'TEMSA', 'VOYAH', 'HARLEY-DAVIDSON', 'RAMZEY',
    'BMC', 'ISUZU', 'MAN', 'DFSK', 'MAXUS', 'TATA', 'TOFAS-FIAT',
];

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
        logger.info('Starting brands sync from Strapi...');

        // Fetch car and motorcycle brands in parallel
        const [carBrandsRes, motorcycleBrandsRes] = await Promise.all([
            fetch(`${STRAPI_URL}/arac-dataveris?fields[0]=brand&pagination[pageSize]=100000`, {
                headers: { 'Authorization': `Bearer ${STRAPI_TOKEN}` },
            }),
            fetch(`${STRAPI_URL}/arac-dataveris?filters[brand][$eq]=MOTORSIKLET&fields[0]=model&pagination[pageSize]=100000`, {
                headers: { 'Authorization': `Bearer ${STRAPI_TOKEN}` },
            }),
        ]);

        if (!carBrandsRes.ok || !motorcycleBrandsRes.ok) {
            throw new Error('Failed to fetch brands from Strapi');
        }

        const [carBrandsData, motorcycleBrandsData]: [StrapiResponse, StrapiResponse] = await Promise.all([
            carBrandsRes.json(),
            motorcycleBrandsRes.json(),
        ]);

        // Process car brands
        const allCarBrands = [...new Set(carBrandsData.data.map(item => item.brand))].filter(Boolean);
        const filteredCarBrands = allCarBrands
            .filter(b => b !== 'MOTORSIKLET' && !EXCLUDED_CAR_BRANDS.includes(b))
            .sort();

        // Process motorcycle brands
        const allMotorcycleBrands = [...new Set(motorcycleBrandsData.data.map(item => item.model))].filter(Boolean);
        let filteredMotorcycleBrands = allMotorcycleBrands.filter(b => ACTIVE_MOTORCYCLE_BRANDS.includes(b));
        if (!filteredMotorcycleBrands.includes('HARLEY-DAVIDSON')) filteredMotorcycleBrands.push('HARLEY-DAVIDSON');
        if (!filteredMotorcycleBrands.includes('RAMZEY')) filteredMotorcycleBrands.push('RAMZEY');
        filteredMotorcycleBrands.sort();

        // Store in Redis (48 hour TTL)
        const TTL = 48 * 60 * 60;
        const pipeline = redis.pipeline();
        pipeline.setex('vehicles:brands:otomobil', TTL, JSON.stringify(filteredCarBrands.map(b => ({ brand: b }))));
        pipeline.setex('vehicles:brands:motorsiklet', TTL, JSON.stringify(filteredMotorcycleBrands.map(b => ({ brand: b }))));
        pipeline.setex('vehicles:last_sync', TTL, new Date().toISOString());
        await pipeline.exec();

        const duration = Date.now() - startTime;

        logger.info({
            carBrands: filteredCarBrands.length,
            motorcycleBrands: filteredMotorcycleBrands.length,
            duration: `${duration}ms`,
        }, 'Brands sync completed');

        return NextResponse.json({
            success: true,
            data: {
                carBrands: filteredCarBrands.length,
                motorcycleBrands: filteredMotorcycleBrands.length,
                duration: `${duration}ms`,
                syncedAt: new Date().toISOString(),
            },
        });
    } catch (error) {
        logger.error({ error }, 'Brands sync failed');
        return NextResponse.json({ success: false, error: 'Sync failed' }, { status: 500 });
    }
}
