import { NextRequest, NextResponse } from 'next/server';
import { createLogger } from '@/lib/logger';

const logger = createLogger('API_REFERRALS_VALIDATE');

export const dynamic = 'force-dynamic';

const STRAPI = process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api';

type RouteContext = { params: Promise<{ code: string }> };

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { code } = await context.params;

    const response = await fetch(`${STRAPI}/referrals/validate/${encodeURIComponent(code)}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { success: false, error: 'Referral kodu geçersiz' },
          { status: 404 }
        );
      }
      logger.warn({ code, status: response.status }, 'Strapi referrals/validate hatası');
      return NextResponse.json(
        { success: false, error: 'Referral kodu doğrulanamadı' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({ success: true, ...data });
  } catch (error) {
    logger.error({ error }, 'Referrals validate API hatası');
    return NextResponse.json(
      { success: false, error: 'Referral kodu doğrulanamadı' },
      { status: 500 }
    );
  }
}
