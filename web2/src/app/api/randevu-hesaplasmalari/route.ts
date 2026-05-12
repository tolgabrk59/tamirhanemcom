import { NextRequest, NextResponse } from 'next/server';
import { createLogger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

const logger = createLogger('RANDEVU-HESAPLASMALARI');
const STRAPI = process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api';

export async function GET(request: NextRequest) {
  try {
    const jwt = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!jwt) {
      return NextResponse.json({ success: false, error: 'Yetkilendirme gerekli' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);

    const response = await fetch(`${STRAPI}/randevu-hesaplasmalari?${searchParams.toString()}`, {
      headers: { Authorization: `Bearer ${jwt}`, 'Content-Type': 'application/json' },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    logger.error({ error: error.message }, 'Randevu hesaplamalar fetch failed');
    return NextResponse.json({ success: false, error: 'Hesaplamalar yüklenemedi' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const jwt = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!jwt) {
      return NextResponse.json({ success: false, error: 'Yetkilendirme gerekli' }, { status: 401 });
    }

    const body = await request.json();

    const response = await fetch(`${STRAPI}/randevu-hesaplasmalari`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${jwt}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    logger.error({ error: error.message }, 'Randevu hesaplama create failed');
    return NextResponse.json({ success: false, error: 'Hesaplama oluşturulamadı' }, { status: 500 });
  }
}
