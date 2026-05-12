import { NextRequest, NextResponse } from 'next/server';
import { createLogger } from '@/lib/logger';

const logger = createLogger('API_SERVICES_DETAIL');

export const dynamic = 'force-dynamic';

const STRAPI = process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const { searchParams } = new URL(request.url);

    const strapiUrl = `${STRAPI}/services/${id}?${searchParams.toString()}`;

    const response = await fetch(strapiUrl, { cache: 'no-store' });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { success: false, error: 'Servis bulunamadı' },
          { status: 404 }
        );
      }
      logger.warn({ id, status: response.status }, 'Strapi service detay hatası');
      return NextResponse.json(
        { success: false, error: 'Servis yüklenemedi' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({ success: true, ...data });
  } catch (error) {
    logger.error({ error }, 'Service detay API hatası');
    return NextResponse.json(
      { success: false, error: 'Servis yüklenemedi' },
      { status: 500 }
    );
  }
}
