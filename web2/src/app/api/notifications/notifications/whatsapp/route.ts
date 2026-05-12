import { NextRequest, NextResponse } from 'next/server';
import { sendTelegramNotification } from '@/lib/telegram';
import { createLogger } from '@/lib/logger';

const logger = createLogger('API:NOTIFICATION');

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      name, phone, city, district, brand, model, year,
      category, notes, service,
      isRegistered, username, email, plate,
      appointmentDate, appointmentTime
    } = body;

    if (!phone || !city || !brand || !model) {
      return NextResponse.json(
        { success: false, error: 'Eksik bilgi' },
        { status: 400 }
      );
    }

    const result = await sendTelegramNotification({
      name: name || 'Belirtilmedi',
      phone,
      city,
      district,
      brand,
      model,
      year,
      category,
      notes,
      service,
      isRegistered: isRegistered || false,
      username,
      email,
      plate,
      appointmentDate,
      appointmentTime
    });

    if (result.success) {
      logger.info({ phone, isRegistered }, 'Telegram notification sent');
      return NextResponse.json({ success: true });
    } else {
      logger.warn({ phone, error: result.error }, 'Telegram notification failed');
      return NextResponse.json({ success: true });
    }
  } catch (error: any) {
    logger.error({ error: error.message }, 'Notification API error');
    return NextResponse.json({ success: true });
  }
}
