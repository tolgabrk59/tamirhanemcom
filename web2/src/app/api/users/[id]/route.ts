import { NextRequest, NextResponse } from 'next/server';
import { createLogger } from '@/lib/logger';

const logger = createLogger('USERS:UPDATE');

const STRAPI = process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api';

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Yetkilendirme gerekli' },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const body = await request.json();

    logger.info({ userId: id }, 'Updating user profile via Strapi');

    const response = await fetch(STRAPI + `/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const result = await response.json();

    if (!response.ok) {
      const errorMsg = result?.error?.message || result?.message || 'Profil güncellenemedi';
      logger.warn({ userId: id, status: response.status, error: errorMsg }, 'Strapi user update failed');
      return NextResponse.json(
        { success: false, error: errorMsg },
        { status: response.status }
      );
    }

    logger.info({ userId: id }, 'User profile updated successfully');

    return NextResponse.json({ success: true, user: result });
  } catch (error: any) {
    logger.error({ error: error.message }, 'User update request failed');
    return NextResponse.json(
      { success: false, error: 'Profil güncellenirken hata oluştu. Lütfen tekrar deneyin.' },
      { status: 500 }
    );
  }
}
