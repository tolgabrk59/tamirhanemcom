import { NextRequest, NextResponse } from 'next/server';
import { createLogger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

const logger = createLogger('USERS:ME');

const STRAPI = process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api';

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Yetkilendirme gerekli' },
        { status: 401 }
      );
    }

    logger.info('Fetching user profile from Strapi');

    const response = await fetch(
      STRAPI + '/users/me?populate=avatar,services,services.ProfilePicture',
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      const errorMsg = result?.error?.message || result?.message || 'Kullanıcı bilgileri alınamadı';
      logger.warn({ status: response.status, error: errorMsg }, 'Strapi users/me failed');
      return NextResponse.json(
        { success: false, error: errorMsg },
        { status: response.status }
      );
    }

    logger.info({ userId: result.id }, 'User profile fetched successfully');

    return NextResponse.json({ success: true, user: result });
  } catch (error: any) {
    logger.error({ error: error.message }, 'Users/me request failed');
    return NextResponse.json(
      { success: false, error: 'Kullanıcı bilgileri alınamadı. Lütfen tekrar deneyin.' },
      { status: 500 }
    );
  }
}
