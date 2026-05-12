import { NextRequest, NextResponse } from 'next/server';
import { createLogger } from '@/lib/logger';

const logger = createLogger('API_CREDIT_CARDS_ID');

export const dynamic = 'force-dynamic';

const STRAPI = process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const jwt = request.headers.get('authorization')?.replace('Bearer ', '');

    if (!jwt) {
      return NextResponse.json(
        { success: false, error: 'Yetkilendirme token\'ı gerekli' },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    logger.info({ cardId: id }, 'Kredi kartı getiriliyor');

    const response = await fetch(`${STRAPI}/credit-cards/${id}`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    if (!response.ok) {
      logger.error({ cardId: id, status: response.status, error: result }, 'Strapi kredi kartı getirme hatası');
      return NextResponse.json(
        { success: false, error: result?.error?.message || 'Kredi kartı bilgileri alınamadı' },
        { status: response.status }
      );
    }

    logger.info({ cardId: id }, 'Kredi kartı alındı');

    return NextResponse.json(result, { status: response.status });
  } catch (error: any) {
    logger.error({ error: error.message }, 'Credit card GET by id request failed');
    return NextResponse.json(
      { success: false, error: 'Kredi kartı bilgileri yüklenirken hata oluştu' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const jwt = request.headers.get('authorization')?.replace('Bearer ', '');

    if (!jwt) {
      return NextResponse.json(
        { success: false, error: 'Yetkilendirme token\'ı gerekli' },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const body = await request.json();

    logger.info({ cardId: id }, 'Kredi kartı güncelleniyor');

    const response = await fetch(`${STRAPI}/credit-cards/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify(body),
    });

    const result = await response.json();

    if (!response.ok) {
      logger.error({ cardId: id, status: response.status, error: result }, 'Strapi kredi kartı güncelleme hatası');
      return NextResponse.json(
        { success: false, error: result?.error?.message || 'Kredi kartı güncellenemedi' },
        { status: response.status }
      );
    }

    logger.info({ cardId: id }, 'Kredi kartı güncellendi');

    return NextResponse.json(result, { status: response.status });
  } catch (error: any) {
    logger.error({ error: error.message }, 'Credit card PUT request failed');
    return NextResponse.json(
      { success: false, error: 'Kredi kartı güncellenirken hata oluştu' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const jwt = request.headers.get('authorization')?.replace('Bearer ', '');

    if (!jwt) {
      return NextResponse.json(
        { success: false, error: 'Yetkilendirme token\'ı gerekli' },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    logger.info({ cardId: id }, 'Kredi kartı siliniyor');

    const response = await fetch(`${STRAPI}/credit-cards/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const result = await response.json().catch(() => ({}));
      logger.error({ cardId: id, status: response.status, error: result }, 'Strapi kredi kartı silme hatası');
      return NextResponse.json(
        { success: false, error: result?.error?.message || 'Kredi kartı silinemedi' },
        { status: response.status }
      );
    }

    logger.info({ cardId: id }, 'Kredi kartı silindi');

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    logger.error({ error: error.message }, 'Credit card DELETE request failed');
    return NextResponse.json(
      { success: false, error: 'Kredi kartı silinirken hata oluştu' },
      { status: 500 }
    );
  }
}
