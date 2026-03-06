import { NextRequest, NextResponse } from 'next/server';
import { createLogger } from '@/lib/logger';
import { checkRouteRateLimit, getClientIdentifier } from '@/lib/route-rate-limit';
import { validateRequest, formatValidationErrors, cikmaParcaSchema } from '@/lib/validation';
import type { CikmaParca, CikmaParcaCategory } from '@/types';

const logger = createLogger('API_CIKMA_PARCA');
export const dynamic = 'force-dynamic';

const STRAPI_API = process.env.STRAPI_API_URL || 'https://api.tamirhanem.com/api';
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

function getStrapiImageUrl(image: any): string | null {
  if (!image) return null;
  const baseUrl = STRAPI_API.replace(/\/api$/, '');

  if (image.data) {
    if (Array.isArray(image.data) && image.data.length > 0) {
      const url = image.data[0]?.attributes?.url;
      if (url) return url.startsWith('http') ? url : `${baseUrl}${url}`;
    }
    if (image.data?.attributes?.url) {
      const url = image.data.attributes.url;
      return url.startsWith('http') ? url : `${baseUrl}${url}`;
    }
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

// GET: Parça listesi
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const category = searchParams.get('category') as CikmaParcaCategory | null;
    const brand = searchParams.get('brand');
    const model = searchParams.get('model');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const condition = searchParams.get('condition');
    const location = searchParams.get('location');
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');

    // Build Strapi query
    const filters: string[] = ['filters[status][$eq]=active'];

    if (category) {
      filters.push(`filters[category][$eq]=${category}`);
    }
    if (brand) {
      filters.push(`filters[brand][$containsi]=${brand}`);
    }
    if (model) {
      filters.push(`filters[model][$containsi]=${model}`);
    }
    if (minPrice) {
      filters.push(`filters[price][$gte]=${minPrice}`);
    }
    if (maxPrice) {
      filters.push(`filters[price][$lte]=${maxPrice}`);
    }
    if (condition) {
      filters.push(`filters[condition][$eq]=${condition}`);
    }
    if (location) {
      filters.push(`filters[location][$containsi]=${location}`);
    }

    const url = `${STRAPI_API}/cikma-parcalar?${filters.join('&')}&populate[0]=images&populate[1]=seller&pagination[page]=${page}&pagination[pageSize]=${pageSize}&sort=createdAt:desc`;

    const response = await fetch(url, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      logger.error({ status: response.status }, 'Strapi fetch failed');
      return NextResponse.json({
        success: true,
        data: [],
        pagination: { page, pageSize, pageCount: 0, total: 0 },
      });
    }

    const json = await response.json();
    const items = (json.data || []).map(transformStrapiParca);

    return NextResponse.json({
      success: true,
      data: items,
      pagination: json.meta?.pagination || { page, pageSize, pageCount: 0, total: 0 },
    });
  } catch (error) {
    logger.error({ error }, 'Çıkma parça listesi hatası');
    return NextResponse.json(
      { success: false, error: 'Parçalar yüklenemedi' },
      { status: 500 }
    );
  }
}

// Rate limit: 10 ilan per hour per IP
const ILAN_RATE_LIMIT = 10;
const ILAN_RATE_WINDOW = 60 * 60 * 1000; // 1 hour

// POST: Yeni parça ilanı oluştur (esnaf için)
export async function POST(request: NextRequest) {
  // Rate limiting check
  const identifier = getClientIdentifier(request.headers, 'parca-ilan');
  const rateLimit = await checkRouteRateLimit(identifier, ILAN_RATE_LIMIT, ILAN_RATE_WINDOW);
  
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Cok fazla ilan olusturdunuz. Lutfen 1 saat bekleyin.',
        retryAfter: rateLimit.retryAfter 
      },
      { 
        status: 429,
        headers: {
          'Retry-After': String(rateLimit.retryAfter || 3600),
        }
      }
    );
  }

  try {
    const body = await request.json();

    // Validate input
    const validation = validateRequest(cikmaParcaSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: formatValidationErrors(validation.errors) },
        { status: 400 }
      );
    }

    const data = validation.data;

    // Check for seller authentication (simplified - real impl would use session/JWT)
    const sellerId = body.sellerId;
    if (!sellerId) {
      return NextResponse.json(
        { success: false, error: 'Satıcı girişi gerekli' },
        { status: 401 }
      );
    }

    // Create in Strapi
    const strapiPayload = {
      data: {
        title: data.title,
        description: data.description,
        category: data.category,
        brand: data.brand,
        model: data.model,
        year_from: data.yearFrom,
        year_to: data.yearTo,
        price: data.price,
        condition: data.condition,
        oem_code: data.oemCode,
        location: data.location,
        status: 'active',
        seller: sellerId,
      },
    };

    const response = await fetch(`${STRAPI_API}/cikma-parcalar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(STRAPI_TOKEN && { Authorization: `Bearer ${STRAPI_TOKEN}` }),
      },
      body: JSON.stringify(strapiPayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      logger.error({ status: response.status, error: errorText }, 'Strapi create failed');
      return NextResponse.json(
        { success: false, error: 'İlan oluşturulamadı' },
        { status: 500 }
      );
    }

    const result = await response.json();

    return NextResponse.json({
      success: true,
      data: { id: result.data.id },
      message: 'İlan başarıyla oluşturuldu',
    });
  } catch (error) {
    logger.error({ error }, 'Çıkma parça oluşturma hatası');
    return NextResponse.json(
      { success: false, error: 'İlan oluşturulamadı' },
      { status: 500 }
    );
  }
}
