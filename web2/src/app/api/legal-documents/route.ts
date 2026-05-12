import { NextRequest, NextResponse } from 'next/server';
import { createLogger } from '@/lib/logger';

const logger = createLogger('LEGAL_DOCUMENTS');

export const dynamic = 'force-dynamic';

const STRAPI = process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api';

export async function GET(request: NextRequest) {
  try {
    const queryString = request.nextUrl.search;
    const url = `${STRAPI}/legal-documents${queryString}`;

    logger.info({ url }, 'Fetching legal documents from Strapi');

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    const result = await response.json();

    if (!response.ok) {
      logger.warn({ status: response.status, error: result }, 'Strapi legal documents GET failed');
      return NextResponse.json(
        { success: false, error: result?.error?.message || 'Yasal belgeler alınamadı' },
        { status: response.status }
      );
    }

    return NextResponse.json(result, { status: response.status });
  } catch (error: any) {
    logger.error({ error: error.message }, 'Legal documents GET failed');
    return NextResponse.json(
      { success: false, error: 'Yasal belgeler yüklenirken hata oluştu' },
      { status: 500 }
    );
  }
}
