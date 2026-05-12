import { NextRequest, NextResponse } from 'next/server';
import { createLogger } from '@/lib/logger';

const logger = createLogger('API_TRANSACTIONS');

export const dynamic = 'force-dynamic';

const STRAPI = process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api';

export async function GET(request: NextRequest) {
  try {
    const jwt = request.headers.get('authorization')?.replace('Bearer ', '');

    if (!jwt) {
      return NextResponse.json(
        { success: false, error: 'Yetkilendirme token\'ı gerekli' },
        { status: 401 }
      );
    }

    const queryString = request.nextUrl.search;
    const url = `${STRAPI}/transactions/me${queryString}`;

    logger.info({ url }, 'İşlem geçmişi getiriliyor');

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    if (!response.ok) {
      logger.error({ status: response.status, error: result }, 'Strapi işlem geçmişi hatası');
      return NextResponse.json(
        { success: false, error: result?.error?.message || 'İşlem geçmişi alınamadı' },
        { status: response.status }
      );
    }

    logger.info({}, 'İşlem geçmişi alındı');

    return NextResponse.json(result, { status: response.status });
  } catch (error: any) {
    logger.error({ error: error.message }, 'Transactions GET request failed');
    return NextResponse.json(
      { success: false, error: 'İşlem geçmişi yüklenirken hata oluştu' },
      { status: 500 }
    );
  }
}
