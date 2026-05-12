import { NextRequest, NextResponse } from 'next/server';
import { createLogger } from '@/lib/logger';

const logger = createLogger('MESSAGES');

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

    const queryString = request.nextUrl.search;
    const url = `${STRAPI}/messages${queryString}`;

    logger.info({ url }, 'Fetching messages from Strapi');

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    const result = await response.json();

    if (!response.ok) {
      logger.warn({ status: response.status, error: result }, 'Strapi messages GET failed');
      return NextResponse.json(
        { success: false, error: result?.error?.message || 'Mesajlar alınamadı' },
        { status: response.status }
      );
    }

    return NextResponse.json(result, { status: response.status });
  } catch (error: any) {
    logger.error({ error: error.message }, 'Messages GET failed');
    return NextResponse.json(
      { success: false, error: 'Mesajlar yüklenirken hata oluştu' },
      { status: 500 }
    );
  }
}

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

    logger.info({}, 'Sending message via Strapi');

    const response = await fetch(`${STRAPI}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const result = await response.json();

    if (!response.ok) {
      logger.warn({ status: response.status, error: result }, 'Strapi message POST failed');
      return NextResponse.json(
        { success: false, error: result?.error?.message || 'Mesaj gönderilemedi' },
        { status: response.status }
      );
    }

    logger.info({ messageId: result?.data?.id }, 'Message sent successfully');

    return NextResponse.json(result, { status: response.status });
  } catch (error: any) {
    logger.error({ error: error.message }, 'Message POST failed');
    return NextResponse.json(
      { success: false, error: 'Mesaj gönderilirken hata oluştu' },
      { status: 500 }
    );
  }
}
