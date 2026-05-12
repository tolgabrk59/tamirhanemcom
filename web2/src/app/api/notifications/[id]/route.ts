import { NextRequest, NextResponse } from 'next/server';
import { createLogger } from '@/lib/logger';

const logger = createLogger('API_NOTIFICATIONS_DETAIL');

export const dynamic = 'force-dynamic';

const STRAPI = process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const jwt = request.headers.get('authorization')?.replace('Bearer ', '');

    if (!jwt) {
      return NextResponse.json(
        { success: false, error: 'Yetkilendirme gerekli' },
        { status: 401 }
      );
    }

    const response = await fetch(`${STRAPI}/notifications/${id}`, {
      headers: { Authorization: `Bearer ${jwt}` },
      cache: 'no-store',
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { success: false, error: 'Bildirim bulunamadı' },
          { status: 404 }
        );
      }
      logger.warn({ id, status: response.status }, 'Strapi notification detay hatası');
      return NextResponse.json(
        { success: false, error: 'Bildirim yüklenemedi' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({ success: true, ...data });
  } catch (error) {
    logger.error({ error }, 'Notification detay API hatası');
    return NextResponse.json(
      { success: false, error: 'Bildirim yüklenemedi' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const jwt = request.headers.get('authorization')?.replace('Bearer ', '');

    if (!jwt) {
      return NextResponse.json(
        { success: false, error: 'Yetkilendirme gerekli' },
        { status: 401 }
      );
    }

    const response = await fetch(`${STRAPI}/notifications/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${jwt}` },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { success: false, error: 'Bildirim bulunamadı' },
          { status: 404 }
        );
      }
      logger.warn({ id, status: response.status }, 'Strapi notification silme hatası');
      return NextResponse.json(
        { success: false, error: 'Bildirim silinemedi' },
        { status: response.status }
      );
    }

    const data = await response.json().catch(() => ({}));
    return NextResponse.json({ success: true, ...data });
  } catch (error) {
    logger.error({ error }, 'Notification silme API hatası');
    return NextResponse.json(
      { success: false, error: 'Bildirim silinemedi' },
      { status: 500 }
    );
  }
}
