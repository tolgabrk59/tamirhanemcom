import { NextRequest, NextResponse } from 'next/server'

const STRAPI_API = (process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api').trim()

// GET /api/user/ratings?jwt=X
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const jwt = searchParams.get('jwt')

    if (!jwt) {
      return NextResponse.json({ success: false, error: 'jwt gerekli' }, { status: 400 })
    }

    const res = await fetch(
      `${STRAPI_API}/ratings?populate[service][populate]=ProfilePicture&populate[user]=*&sort=createdAt:desc`,
      { headers: { Authorization: `Bearer ${jwt}` } }
    )

    if (!res.ok) {
      return NextResponse.json({ success: false, error: 'Değerlendirmeler alınamadı' }, { status: res.status })
    }

    const raw = await res.json()

    const data = (raw.data || []).map((item: {
      id: number
      attributes: Record<string, unknown>
    }) => {
      const a = item.attributes || {}
      const service = (a.service as { data?: { id?: number; attributes?: Record<string, unknown> } } | null)?.data
      const sa = service?.attributes || {}

      return {
        id: item.id,
        rating: Number(a.rating || a.score || 0),
        comment: String(a.comment || a.review || ''),
        createdAt: String(a.createdAt || ''),
        serviceId: service?.id || null,
        serviceName: String(sa.name || ''),
        serviceCategory: String(sa.category || a.serviceCategory || ''),
        helpfulCount: Number(a.helpfulCount || 0),
        replyFrom: String(a.replyFrom || ''),
        reply: String(a.reply || ''),
      }
    })

    return NextResponse.json({ success: true, data })
  } catch {
    return NextResponse.json({ success: false, error: 'Sunucu hatası' }, { status: 500 })
  }
}

// POST /api/user/ratings — Değerlendirme oluştur (mobil referans: POST /api/ratings)
export async function POST(request: NextRequest) {
  try {
    const { jwt, appointmentId, rating, comment } = await request.json()

    if (!jwt || !appointmentId || !rating) {
      return NextResponse.json({ success: false, error: 'jwt, appointmentId ve rating gerekli' }, { status: 400 })
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ success: false, error: 'Rating 1-5 arası olmalı' }, { status: 400 })
    }

    // Kullanıcı doğrula
    const meRes = await fetch(`${STRAPI_API}/users/me`, {
      headers: { Authorization: `Bearer ${jwt}` },
    })
    if (!meRes.ok) {
      return NextResponse.json({ success: false, error: 'Kullanıcı doğrulanamadı' }, { status: 401 })
    }
    const meData = await meRes.json()
    const userId = meData.id

    // Randevuyu al — servis bilgisini çekmek için
    const aptRes = await fetch(
      `${STRAPI_API}/appointments/${appointmentId}?populate=service`,
      { headers: { Authorization: `Bearer ${jwt}` } }
    )
    if (!aptRes.ok) {
      return NextResponse.json({ success: false, error: 'Randevu bulunamadı' }, { status: 404 })
    }
    const aptRaw = await aptRes.json()
    const aptData = aptRaw.data || aptRaw
    const serviceObj = aptData?.service || aptData?.attributes?.service?.data
    const serviceId = serviceObj?.id || serviceObj?.data?.id || null

    // Strapi'ye rating oluştur (mobil referans formatı)
    const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN || ''
    const createRes = await fetch(`${STRAPI_API}/ratings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${STRAPI_TOKEN}`,
      },
      body: JSON.stringify({
        data: {
          value: rating,
          comment: comment || '',
          appointment: appointmentId,
          service: serviceId,
          user: userId,
        },
      }),
    })

    if (!createRes.ok) {
      const errBody = await createRes.text()
      return NextResponse.json({ success: false, error: 'Değerlendirme oluşturulamadı', detail: errBody }, { status: createRes.status })
    }

    const result = await createRes.json()
    return NextResponse.json({ success: true, data: result })
  } catch {
    return NextResponse.json({ success: false, error: 'Sunucu hatası' }, { status: 500 })
  }
}
