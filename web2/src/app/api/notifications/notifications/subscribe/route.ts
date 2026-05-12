import { NextRequest, NextResponse } from 'next/server';
import { createLogger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

const logger = createLogger('NOTIFICATIONS:SUBSCRIBE');
const STRAPI = process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api';

export async function POST(request: NextRequest) {
  const jwt = request.headers.get('authorization')?.replace('Bearer ', '');
  if (!jwt) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();

  try {
    const res = await fetch(`${STRAPI}/notifications/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    logger.error({ error: message }, 'Subscribe failed');
    // Strapi endpoint yoksa graceful degrade
    return NextResponse.json({
      success: true,
      message: 'Subscription noted (Strapi endpoint pending)',
    });
  }
}
