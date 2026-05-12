import { NextRequest, NextResponse } from 'next/server';
import { createLogger } from '@/lib/logger';

const logger = createLogger('VEHICLES');

const STRAPI = process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api';

export async function GET(request: NextRequest) {
  try {
    const jwt = request.headers.get('authorization')?.replace('Bearer ', '');

    if (!jwt) {
      return NextResponse.json(
        { success: false, error: 'Yetkilendirme gerekli' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    const url = `${STRAPI}/vehicles?populate=vehicleImage${queryString ? `&${queryString}` : ''}`;

    logger.info({ url }, 'Fetching vehicles from Strapi');

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      logger.warn({ status: response.status, error: result }, 'Strapi vehicles GET failed');
      return NextResponse.json(
        { success: false, error: result?.error?.message || 'Araçlar getirilemedi' },
        { status: response.status }
      );
    }

    logger.info('Vehicles fetched successfully');
    return NextResponse.json(result);
  } catch (error: any) {
    logger.error({ error: error.message }, 'Vehicles GET failed');
    return NextResponse.json(
      { success: false, error: 'Araçlar getirilirken hata oluştu' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const jwt = request.headers.get('authorization')?.replace('Bearer ', '');

    if (!jwt) {
      return NextResponse.json(
        { success: false, error: 'Yetkilendirme gerekli' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { brand, model, plate, year, fuelType, mileage, user } = body;

    if (!plate) {
      return NextResponse.json(
        { success: false, error: 'Plaka gerekli' },
        { status: 400 }
      );
    }

    if (year !== undefined && (typeof year !== 'number' || isNaN(year))) {
      return NextResponse.json(
        { success: false, error: 'Yıl sayısal bir değer olmalı' },
        { status: 400 }
      );
    }

    const payload = {
      data: {
        brand,
        model,
        plate,
        year,
        fuelType,
        mileage,
        user,
        publishedAt: new Date(),
      },
    };

    logger.info({ plate }, 'Creating vehicle in Strapi');

    const response = await fetch(`${STRAPI}/vehicles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      logger.warn({ plate, status: response.status, error: result }, 'Strapi vehicle POST failed');
      return NextResponse.json(
        { success: false, error: result?.error?.message || 'Araç oluşturulamadı' },
        { status: response.status }
      );
    }

    logger.info({ plate }, 'Vehicle created successfully');
    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    logger.error({ error: error.message }, 'Vehicle POST failed');
    return NextResponse.json(
      { success: false, error: 'Araç oluşturulurken hata oluştu' },
      { status: 500 }
    );
  }
}
