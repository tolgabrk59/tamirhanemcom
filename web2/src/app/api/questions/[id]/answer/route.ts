import { NextRequest, NextResponse } from 'next/server';
import { createLogger } from '@/lib/logger';

const logger = createLogger('QUESTIONS:ANSWER');

export const dynamic = 'force-dynamic';

const STRAPI = process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api';

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const jwt = request.headers.get('authorization')?.replace('Bearer ', '');

    if (!jwt) {
      return NextResponse.json(
        { success: false, error: 'Yetkilendirme gerekli' },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const body = await request.json();

    logger.info({ questionId: id }, 'Submitting answer to question in Strapi');

    const response = await fetch(`${STRAPI}/questions/${id}/answer`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const result = await response.json();

    if (!response.ok) {
      logger.warn({ questionId: id, status: response.status, error: result }, 'Strapi question answer POST failed');
      return NextResponse.json(
        { success: false, error: result?.error?.message || 'Cevap gönderilemedi' },
        { status: response.status }
      );
    }

    logger.info({ questionId: id }, 'Question answer submitted successfully');

    return NextResponse.json(result, { status: response.status });
  } catch (error: any) {
    logger.error({ error: error.message }, 'Question answer POST failed');
    return NextResponse.json(
      { success: false, error: 'Cevap gönderilirken hata oluştu' },
      { status: 500 }
    );
  }
}
