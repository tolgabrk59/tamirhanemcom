import { NextRequest, NextResponse } from 'next/server'

const STRAPI_API = (process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api').trim()

// GET /api/user/offers?jwt=X
// isOfferRequest=true olan appointments = teklifler
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const jwt = searchParams.get('jwt')

    if (!jwt) {
      return NextResponse.json({ success: false, error: 'jwt gerekli' }, { status: 400 })
    }

    const endpoint =
      `${STRAPI_API}/appointments?filters[isOfferRequest][$eq]=true` +
      `&populate[service][populate]=ProfilePicture` +
      `&populate[category]=*` +
      `&sort=createdAt:desc`

    const res = await fetch(endpoint, {
      headers: { Authorization: `Bearer ${jwt}` },
    })

    if (!res.ok) {
      return NextResponse.json({ success: false, error: 'Teklifler alınamadı' }, { status: res.status })
    }

    const raw = await res.json()

    const data = (raw.data || []).map((item: {
      id: number
      attributes: Record<string, unknown>
    }) => {
      const a = item.attributes || {}
      const service = (a.service as { data?: { id?: number; attributes?: Record<string, unknown> } } | null)?.data
      const category = (a.category as { data?: { id?: number; attributes?: Record<string, unknown> } } | null)?.data

      return {
        id: item.id,
        status: String(a.offerStatus || a.status || 'Teklif Verildi'),
        offerPrice: Number(a.offerPrice || a.price || 0),
        isOfferRequest: Boolean(a.isOfferRequest),
        note: String(a.note || ''),
        createdAt: String(a.createdAt || ''),
        appointmentDate: String(a.appointmentDate || a.date || ''),
        serviceName: String(service?.attributes?.name || ''),
        serviceId: service?.id || null,
        categoryName: String(category?.attributes?.name || ''),
      }
    })

    return NextResponse.json({ success: true, data })
  } catch {
    return NextResponse.json({ success: false, error: 'Sunucu hatası' }, { status: 500 })
  }
}
