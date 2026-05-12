import { NextRequest, NextResponse } from 'next/server';
import { createLogger } from '@/lib/logger';

const logger = createLogger('API_CREDIT_CARDS');

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

    logger.info({}, 'Kredi kartları getiriliyor');

    const response = await fetch(`${STRAPI}/credit-cards`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    if (!response.ok) {
      logger.error({ status: response.status, error: result }, 'Strapi kredi kartı listesi hatası');
      return NextResponse.json(
        { success: false, error: result?.error?.message || 'Kredi kartları alınamadı' },
        { status: response.status }
      );
    }

    logger.info({}, 'Kredi kartları alındı');

    return NextResponse.json(result, { status: response.status });
  } catch (error: any) {
    logger.error({ error: error.message }, 'Credit cards GET request failed');
    return NextResponse.json(
      { success: false, error: 'Kredi kartları yüklenirken hata oluştu' },
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

    logger.info({}, 'Yeni kredi kartı ekleniyor');

    const response = await fetch(`${STRAPI}/credit-cards`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify(body),
    });

    const result = await response.json();

    if (!response.ok) {
      logger.error({ status: response.status, error: result }, 'Strapi kredi kartı ekleme hatası');
      return NextResponse.json(
        { success: false, error: result?.error?.message || 'Kredi kartı eklenemedi' },
        { status: response.status }
      );
    }

    logger.info({ cardId: result?.data?.id }, 'Kredi kartı eklendi');

    return NextResponse.json(result, { status: response.status });
  } catch (error: any) {
    logger.error({ error: error.message }, 'Credit cards POST request failed');
    return NextResponse.json(
      { success: false, error: 'Kredi kartı eklenirken hata oluştu' },
      { status: 500 }
    );
  }
}
