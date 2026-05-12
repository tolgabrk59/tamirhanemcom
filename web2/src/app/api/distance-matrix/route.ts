import { NextRequest, NextResponse } from 'next/server';
import { createLogger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

const logger = createLogger('DISTANCE-MATRIX');
const STRAPI = process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const origins = searchParams.get('origins');
    const destinations = searchParams.get('destinations');

    if (!origins || !destinations) {
      return NextResponse.json(
        { success: false, error: 'origins ve destinations parametreleri gerekli' },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${STRAPI}/distance-matrix?origins=${encodeURIComponent(origins)}&destinations=${encodeURIComponent(destinations)}`,
      { headers: { 'Content-Type': 'application/json' } }
    );

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    logger.error({ error: error.message }, 'Distance matrix fetch failed');
    return NextResponse.json({ success: false, error: 'Mesafe hesaplanamadı' }, { status: 500 });
  }
}
