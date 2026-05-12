import { NextRequest, NextResponse } from 'next/server';
import { createLogger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

const logger = createLogger('SERVICES:CAR-WASH-DETAIL');
const STRAPI = process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const vehicleType = searchParams.get('vehicleType') || '';

    const url = vehicleType
      ? `${STRAPI}/services/car-wash/${params.id}?vehicleType=${vehicleType}`
      : `${STRAPI}/services/car-wash/${params.id}`;

    const response = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    logger.error({ error: error.message }, 'Car-wash service detail failed');
    return NextResponse.json({ success: false, error: 'Servis bilgileri yüklenemedi' }, { status: 500 });
  }
}
