import { NextRequest, NextResponse } from 'next/server';
import { createLogger } from '@/lib/logger';

const logger = createLogger('API_CAMPAIGNS');

export const dynamic = 'force-dynamic';

const STRAPI = process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const strapiUrl = `${STRAPI}/campaigns?filters[is_active][$eq]=true&populate[campaign_image]=*&populate[service][populate][0]=ProfilePicture&populate[service][populate][1]=categories&populate[services][populate][0]=ProfilePicture&populate[services][populate][1]=categories&sort=display_order:asc&${searchParams.toString()}`;

    const response = await fetch(strapiUrl, { cache: 'no-store' });

    if (!response.ok) {
      logger.warn({ status: response.status }, 'Strapi campaigns hatası');
      return NextResponse.json(
        { success: false, error: 'Kampanyalar yüklenemedi' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({ success: true, ...data });
  } catch (error) {
    logger.error({ error }, 'Campaigns API hatası');
    return NextResponse.json(
      { success: false, error: 'Kampanyalar yüklenemedi' },
      { status: 500 }
    );
  }
}
