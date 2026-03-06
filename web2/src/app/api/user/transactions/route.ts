import { NextRequest, NextResponse } from 'next/server'

const STRAPI_API = (process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api').trim()

// GET /api/user/transactions?jwt=X&page=1&pageSize=20
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const jwt = searchParams.get('jwt')
    const page = searchParams.get('page') || '1'
    const pageSize = searchParams.get('pageSize') || '20'

    if (!jwt) {
      return NextResponse.json({ success: false, error: 'jwt gerekli' }, { status: 400 })
    }

    const res = await fetch(
      `${STRAPI_API}/transactions?pagination[page]=${page}&pagination[pageSize]=${pageSize}&sort=createdAt:desc&populate=user,appointment`,
      { headers: { Authorization: `Bearer ${jwt}` } }
    )

    if (!res.ok) {
      return NextResponse.json({ success: false, error: 'İşlemler alınamadı' }, { status: res.status })
    }

    // Strapi v4: { data: [{id, attributes:{...}}], meta:{...} }
    const raw = await res.json()
    const data = (raw.data || []).map((item: {
      id: number
      attributes: Record<string, unknown>
    }) => {
      const a = item.attributes || {}
      const rawType = String(a.type || '').toLowerCase()
      const amount = Number(a.amount || 0)
      const isCredit = rawType === 'credit' || rawType === 'giris' || rawType === 'deposit' || amount > 0

      return {
        id: item.id,
        type: isCredit ? 'giris' : 'cikis',
        amount: Number(Math.abs(amount)),
        description: String(a.description || a.note || (isCredit ? 'Yükleme' : 'Ödeme')),
        status: String(a.status || 'completed'),
        createdAt: String(a.createdAt || ''),
      }
    })

    return NextResponse.json({ success: true, data })
  } catch {
    return NextResponse.json({ success: false, error: 'Sunucu hatası' }, { status: 500 })
  }
}
