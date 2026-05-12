import { NextRequest, NextResponse } from 'next/server';
import { createLogger } from '@/lib/logger';

const logger = createLogger('SUPPORT_CONVERSATIONS');

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

    const url = `${STRAPI}/support-conversations/my`;

    logger.info({ url }, 'Fetching user support conversations from Strapi');

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    const result = await response.json();

    if (!response.ok) {
      logger.warn({ status: response.status, error: result }, 'Strapi support conversations GET failed');
      return NextResponse.json(
        { success: false, error: result?.error?.message || 'Destek konuşmaları alınamadı' },
        { status: response.status }
      );
    }

    return NextResponse.json(result, { status: response.status });
  } catch (error: any) {
    logger.error({ error: error.message }, 'Support conversations GET failed');
    return NextResponse.json(
      { success: false, error: 'Destek konuşmaları yüklenirken hata oluştu' },
      { status: 500 }
    );
  }
}
