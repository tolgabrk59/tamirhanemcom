import { NextRequest, NextResponse } from 'next/server';
import { createLogger } from '@/lib/logger';
import { sendSMS } from '@/lib/netgsm';

const logger = createLogger('AUTH:AUTO-REGISTER');

const STRAPI_API = process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api';
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

// Rastgele kullanici adi olustur (telefon bazli)
function generateUsername(phone: string): string {
  const last4 = phone.slice(-4);
  const random = Math.random().toString(36).substring(2, 6);
  return 'user_' + last4 + random;
}

// Rastgele sifre olustur (8 karakter)
function generatePassword(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let password = '';
  for (let i = 0; i < 8; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, name, city, district, brand, model, plate } = body;

    if (!phone) {
      return NextResponse.json(
        { success: false, error: 'Telefon numarasi gerekli' },
        { status: 400 }
      );
    }

    const cleanPhone = phone.replace(/[\s\-\+]/g, '').replace(/^90/, '');
    
    // Kullanici adi ve sifre olustur
    const username = generateUsername(cleanPhone);
    const password = generatePassword();
    const email = cleanPhone + '@tamirhanem.auto';

    // Strapi'ye kaydet
    const strapiData = {
      data: {
        phone: '+90' + cleanPhone,
        username: username,
        email: email,
        password: password,
        name: name || null,
        brand: brand || null,
        model: model || null,
        plate: plate || null,
        city: city || null,
        district: district || null,
        phone_verified: true,
        status: 'active',
        auto_registered: true
      }
    };

    const response = await fetch(STRAPI_API + '/users-customers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(STRAPI_TOKEN && { Authorization: 'Bearer ' + STRAPI_TOKEN }),
      },
      body: JSON.stringify(strapiData),
    });

    let userId = null;
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      logger.warn({ error: errorData, phone: cleanPhone }, 'Strapi registration failed - user may exist');
      // Kullanici zaten varsa devam et
    } else {
      const result = await response.json();
      userId = result.data?.id;
      logger.info({ userId, phone: cleanPhone }, 'User auto-registered');
    }

    // Kullaniciya SMS gonder
    const smsMessage = 'TamirHanem hesabiniz olusturuldu. Kullanici: ' + username + ' Sifre: ' + password + ' tamirhanem.com';
    
    try {
      await sendSMS(cleanPhone, smsMessage);
      logger.info({ phone: cleanPhone }, 'Credentials SMS sent');
    } catch (smsError: any) {
      logger.error({ error: smsError.message }, 'Failed to send credentials SMS');
    }

    return NextResponse.json({
      success: true,
      message: 'Hesabiniz olusturuldu, bilgileriniz SMS ile gonderildi',
      userId,
      username
    });

  } catch (error: any) {
    logger.error({ error: error.message }, 'Auto-registration failed');
    return NextResponse.json(
      { success: false, error: 'Kayit islemi basarisiz' },
      { status: 500 }
    );
  }
}
