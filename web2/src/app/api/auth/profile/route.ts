import { NextRequest, NextResponse } from 'next/server'

const STRAPI_API = (process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api').trim()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const jwt = searchParams.get('jwt')
    if (!jwt) return NextResponse.json({ success: false, error: 'JWT gerekli' }, { status: 400 })

    const res = await fetch(`${STRAPI_API}/users/me`, {
      headers: { Authorization: `Bearer ${jwt}` },
      cache: 'no-store',
    })
    if (!res.ok) return NextResponse.json({ success: false, error: 'Kullanıcı bilgisi alınamadı' }, { status: res.status })

    const data = await res.json()
    const fullName = [data.name || '', data.surname || ''].filter(Boolean).join(' ') || data.username

    return NextResponse.json({
      success: true,
      user: {
        id: data.id,
        username: data.username,
        email: data.email,
        name: fullName,
        firstName: data.name || '',
        lastName: data.surname || '',
        phone: data.phone || '',
        adress: data.adress || '',
        birthDate: data.birthDate || '',
        gender: data.gender || '',
      },
    })
  } catch {
    return NextResponse.json({ success: false, error: 'Sunucu hatası' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { jwt, id, name, surname, phone, adress, birthDate, gender } = await request.json()

    if (!jwt || !id) {
      return NextResponse.json({ success: false, error: 'JWT ve ID gerekli' }, { status: 400 })
    }

    const res = await fetch(`${STRAPI_API}/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({ name, surname, phone, adress, birthDate: birthDate || null, gender: gender || null }),
    })

    const data = await res.json()

    if (!res.ok) {
      return NextResponse.json({ success: false, error: data?.error?.message || 'Güncelleme başarısız' }, { status: 400 })
    }

    const updatedName = [data.name || '', data.surname || ''].filter(Boolean).join(' ') || data.username

    return NextResponse.json({
      success: true,
      user: {
        id: data.id,
        username: data.username,
        email: data.email,
        name: updatedName,
        firstName: data.name || '',
        lastName: data.surname || '',
        phone: data.phone || '',
        adress: data.adress || '',
        birthDate: data.birthDate || '',
        gender: data.gender || '',
      },
    })
  } catch {
    return NextResponse.json({ success: false, error: 'Sunucu hatası' }, { status: 500 })
  }
}
