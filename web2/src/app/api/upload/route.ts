import { NextRequest, NextResponse } from 'next/server';
import { createLogger } from '@/lib/logger';

const logger = createLogger('API_UPLOAD');

export const dynamic = 'force-dynamic';

const STRAPI = process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api';

export async function POST(request: NextRequest) {
  try {
    const jwt = request.headers.get('authorization')?.replace('Bearer ', '');

    if (!jwt) {
      return NextResponse.json(
        { success: false, error: 'Yetkilendirme gerekli' },
        { status: 401 }
      );
    }

    const formData = await request.formData();

    logger.info('Dosya yükleme isteği alındı');

    const response = await fetch(`${STRAPI}/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${jwt}`,
        // Content-Type intentionally omitted — fetch sets multipart boundary automatically
      },
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      const errorMsg = result?.error?.message || result?.message || 'Dosya yüklenemedi';
      logger.warn({ status: response.status, error: errorMsg }, 'Strapi upload failed');
      return NextResponse.json(
        { success: false, error: errorMsg },
        { status: response.status }
      );
    }

    logger.info({ count: Array.isArray(result) ? result.length : 1 }, 'Dosya yükleme başarılı');

    return NextResponse.json(result, { status: response.status });
  } catch (error: any) {
    logger.error({ error: error.message }, 'Upload request failed');
    return NextResponse.json(
      { success: false, error: 'Dosya yüklenirken hata oluştu. Lütfen tekrar deneyin.' },
      { status: 500 }
    );
  }
}
