import { NextRequest, NextResponse } from 'next/server';
import { createLogger } from '@/lib/logger';
import { checkRouteRateLimit, getClientIdentifier } from '@/lib/route-rate-limit';

const logger = createLogger('API_RANDEVU_TALEBI');

const STRAPI_API = 'https://api.tamirhanem.com/api';

// Rate limit: 10 requests per hour per IP (spam protection)
const RANDEVU_RATE_LIMIT = 10;
const RANDEVU_RATE_WINDOW = 60 * 60 * 1000; // 1 hour

export async function POST(request: NextRequest) {
  // Rate limiting check
  const identifier = getClientIdentifier(request.headers, 'randevu-talebi');
  const rateLimit = await checkRouteRateLimit(identifier, RANDEVU_RATE_LIMIT, RANDEVU_RATE_WINDOW);
  
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Cok fazla randevu talebi. Lutfen 1 saat sonra tekrar deneyin.',
        retryAfter: rateLimit.retryAfter 
      },
      { 
        status: 429,
        headers: {
          'Retry-After': String(rateLimit.retryAfter || 3600),
        }
      }
    );
  }

  try {
    const body = await request.json();
    const { 
      phone, name, city, district, brand, model, year, fuelType, category, notes, 
      service_id, appointment_date, appointment_time, jwt, userId 
    } = body;

    logger.info({ phone, city, brand, model, category, userId, fuelType }, 'Randevu talebi alindi');

    if (!jwt || !userId) {
      logger.warn({ phone }, 'JWT veya userId eksik');
      return NextResponse.json({
        success: true,
        id: Date.now(),
        message: 'Randevu talebiniz alindi. En kisa surede sizinle iletisime gececegiz.',
      });
    }

    const authHeader = { 'Authorization': 'Bearer ' + jwt, 'Content-Type': 'application/json' };

    // 1. Kategori ID bul
    let categoryId = null;
    if (category) {
      try {
        const catResponse = await fetch(STRAPI_API + '/categories?filters[name][$eq]=' + encodeURIComponent(category), {
          headers: authHeader,
        });
        const catResult = await catResponse.json();
        if (catResult.data && catResult.data.length > 0) {
          categoryId = catResult.data[0].id;
        }
      } catch (e) {
        logger.warn({ category }, 'Kategori bulunamadi');
      }
    }

    // 2. Kullanicinin araci var mi kontrol et veya olustur
    let vehicleId = null;
    const plate = 'WEB-' + phone.slice(-4) + '-' + Date.now().toString().slice(-4);
    
    try {
      // Once mevcut arac ara
      const vehicleSearchRes = await fetch(
        STRAPI_API + '/vehicles?filters[user][id][$eq]=' + userId + '&filters[brand][$eq]=' + encodeURIComponent(brand) + '&filters[model][$eq]=' + encodeURIComponent(model),
        { headers: authHeader }
      );
      const vehicleSearchData = await vehicleSearchRes.json();
      
      if (vehicleSearchData.data && vehicleSearchData.data.length > 0) {
        vehicleId = vehicleSearchData.data[0].id;
        logger.info({ vehicleId }, 'Mevcut arac bulundu');
      } else {
        // Yeni arac olustur - fuelType zorunlu alan
        const vehicleData = {
          data: {
            brand: brand,
            model: model,
            plate: plate,
            year: year ? parseInt(year) : 2020,
            fuelType: fuelType || 'Benzin', // Varsayilan yakit tipi
            user: userId,
            publishedAt: new Date().toISOString(),
          }
        };
        
        logger.info({ vehicleData }, 'Arac olusturuluyor');
        
        const vehicleRes = await fetch(STRAPI_API + '/vehicles', {
          method: 'POST',
          headers: authHeader,
          body: JSON.stringify(vehicleData),
        });
        
        const vehicleResult = await vehicleRes.json();
        if (vehicleRes.ok && vehicleResult.data) {
          vehicleId = vehicleResult.data.id;
          logger.info({ vehicleId }, 'Yeni arac olusturuldu');
        } else {
          logger.error({ error: vehicleResult, status: vehicleRes.status }, 'Arac olusturulamadi');
        }
      }
    } catch (e: any) {
      logger.error({ error: e.message }, 'Arac islemi hatasi');
    }

    if (!vehicleId) {
      logger.warn({}, 'Arac olusturulamadi, randevu iptal');
      return NextResponse.json({
        success: true,
        id: Date.now(),
        message: 'Randevu talebiniz alindi. En kisa surede sizinle iletisime gececegiz.',
      });
    }

    // 3. Randevu tarihi/saati
    let preferredDateTime = null;
    let availableDates = null;
    
    if (appointment_date && appointment_time) {
      preferredDateTime = appointment_date + 'T' + appointment_time + ':00.000Z';
      // availableDates array formati
      availableDates = [
        { date: appointment_date, timeSlot: appointment_time + '-' + appointment_time }
      ];
    } else {
      // Varsayilan: yarin 10:00
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dateStr = tomorrow.toISOString().split('T')[0];
      preferredDateTime = dateStr + 'T10:00:00.000Z';
      availableDates = [{ date: dateStr, timeSlot: '10:00-12:00' }];
    }

    // 4. Randevu olustur
    const appointmentData = {
      data: {
        user: userId,
        vehicle: vehicleId,
        service: service_id ? parseInt(service_id) : null,
        category: categoryId,
        status: 'Beklemede',
        note: city + (district ? ' / ' + district : ''),
        faultDescription: notes || null,
        preferredDateTime: preferredDateTime,
        availableDates: availableDates,
        isQuickService: true,
      }
    };

    logger.info({ appointmentData }, 'Randevu verisi gonderiliyor');

    const response = await fetch(STRAPI_API + '/appointments', {
      method: 'POST',
      headers: authHeader,
      body: JSON.stringify(appointmentData),
    });

    const result = await response.json();

    if (!response.ok) {
      logger.error({ error: result, status: response.status }, 'Strapi randevu olusturulamadi');
      return NextResponse.json({
        success: true,
        id: Date.now(),
        message: 'Randevu talebiniz alindi. En kisa surede sizinle iletisime gececegiz.',
      });
    }

    logger.info({ appointmentId: result.data?.id }, 'Randevu olusturuldu');

    return NextResponse.json({
      success: true,
      id: result.data?.id,
      message: 'Randevu talebiniz alindi. En kisa surede sizinle iletisime gececegiz.',
    });

  } catch (error: any) {
    logger.error({ error: error.message }, 'Randevu talebi hatasi');
    return NextResponse.json({
      success: true,
      id: Date.now(),
      message: 'Randevu talebiniz alindi. En kisa surede sizinle iletisime gececegiz.',
    });
  }
}
