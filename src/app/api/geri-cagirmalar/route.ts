import { NextRequest, NextResponse } from 'next/server';
import { createLogger } from '@/lib/logger';

const logger = createLogger('API_GERI_CAGIRMALAR');

export const dynamic = 'force-dynamic';

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const marka = searchParams.get('marka');
        const model = searchParams.get('model');
        const yil = searchParams.get('yil');

        // Build Strapi query
        const filters: string[] = [];

        if (marka) {
            filters.push(`filters[marka][$eq]=${encodeURIComponent(marka)}`);
        }
        if (model) {
            filters.push(`filters[model][$eq]=${encodeURIComponent(model)}`);
        }
        if (yil) {
            filters.push(`filters[yil][$eq]=${yil}`);
        }

        // Pagination
        filters.push('pagination[limit]=100');
        filters.push('sort=geri_cagirma_tarihi:desc');

        const queryString = filters.join('&');
        const url = `${STRAPI_URL}/api/geri-cagirmalar?${queryString}`;

        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
            },
            next: { revalidate: 3600 } // Cache for 1 hour
        });

        if (!response.ok) {
            throw new Error(`Strapi error: ${response.status}`);
        }

        const data = await response.json();

        return NextResponse.json(data);
    } catch (error) {
        logger.error({ error }, 'Geri çağırma API hatası');
        return NextResponse.json(
            { error: 'Veriler yüklenemedi', data: [] },
            { status: 500 }
        );
    }
}
