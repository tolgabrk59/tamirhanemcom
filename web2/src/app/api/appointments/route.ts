import { NextRequest, NextResponse } from 'next/server';
import { createLogger } from '@/lib/logger';

const logger = createLogger('APPOINTMENTS');

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
    const url = `${STRAPI}/appointments${queryString}`;

    logger.info({ url }, 'Randevular getiriliyor');

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    if (!response.ok) {
      logger.error({ status: response.status, error: result }, 'Strapi randevu listesi hatası');
      return NextResponse.json(
        { success: false, error: result?.error?.message || 'Randevular alınamadı' },
        { status: response.status }
      );
    }

    return NextResponse.json(result, { status: response.status });
  } catch (error: any) {
    logger.error({ error: error.message }, 'Randevu listesi hatası');
    return NextResponse.json(
      { success: false, error: 'Randevular yüklenirken hata oluştu' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const jwt = request.headers.get('authorization')?.replace('Bearer ', '');

    if (!jwt) {
      return NextResponse.json(
        { success: false, error: 'Yetkilendirme token\'ı gerekli' },
        { status: 401 }
      );
    }

    const body = await request.json();

    logger.info({}, 'Yeni randevu oluşturuluyor');

    const response = await fetch(`${STRAPI}/appointments`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const result = await response.json();

    if (!response.ok) {
      logger.error({ status: response.status, error: result }, 'Strapi randevu oluşturma hatası');
      return NextResponse.json(
        { success: false, error: result?.error?.message || 'Randevu oluşturulamadı' },
        { status: response.status }
      );
    }

    logger.info({ appointmentId: result?.data?.id }, 'Randevu oluşturuldu');

    return NextResponse.json(result, { status: response.status });
  } catch (error: any) {
    logger.error({ error: error.message }, 'Randevu oluşturma hatası');
    return NextResponse.json(
      { success: false, error: 'Randevu oluşturulurken hata oluştu' },
      { status: 500 }
    );
  }
}
