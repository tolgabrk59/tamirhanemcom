import { NextResponse } from 'next/server';
import { randevuSchema, validateRequest, formatValidationErrors } from '@/lib/validation';
import { successResponse, errors, logError } from '@/lib/api-response';

const STRAPI_API = process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api';
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate input with Zod
    const validation = validateRequest(randevuSchema, body);

    if (!validation.success) {
      return errors.validation(formatValidationErrors(validation.errors));
    }

    const data = validation.data;

    // Normalize phone to +90 format
    let normalizedPhone = data.phone.replace(/[\s\-\(\)]/g, '');
    if (normalizedPhone.startsWith('0')) {
      normalizedPhone = '+90' + normalizedPhone.slice(1);
    } else if (!normalizedPhone.startsWith('+90')) {
      normalizedPhone = '+90' + normalizedPhone;
    }

    // Prepare data for Strapi
    const strapiData = {
      data: {
        phone: normalizedPhone,
        name: data.name || null,
        city: data.city,
        brand: data.brand,
        model: data.model,
        year: data.year ? String(data.year) : null,
        category: data.category,
        notes: data.notes || null,
        status: 'pending',
      },
    };

    // Send to Strapi
    const response = await fetch(`${STRAPI_API}/randevu-talepleri`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(STRAPI_TOKEN && { Authorization: `Bearer ${STRAPI_TOKEN}` }),
      },
      body: JSON.stringify(strapiData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      logError('Strapi randevu-talebi', new Error(errorText));

      // Log for manual processing but don't expose error to user
      console.log('Randevu talebi (fallback):', JSON.stringify(strapiData));

      return successResponse({
        id: Date.now(),
        message: 'Randevu talebiniz alındı. En kısa sürede sizinle iletişime geçeceğiz.',
      });
    }

    const result = await response.json();

    return successResponse({
      id: result.data?.id,
      message: 'Randevu talebiniz alındı. En kısa sürede sizinle iletişime geçeceğiz.',
    });
  } catch (error) {
    logError('Randevu talebi API', error);
    return errors.internal('Randevu talebi oluşturulamadı');
  }
}
