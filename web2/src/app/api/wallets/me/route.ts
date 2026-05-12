import { NextRequest, NextResponse } from 'next/server';
import { createLogger } from '@/lib/logger';

const logger = createLogger('API_WALLETS_ME');

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

    logger.info({}, 'Cüzdan bilgileri getiriliyor');

    const response = await fetch(`${STRAPI}/wallets/me`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    if (!response.ok) {
      logger.error({ status: response.status, error: result }, 'Strapi cüzdan bilgisi hatası');
      return NextResponse.json(
        { success: false, error: result?.error?.message || 'Cüzdan bilgileri alınamadı' },
        { status: response.status }
      );
    }

    logger.info({}, 'Cüzdan bilgileri alındı');

    return NextResponse.json(result, { status: response.status });
  } catch (error: any) {
    logger.error({ error: error.message }, 'Wallet me request failed');
    return NextResponse.json(
      { success: false, error: 'Cüzdan bilgileri yüklenirken hata oluştu' },
      { status: 500 }
    );
  }
}
