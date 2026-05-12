import { NextRequest, NextResponse } from 'next/server';
import { createLogger } from '@/lib/logger';

const logger = createLogger('QUESTIONS:SERVICE');

export const dynamic = 'force-dynamic';

const STRAPI = process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api';

export async function GET(request: NextRequest) {
  try {
    const queryString = request.nextUrl.search;
    const url = `${STRAPI}/questions/service-questions${queryString}`;

    logger.info({ url }, 'Fetching service questions from Strapi');

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    const result = await response.json();

    if (!response.ok) {
      logger.warn({ status: response.status, error: result }, 'Strapi service-questions GET failed');
      return NextResponse.json(
        { success: false, error: result?.error?.message || 'Servis soruları alınamadı' },
        { status: response.status }
      );
    }

    return NextResponse.json(result, { status: response.status });
  } catch (error: any) {
    logger.error({ error: error.message }, 'Service questions GET failed');
    return NextResponse.json(
      { success: false, error: 'Servis soruları yüklenirken hata oluştu' },
      { status: 500 }
    );
  }
}
