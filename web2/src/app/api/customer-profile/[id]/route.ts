import { NextRequest, NextResponse } from 'next/server';
import { createLogger } from '@/lib/logger';

const logger = createLogger('API_CUSTOMER_PROFILE');

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

    logger.info({ id }, 'Müşteri profili getiriliyor');

    const response = await fetch(`${STRAPI}/customer-profile/${id}`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    const result = await response.json();

    if (!response.ok) {
      const errorMsg = result?.error?.message || result?.message || 'Müşteri profili alınamadı';
      logger.warn({ id, status: response.status, error: errorMsg }, 'Strapi customer-profile GET failed');
      return NextResponse.json(
        { success: false, error: errorMsg },
        { status: response.status }
      );
    }

    logger.info({ id }, 'Müşteri profili başarıyla getirildi');

    return NextResponse.json(result, { status: response.status });
  } catch (error: any) {
    logger.error({ error: error.message }, 'Customer profile GET request failed');
    return NextResponse.json(
      { success: false, error: 'Müşteri profili yüklenirken hata oluştu. Lütfen tekrar deneyin.' },
      { status: 500 }
    );
  }
}
