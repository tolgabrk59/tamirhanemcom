import { NextRequest, NextResponse } from 'next/server';
import { createLogger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

const logger = createLogger('SERVICES:CAR-WASH-AVAILABILITY');
const STRAPI = process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const totalDuration = searchParams.get('totalDuration');

    if (!date) {
      return NextResponse.json({ success: false, error: 'date parametresi gerekli' }, { status: 400 });
    }

    const queryString = new URLSearchParams();
    if (date) queryString.set('date', date);
    if (totalDuration) queryString.set('totalDuration', totalDuration);

    const response = await fetch(
      `${STRAPI}/services/car-wash/${params.id}/availability?${queryString.toString()}`,
      { headers: { 'Content-Type': 'application/json' } }
    );

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    logger.error({ error: error.message }, 'Car-wash availability fetch failed');
    return NextResponse.json({ success: false, error: 'Uygunluk bilgileri yüklenemedi' }, { status: 500 });
  }
}
