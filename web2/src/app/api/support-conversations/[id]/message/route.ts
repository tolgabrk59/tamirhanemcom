import { NextRequest, NextResponse } from 'next/server';
import { createLogger } from '@/lib/logger';

const logger = createLogger('SUPPORT_CONVERSATIONS:MESSAGE');

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

    logger.info({ conversationId: id }, 'Sending message to support conversation in Strapi');

    const response = await fetch(`${STRAPI}/support-conversations/${id}/message`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const result = await response.json();

    if (!response.ok) {
      logger.warn({ conversationId: id, status: response.status, error: result }, 'Strapi support conversation message POST failed');
      return NextResponse.json(
        { success: false, error: result?.error?.message || 'Mesaj gönderilemedi' },
        { status: response.status }
      );
    }

    logger.info({ conversationId: id }, 'Support conversation message sent successfully');

    return NextResponse.json(result, { status: response.status });
  } catch (error: any) {
    logger.error({ error: error.message }, 'Support conversation message POST failed');
    return NextResponse.json(
      { success: false, error: 'Mesaj gönderilirken hata oluştu' },
      { status: 500 }
    );
  }
}
