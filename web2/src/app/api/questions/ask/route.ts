import { NextRequest, NextResponse } from 'next/server';
import { createLogger } from '@/lib/logger';

const logger = createLogger('QUESTIONS:ASK');

export const dynamic = 'force-dynamic';

const STRAPI = process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api';

export async function POST(request: NextRequest) {
  try {
    const jwt = request.headers.get('authorization')?.replace('Bearer ', '');

    if (!jwt) {
      return NextResponse.json(
        { success: false, error: 'Yetkilendirme gerekli' },
        { status: 401 }
      );
    }

    const body = await request.json();

    logger.info({}, 'Submitting question to Strapi');

    const response = await fetch(`${STRAPI}/questions/ask`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const result = await response.json();

    if (!response.ok) {
      logger.warn({ status: response.status, error: result }, 'Strapi question ask POST failed');
      return NextResponse.json(
        { success: false, error: result?.error?.message || 'Soru gönderilemedi' },
        { status: response.status }
      );
    }

    logger.info({ questionId: result?.data?.id }, 'Question submitted successfully');

    return NextResponse.json(result, { status: response.status });
  } catch (error: any) {
    logger.error({ error: error.message }, 'Question ask POST failed');
    return NextResponse.json(
      { success: false, error: 'Soru gönderilirken hata oluştu' },
      { status: 500 }
    );
  }
}
