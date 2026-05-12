import { NextRequest, NextResponse } from 'next/server';
import { createLogger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

const logger = createLogger('WASH-HOME-CAMPAIGNS:ELIGIBILITY');
const STRAPI = process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const jwt = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!jwt) {
      return NextResponse.json({ success: false, error: 'Yetkilendirme gerekli' }, { status: 401 });
    }

    const response = await fetch(`${STRAPI}/wash-home-campaigns/${params.id}/eligibility`, {
      headers: { Authorization: `Bearer ${jwt}`, 'Content-Type': 'application/json' },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    logger.error({ error: error.message }, 'Campaign eligibility check failed');
    return NextResponse.json({ success: false, error: 'Uygunluk kontrolü başarısız' }, { status: 500 });
  }
}
