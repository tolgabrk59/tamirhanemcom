import { NextRequest, NextResponse } from 'next/server';
import { createLogger } from '@/lib/logger';

const logger = createLogger('API_SERVICES_ROADSIDE');

export const dynamic = 'force-dynamic';

const STRAPI = process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api';

export async function GET(request: NextRequest) {
  try {
    const queryString = request.nextUrl.search;
    const url = `${STRAPI}/services/roadside-assistance${queryString}`;

    logger.info({ url }, 'Yol yardımı servisleri getiriliyor');

    const response = await fetch(url, { cache: 'no-store' });

    if (!response.ok) {
      logger.warn({ status: response.status }, 'Strapi services/roadside-assistance GET hatası');
      return NextResponse.json(
        { success: false, error: 'Yol yardımı servisleri yüklenemedi' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    logger.error({ error: error.message }, 'Roadside assistance GET request failed');
    return NextResponse.json(
      { success: false, error: 'Yol yardımı servisleri yüklenirken hata oluştu' },
      { status: 500 }
    );
  }
}
