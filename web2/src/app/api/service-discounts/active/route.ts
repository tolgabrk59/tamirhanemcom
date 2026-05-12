import { NextRequest, NextResponse } from 'next/server';
import { createLogger } from '@/lib/logger';

const logger = createLogger('API_SERVICE_DISCOUNTS_ACTIVE');

export const dynamic = 'force-dynamic';

const STRAPI = process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const strapiUrl = `${STRAPI}/service-discounts/active?${searchParams.toString()}`;

    const response = await fetch(strapiUrl, { cache: 'no-store' });

    if (!response.ok) {
      logger.warn({ status: response.status }, 'Strapi service-discounts/active GET hatası');
      return NextResponse.json(
        { success: false, error: 'Aktif indirimler yüklenemedi' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({ success: true, ...data });
  } catch (error) {
    logger.error({ error }, 'Service discounts active API hatası');
    return NextResponse.json(
      { success: false, error: 'Aktif indirimler yüklenemedi' },
      { status: 500 }
    );
  }
}
