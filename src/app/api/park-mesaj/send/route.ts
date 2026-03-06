import { NextRequest, NextResponse } from 'next/server';
import { createLogger } from '@/lib/logger';
import { validateRequest, formatValidationErrors, parkMesajSchema } from '@/lib/validation';
import { checkRouteRateLimit, getClientIdentifier } from '@/lib/route-rate-limit';

const logger = createLogger('API_PARK_MESAJ_SEND');
export const dynamic = 'force-dynamic';

const STRAPI_API = process.env.STRAPI_API_URL || 'https://api.tamirhanem.com/api';
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

// Rate limit: 5 messages per hour per IP (SMS spam protection)
const PARK_MESAJ_RATE_LIMIT = 5;
const PARK_MESAJ_RATE_WINDOW = 60 * 60 * 1000; // 1 hour

// POST: Send park message
export async function POST(request: NextRequest) {
  try {
    // Rate limiting check (Redis-based)
    const identifier = getClientIdentifier(request.headers, 'park-mesaj');
    const rateLimit = await checkRouteRateLimit(identifier, PARK_MESAJ_RATE_LIMIT, PARK_MESAJ_RATE_WINDOW);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Cok fazla mesaj gonderdiniz. Lutfen 1 saat bekleyin.',
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

    const body = await request.json();

    // Validate input
    const validation = validateRequest(parkMesajSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: formatValidationErrors(validation.errors) },
        { status: 400 }
      );
    }

    const data = validation.data;
    const plaka = data.targetPlaka.replace(/\s/g, '').toUpperCase();

    // Check if plaka is registered
    const checkUrl = `${STRAPI_API}/arac-plakalar?filters[plaka][$eq]=${plaka}&filters[is_active][$eq]=true`;
    const checkResponse = await fetch(checkUrl);

    if (!checkResponse.ok) {
      throw new Error('Strapi check failed');
    }

    const checkJson = await checkResponse.json();
    const plakaRecord = checkJson.data?.[0];

    if (!plakaRecord) {
      return NextResponse.json(
        { success: false, error: 'Bu plaka sistemde kayitli degil' },
        { status: 404 }
      );
    }

    // Create message in Strapi
    const strapiPayload = {
      data: {
        target_plaka: plakaRecord.id,
        sender_phone: data.senderPhone,
        message_type: data.messageType,
        message: data.message,
        location_description: data.locationDescription,
        status: 'sent',
      },
    };

    const response = await fetch(`${STRAPI_API}/park-mesajlari`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(STRAPI_TOKEN && { Authorization: `Bearer ${STRAPI_TOKEN}` }),
      },
      body: JSON.stringify(strapiPayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      logger.error({ status: response.status, error: errorText }, 'Strapi message create failed');
      return NextResponse.json(
        { success: false, error: 'Mesaj gonderilemedi' },
        { status: 500 }
      );
    }

    // TODO: Send actual notification (SMS/Push) to owner
    // This would integrate with an SMS gateway like Netgsm, Iletimerkezi, etc.

    logger.info({ plaka, messageType: data.messageType }, 'Park mesaji gonderildi');

    return NextResponse.json({
      success: true,
      message: 'Mesajiniz arac sahibine iletildi',
    });
  } catch (error) {
    logger.error({ error }, 'Park mesaj gonderme hatasi');
    return NextResponse.json(
      { success: false, error: 'Mesaj gonderilemedi' },
      { status: 500 }
    );
  }
}
