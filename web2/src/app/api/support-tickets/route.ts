import { NextRequest, NextResponse } from 'next/server';
import { createLogger } from '@/lib/logger';

const logger = createLogger('SUPPORT_TICKETS');

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
    const url = `${STRAPI}/support-tickets${queryString}`;

    logger.info({ url }, 'Fetching support tickets from Strapi');

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    const result = await response.json();

    if (!response.ok) {
      logger.warn({ status: response.status, error: result }, 'Strapi support tickets GET failed');
      return NextResponse.json(
        { success: false, error: result?.error?.message || 'Destek talepleri alınamadı' },
        { status: response.status }
      );
    }

    return NextResponse.json(result, { status: response.status });
  } catch (error: any) {
    logger.error({ error: error.message }, 'Support tickets GET failed');
    return NextResponse.json(
      { success: false, error: 'Destek talepleri yüklenirken hata oluştu' },
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

    logger.info({}, 'Creating support ticket in Strapi');

    const response = await fetch(`${STRAPI}/support-tickets`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const result = await response.json();

    if (!response.ok) {
      logger.warn({ status: response.status, error: result }, 'Strapi support ticket POST failed');
      return NextResponse.json(
        { success: false, error: result?.error?.message || 'Destek talebi oluşturulamadı' },
        { status: response.status }
      );
    }

    logger.info({ ticketId: result?.data?.id }, 'Support ticket created successfully');

    return NextResponse.json(result, { status: response.status });
  } catch (error: any) {
    logger.error({ error: error.message }, 'Support ticket POST failed');
    return NextResponse.json(
      { success: false, error: 'Destek talebi oluşturulurken hata oluştu' },
      { status: 500 }
    );
  }
}
