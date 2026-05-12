import { NextRequest, NextResponse } from 'next/server';
import { createLogger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

const logger = createLogger('WASH-HOME-CAMPAIGNS:CLICK');
const STRAPI = process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const jwt = request.headers.get('authorization')?.replace('Bearer ', '');

    const response = await fetch(`${STRAPI}/wash-home-campaigns/${params.id}/click`, {
      method: 'POST',
      headers: {
        ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}),
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    logger.error({ error: error.message }, 'Campaign click failed');
    return NextResponse.json({ success: false, error: 'İşlem başarısız' }, { status: 500 });
  }
}
