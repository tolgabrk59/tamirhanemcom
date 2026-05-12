import { NextRequest, NextResponse } from 'next/server';
import { createLogger } from '@/lib/logger';

const logger = createLogger('AUTH:GOOGLE:REGISTER');

export const dynamic = 'force-dynamic';

const STRAPI = process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    logger.info('Google register isteği alındı');

    const response = await fetch(`${STRAPI}/google-auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const result = await response.json();

    if (!response.ok) {
      const errorMsg = result?.error?.message || result?.message || 'Google ile kayıt başarısız';
      logger.warn({ status: response.status, error: errorMsg }, 'Strapi google-auth/register failed');
      return NextResponse.json(
        { success: false, error: errorMsg },
        { status: response.status }
      );
    }

    logger.info({ userId: result?.user?.id }, 'Google register successful');

    return NextResponse.json(result, { status: response.status });
  } catch (error: any) {
    logger.error({ error: error.message }, 'Google register request failed');
    return NextResponse.json(
      { success: false, error: 'Google ile kayıt işlemi başarısız. Lütfen tekrar deneyin.' },
      { status: 500 }
    );
  }
}
