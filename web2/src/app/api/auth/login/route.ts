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

    return NextResponse.json({
      success: true,
      jwt: data.jwt,
      user: {
        id: data.user.id,
        username: data.user.username,
        email: data.user.email,
        name: data.user.name || data.user.username,
      },
    })
  } catch {
    return NextResponse.json({ success: false, error: 'Sunucu hatası' }, { status: 500 })
  }
}
