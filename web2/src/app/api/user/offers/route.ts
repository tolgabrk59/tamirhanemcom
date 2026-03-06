import { NextRequest, NextResponse } from 'next/server'

const STRAPI_API = (process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api').trim()

// GET /api/user/offers?jwt=X
// Kullanıcının gönderdiği teklif taleplerini getirir (teklifler collection)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const jwt = searchParams.get('jwt')

    if (!jwt) {
      return NextResponse.json({ success: false, error: 'jwt gerekli' }, { status: 400 })
    }

    const endpoint =
      `${STRAPI_API}/teklifler?` +
      `populate[service]=name,location` +
      `&populate[category]=name` +
      `&populate[vehicle]=brand,model,plate` +
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
      const vehicle = (a.vehicle as { data?: { id?: number; attributes?: Record<string, unknown> } } | null)?.data

      return {
        id: item.id,
        city: String(a.city || ''),
        district: String(a.district || ''),
        scope: String(a.scope || 'all'),
        status: String(a.status || 'bekliyor'),
        notes: String(a.notes || ''),
        createdAt: String(a.createdAt || ''),
        serviceName: String(service?.attributes?.name || ''),
        serviceLocation: String(service?.attributes?.location || ''),
        serviceId: service?.id || null,
        categoryName: String(category?.attributes?.name || ''),
        vehicleInfo: vehicle
          ? `${vehicle.attributes?.brand || ''} ${vehicle.attributes?.model || ''}`.trim()
          : '',
        vehiclePlate: String(vehicle?.attributes?.plate || ''),
      }
    })

    return NextResponse.json({ success: true, data })
  } catch {
    return NextResponse.json({ success: false, error: 'Sunucu hatası' }, { status: 500 })
  }
}
