import { NextRequest, NextResponse } from 'next/server';
import { createLogger } from '@/lib/logger';
import type { CikmaParca } from '@/types';

const logger = createLogger('API_CIKMA_PARCA_DETAIL');
export const dynamic = 'force-dynamic';

const STRAPI_API = process.env.STRAPI_API_URL || 'https://api.tamirhanem.com/api';
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

function getStrapiImageUrl(image: any): string | null {
  if (!image) return null;
  const baseUrl = STRAPI_API.replace(/\/api$/, '');

  if (image.attributes?.url) {
    const url = image.attributes.url;
    return url.startsWith('http') ? url : `${baseUrl}${url}`;
  }

  if (image.url) {
    return image.url.startsWith('http') ? image.url : `${baseUrl}${image.url}`;
  }

  return null;
}

function transformStrapiParca(item: any): CikmaParca {
  const attrs = item.attributes || item;
  const seller = attrs.seller?.data?.attributes || attrs.seller || {};

  return {
    id: item.id,
    title: attrs.title || '',
    description: attrs.description || '',
    category: attrs.category || 'diger',
    brand: attrs.brand || '',
    model: attrs.model || '',
    yearFrom: attrs.year_from || attrs.yearFrom,
    yearTo: attrs.year_to || attrs.yearTo,
    price: parseFloat(attrs.price) || 0,
    condition: attrs.condition || 'orta',
    images: (attrs.images?.data || []).map((img: any) => ({
      url: getStrapiImageUrl(img) || '',
    })),
    seller: {
      id: attrs.seller?.data?.id || 0,
      name: seller.name || 'Satıcı',
      location: seller.location || '',
      phone: seller.phone,
      rating: seller.rating,
    },
    status: attrs.status || 'active',
    oemCode: attrs.oem_code || attrs.oemCode,
    location: attrs.location || '',
    createdAt: attrs.createdAt || new Date().toISOString(),
    updatedAt: attrs.updatedAt || new Date().toISOString(),
  };
}

type RouteContext = { params: Promise<{ id: string }> };

// GET: Parça detayı
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    const url = `${STRAPI_API}/cikma-parcalar/${id}?populate[0]=images&populate[1]=seller`;

    const response = await fetch(url, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { success: false, error: 'Parça bulunamadı' },
          { status: 404 }
        );
      }
      throw new Error('Strapi fetch failed');
    }

    const json = await response.json();
    const parca = transformStrapiParca(json.data);

    return NextResponse.json({
      success: true,
      data: parca,
    });
  } catch (error) {
    logger.error({ error }, 'Parça detay hatası');
    return NextResponse.json(
      { success: false, error: 'Parça yüklenemedi' },
      { status: 500 }
    );
  }
}

// PUT: Parça güncelle (sadece satıcı)
export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    // Check seller ownership (simplified)
    const sellerId = body.sellerId;
    if (!sellerId) {
      return NextResponse.json(
        { success: false, error: 'Yetkilendirme hatası' },
        { status: 401 }
      );
    }

    const strapiPayload = {
      data: {
        ...(body.title && { title: body.title }),
        ...(body.description && { description: body.description }),
        ...(body.price && { price: body.price }),
        ...(body.condition && { condition: body.condition }),
        ...(body.status && { status: body.status }),
      },
    };

    const response = await fetch(`${STRAPI_API}/cikma-parcalar/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(STRAPI_TOKEN && { Authorization: `Bearer ${STRAPI_TOKEN}` }),
      },
      body: JSON.stringify(strapiPayload),
    });

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: 'Güncelleme başarısız' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'İlan güncellendi',
    });
  } catch (error) {
    logger.error({ error }, 'Parça güncelleme hatası');
    return NextResponse.json(
      { success: false, error: 'Güncelleme başarısız' },
      { status: 500 }
    );
  }
}

// DELETE: Parça sil (pasif yap)
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const { searchParams } = new URL(request.url);
    const sellerId = searchParams.get('sellerId');

    if (!sellerId) {
      return NextResponse.json(
        { success: false, error: 'Yetkilendirme hatası' },
        { status: 401 }
      );
    }

    // Soft delete: set status to inactive
    const response = await fetch(`${STRAPI_API}/cikma-parcalar/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(STRAPI_TOKEN && { Authorization: `Bearer ${STRAPI_TOKEN}` }),
      },
      body: JSON.stringify({ data: { status: 'inactive' } }),
    });

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: 'Silme başarısız' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'İlan kaldırıldı',
    });
  } catch (error) {
    logger.error({ error }, 'Parça silme hatası');
    return NextResponse.json(
      { success: false, error: 'Silme başarısız' },
      { status: 500 }
    );
  }
}
