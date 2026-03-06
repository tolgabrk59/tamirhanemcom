import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function PUT(request: NextRequest) {
  try {
    const jwt = request.headers.get('Authorization')?.replace('Bearer ', '')
    const { currentPassword, newPassword } = await request.json()

    if (!jwt || !currentPassword || !newPassword) {
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
        password: newPassword,
        passwordConfirmation: newPassword,
      }),
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      const rawMsg: string = err?.error?.message || ''
      const msg = rawMsg.toLowerCase().includes('invalid') || rawMsg.toLowerCase().includes('incorrect') || rawMsg.toLowerCase().includes('wrong')
        ? 'Mevcut şifre hatalı'
        : rawMsg || 'Şifre değiştirilemedi'
      return NextResponse.json({ success: false, error: msg }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ success: false, error: 'Sunucu hatası' }, { status: 500 })
  }
}
