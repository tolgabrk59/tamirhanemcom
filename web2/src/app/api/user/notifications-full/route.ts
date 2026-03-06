import { NextRequest, NextResponse } from 'next/server'

const STRAPI_API = (process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api').trim()

// GET /api/user/notifications-full?jwt=X
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const jwt = searchParams.get('jwt')

    if (!jwt) {
      return NextResponse.json({ success: false, error: 'jwt gerekli' }, { status: 400 })
    }

    const res = await fetch(
      `${STRAPI_API}/notifications?populate=*&sort=createdAt:desc`,
      { headers: { Authorization: `Bearer ${jwt}` } }
    )

    if (!res.ok) {
      return NextResponse.json({ success: false, error: 'Bildirimler alınamadı' }, { status: res.status })
    }

    const data = await res.json()
    return NextResponse.json({ success: true, data })
  } catch {
    return NextResponse.json({ success: false, error: 'Sunucu hatası' }, { status: 500 })
  }
}

// PUT /api/user/notifications-full — bildirim okundu olarak işaretle
// Body: { jwt, id }
export async function PUT(request: NextRequest) {
  try {
    const { jwt, id } = await request.json()

    if (!jwt || !id) {
      return NextResponse.json({ success: false, error: 'jwt ve id gerekli' }, { status: 400 })
    }

    const res = await fetch(`${STRAPI_API}/notifications/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({ data: { read: true } }),
    })

    if (!res.ok) {
      return NextResponse.json({ success: false, error: 'Bildirim güncellenemedi' }, { status: res.status })
    }

    const data = await res.json()
    return NextResponse.json({ success: true, data })
  } catch {
    return NextResponse.json({ success: false, error: 'Sunucu hatası' }, { status: 500 })
  }
}
