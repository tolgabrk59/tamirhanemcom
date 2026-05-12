import { NextRequest, NextResponse } from 'next/server';
import { createLogger } from '@/lib/logger';

const logger = createLogger('VEHICLES:ID');

const STRAPI = process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const jwt = request.headers.get('authorization')?.replace('Bearer ', '');

    if (!jwt) {
      return NextResponse.json(
        { success: false, error: 'Yetkilendirme gerekli' },
        { status: 401 }
      );
    }

    const { id } = await params;

    logger.info({ id }, 'Fetching vehicle from Strapi');

    const response = await fetch(`${STRAPI}/vehicles/${id}?populate=vehicleImage`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      logger.warn({ id, status: response.status, error: result }, 'Strapi vehicle GET failed');
      return NextResponse.json(
        { success: false, error: result?.error?.message || 'Araç bulunamadı' },
        { status: response.status }
      );
    }

    logger.info({ id }, 'Vehicle fetched successfully');
    return NextResponse.json(result);
  } catch (error: any) {
    logger.error({ error: error.message }, 'Vehicle GET failed');
    return NextResponse.json(
      { success: false, error: 'Araç getirilirken hata oluştu' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const jwt = request.headers.get('authorization')?.replace('Bearer ', '');

    if (!jwt) {
      return NextResponse.json(
        { success: false, error: 'Yetkilendirme gerekli' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    logger.info({ id }, 'Updating vehicle in Strapi');

    const response = await fetch(`${STRAPI}/vehicles/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({ data: body }),
    });

    const result = await response.json();

    if (!response.ok) {
      logger.warn({ id, status: response.status, error: result }, 'Strapi vehicle PUT failed');
      return NextResponse.json(
        { success: false, error: result?.error?.message || 'Araç güncellenemedi' },
        { status: response.status }
      );
    }

    logger.info({ id }, 'Vehicle updated successfully');
    return NextResponse.json(result);
  } catch (error: any) {
    logger.error({ error: error.message }, 'Vehicle PUT failed');
    return NextResponse.json(
      { success: false, error: 'Araç güncellenirken hata oluştu' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const jwt = request.headers.get('authorization')?.replace('Bearer ', '');

    if (!jwt) {
      return NextResponse.json(
        { success: false, error: 'Yetkilendirme gerekli' },
        { status: 401 }
      );
    }

    const { id } = await params;

    logger.info({ id }, 'Deleting vehicle from Strapi');

    const response = await fetch(`${STRAPI}/vehicles/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    if (!response.ok) {
      const result = await response.json().catch(() => ({}));
      logger.warn({ id, status: response.status, error: result }, 'Strapi vehicle DELETE failed');
      return NextResponse.json(
        { success: false, error: result?.error?.message || 'Araç silinemedi' },
        { status: response.status }
      );
    }

    logger.info({ id }, 'Vehicle deleted successfully');

    // Strapi DELETE returns 200 with deleted data or 204 with no content
    if (response.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    const result = await response.json().catch(() => ({}));
    return NextResponse.json(result);
  } catch (error: any) {
    logger.error({ error: error.message }, 'Vehicle DELETE failed');
    return NextResponse.json(
      { success: false, error: 'Araç silinirken hata oluştu' },
      { status: 500 }
    );
  }
}
