import { NextRequest, NextResponse } from 'next/server';
import { createLogger } from '@/lib/logger';

const logger = createLogger('API_APP_CONFIG');

export const dynamic = 'force-dynamic';

const STRAPI = process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api';

export async function GET(_request: NextRequest) {
  try {
    const response = await fetch(`${STRAPI}/app-config`, { cache: 'no-store' });

    if (!response.ok) {
      logger.warn({ status: response.status }, 'Strapi app-config GET hatası');
      return NextResponse.json(
        { success: false, error: 'Uygulama yapılandırması yüklenemedi' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(
      { success: true, ...data },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
        },
      }
    );
  } catch (error) {
    logger.error({ error }, 'App config API hatası');
    return NextResponse.json(
      { success: false, error: 'Uygulama yapılandırması yüklenemedi' },
      { status: 500 }
    );
  }
}
