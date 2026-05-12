import { NextRequest, NextResponse } from 'next/server';
import { createLogger } from '@/lib/logger';

const logger = createLogger('API_CREDIT_CARDS_SECURE_DETAILS');

export const dynamic = 'force-dynamic';

const STRAPI = process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api';

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, context: RouteContext) {
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

    logger.info({ cardId: id }, 'Kart güvenli detayları getiriliyor');

    const response = await fetch(`${STRAPI}/credit-cards/${id}/secure-details`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify(body),
    });

    const result = await response.json();

    if (!response.ok) {
      logger.error({ cardId: id, status: response.status, error: result }, 'Strapi kart güvenli detay hatası');
      return NextResponse.json(
        { success: false, error: result?.error?.message || 'Kart güvenli bilgileri alınamadı' },
        { status: response.status }
      );
    }

    logger.info({ cardId: id }, 'Kart güvenli detayları alındı');

    return NextResponse.json(result, { status: response.status });
  } catch (error: any) {
    logger.error({ error: error.message }, 'Credit card secure-details request failed');
    return NextResponse.json(
      { success: false, error: 'Kart güvenli bilgileri alınırken hata oluştu' },
      { status: 500 }
    );
  }
}
