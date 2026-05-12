import { NextRequest, NextResponse } from 'next/server'

const STRAPI_API = (process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api').trim()

// POST /api/teklif-gonder
// Body: { jwt, vehicleId, city, district, scope, categoryIds, notes, serviceId }
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      jwt,
      vehicleId,
      city,
      district,
      scope,        // 'single' | 'all'
      categoryIds,  // number[] (optional)
      notes,        // string (optional)
      serviceId,    // number (optional, scope=single ise)
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

    // Teklif verisi
    const teklifData: Record<string, unknown> = {
      user: userId,
      vehicle: vehicleId,
      city,
      district: district || null,
      scope,                              // 'single' | 'all'
      notes: notes || null,
      status: 'bekliyor',
      publishedAt: new Date().toISOString(),
    }

    if (serviceId) {
      teklifData.service = Number(serviceId)
    }

    if (categoryIds && categoryIds.length > 0) {
      teklifData.category = categoryIds[0]
    }

    const res = await fetch(`${STRAPI_API}/teklifler`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({ data: teklifData }),
    })

    const result = await res.json()

    if (!res.ok) {
      console.error('[teklif-gonder] Strapi hata:', JSON.stringify(result))
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
