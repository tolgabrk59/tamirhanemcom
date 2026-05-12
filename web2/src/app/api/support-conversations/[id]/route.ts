import { NextRequest, NextResponse } from 'next/server';
import { createLogger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

const logger = createLogger('SUPPORT:CONVERSATION-DETAIL');
const STRAPI = process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const jwt = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!jwt) {
      return NextResponse.json({ success: false, error: 'Yetkilendirme gerekli' }, { status: 401 });
    }

    const { id } = await context.params;

    const response = await fetch(`${STRAPI}/support-conversations/${id}`, {
      headers: { Authorization: `Bearer ${jwt}`, 'Content-Type': 'application/json' },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    logger.error({ error: error.message }, 'Support conversation detail fetch failed');
    return NextResponse.json({ success: false, error: 'Konuşma yüklenemedi' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const jwt = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!jwt) {
      return NextResponse.json({ success: false, error: 'Yetkilendirme gerekli' }, { status: 401 });
    }

    const { id } = await context.params;

    const response = await fetch(`${STRAPI}/support-conversations/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${jwt}` },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    logger.error({ error: error.message }, 'Support conversation delete failed');
    return NextResponse.json({ success: false, error: 'Konuşma silinemedi' }, { status: 500 });
  }
}
