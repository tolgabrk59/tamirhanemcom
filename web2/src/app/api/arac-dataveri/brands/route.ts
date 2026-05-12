import { NextRequest, NextResponse } from 'next/server';
import { createLogger } from '@/lib/logger';

const logger = createLogger('ARAC-DATAVERI:BRANDS');

const STRAPI = process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api';

export async function GET(request: NextRequest) {
  try {
    logger.info('Fetching unique car brands from Strapi');

    const response = await fetch(`${STRAPI}/arac-dataveri/unique-brands`, {
      headers: { 'Content-Type': 'application/json' },
    });

    const result = await response.json();

    if (!response.ok) {
      logger.warn({ status: response.status, error: result }, 'Strapi unique-brands failed');
      return NextResponse.json(
        { success: false, error: result?.error?.message || 'Markalar getirilemedi' },
        { status: response.status }
      );
    }

    logger.info('Car brands fetched successfully');
    return NextResponse.json(result);
  } catch (error: any) {
    logger.error({ error: error.message }, 'Brands fetch failed');
    return NextResponse.json(
      { success: false, error: 'Markalar getirilirken hata oluştu' },
      { status: 500 }
    );
  }
}
