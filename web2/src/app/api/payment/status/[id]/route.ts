import { NextRequest, NextResponse } from 'next/server';
import { createLogger } from '@/lib/logger';

const logger = createLogger('API_PAYMENT_STATUS');

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

    logger.info({ paymentId: id }, 'Ödeme durumu sorgulanıyor');

    const response = await fetch(`${STRAPI}/payment/status/${id}`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    if (!response.ok) {
      logger.error({ paymentId: id, status: response.status, error: result }, 'Strapi ödeme durumu hatası');
      return NextResponse.json(
        { success: false, error: result?.error?.message || 'Ödeme durumu alınamadı' },
        { status: response.status }
      );
    }

    logger.info({ paymentId: id }, 'Ödeme durumu alındı');

    return NextResponse.json(result, { status: response.status });
  } catch (error: any) {
    logger.error({ error: error.message }, 'Payment status request failed');
    return NextResponse.json(
      { success: false, error: 'Ödeme durumu sorgulanırken hata oluştu' },
      { status: 500 }
    );
  }
}
