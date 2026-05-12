import { NextRequest, NextResponse } from 'next/server';
import { createLogger } from '@/lib/logger';

const logger = createLogger('API_NOTIFICATIONS_UNREAD');

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

    const response = await fetch(`${STRAPI}/notifications/unread-count`, {
      headers: { Authorization: `Bearer ${jwt}` },
      cache: 'no-store',
    });

    if (!response.ok) {
      logger.warn({ status: response.status }, 'Strapi unread-count hatası');
      return NextResponse.json(
        { success: false, error: 'Okunmamış bildirim sayısı alınamadı' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({ success: true, ...data });
  } catch (error) {
    logger.error({ error }, 'Unread-count API hatası');
    return NextResponse.json(
      { success: false, error: 'Okunmamış bildirim sayısı alınamadı' },
      { status: 500 }
    );
  }
}
