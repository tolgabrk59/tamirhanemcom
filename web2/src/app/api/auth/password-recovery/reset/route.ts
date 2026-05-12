import { NextRequest, NextResponse } from 'next/server';
import { createLogger } from '@/lib/logger';

const logger = createLogger('AUTH:PASSWORD-RECOVERY:RESET');

const STRAPI = process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, code, newPassword } = body;

    if (!phone || !code || !newPassword) {
      return NextResponse.json(
        { success: false, error: 'Telefon numarası, doğrulama kodu ve yeni şifre gerekli' },
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

    if (!/^[0-9]{6}$/.test(code)) {
      return NextResponse.json(
        { success: false, error: 'Doğrulama kodu 6 haneli olmalı' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Şifre en az 6 karakter olmalı' },
        { status: 400 }
      );
    }

    logger.info({ phone: cleanPhone }, 'Password recovery reset request');

    const response = await fetch(STRAPI + '/password-recovery/reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: cleanPhone, code, newPassword }),
    });

    const result = await response.json();

    if (!response.ok || result.success === false) {
      const errorMsg = result?.error?.message || result?.message || 'Şifre sıfırlanamadı';
      logger.warn({ phone: cleanPhone, error: errorMsg }, 'Password recovery reset failed');
      return NextResponse.json(
        { success: false, error: errorMsg },
        { status: response.status || 400 }
      );
    }

    logger.info({ phone: cleanPhone }, 'Password reset successfully');

    return NextResponse.json({
      success: true,
      message: result.message || 'Şifreniz başarıyla sıfırlandı',
    });
  } catch (error: any) {
    logger.error({ error: error.message }, 'Password recovery reset failed');
    return NextResponse.json(
      { success: false, error: 'Şifre sıfırlanırken hata oluştu. Lütfen tekrar deneyin.' },
      { status: 500 }
    );
  }
}
