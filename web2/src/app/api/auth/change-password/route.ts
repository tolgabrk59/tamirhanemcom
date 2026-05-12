import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

async function handleChangePassword(request: NextRequest) {
  try {
    const jwt = request.headers.get('Authorization')?.replace('Bearer ', '')
    const body = await request.json()
    const { currentPassword, password, newPassword, passwordConfirmation } = body
    const actualPassword = password || newPassword

    if (!jwt || !currentPassword || !actualPassword) {
      return NextResponse.json({ success: false, error: 'Eksik parametre' }, { status: 400 })
    }

    const STRAPI_API = (process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api').trim()

    const res = await fetch(`${STRAPI_API}/auth/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        currentPassword,
        password: actualPassword,
        passwordConfirmation: passwordConfirmation || actualPassword,
      }),
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      const rawMsg: string = err?.error?.message || ''
      const msg = rawMsg.toLowerCase().includes('invalid') || rawMsg.toLowerCase().includes('incorrect') || rawMsg.toLowerCase().includes('wrong') || rawMsg.toLowerCase().includes('current')
        ? 'Mevcut şifre hatalı'
        : rawMsg || 'Şifre değiştirilemedi'
      return NextResponse.json({ success: false, error: msg }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ success: false, error: 'Sunucu hatası' }, { status: 500 })
  }
}

export const POST = handleChangePassword
export const PUT = handleChangePassword
