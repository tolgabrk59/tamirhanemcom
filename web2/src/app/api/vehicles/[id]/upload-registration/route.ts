import { NextRequest, NextResponse } from 'next/server';
import { createLogger } from '@/lib/logger';

const logger = createLogger('VEHICLES:UPLOAD-REGISTRATION');

const STRAPI = process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const jwt = request.headers.get('authorization')?.replace('Bearer ', '');

    if (!jwt) {
      return NextResponse.json(
        { success: false, error: 'Yetkilendirme gerekli' },
        { status: 401 }
      );
    }

    const { id } = await params;

    const formData = await request.formData();

    logger.info({ id }, 'Uploading registration document to Strapi');

    const response = await fetch(`${STRAPI}/vehicles/${id}/upload-registration`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      logger.warn({ id, status: response.status, error: result }, 'Strapi upload-registration failed');
      return NextResponse.json(
        { success: false, error: result?.error?.message || 'Ruhsat yüklenemedi' },
        { status: response.status }
      );
    }

    logger.info({ id }, 'Registration document uploaded successfully');
    return NextResponse.json(result);
  } catch (error: any) {
    logger.error({ error: error.message }, 'Upload registration failed');
    return NextResponse.json(
      { success: false, error: 'Ruhsat yüklenirken hata oluştu' },
      { status: 500 }
    );
  }
}
