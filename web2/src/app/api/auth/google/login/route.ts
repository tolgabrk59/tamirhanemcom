import { NextRequest, NextResponse } from 'next/server';
import { createLogger } from '@/lib/logger';

const logger = createLogger('AUTH:GOOGLE:LOGIN');

export const dynamic = 'force-dynamic';

const STRAPI = process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    logger.info('Google login isteği alındı');

    const response = await fetch(`${STRAPI}/google-auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const result = await response.json();

    if (!response.ok) {
      const errorMsg = result?.error?.message || result?.message || 'Google ile giriş başarısız';
      logger.warn({ status: response.status, error: errorMsg }, 'Strapi google-auth/login failed');
      return NextResponse.json(
        { success: false, error: errorMsg },
        { status: response.status }
      );
    }

    logger.info({ userId: result?.user?.id }, 'Google login successful');

    return NextResponse.json(result, { status: response.status });
  } catch (error: any) {
    logger.error({ error: error.message }, 'Google login request failed');
    return NextResponse.json(
      { success: false, error: 'Google ile giriş işlemi başarısız. Lütfen tekrar deneyin.' },
      { status: 500 }
    );
  }
}
