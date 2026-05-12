import { NextRequest, NextResponse } from 'next/server'

const STRAPI_API = (process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api').trim()
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN

// GET /api/favorites?serviceId=X&userId=Y — favoriye eklenmiş mi kontrol et
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const serviceId = searchParams.get('serviceId')
    const userId = searchParams.get('userId')

    if (!serviceId || !userId) {
      return NextResponse.json({ success: false, error: 'serviceId ve userId gerekli' }, { status: 400 })
    }

    const res = await fetch(
      `${STRAPI_API}/favorites?filters%5Bservice%5D%5Bid%5D%5B%24eq%5D=${serviceId}&filters%5Buser%5D%5Bid%5D%5B%24eq%5D=${userId}&pagination%5BpageSize%5D=1`,
      { headers: { Authorization: `Bearer ${STRAPI_TOKEN}` } }
    )

    const data = await res.json()
    const existing = data?.data?.[0] || null

    return NextResponse.json({
      success: true,
      isFavorited: !!existing,
      favoriteId: existing?.id || null,
    })
  } catch {
    return NextResponse.json({ success: false, error: 'Sunucu hatası' }, { status: 500 })
  }
}

// POST /api/favorites — favoriye ekle
// Body: { serviceId, jwt }
export async function POST(request: NextRequest) {
  try {
    const { serviceId, jwt } = await request.json()

    if (!serviceId || !jwt) {
      return NextResponse.json({ success: false, error: 'serviceId ve jwt gerekli' }, { status: 400 })
    }

    // JWT'den kullanıcıyı al
    const meRes = await fetch(`${STRAPI_API}/users/me`, {
      headers: { Authorization: `Bearer ${jwt}` },
    })

    if (!meRes.ok) {
      return NextResponse.json({ success: false, error: 'Geçersiz oturum' }, { status: 401 })
    }

    const me = await meRes.json()
    const userId = me.id

    // Zaten favoride mi?
    const checkRes = await fetch(
      `${STRAPI_API}/favorites?filters%5Bservice%5D%5Bid%5D%5B%24eq%5D=${serviceId}&filters%5Buser%5D%5Bid%5D%5B%24eq%5D=${userId}&pagination%5BpageSize%5D=1`,
      { headers: { Authorization: `Bearer ${STRAPI_TOKEN}` } }
    )
    const checkData = await checkRes.json()

    if (checkData?.data?.length > 0) {
      return NextResponse.json({
        success: true,
        alreadyExists: true,
        favoriteId: checkData.data[0].id,
        message: 'Zaten favorilerde',
      })
    }

    // Favoriye ekle
    const addRes = await fetch(`${STRAPI_API}/favorites`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${STRAPI_TOKEN}`,
      },
      body: JSON.stringify({
        data: {
          service: serviceId,
          user: userId,
          temp: null,
        },
      }),
    })

    if (!addRes.ok) {
      const err = await addRes.json().catch(() => ({}))
      console.error('[favorites POST] Strapi error:', err)
      return NextResponse.json({ success: false, error: 'Favoriye eklenemedi' }, { status: 500 })
    }

    const result = await addRes.json()
    return NextResponse.json({
      success: true,
      favoriteId: result?.data?.id,
      message: 'Favorilere eklendi',
    })
  } catch {
    return NextResponse.json({ success: false, error: 'Sunucu hatası' }, { status: 500 })
  }
}

// DELETE /api/favorites?id=X — favoriden çıkar
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const jwt = request.headers.get('authorization')?.replace('Bearer ', '')

    if (!id || !jwt) {
      return NextResponse.json({ success: false, error: 'id ve jwt gerekli' }, { status: 400 })
    }

    // JWT doğrula
    const meRes = await fetch(`${STRAPI_API}/users/me`, {
      headers: { Authorization: `Bearer ${jwt}` },
    })
    if (!meRes.ok) {
      return NextResponse.json({ success: false, error: 'Geçersiz oturum' }, { status: 401 })
    }

    const delRes = await fetch(`${STRAPI_API}/favorites/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${STRAPI_TOKEN}` },
    })

    if (!delRes.ok) {
      return NextResponse.json({ success: false, error: 'Favoriden çıkarılamadı' }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'Favorilerden çıkarıldı' })
  } catch {
    return NextResponse.json({ success: false, error: 'Sunucu hatası' }, { status: 500 })
  }
}
