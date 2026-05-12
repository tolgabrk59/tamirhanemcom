import { NextRequest, NextResponse } from 'next/server';
import { createLogger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

const logger = createLogger('AUTH:AUTO-REGISTER');

const STRAPI_API = process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api';

function generateUsername(phone: string): string {
  const last4 = phone.slice(-4);
  const random = Math.random().toString(36).substring(2, 6);
  return 'user_' + last4 + random;
}

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
        { success: false, error: 'Telefon numarası gerekli' },
        { status: 400 }
      );
    }

    const cleanPhone = phone.replace(/[\s\-\+]/g, '').replace(/^90/, '');

    const username = generateUsername(cleanPhone);
    const password = generatePassword();
    const email = cleanPhone + '@tamirhanem.auto';

    // Adım 1: Mobil ile aynı — /api/auth/local/register
    const registerResponse = await fetch(STRAPI_API + '/auth/local/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });

    let jwt: string | null = null;
    let userId: number | null = null;

    if (registerResponse.ok) {
      const data = await registerResponse.json();
      jwt = data.jwt;
      userId = data.user?.id;
      logger.info({ userId, phone: cleanPhone }, 'User auto-registered');
    } else {
      const err = await registerResponse.json().catch(() => ({}));
      logger.warn({ error: err, phone: cleanPhone }, 'Auto-register failed — user may exist');
    }

    // Adım 2: Profil güncelle (jwt varsa)
    if (jwt && userId) {
      const updatePayload: Record<string, any> = {
        phone: '+90' + cleanPhone,
        phone_verified: true,
        auto_registered: true,
      };
      if (name) updatePayload.name = name;
      if (brand) updatePayload.brand = brand;
      if (model) updatePayload.model = model;
      if (plate) updatePayload.plate = plate;
      if (city) updatePayload.city = city;
      if (district) updatePayload.district = district;

      try {
        await fetch(STRAPI_API + `/users/${userId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwt}`,
          },
          body: JSON.stringify(updatePayload),
        });
      } catch (e: any) {
        logger.warn({ error: e.message }, 'Profile update failed (non-critical)');
      }

      // Adım 3: Strapi OTP servisi üzerinden hoş geldin SMS'i gönder
      try {
        const welcomeMsg = `TamirHanem hesabiniz olusturuldu. Kullanici: ${username} Sifre: ${password} tamirhanem.com`;
        await fetch(STRAPI_API + '/otp/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: cleanPhone, message: welcomeMsg }),
        });
      } catch (smsErr: any) {
        logger.warn({ error: smsErr.message }, 'Welcome SMS failed (non-critical)');
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Hesabınız oluşturuldu, bilgileriniz SMS ile gönderildi',
      userId,
      username,
    });
  } catch (error: any) {
    logger.error({ error: error.message }, 'Auto-registration failed');
    return NextResponse.json(
      { success: false, error: 'Kayıt işlemi başarısız' },
      { status: 500 }
    );
  }
}
