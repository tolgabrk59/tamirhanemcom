import { NextRequest, NextResponse } from 'next/server'

const STRAPI_API = (process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api').trim()

// GET /api/user/wallet?jwt=X
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const jwt = searchParams.get('jwt')

    if (!jwt) {
      return NextResponse.json({ success: false, error: 'jwt gerekli' }, { status: 400 })
    }

    const walletRes = await fetch(`${STRAPI_API}/wallets/me`, {
      headers: { Authorization: `Bearer ${jwt}` },
    })

    if (!walletRes.ok) {
      return NextResponse.json({ success: false, error: 'Cüzdan bilgisi alınamadı' }, { status: walletRes.status })
    }

    // Strapi v4: { data: { id, attributes: { balance, ... } } }
    const raw = await walletRes.json()
    const walletData = raw?.data
    const balance = walletData?.attributes?.balance ?? walletData?.balance ?? 0

    return NextResponse.json({
      success: true,
      data: {
        id: walletData?.id || null,
        balance: Number(balance),
      },
    })
  } catch {
    return NextResponse.json({ success: false, error: 'Sunucu hatası' }, { status: 500 })
  }
}
