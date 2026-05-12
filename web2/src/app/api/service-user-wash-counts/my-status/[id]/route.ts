import { NextRequest, NextResponse } from 'next/server';
import { createLogger } from '@/lib/logger';

const logger = createLogger('API_SERVICE_USER_WASH_COUNTS_MY_STATUS');

export const dynamic = 'force-dynamic';

const STRAPI = process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const jwt = request.headers.get('authorization')?.replace('Bearer ', '');

    if (!jwt) {
      return NextResponse.json(
        { success: false, error: 'Yetkilendirme gerekli' },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    const response = await fetch(`${STRAPI}/service-user-wash-counts/my-status/${id}`, {
      headers: { Authorization: `Bearer ${jwt}` },
      cache: 'no-store',
    });

    if (!response.ok) {
      logger.warn({ status: response.status, id }, 'Strapi service-user-wash-counts/my-status GET hatası');
      return NextResponse.json(
        { success: false, error: 'Yıkama durumu yüklenemedi' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({ success: true, ...data });
  } catch (error) {
    logger.error({ error }, 'Service user wash counts my-status API hatası');
    return NextResponse.json(
      { success: false, error: 'Yıkama durumu yüklenemedi' },
      { status: 500 }
    );
  }
}
