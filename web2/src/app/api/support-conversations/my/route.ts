import { NextRequest, NextResponse } from 'next/server';
import { createLogger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

const logger = createLogger('SUPPORT:MY-CONVERSATIONS');
const STRAPI = process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api';

export async function GET(request: NextRequest) {
  try {
    const jwt = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!jwt) {
      return NextResponse.json({ success: false, error: 'Yetkilendirme gerekli' }, { status: 401 });
    }

    const response = await fetch(`${STRAPI}/support-conversations/my`, {
      headers: { Authorization: `Bearer ${jwt}`, 'Content-Type': 'application/json' },
    });

    const raw = await response.json();
    // Strapi custom route returns { conversations: [...] }
    const conversations = Array.isArray(raw?.conversations) ? raw.conversations :
                          Array.isArray(raw?.data) ? raw.data : [];
    return NextResponse.json({ success: true, data: conversations }, { status: 200 });
  } catch (error: any) {
    logger.error({ error: error.message }, 'Support conversations fetch failed');
    return NextResponse.json({ success: false, error: 'Konuşmalar yüklenemedi' }, { status: 500 });
  }
}
