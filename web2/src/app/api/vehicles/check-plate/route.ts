import { NextRequest, NextResponse } from 'next/server';
import { createLogger } from '@/lib/logger';

const logger = createLogger('VEHICLES:CHECK-PLATE');

const STRAPI = process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const plate = searchParams.get('plate');

    if (!plate) {
      return NextResponse.json(
        { success: false, error: 'Plaka parametresi gerekli' },
        { status: 400 }
      );
    }

    logger.info({ plate }, 'Checking plate via Strapi');

    const response = await fetch(
      `${STRAPI}/vehicles/check-plate?plate=${encodeURIComponent(plate)}`,
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      logger.warn({ plate, status: response.status, error: result }, 'Strapi check-plate failed');
      return NextResponse.json(
        { success: false, error: result?.error?.message || 'Plaka sorgulanamadı' },
        { status: response.status }
      );
    }

    logger.info({ plate }, 'Plate check completed');
    return NextResponse.json(result);
  } catch (error: any) {
    logger.error({ error: error.message }, 'Plate check failed');
    return NextResponse.json(
      { success: false, error: 'Plaka sorgulanırken hata oluştu' },
      { status: 500 }
    );
  }
}
