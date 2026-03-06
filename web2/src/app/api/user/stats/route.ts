import { NextRequest, NextResponse } from 'next/server'

const STRAPI_API = (process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api').trim()

// GET /api/user/stats?jwt=X
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const jwt = searchParams.get('jwt')

    if (!jwt) return NextResponse.json({ success: false, error: 'jwt gerekli' }, { status: 400 })

    const headers = { Authorization: `Bearer ${jwt}` }

    // Paralel fetch: randevular + cüzdan
    const [aptRes, walletRes] = await Promise.allSettled([
      fetch(`${STRAPI_API}/appointments?sort=createdAt:desc`, { headers }),
      fetch(`${STRAPI_API}/wallets/me`, { headers }),
    ])

    // Randevu sayıları
    let appointments = 0
    let completed = 0
    if (aptRes.status === 'fulfilled' && aptRes.value.ok) {
      const raw = await aptRes.value.json()
      const items: Array<{ status?: string }> = Array.isArray(raw) ? raw : (Array.isArray(raw?.data) ? raw.data : [])
      appointments = items.length
      completed = items.filter(a => {
        const s = String(a.status || '').toLowerCase()
        return s === 'tamamlandi' || s === 'tamamlandı' || s === 'completed'
      }).length
    }

    // Cüzdan bakiyesi
    let balance = '0'
    if (walletRes.status === 'fulfilled' && walletRes.value.ok) {
      const raw = await walletRes.value.json()
      const walletData = raw?.data
      const b = walletData?.attributes?.balance ?? walletData?.balance ?? raw?.balance ?? 0
      balance = Number(b).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    }

    return NextResponse.json({
      success: true,
      stats: { appointments, completed, points: 0, balance },
    })
  } catch {
    return NextResponse.json({ success: false, error: 'Sunucu hatası' }, { status: 500 })
  }
}
