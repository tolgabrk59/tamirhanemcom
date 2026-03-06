import { NextRequest, NextResponse } from 'next/server'

const STRAPI_API = (process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api').trim()

// GET /api/user/ratings?jwt=X
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const jwt = searchParams.get('jwt')

    if (!jwt) {
      return NextResponse.json({ success: false, error: 'jwt gerekli' }, { status: 400 })
    }

    const res = await fetch(
      `${STRAPI_API}/ratings?populate[service][populate]=ProfilePicture&populate[user]=*&sort=createdAt:desc`,
      { headers: { Authorization: `Bearer ${jwt}` } }
    )

    if (!res.ok) {
      return NextResponse.json({ success: false, error: 'Değerlendirmeler alınamadı' }, { status: res.status })
    }

    const raw = await res.json()

    const data = (raw.data || []).map((item: {
      id: number
      attributes: Record<string, unknown>
    }) => {
      const a = item.attributes || {}
      const service = (a.service as { data?: { id?: number; attributes?: Record<string, unknown> } } | null)?.data
      const sa = service?.attributes || {}

      return {
        id: item.id,
        rating: Number(a.rating || a.score || 0),
        comment: String(a.comment || a.review || ''),
        createdAt: String(a.createdAt || ''),
        serviceId: service?.id || null,
        serviceName: String(sa.name || ''),
        serviceCategory: String(sa.category || a.serviceCategory || ''),
        helpfulCount: Number(a.helpfulCount || 0),
        replyFrom: String(a.replyFrom || ''),
        reply: String(a.reply || ''),
      }
    })

    return NextResponse.json({ success: true, data })
  } catch {
    return NextResponse.json({ success: false, error: 'Sunucu hatası' }, { status: 500 })
  }
}
