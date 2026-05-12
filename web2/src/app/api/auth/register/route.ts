import { NextRequest, NextResponse } from 'next/server'

const STRAPI_API = (process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api').trim()

export async function POST(request: NextRequest) {
  try {
    const { username, email, password } = await request.json()

    if (!username || !email || !password) {
      return NextResponse.json({ success: false, error: 'Tüm alanlar gerekli' }, { status: 400 })
    }

    const res = await fetch(`${STRAPI_API}/auth/local/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    })

    const data = await res.json()

    if (!res.ok) {
      const msg: string = data?.error?.message || 'Kayıt başarısız'
      const friendly = msg.includes('already taken') ? 'Bu email veya kullanıcı adı zaten kayıtlı' : msg
      return NextResponse.json({ success: false, error: friendly }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      jwt: data.jwt,
      user: {
        id: data.user.id,
        username: data.user.username,
        email: data.user.email,
      },
    })
  } catch {
    return NextResponse.json({ success: false, error: 'Sunucu hatası' }, { status: 500 })
  }
}
