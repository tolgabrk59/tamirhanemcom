import { NextRequest, NextResponse } from 'next/server';
import { createLogger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

const logger = createLogger('WASH-HOME-CAMPAIGNS:TYPE');
const STRAPI = process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api';

export async function GET(
  request: NextRequest,
  { params }: { params: { type: string } }
) {
  try {
    const jwt = request.headers.get('authorization')?.replace('Bearer ', '');

    const response = await fetch(`${STRAPI}/wash-home-campaigns/type/${params.type}`, {
      headers: {
        ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}),
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    logger.error({ error: error.message }, 'Wash home campaigns type fetch failed');
    return NextResponse.json({ success: false, error: 'Kampanyalar yüklenemedi' }, { status: 500 });
  }
}
