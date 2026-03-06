import { NextRequest, NextResponse } from 'next/server';
import { createLogger } from '@/lib/logger';
import { validateRequest, formatValidationErrors, plakaKayitSchema } from '@/lib/validation';
import { checkRouteRateLimit, getClientIdentifier } from '@/lib/route-rate-limit';

const logger = createLogger('API_PLAKA_KAYIT');
export const dynamic = 'force-dynamic';

const STRAPI_API = process.env.STRAPI_API_URL || 'https://api.tamirhanem.com/api';
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

// Rate limit: 5 requests per day per IP (very strict)
const PLAKA_KAYIT_RATE_LIMIT = 5;
const PLAKA_KAYIT_RATE_WINDOW = 24 * 60 * 60 * 1000; // 24 hours

// POST: Register plaka
export async function POST(request: NextRequest) {
  // Rate limiting check
  const identifier = getClientIdentifier(request.headers, 'plaka-kayit');
  const rateLimit = await checkRouteRateLimit(identifier, PLAKA_KAYIT_RATE_LIMIT, PLAKA_KAYIT_RATE_WINDOW);
  
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Gunluk kayit limitine ulastiniz. Lutfen 24 saat bekleyin.',
        retryAfter: rateLimit.retryAfter 
      },
      { 
        status: 429,
        headers: {
          'Retry-After': String(rateLimit.retryAfter || 86400),
        }
      }
    );
  }

  try {
    const body = await request.json();

    // Validate input
    const validation = validateRequest(plakaKayitSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: formatValidationErrors(validation.errors) },
        { status: 400 }
      );
    }

    const data = validation.data;
    const plaka = data.plaka.replace(/\s/g, '').toUpperCase();

    // Check if plaka already exists
    const checkUrl = `${STRAPI_API}/arac-plakalar?filters[plaka][$eq]=${plaka}`;
    const checkResponse = await fetch(checkUrl);

    if (checkResponse.ok) {
      const checkJson = await checkResponse.json();
      if (checkJson.data?.length > 0) {
        return NextResponse.json(
          { success: false, error: 'Bu plaka zaten kayitli' },
          { status: 409 }
        );
      }
    }

    // Create in Strapi
    const strapiPayload = {
      data: {
        plaka: plaka,
        owner_phone: data.ownerPhone,
        owner_email: data.ownerEmail,
        brand: data.brand,
        model: data.model,
        year: data.year,
        is_active: true,
        kvkk_consent: true,
        kvkk_consent_date: new Date().toISOString(),
      },
    };

    const response = await fetch(`${STRAPI_API}/arac-plakalar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(STRAPI_TOKEN && { Authorization: `Bearer ${STRAPI_TOKEN}` }),
      },
      body: JSON.stringify(strapiPayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      logger.error({ status: response.status, error: errorText }, 'Strapi plaka create failed');
      return NextResponse.json(
        { success: false, error: 'Kayit olusturulamadi' },
        { status: 500 }
      );
    }

    logger.info({ plaka }, 'Plaka kaydedildi');

    return NextResponse.json({
      success: true,
      message: 'Plakaniz basariyla kaydedildi. Artik size mesaj gonderilebilir.',
    });
  } catch (error) {
    logger.error({ error }, 'Plaka kayit hatasi');
    return NextResponse.json(
      { success: false, error: 'Kayit olusturulamadi' },
      { status: 500 }
    );
  }
}

// DELETE: Unregister plaka
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const plaka = searchParams.get('plaka')?.replace(/\s/g, '').toUpperCase();
    const phone = searchParams.get('phone');

    if (!plaka || !phone) {
      return NextResponse.json(
        { success: false, error: 'Plaka ve telefon gerekli' },
        { status: 400 }
      );
    }

    // Find and verify ownership
    const checkUrl = `${STRAPI_API}/arac-plakalar?filters[plaka][$eq]=${plaka}&filters[owner_phone][$eq]=${phone}`;
    const checkResponse = await fetch(checkUrl, {
      headers: {
        ...(STRAPI_TOKEN && { Authorization: `Bearer ${STRAPI_TOKEN}` }),
      },
    });

    if (!checkResponse.ok) {
      throw new Error('Strapi check failed');
    }

    const checkJson = await checkResponse.json();
    const record = checkJson.data?.[0];

    if (!record) {
      return NextResponse.json(
        { success: false, error: 'Kayit bulunamadi veya yetkiniz yok' },
        { status: 404 }
      );
    }

    // Soft delete: set is_active to false
    const response = await fetch(`${STRAPI_API}/arac-plakalar/${record.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(STRAPI_TOKEN && { Authorization: `Bearer ${STRAPI_TOKEN}` }),
      },
      body: JSON.stringify({ data: { is_active: false } }),
    });

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: 'Silme basarisiz' },
        { status: 500 }
      );
    }

    logger.info({ plaka }, 'Plaka kaydi silindi');

    return NextResponse.json({
      success: true,
      message: 'Plaka kaydiniz silindi',
    });
  } catch (error) {
    logger.error({ error }, 'Plaka silme hatasi');
    return NextResponse.json(
      { success: false, error: 'Silme basarisiz' },
      { status: 500 }
    );
  }
}
