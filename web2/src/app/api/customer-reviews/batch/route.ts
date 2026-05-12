import { NextRequest, NextResponse } from 'next/server';
import { createLogger } from '@/lib/logger';

const logger = createLogger('API_CUSTOMER_REVIEWS_BATCH');

export const dynamic = 'force-dynamic';

const STRAPI = process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api';

export async function GET(request: NextRequest) {
  try {
    const queryString = request.nextUrl.search;
    const url = `${STRAPI}/customer-reviews/batch${queryString}`;

    logger.info({ url }, 'Toplu müşteri yorumları getiriliyor');

    const response = await fetch(url, { cache: 'no-store' });

    if (!response.ok) {
      logger.warn({ status: response.status }, 'Strapi customer-reviews/batch GET hatası');
      return NextResponse.json(
        { success: false, error: 'Müşteri yorumları yüklenemedi' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    logger.error({ error: error.message }, 'Customer reviews batch GET request failed');
    return NextResponse.json(
      { success: false, error: 'Müşteri yorumları yüklenirken hata oluştu' },
      { status: 500 }
    );
  }
}
