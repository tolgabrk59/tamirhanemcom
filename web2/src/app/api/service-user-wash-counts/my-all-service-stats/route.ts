import { NextRequest, NextResponse } from 'next/server';
import { createLogger } from '@/lib/logger';

const logger = createLogger('API_SERVICE_USER_WASH_COUNTS_ALL_STATS');

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

    const response = await fetch(`${STRAPI}/service-user-wash-counts/my-all-service-stats`, {
      headers: { Authorization: `Bearer ${jwt}` },
      cache: 'no-store',
    });

    if (!response.ok) {
      logger.warn({ status: response.status }, 'Strapi service-user-wash-counts/my-all-service-stats GET hatası');
      return NextResponse.json(
        { success: false, error: 'Servis istatistikleri yüklenemedi' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({ success: true, ...data });
  } catch (error) {
    logger.error({ error }, 'Service user wash counts my-all-service-stats API hatası');
    return NextResponse.json(
      { success: false, error: 'Servis istatistikleri yüklenemedi' },
      { status: 500 }
    );
  }
}
