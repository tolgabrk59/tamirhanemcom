import { NextRequest, NextResponse } from 'next/server';
import { createLogger } from '@/lib/logger';
import { validateRequest, formatValidationErrors, cikmaParcaTeklifSchema } from '@/lib/validation';
import { checkRouteRateLimit, getClientIdentifier } from '@/lib/route-rate-limit';

const logger = createLogger('API_PARCA_TEKLIF');
export const dynamic = 'force-dynamic';

const STRAPI_API = process.env.STRAPI_API_URL || 'https://api.tamirhanem.com/api';
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

// Rate limit: 10 teklif per hour per IP
const TEKLIF_RATE_LIMIT = 10;
const TEKLIF_RATE_WINDOW = 60 * 60 * 1000; // 1 hour

// POST: Teklif gonder
export async function POST(request: NextRequest) {
  // Rate limiting check
  const identifier = getClientIdentifier(request.headers, 'parca-teklif');
  const rateLimit = await checkRouteRateLimit(identifier, TEKLIF_RATE_LIMIT, TEKLIF_RATE_WINDOW);
  
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Cok fazla teklif gonderdiniz. Lutfen 1 saat bekleyin.',
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
    const validation = validateRequest(cikmaParcaTeklifSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: formatValidationErrors(validation.errors) },
        { status: 400 }
      );
    }

    const data = validation.data;

    // Create teklif in Strapi
    const strapiPayload = {
      data: {
        parca: data.parcaId,
        sender_name: data.senderName,
        sender_phone: data.senderPhone,
        message: data.message,
        offered_price: data.offeredPrice,
        status: 'pending',
      },
    };

    const response = await fetch(`${STRAPI_API}/parca-teklifleri`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(STRAPI_TOKEN && { Authorization: `Bearer ${STRAPI_TOKEN}` }),
      },
      body: JSON.stringify(strapiPayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      logger.error({ status: response.status, error: errorText }, 'Strapi teklif create failed');
      return NextResponse.json(
        { success: false, error: 'Teklif gonderilemedi' },
        { status: 500 }
      );
    }

    logger.info({ parcaId: data.parcaId }, 'Teklif gonderildi');

    return NextResponse.json({
      success: true,
      message: 'Teklifiniz saticiya iletildi',
    });
  } catch (error) {
    logger.error({ error }, 'Teklif gonderme hatasi');
    return NextResponse.json(
      { success: false, error: 'Teklif gonderilemedi' },
      { status: 500 }
    );
  }
}

// GET: Teklif listesi (satici icin)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sellerId = searchParams.get('sellerId');
    const parcaId = searchParams.get('parcaId');

    if (!sellerId) {
      return NextResponse.json(
        { success: false, error: 'Yetkilendirme gerekli' },
        { status: 401 }
      );
    }

    let url = `${STRAPI_API}/parca-teklifleri?populate=parca&sort=createdAt:desc`;

    if (parcaId) {
      url += `&filters[parca][id][$eq]=${parcaId}`;
    }

    const response = await fetch(url, {
      headers: {
        ...(STRAPI_TOKEN && { Authorization: `Bearer ${STRAPI_TOKEN}` }),
      },
    });

    if (!response.ok) {
      throw new Error('Strapi fetch failed');
    }

    const json = await response.json();

    const teklifler = (json.data || []).map((item: any) => {
      const attrs = item.attributes || item;
      return {
        id: item.id,
        parca: {
          id: attrs.parca?.data?.id,
          title: attrs.parca?.data?.attributes?.title || '',
        },
        senderName: attrs.sender_name || '',
        senderPhone: attrs.sender_phone || '',
        message: attrs.message || '',
        offeredPrice: attrs.offered_price,
        status: attrs.status || 'pending',
        sellerReply: attrs.seller_reply,
        createdAt: attrs.createdAt,
      };
    });

    return NextResponse.json({
      success: true,
      data: teklifler,
    });
  } catch (error) {
    logger.error({ error }, 'Teklif listesi hatasi');
    return NextResponse.json(
      { success: false, error: 'Teklifler yuklenemedi' },
      { status: 500 }
    );
  }
}
