import { NextRequest, NextResponse } from 'next/server';
import { createLogger } from '@/lib/logger';

const logger = createLogger('API_NOTIFICATIONS_MARK_READ');

export const dynamic = 'force-dynamic';

const STRAPI = process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api';

export async function PUT(request: NextRequest) {
  try {
    const jwt = request.headers.get('authorization')?.replace('Bearer ', '');

    if (!jwt) {
      return NextResponse.json(
        { success: false, error: 'Yetkilendirme gerekli' },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));

    const response = await fetch(`${STRAPI}/notifications/mark-as-read`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      logger.warn({ status: response.status }, 'Strapi mark-as-read hatası');
      return NextResponse.json(
        { success: false, error: 'Bildirimler okundu olarak işaretlenemedi' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({ success: true, ...data });
  } catch (error) {
    logger.error({ error }, 'Mark-as-read API hatası');
    return NextResponse.json(
      { success: false, error: 'Bildirimler okundu olarak işaretlenemedi' },
      { status: 500 }
    );
  }
}
