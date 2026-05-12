import { NextRequest, NextResponse } from 'next/server';
import { createLogger } from '@/lib/logger';

const logger = createLogger('USERS:DELETE-ACCOUNT');

const STRAPI = process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api';

export async function DELETE(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Yetkilendirme gerekli' },
        { status: 401 }
      );
    }

    logger.info('Account deletion request via Strapi');

    const response = await fetch(STRAPI + '/users/delete-account', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      const errorMsg = result?.error?.message || result?.message || 'Hesap silinemedi';
      logger.warn({ status: response.status, error: errorMsg }, 'Strapi delete-account failed');
      return NextResponse.json(
        { success: false, error: errorMsg },
        { status: response.status }
      );
    }

    logger.info('Account deleted successfully');

    return NextResponse.json({
      success: true,
      message: result.message || 'Hesabınız başarıyla silindi',
    });
  } catch (error: any) {
    logger.error({ error: error.message }, 'Delete account request failed');
    return NextResponse.json(
      { success: false, error: 'Hesap silinirken hata oluştu. Lütfen tekrar deneyin.' },
      { status: 500 }
    );
  }
}
