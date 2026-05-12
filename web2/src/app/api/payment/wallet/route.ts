import { NextRequest, NextResponse } from 'next/server';
import { createLogger } from '@/lib/logger';

const logger = createLogger('API_PAYMENT_WALLET');

export const dynamic = 'force-dynamic';

const STRAPI = process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api';

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

    logger.info({}, 'Cüzdan ile ödeme başlatılıyor');

    const response = await fetch(`${STRAPI}/payment/wallet`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify(body),
    });

    const result = await response.json();

    if (!response.ok) {
      logger.error({ status: response.status, error: result }, 'Strapi cüzdan ödeme hatası');
      return NextResponse.json(
        { success: false, error: result?.error?.message || 'Cüzdan ile ödeme yapılamadı' },
        { status: response.status }
      );
    }

    logger.info({}, 'Cüzdan ödemesi tamamlandı');

    return NextResponse.json(result, { status: response.status });
  } catch (error: any) {
    logger.error({ error: error.message }, 'Payment wallet request failed');
    return NextResponse.json(
      { success: false, error: 'Cüzdan ödemesi sırasında hata oluştu' },
      { status: 500 }
    );
  }
}
