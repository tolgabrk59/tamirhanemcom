import { NextRequest, NextResponse } from 'next/server';
import { createLogger } from '@/lib/logger';

const logger = createLogger('API_REFERRALS_MY_CODE');

export const dynamic = 'force-dynamic';

const STRAPI = process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api';

export async function GET(request: NextRequest) {
  try {
    const jwt = request.headers.get('authorization')?.replace('Bearer ', '');

    if (!jwt) {
      return NextResponse.json(
        { success: false, error: 'Yetkilendirme gerekli' },
        { status: 401 }
      );
    }

    const response = await fetch(`${STRAPI}/referrals/my-code`, {
      headers: { Authorization: `Bearer ${jwt}` },
      cache: 'no-store',
    });

    if (!response.ok) {
      logger.warn({ status: response.status }, 'Strapi referrals/my-code hatası');
      return NextResponse.json(
        { success: false, error: 'Referral kodu alınamadı' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({ success: true, ...data });
  } catch (error) {
    logger.error({ error }, 'Referrals my-code API hatası');
    return NextResponse.json(
      { success: false, error: 'Referral kodu alınamadı' },
      { status: 500 }
    );
  }
}
