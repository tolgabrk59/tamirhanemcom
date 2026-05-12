import { NextRequest, NextResponse } from 'next/server';
import { createLogger } from '@/lib/logger';

const logger = createLogger('API_PLATFORM_LOYALTY_ELIGIBLE_SERVICES');

export const dynamic = 'force-dynamic';

const STRAPI = process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api';

export async function GET(request: NextRequest) {
  try {
    const jwt = request.headers.get('authorization')?.replace('Bearer ', '');

    if (!jwt) {
      return NextResponse.json(
        { success: false, error: 'Yetkilendirme gerekli' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const strapiUrl = `${STRAPI}/platform-loyalty/eligible-services?${searchParams.toString()}`;

    const response = await fetch(strapiUrl, {
      headers: { Authorization: `Bearer ${jwt}` },
      cache: 'no-store',
    });

    if (!response.ok) {
      logger.warn({ status: response.status }, 'Strapi platform-loyalty/eligible-services GET hatası');
      return NextResponse.json(
        { success: false, error: 'Uygun servisler yüklenemedi' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({ success: true, ...data });
  } catch (error) {
    logger.error({ error }, 'Platform loyalty eligible-services API hatası');
    return NextResponse.json(
      { success: false, error: 'Uygun servisler yüklenemedi' },
      { status: 500 }
    );
  }
}
