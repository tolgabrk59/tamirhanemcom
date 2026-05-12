import { NextRequest, NextResponse } from 'next/server';
import { createLogger } from '@/lib/logger';

const logger = createLogger('AUTH:PASSWORD-RECOVERY:SEND-OTP');

const STRAPI = process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone } = body;

    if (!phone) {
      return NextResponse.json(
        { success: false, error: 'Telefon numarası gerekli' },
        { status: 400 }
      );
    }

    const cleanPhone = phone.replace(/[\s\-\+]/g, '').replace(/^90/, '');

    if (!/^[5][0-9]{9}$/.test(cleanPhone)) {
      return NextResponse.json(
        { success: false, error: 'Geçersiz telefon numarası formatı (5XXXXXXXXX)' },
        { status: 400 }
      );
    }

    logger.info({ phone: cleanPhone }, 'Password recovery OTP send request');

    const response = await fetch(STRAPI + '/password-recovery/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: cleanPhone }),
    });

    const result = await response.json();

    if (!response.ok || result.success === false) {
      const errorMsg = result?.error?.message || result?.message || 'SMS gönderilemedi';
      logger.warn({ phone: cleanPhone, error: errorMsg }, 'Password recovery OTP send failed');
      return NextResponse.json(
        { success: false, error: errorMsg },
        { status: response.status || 400 }
      );
    }

    logger.info({ phone: cleanPhone }, 'Password recovery OTP sent successfully');

    return NextResponse.json({
      success: true,
      message: result.message || 'Doğrulama kodu SMS ile gönderildi',
      expiresIn: result.expiresIn || 180,
    });
  } catch (error: any) {
    logger.error({ error: error.message }, 'Password recovery send-otp failed');
    return NextResponse.json(
      { success: false, error: 'SMS gönderilirken hata oluştu. Lütfen tekrar deneyin.' },
      { status: 500 }
    );
  }
}
