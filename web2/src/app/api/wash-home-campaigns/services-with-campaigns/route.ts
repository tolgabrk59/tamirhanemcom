import { NextRequest, NextResponse } from 'next/server';
import { createLogger } from '@/lib/logger';

const logger = createLogger('API_WASH_HOME_CAMPAIGNS_SERVICES_WITH_CAMPAIGNS');

export const dynamic = 'force-dynamic';

const STRAPI = process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const strapiUrl = `${STRAPI}/wash-home-campaigns/services-with-campaigns?${searchParams.toString()}`;

    const response = await fetch(strapiUrl, { cache: 'no-store' });

    if (!response.ok) {
      logger.warn({ status: response.status }, 'Strapi wash-home-campaigns/services-with-campaigns GET hatası');
      return NextResponse.json(
        { success: false, error: 'Kampanyalı servisler yüklenemedi' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({ success: true, ...data });
  } catch (error) {
    logger.error({ error }, 'Wash home campaigns services-with-campaigns API hatası');
    return NextResponse.json(
      { success: false, error: 'Kampanyalı servisler yüklenemedi' },
      { status: 500 }
    );
  }
}
