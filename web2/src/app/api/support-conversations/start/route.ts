import { NextRequest, NextResponse } from 'next/server';
import { createLogger } from '@/lib/logger';

const logger = createLogger('SUPPORT_CONVERSATIONS:START');

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

    logger.info({}, 'Starting support conversation in Strapi');

    const response = await fetch(`${STRAPI}/support-conversations/start`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const result = await response.json();

    if (!response.ok) {
      logger.warn({ status: response.status, error: result }, 'Strapi support conversation start POST failed');
      return NextResponse.json(
        { success: false, error: result?.error?.message || 'Destek konuşması başlatılamadı' },
        { status: response.status }
      );
    }

    logger.info({ conversationId: result?.data?.id }, 'Support conversation started successfully');

    return NextResponse.json(result, { status: response.status });
  } catch (error: any) {
    logger.error({ error: error.message }, 'Support conversation start POST failed');
    return NextResponse.json(
      { success: false, error: 'Destek konuşması başlatılırken hata oluştu' },
      { status: 500 }
    );
  }
}
