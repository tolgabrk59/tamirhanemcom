import { NextRequest, NextResponse } from 'next/server';
import { createLogger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

const logger = createLogger('OTP:VERIFY');

const STRAPI_API = process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api';

// Mobil uygulama ile aynı: POST /api/otp/verify → Strapi /otp/verify
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, otp, code } = body;

    const otpCode = otp || code;

    if (!phone) {
      return NextResponse.json(
        { success: false, error: 'Telefon numarası gerekli' },
        { status: 400 }
      );
    }

    if (!otpCode) {
      return NextResponse.json(
        { success: false, error: 'Doğrulama kodu gerekli' },
        { status: 400 }
      );
    }

    const cleanPhone = phone.replace(/[\s\-\+]/g, '').replace(/^90/, '');

    if (!/^[5][0-9]{9}$/.test(cleanPhone)) {
      return NextResponse.json(
        { success: false, error: 'Geçersiz telefon numarası formatı' },
        { status: 400 }
      );
    }

    if (!/^[0-9]{6}$/.test(otpCode)) {
      return NextResponse.json(
        { success: false, error: 'Doğrulama kodu 6 haneli olmalı' },
        { status: 400 }
      );
    }

    logger.info({ phone: cleanPhone }, 'OTP verify request via Strapi');

    const response = await fetch(STRAPI_API + '/otp/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: cleanPhone, code: otpCode }),
    });

    const result = await response.json();

    if (!response.ok || result.success === false) {
      logger.warn({ phone: cleanPhone, error: result }, 'OTP verification failed');
      return NextResponse.json(
        {
          success: false,
          error: result.message || 'Doğrulama kodu hatalı',
          remainingAttempts: result.remainingAttempts,
        },
        { status: response.status || 400 }
      );
    }

    logger.info({ phone: cleanPhone }, 'OTP verified successfully');

    return NextResponse.json({
      success: true,
      phone: cleanPhone,
      message: result.message || 'Telefon numaranız başarıyla doğrulandı',
    });
  } catch (error: any) {
    logger.error({ error: error.message }, 'OTP verify failed');
    return NextResponse.json(
      { success: false, error: 'Doğrulama işlemi başarısız. Lütfen tekrar deneyin.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ success: false, error: 'Method not allowed' }, { status: 405 });
}
