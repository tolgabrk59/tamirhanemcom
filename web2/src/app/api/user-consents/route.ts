import { NextRequest, NextResponse } from 'next/server';
import { createLogger } from '@/lib/logger';

const logger = createLogger('USER_CONSENTS');

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
    const url = `${STRAPI}/user-consents${queryString}`;

    logger.info({ url }, 'Fetching user consents from Strapi');

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    const result = await response.json();

    if (!response.ok) {
      logger.warn({ status: response.status, error: result }, 'Strapi user consents GET failed');
      return NextResponse.json(
        { success: false, error: result?.error?.message || 'Kullanıcı onayları alınamadı' },
        { status: response.status }
      );
    }

    return NextResponse.json(result, { status: response.status });
  } catch (error: any) {
    logger.error({ error: error.message }, 'User consents GET failed');
    return NextResponse.json(
      { success: false, error: 'Kullanıcı onayları yüklenirken hata oluştu' },
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

    logger.info({}, 'Creating user consent in Strapi');

    const response = await fetch(`${STRAPI}/user-consents`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const result = await response.json();

    if (!response.ok) {
      logger.warn({ status: response.status, error: result }, 'Strapi user consent POST failed');
      return NextResponse.json(
        { success: false, error: result?.error?.message || 'Kullanıcı onayı kaydedilemedi' },
        { status: response.status }
      );
    }

    logger.info({ consentId: result?.data?.id }, 'User consent created successfully');

    return NextResponse.json(result, { status: response.status });
  } catch (error: any) {
    logger.error({ error: error.message }, 'User consent POST failed');
    return NextResponse.json(
      { success: false, error: 'Kullanıcı onayı kaydedilirken hata oluştu' },
      { status: 500 }
    );
  }
}
