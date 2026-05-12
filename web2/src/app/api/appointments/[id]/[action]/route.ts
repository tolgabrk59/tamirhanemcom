import { NextRequest, NextResponse } from 'next/server';
import { createLogger } from '@/lib/logger';

const logger = createLogger('APPOINTMENTS:ACTION');

const STRAPI = process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api';

const VALID_ACTIONS = new Set([
  'accept',
  'cancel',
  'offer',
  'accept-offer',
  'reject-offer',
  'matchDate',
  'confirm-completion',
  'vehicle-received',
  'vehicle-delivered',
  'send-reminder',
  'report-delay',
  'confirm-attendance',
  'update-progress',
  'customer-report-progress',
  'no-show',
  'customer-no-show',
  'service-cancel',
  'claim-from-pool',
  'reject',
  'check-location-completion',
]);

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string; action: string } }
) {
  try {
    const jwt = request.headers.get('authorization')?.replace('Bearer ', '');

    if (!jwt) {
      return NextResponse.json(
        { success: false, error: 'Yetkilendirme token\'ı gerekli' },
        { status: 401 }
      );
    }

    const { id, action } = params;

    if (!VALID_ACTIONS.has(action)) {
      logger.warn({ id, action }, 'Geçersiz randevu aksiyonu');
      return NextResponse.json(
        { success: false, error: `Geçersiz aksiyon: "${action}"` },
        { status: 400 }
      );
    }

    const body = await request.json().catch(() => ({}));

    logger.info({ id, action }, 'Randevu aksiyonu uygulanıyor');

    const response = await fetch(`${STRAPI}/appointments/${id}/${action}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const result = await response.json();

    if (!response.ok) {
      logger.error({ id, action, status: response.status, error: result }, 'Strapi randevu aksiyon hatası');
      return NextResponse.json(
        { success: false, error: result?.error?.message || `"${action}" aksiyonu uygulanamadı` },
        { status: response.status }
      );
    }

    logger.info({ id, action }, 'Randevu aksiyonu başarılı');

    return NextResponse.json(result, { status: response.status });
  } catch (error: any) {
    logger.error({ error: error.message }, 'Randevu aksiyon hatası');
    return NextResponse.json(
      { success: false, error: 'Randevu aksiyonu uygulanırken hata oluştu' },
      { status: 500 }
    );
  }
}
