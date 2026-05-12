import { NextRequest, NextResponse } from 'next/server';
import { createLogger } from '@/lib/logger';

const logger = createLogger('APPOINTMENTS:ID');

const STRAPI = process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const jwt = request.headers.get('authorization')?.replace('Bearer ', '');

    if (!jwt) {
      return NextResponse.json(
        { success: false, error: 'Yetkilendirme token\'ı gerekli' },
        { status: 401 }
      );
    }

    const { id } = params;
    const queryString = request.nextUrl.search;
    const url = `${STRAPI}/appointments/${id}${queryString}`;

    logger.info({ id, url }, 'Randevu detayı getiriliyor');

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    if (!response.ok) {
      logger.error({ id, status: response.status, error: result }, 'Strapi randevu detay hatası');
      return NextResponse.json(
        { success: false, error: result?.error?.message || 'Randevu bulunamadı' },
        { status: response.status }
      );
    }

    return NextResponse.json(result, { status: response.status });
  } catch (error: any) {
    logger.error({ error: error.message }, 'Randevu detay hatası');
    return NextResponse.json(
      { success: false, error: 'Randevu detayı yüklenirken hata oluştu' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const jwt = request.headers.get('authorization')?.replace('Bearer ', '');

    if (!jwt) {
      return NextResponse.json(
        { success: false, error: 'Yetkilendirme token\'ı gerekli' },
        { status: 401 }
      );
    }

    const { id } = params;
    const body = await request.json();

    logger.info({ id }, 'Randevu güncelleniyor');

    const response = await fetch(`${STRAPI}/appointments/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const result = await response.json();

    if (!response.ok) {
      logger.error({ id, status: response.status, error: result }, 'Strapi randevu güncelleme hatası');
      return NextResponse.json(
        { success: false, error: result?.error?.message || 'Randevu güncellenemedi' },
        { status: response.status }
      );
    }

    logger.info({ id }, 'Randevu güncellendi');

    return NextResponse.json(result, { status: response.status });
  } catch (error: any) {
    logger.error({ error: error.message }, 'Randevu güncelleme hatası');
    return NextResponse.json(
      { success: false, error: 'Randevu güncellenirken hata oluştu' },
      { status: 500 }
    );
  }
}
