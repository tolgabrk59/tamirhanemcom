import { NextRequest, NextResponse } from 'next/server';
import { createLogger } from '@/lib/logger';

const logger = createLogger('ARAC-DATAVERI:MODELS');

const STRAPI = process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ make: string }> }
) {
  try {
    const { make } = await params;

    if (!make) {
      return NextResponse.json(
        { success: false, error: 'Marka parametresi gerekli' },
        { status: 400 }
      );
    }

    const encodedMake = encodeURIComponent(make);

    logger.info({ make }, 'Fetching models for make from Strapi');

    const response = await fetch(`${STRAPI}/arac-dataveri/models/${encodedMake}`, {
      headers: { 'Content-Type': 'application/json' },
    });

    const result = await response.json();

    if (!response.ok) {
      logger.warn({ make, status: response.status, error: result }, 'Strapi models fetch failed');
      return NextResponse.json(
        { success: false, error: result?.error?.message || 'Modeller getirilemedi' },
        { status: response.status }
      );
    }

    logger.info({ make }, 'Models fetched successfully');
    return NextResponse.json(result);
  } catch (error: any) {
    logger.error({ error: error.message }, 'Models fetch failed');
    return NextResponse.json(
      { success: false, error: 'Modeller getirilirken hata oluştu' },
      { status: 500 }
    );
  }
}
