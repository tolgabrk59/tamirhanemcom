import { NextRequest, NextResponse } from 'next/server';
import { createLogger } from '@/lib/logger';

const logger = createLogger('API_CUSTOMER_PROFILE_BATCH');

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

    const queryString = request.nextUrl.search;
    const url = `${STRAPI}/customer-profile/batch${queryString}`;

    logger.info({ url }, 'Toplu müşteri profili getiriliyor');

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    const result = await response.json();

    if (!response.ok) {
      const errorMsg = result?.error?.message || result?.message || 'Müşteri profilleri alınamadı';
      logger.warn({ status: response.status, error: errorMsg }, 'Strapi customer-profile/batch GET failed');
      return NextResponse.json(
        { success: false, error: errorMsg },
        { status: response.status }
      );
    }

    logger.info('Toplu müşteri profili başarıyla getirildi');

    return NextResponse.json(result, { status: response.status });
  } catch (error: any) {
    logger.error({ error: error.message }, 'Customer profile batch GET request failed');
    return NextResponse.json(
      { success: false, error: 'Müşteri profilleri yüklenirken hata oluştu. Lütfen tekrar deneyin.' },
      { status: 500 }
    );
  }
}
