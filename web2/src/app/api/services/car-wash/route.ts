import { NextRequest, NextResponse } from 'next/server';
import { createLogger } from '@/lib/logger';

const logger = createLogger('API_SERVICES_CAR_WASH');

export const dynamic = 'force-dynamic';

const STRAPI = process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const strapiUrl = `${STRAPI}/services/car-wash?${searchParams.toString()}`;

    const response = await fetch(strapiUrl, { cache: 'no-store' });

    if (!response.ok) {
      logger.warn({ status: response.status }, 'Strapi car-wash hatası');
      return NextResponse.json(
        { success: false, error: 'Oto yıkama servisleri yüklenemedi' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({ success: true, ...data });
  } catch (error) {
    logger.error({ error }, 'Car-wash API hatası');
    return NextResponse.json(
      { success: false, error: 'Oto yıkama servisleri yüklenemedi' },
      { status: 500 }
    );
  }
}
