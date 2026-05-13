import { NextRequest, NextResponse } from 'next/server';
import { createLogger } from '@/lib/logger';
import { normalizeStrapiList } from '@/lib/strapi-normalize';

const logger = createLogger('API_RATINGS');

export const dynamic = 'force-dynamic';

const STRAPI = process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api';

function mapRating(flat: Record<string, unknown>) {
  const service = (flat.service as { data?: { id?: number; attributes?: Record<string, unknown> } } | null)?.data;
  const sa = service?.attributes || (service as Record<string, unknown>) || {};
  return {
    id: flat.id as number,
    rating: Number(flat.rating || flat.score || flat.value || 0),
    comment: String(flat.comment || flat.review || ''),
    createdAt: String(flat.createdAt || ''),
    serviceId: service?.id || null,
    serviceName: String((sa as Record<string, unknown>).name || ''),
    serviceCategory: String((sa as Record<string, unknown>).category || flat.serviceCategory || ''),
    helpfulCount: Number(flat.helpfulCount || 0),
    replyFrom: String(flat.replyFrom || ''),
    reply: String(flat.reply || ''),
  };
}

export async function GET(request: NextRequest) {
  try {
    const jwt = request.headers.get('authorization')?.replace('Bearer ', '');

    if (!jwt) {
      return NextResponse.json(
        { success: false, error: 'Yetkilendirme gerekli' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    searchParams.set('populate[service]', '*');
    const strapiUrl = `${STRAPI}/ratings?${searchParams.toString()}`;

    const response = await fetch(strapiUrl, {
      headers: { Authorization: `Bearer ${jwt}` },
      cache: 'no-store',
    });

    if (!response.ok) {
      logger.warn({ status: response.status }, 'Strapi ratings GET hatası');
      return NextResponse.json(
        { success: false, error: 'Değerlendirmeler yüklenemedi' },
        { status: response.status }
      );
    }

    const raw = await response.json();
    return NextResponse.json({ success: true, data: normalizeStrapiList(raw, mapRating) });
  } catch (error) {
    logger.error({ error }, 'Ratings GET API hatası');
    return NextResponse.json(
      { success: false, error: 'Değerlendirmeler yüklenemedi' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const jwt = request.headers.get('authorization')?.replace('Bearer ', '');

    if (!jwt) {
      return NextResponse.json(
        { success: false, error: 'Yetkilendirme gerekli' },
        { status: 401 }
      );
    }

    const body = await request.json();

    const response = await fetch(`${STRAPI}/ratings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      logger.warn({ status: response.status, error }, 'Strapi ratings POST hatası');
      return NextResponse.json(
        { success: false, error: 'Değerlendirme gönderilemedi' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({ success: true, ...data }, { status: 201 });
  } catch (error) {
    logger.error({ error }, 'Ratings POST API hatası');
    return NextResponse.json(
      { success: false, error: 'Değerlendirme gönderilemedi' },
      { status: 500 }
    );
  }
}
