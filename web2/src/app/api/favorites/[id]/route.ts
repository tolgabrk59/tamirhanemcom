import { NextRequest, NextResponse } from 'next/server';
import { createLogger } from '@/lib/logger';

const logger = createLogger('API_FAVORITES_DETAIL');

export const dynamic = 'force-dynamic';

const STRAPI = process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api';

type RouteContext = { params: Promise<{ id: string }> };

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

    const response = await fetch(`${STRAPI}/favorites/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${jwt}` },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { success: false, error: 'Favori bulunamadı' },
          { status: 404 }
        );
      }
      logger.warn({ id, status: response.status }, 'Strapi favorites DELETE hatası');
      return NextResponse.json(
        { success: false, error: 'Favoriden çıkarılamadı' },
        { status: response.status }
      );
    }

    const data = await response.json().catch(() => ({}));
    return NextResponse.json({ success: true, ...data });
  } catch (error) {
    logger.error({ error }, 'Favorites DELETE API hatası');
    return NextResponse.json(
      { success: false, error: 'Favoriden çıkarılamadı' },
      { status: 500 }
    );
  }
}
