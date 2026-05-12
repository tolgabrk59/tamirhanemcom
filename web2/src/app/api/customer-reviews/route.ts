import { NextRequest, NextResponse } from 'next/server';
import { createLogger } from '@/lib/logger';

const logger = createLogger('API_CUSTOMER_REVIEWS');

export const dynamic = 'force-dynamic';

const STRAPI = process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const strapiUrl = `${STRAPI}/customer-reviews?${searchParams.toString()}`;

    const response = await fetch(strapiUrl, { cache: 'no-store' });

    if (!response.ok) {
      logger.warn({ status: response.status }, 'Strapi customer-reviews GET hatası');
      return NextResponse.json(
        { success: false, error: 'Müşteri yorumları yüklenemedi' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({ success: true, ...data });
  } catch (error) {
    logger.error({ error }, 'Customer-reviews GET API hatası');
    return NextResponse.json(
      { success: false, error: 'Müşteri yorumları yüklenemedi' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const jwt = request.headers.get('authorization')?.replace('Bearer ', '');

    if (!jwt) {
      return NextResponse.json(
        { success: false, error: 'Yetkilendirme gerekli' },
        { status: 401 }
      );
    }

    const body = await request.json();

    const response = await fetch(`${STRAPI}/customer-reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      logger.warn({ status: response.status, error }, 'Strapi customer-reviews POST hatası');
      return NextResponse.json(
        { success: false, error: 'Yorum gönderilemedi' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({ success: true, ...data }, { status: 201 });
  } catch (error) {
    logger.error({ error }, 'Customer-reviews POST API hatası');
    return NextResponse.json(
      { success: false, error: 'Yorum gönderilemedi' },
      { status: 500 }
    );
  }
}
