import { NextRequest, NextResponse } from 'next/server';
import { createLogger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

const logger = createLogger('VEHICLES:SUPPORTED-COUNTRIES');
const STRAPI = process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api';

export async function GET(request: NextRequest) {
  try {
    const response = await fetch(`${STRAPI}/vehicles/supported-countries`, {
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    logger.error({ error: error.message }, 'Supported countries fetch failed');
    return NextResponse.json({ success: false, error: 'Desteklenen ülkeler yüklenemedi' }, { status: 500 });
  }
}
