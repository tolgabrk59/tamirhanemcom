import { NextRequest, NextResponse } from 'next/server'

const STRAPI_API = (process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api').trim()

export async function POST(request: NextRequest) {
  try {
    const { identifier, password } = await request.json()

    if (!identifier || !password) {
      return NextResponse.json({ success: false, error: 'Kullanıcı adı ve şifre gerekli' }, { status: 400 })
    }

    const res = await fetch(`${STRAPI_API}/auth/local`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password }),
    })

    const data = await res.json()

    if (!res.ok) {
      const msg = data?.error?.message || 'Giriş başarısız'
      const friendly = msg.includes('Invalid identifier') ? 'Kullanıcı adı veya şifre hatalı' : msg
      return NextResponse.json({ success: false, error: friendly }, { status: 401 })
    }

    // Genişletilmiş kullanıcı bilgisini çek
    let fullUser = data.user
    try {
      const meRes = await fetch(`${STRAPI_API}/users/me`, {
        headers: { Authorization: `Bearer ${data.jwt}` },
      })
      if (meRes.ok) fullUser = await meRes.json()
    } catch {}

    // Strapi'de name + surname alanları var
    const name = fullUser.name || ''
    const surname = fullUser.surname || ''
    const displayName = [name, surname].filter(Boolean).join(' ') || fullUser.username

    return NextResponse.json({
      success: true,
      jwt: data.jwt,
      user: {
        id: fullUser.id,
        username: fullUser.username,
        email: fullUser.email,
        name: displayName,
        firstName: name,
        lastName: surname,
        phone: fullUser.phone || '',
        adress: fullUser.adress || '',
      },
    })
  } catch {
    return NextResponse.json({ success: false, error: 'Sunucu hatası' }, { status: 500 })
  }
}
