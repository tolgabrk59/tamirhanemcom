import { NextRequest, NextResponse } from 'next/server';
import { createLogger } from '@/lib/logger';

const logger = createLogger('APPOINTMENTS:GENERAL_POOL');

const STRAPI = process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api';

export async function GET(request: NextRequest) {
  try {
    const jwt = request.headers.get('authorization')?.replace('Bearer ', '');

    if (!jwt) {
      return NextResponse.json(
        { success: false, error: 'Yetkilendirme token\'ı gerekli' },
        { status: 401 }
      );
    }

    const queryString = request.nextUrl.search;
    const url = `${STRAPI}/appointments/general-pool${queryString}`;

    logger.info({ url }, 'Genel havuz randevuları getiriliyor');

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    if (!response.ok) {
      logger.error({ status: response.status, error: result }, 'Strapi genel havuz hatası');
      return NextResponse.json(
        { success: false, error: result?.error?.message || 'Genel havuz randevuları alınamadı' },
        { status: response.status }
      );
    }

    return NextResponse.json(result, { status: response.status });
  } catch (error: any) {
    logger.error({ error: error.message }, 'Genel havuz randevuları hatası');
    return NextResponse.json(
      { success: false, error: 'Genel havuz randevuları yüklenirken hata oluştu' },
      { status: 500 }
    );
  }
}
