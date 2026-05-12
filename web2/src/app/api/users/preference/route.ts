import { NextRequest, NextResponse } from 'next/server';
import { createLogger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

const logger = createLogger('USERS:PREFERENCE');
const STRAPI = process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api';

export async function GET(request: NextRequest) {
  try {
    const jwt = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!jwt) {
      return NextResponse.json({ success: false, error: 'Yetkilendirme gerekli' }, { status: 401 });
    }

    const response = await fetch(`${STRAPI}/users/preference`, {
      headers: { Authorization: `Bearer ${jwt}`, 'Content-Type': 'application/json' },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    logger.error({ error: error.message }, 'Users preference fetch failed');
    return NextResponse.json({ success: false, error: 'Tercihler yüklenemedi' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const jwt = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!jwt) {
      return NextResponse.json({ success: false, error: 'Yetkilendirme gerekli' }, { status: 401 });
    }

    const body = await request.json();

    const response = await fetch(`${STRAPI}/users/preference`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${jwt}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    logger.error({ error: error.message }, 'Users preference update failed');
    return NextResponse.json({ success: false, error: 'Tercihler güncellenemedi' }, { status: 500 });
  }
}
