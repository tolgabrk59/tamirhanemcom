import { NextRequest, NextResponse } from 'next/server';
import { createLogger } from '@/lib/logger';

const logger = createLogger('API_SERVICES_NEAREST');

export const dynamic = 'force-dynamic';

const STRAPI = process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const radius = searchParams.get('radius') || '15';

    if (!lat || !lng) {
      return NextResponse.json(
        { success: false, error: 'lat ve lng parametreleri gereklidir' },
        { status: 400 }
      );
    }

    const strapiParams = new URLSearchParams({
      lat,
      lng,
      radius,
      populate: 'ProfilePicture',
    });

    const strapiUrl = `${STRAPI}/services/nearest?${strapiParams.toString()}`;

    const response = await fetch(strapiUrl, { cache: 'no-store' });

    if (!response.ok) {
      logger.warn({ status: response.status }, 'Strapi nearest hatası');
      return NextResponse.json(
        { success: false, error: 'Yakın servisler yüklenemedi' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({ success: true, ...data });
  } catch (error) {
    logger.error({ error }, 'Nearest services API hatası');
    return NextResponse.json(
      { success: false, error: 'Yakın servisler yüklenemedi' },
      { status: 500 }
    );
  }
}
