import { NextRequest, NextResponse } from 'next/server';
import { createLogger } from '@/lib/logger';

const logger = createLogger('API_ORDERS');

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
    const url = `${STRAPI}/orders${queryString}`;

    logger.info({ url }, 'Siparişler getiriliyor');

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    if (!response.ok) {
      logger.error({ status: response.status, error: result }, 'Strapi sipariş listesi hatası');
      return NextResponse.json(
        { success: false, error: result?.error?.message || 'Siparişler alınamadı' },
        { status: response.status }
      );
    }

    logger.info({}, 'Siparişler alındı');

    return NextResponse.json(result, { status: response.status });
  } catch (error: any) {
    logger.error({ error: error.message }, 'Orders GET request failed');
    return NextResponse.json(
      { success: false, error: 'Siparişler yüklenirken hata oluştu' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const jwt = request.headers.get('authorization')?.replace('Bearer ', '');

    if (!jwt) {
      return NextResponse.json(
        { success: false, error: 'Yetkilendirme token\'ı gerekli' },
        { status: 401 }
      );
    }

    const body = await request.json();

    logger.info({}, 'Yeni sipariş oluşturuluyor');

    const response = await fetch(`${STRAPI}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify(body),
    });

    const result = await response.json();

    if (!response.ok) {
      logger.error({ status: response.status, error: result }, 'Strapi sipariş oluşturma hatası');
      return NextResponse.json(
        { success: false, error: result?.error?.message || 'Sipariş oluşturulamadı' },
        { status: response.status }
      );
    }

    logger.info({ orderId: result?.data?.id }, 'Sipariş oluşturuldu');

    return NextResponse.json(result, { status: response.status });
  } catch (error: any) {
    logger.error({ error: error.message }, 'Orders POST request failed');
    return NextResponse.json(
      { success: false, error: 'Sipariş oluşturulurken hata oluştu' },
      { status: 500 }
    );
  }
}
