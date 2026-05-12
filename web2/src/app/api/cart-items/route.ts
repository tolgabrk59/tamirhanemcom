import { NextRequest, NextResponse } from 'next/server';
import { createLogger } from '@/lib/logger';

const logger = createLogger('API_CART_ITEMS');

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
    const url = `${STRAPI}/cart-items${queryString}`;

    logger.info({ url }, 'Sepet öğeleri getiriliyor');

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    if (!response.ok) {
      logger.error({ status: response.status, error: result }, 'Strapi sepet listesi hatası');
      return NextResponse.json(
        { success: false, error: result?.error?.message || 'Sepet öğeleri alınamadı' },
        { status: response.status }
      );
    }

    logger.info({}, 'Sepet öğeleri alındı');

    return NextResponse.json(result, { status: response.status });
  } catch (error: any) {
    logger.error({ error: error.message }, 'Cart items GET request failed');
    return NextResponse.json(
      { success: false, error: 'Sepet öğeleri yüklenirken hata oluştu' },
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

    logger.info({}, 'Sepete öğe ekleniyor');

    const response = await fetch(`${STRAPI}/cart-items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify(body),
    });

    const result = await response.json();

    if (!response.ok) {
      logger.error({ status: response.status, error: result }, 'Strapi sepete ekleme hatası');
      return NextResponse.json(
        { success: false, error: result?.error?.message || 'Sepete öğe eklenemedi' },
        { status: response.status }
      );
    }

    logger.info({ itemId: result?.data?.id }, 'Sepete öğe eklendi');

    return NextResponse.json(result, { status: response.status });
  } catch (error: any) {
    logger.error({ error: error.message }, 'Cart items POST request failed');
    return NextResponse.json(
      { success: false, error: 'Sepete öğe eklenirken hata oluştu' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const jwt = request.headers.get('authorization')?.replace('Bearer ', '');

    if (!jwt) {
      return NextResponse.json(
        { success: false, error: 'Yetkilendirme token\'ı gerekli' },
        { status: 401 }
      );
    }

    logger.info({}, 'Sepet temizleniyor');

    const response = await fetch(`${STRAPI}/cart-items/clear`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const result = await response.json().catch(() => ({}));
      logger.error({ status: response.status, error: result }, 'Strapi sepet temizleme hatası');
      return NextResponse.json(
        { success: false, error: result?.error?.message || 'Sepet temizlenemedi' },
        { status: response.status }
      );
    }

    logger.info({}, 'Sepet temizlendi');

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    logger.error({ error: error.message }, 'Cart items clear DELETE request failed');
    return NextResponse.json(
      { success: false, error: 'Sepet temizlenirken hata oluştu' },
      { status: 500 }
    );
  }
}
