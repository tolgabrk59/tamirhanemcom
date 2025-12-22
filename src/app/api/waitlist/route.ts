import { NextRequest, NextResponse } from 'next/server';
import { waitlistSchema, validateRequest, formatValidationErrors } from '@/lib/validation';
import { successResponse, errors, logError } from '@/lib/api-response';

const STRAPI_API = process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api';
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input with Zod
    const validation = validateRequest(waitlistSchema, body);

    if (!validation.success) {
      return errors.validation(formatValidationErrors(validation.errors));
    }

    const { email, phone, name } = validation.data;

    // Normalize email for consistent checks
    const normalizedEmail = email?.toLowerCase().trim();

    if (!normalizedEmail) {
      return errors.badRequest('E-posta adresi gereklidir');
    }

    // Check if already registered
    const checkResponse = await fetch(
      `${STRAPI_API}/waitinglists?filters[email][$eq]=${encodeURIComponent(normalizedEmail)}`,
      {
        headers: {
          'Content-Type': 'application/json',
          ...(STRAPI_TOKEN && { Authorization: `Bearer ${STRAPI_TOKEN}` }),
        },
        cache: 'no-store',
      }
    );

    if (checkResponse.ok) {
      const checkData = await checkResponse.json();
      if (checkData.data && checkData.data.length > 0) {
        return successResponse({
          message: 'Bu e-posta adresi zaten kayıtlı',
          alreadyRegistered: true,
        });
      }
    }

    // Normalize phone if provided
    let normalizedPhone = phone?.replace(/[\s\-\(\)]/g, '') || null;
    if (normalizedPhone) {
      if (normalizedPhone.startsWith('0')) {
        normalizedPhone = '+90' + normalizedPhone.slice(1);
      } else if (!normalizedPhone.startsWith('+90')) {
        normalizedPhone = '+90' + normalizedPhone;
      }
    }

    // Create new registration
    const createResponse = await fetch(`${STRAPI_API}/waitinglists`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(STRAPI_TOKEN && { Authorization: `Bearer ${STRAPI_TOKEN}` }),
      },
      body: JSON.stringify({
        data: {
          email: normalizedEmail,
          phone: normalizedPhone,
          name: name?.trim() || null,
        },
      }),
    });

    if (!createResponse.ok) {
      const errorText = await createResponse.text();
      logError('Strapi waitlist create', new Error(errorText));

      // Log for manual processing
      console.log('Waitlist kayıt (fallback):', { email: normalizedEmail, phone: normalizedPhone, name });

      // Don't expose error to user
      return successResponse({
        message: 'Bekleme listesine başarıyla eklendiniz',
      });
    }

    return successResponse({
      message: 'Bekleme listesine başarıyla eklendiniz',
    });
  } catch (error) {
    logError('Waitlist API', error);
    return errors.internal('Kayıt oluşturulamadı');
  }
}
