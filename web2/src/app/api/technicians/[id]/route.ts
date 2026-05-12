import { NextRequest, NextResponse } from 'next/server';
import { createLogger } from '@/lib/logger';

const logger = createLogger('TECHNICIANS:ID');

export const dynamic = 'force-dynamic';

const STRAPI = process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const jwt = request.headers.get('authorization')?.replace('Bearer ', '');

    if (!jwt) {
      return NextResponse.json(
        { success: false, error: 'Yetkilendirme gerekli' },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const url = `${STRAPI}/technicians/${id}`;

    logger.info({ technicianId: id, url }, 'Fetching technician detail from Strapi');

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    const result = await response.json();

    if (!response.ok) {
      logger.warn({ technicianId: id, status: response.status, error: result }, 'Strapi technician GET failed');
      return NextResponse.json(
        { success: false, error: result?.error?.message || 'Teknisyen bulunamadı' },
        { status: response.status }
      );
    }

    return NextResponse.json(result, { status: response.status });
  } catch (error: any) {
    logger.error({ error: error.message }, 'Technician GET failed');
    return NextResponse.json(
      { success: false, error: 'Teknisyen bilgileri yüklenirken hata oluştu' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const jwt = request.headers.get('authorization')?.replace('Bearer ', '');

    if (!jwt) {
      return NextResponse.json(
        { success: false, error: 'Yetkilendirme gerekli' },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const body = await request.json();

    logger.info({ technicianId: id }, 'Updating technician in Strapi');

    const response = await fetch(`${STRAPI}/technicians/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const result = await response.json();

    if (!response.ok) {
      logger.warn({ technicianId: id, status: response.status, error: result }, 'Strapi technician PUT failed');
      return NextResponse.json(
        { success: false, error: result?.error?.message || 'Teknisyen güncellenemedi' },
        { status: response.status }
      );
    }

    logger.info({ technicianId: id }, 'Technician updated successfully');

    return NextResponse.json(result, { status: response.status });
  } catch (error: any) {
    logger.error({ error: error.message }, 'Technician PUT failed');
    return NextResponse.json(
      { success: false, error: 'Teknisyen güncellenirken hata oluştu' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const jwt = request.headers.get('authorization')?.replace('Bearer ', '');

    if (!jwt) {
      return NextResponse.json(
        { success: false, error: 'Yetkilendirme gerekli' },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    logger.info({ technicianId: id }, 'Deleting technician in Strapi');

    const response = await fetch(`${STRAPI}/technicians/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const result = await response.json().catch(() => ({}));
      logger.warn({ technicianId: id, status: response.status, error: result }, 'Strapi technician DELETE failed');
      return NextResponse.json(
        { success: false, error: result?.error?.message || 'Teknisyen silinemedi' },
        { status: response.status }
      );
    }

    logger.info({ technicianId: id }, 'Technician deleted successfully');

    const result = await response.json().catch(() => ({}));
    return NextResponse.json(result, { status: response.status });
  } catch (error: any) {
    logger.error({ error: error.message }, 'Technician DELETE failed');
    return NextResponse.json(
      { success: false, error: 'Teknisyen silinirken hata oluştu' },
      { status: 500 }
    );
  }
}
