import { NextRequest, NextResponse } from 'next/server';
import { createLogger } from '@/lib/logger';

const logger = createLogger('API_SERVICES');

export const dynamic = 'force-dynamic';

const STRAPI = process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const jwt = request.headers.get('authorization')?.replace('Bearer ', '');

    const strapiUrl = `${STRAPI}/services?${searchParams.toString()}`;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (jwt) {
      headers['Authorization'] = `Bearer ${jwt}`;
    }

    const response = await fetch(strapiUrl, { headers, cache: 'no-store' });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      logger.warn({ status: response.status, error }, 'Strapi services hatası');
      return NextResponse.json(
        { success: false, error: 'Servisler yüklenemedi' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({ success: true, ...data });
  } catch (error) {
    logger.error({ error }, 'Services API hatası');
    return NextResponse.json(
      { success: false, error: 'Servisler yüklenemedi' },
      { status: 500 }
    );
  }
}
