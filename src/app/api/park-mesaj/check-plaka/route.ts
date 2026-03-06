import { NextRequest, NextResponse } from 'next/server';
import { createLogger } from '@/lib/logger';
import { plakaSchema } from '@/lib/validation';

const logger = createLogger('API_CHECK_PLAKA');
export const dynamic = 'force-dynamic';

const STRAPI_API = process.env.STRAPI_API_URL || 'https://api.tamirhanem.com/api';

// GET: Check if plaka is registered (returns only status, NOT owner info)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const plakaRaw = searchParams.get('plaka');

    if (!plakaRaw) {
      return NextResponse.json(
        { success: false, error: 'Plaka gerekli' },
        { status: 400 }
      );
    }

    // Validate plaka format
    const result = plakaSchema.safeParse(plakaRaw);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: 'Geçersiz plaka formatı' },
        { status: 400 }
      );
    }

    const plaka = result.data.replace(/\s/g, '').toUpperCase();

    // Check in Strapi
    const url = `${STRAPI_API}/arac-plakalar?filters[plaka][$eq]=${plaka}&filters[is_active][$eq]=true`;

    const response = await fetch(url, {
      next: { revalidate: 30 },
    });

    if (!response.ok) {
      throw new Error('Strapi fetch failed');
    }

    const json = await response.json();
    const found = (json.data || []).length > 0;

    // IMPORTANT: Never return owner info for privacy
    return NextResponse.json({
      success: true,
      registered: found,
      message: found
        ? 'Bu plaka kayıtlı. Mesaj gönderebilirsiniz.'
        : 'Bu plaka sistemde kayıtlı değil.',
    });
  } catch (error) {
    logger.error({ error }, 'Plaka kontrol hatası');
    return NextResponse.json(
      { success: false, error: 'Sorgulama başarısız' },
      { status: 500 }
    );
  }
}
