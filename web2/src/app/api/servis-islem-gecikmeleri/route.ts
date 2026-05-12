import { NextRequest, NextResponse } from 'next/server';
import { createLogger } from '@/lib/logger';

const logger = createLogger('API_SERVIS_ISLEM_GECIKMELERI');

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
    const strapiUrl = `${STRAPI}/servis-islem-gecikmeleri?${searchParams.toString()}`;

    const response = await fetch(strapiUrl, {
      headers: { Authorization: `Bearer ${jwt}` },
      cache: 'no-store',
    });

    if (!response.ok) {
      logger.warn({ status: response.status }, 'Strapi servis-islem-gecikmeleri GET hatası');
      return NextResponse.json(
        { success: false, error: 'Servis işlem gecikmeleri yüklenemedi' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({ success: true, ...data });
  } catch (error) {
    logger.error({ error }, 'Servis islem gecikmeleri API hatası');
    return NextResponse.json(
      { success: false, error: 'Servis işlem gecikmeleri yüklenemedi' },
      { status: 500 }
    );
  }
}
