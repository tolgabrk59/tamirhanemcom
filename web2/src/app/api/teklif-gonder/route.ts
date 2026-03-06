import { NextRequest, NextResponse } from 'next/server'

const STRAPI_API = (process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api').trim()

// POST /api/teklif-gonder
// Body: { jwt, vehicleId, city, district, scope, categoryIds, minPrice, maxPrice, notes, serviceId }
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      jwt,
      vehicleId,
      city,
      district,
      scope,          // 'single' | 'all'
      categoryIds,    // number[] (optional)
      minPrice,       // number (optional)
      maxPrice,       // number (optional)
      notes,          // string (optional)
      serviceId,      // number (optional, bağlı servis)
    } = body

    if (!jwt || !vehicleId || !city) {
      return NextResponse.json({ success: false, error: 'jwt, vehicleId ve city gerekli' }, { status: 400 })
    }

    // JWT doğrula
    const meRes = await fetch(`${STRAPI_API}/users/me`, {
      headers: { Authorization: `Bearer ${jwt}` },
    })

    if (!meRes.ok) {
      return NextResponse.json({ success: false, error: 'Geçersiz oturum' }, { status: 401 })
    }

    const me = await meRes.json()
    const userId = me.id

    // Fiyat aralığı ve kapsam bilgisini nota ekle
    const locationNote = `${city}${district ? ' / ' + district : ''}`
    const scopeNote = scope === 'all' ? '[Tüm Servisler]' : '[Tek Servis]'
    const priceNote = (minPrice || maxPrice)
      ? `[Fiyat: ${minPrice || 0} - ${maxPrice || '∞'} TL]`
      : ''

    const fullNote = [locationNote, scopeNote, priceNote].filter(Boolean).join(' ')

    // Tercih tarihi: yarın
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const preferredDateTime = `${tomorrow.toISOString().split('T')[0]}T10:00:00.000Z`

    // Randevu/teklif talebi oluştur
    const appointmentData: Record<string, unknown> = {
      user: userId,
      vehicle: vehicleId,
      status: 'Beklemede',
      isOfferRequest: true,
      offerStatus: 'Teklif Bekliyor',
      note: fullNote,
      faultDescription: notes || null,
      preferredDateTime,
      publishedAt: new Date().toISOString(),
    }

    if (serviceId) {
      appointmentData.service = parseInt(serviceId)
    }

    if (categoryIds && categoryIds.length > 0) {
      appointmentData.category = categoryIds[0]
    }

    if (minPrice) appointmentData.minBudget = minPrice
    if (maxPrice) appointmentData.maxBudget = maxPrice

    const res = await fetch(`${STRAPI_API}/appointments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({ data: appointmentData }),
    })

    const result = await res.json()

    if (!res.ok) {
      console.error('[teklif-gonder] Strapi hata:', result)
      return NextResponse.json({ success: false, error: 'Teklif gönderilemedi' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      id: result?.data?.id,
      message: 'Teklif talebiniz iletildi. Servisler en kısa sürede size dönecek.',
    })
  } catch {
    return NextResponse.json({ success: false, error: 'Sunucu hatası' }, { status: 500 })
  }
}
