import { NextRequest, NextResponse } from 'next/server'

const STRAPI_API = (process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api').trim()

export const dynamic = 'force-dynamic'

// GET /api/user/offers
// Kullanıcının gönderdiği teklif taleplerini getirir (teklifler collection)
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization')
    const jwt = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null

    if (!jwt) {
      return NextResponse.json({ success: false, error: 'jwt gerekli' }, { status: 400 })
    }

    // Get userId from /users/me
    const meRes = await fetch(`${STRAPI_API}/users/me`, {
      headers: { Authorization: `Bearer ${jwt}` },
    })

    if (!meRes.ok) {
      return NextResponse.json({ success: false, error: 'Kullanıcı doğrulanamadı' }, { status: meRes.status })
    }

    const me = await meRes.json()

    const endpoint =
      `${STRAPI_API}/teklifler?` +
      `filters[user][id][$eq]=${me.id}` +
      `&populate[service][fields][0]=name` +
      `&populate[service][fields][1]=location` +
      `&populate[category][fields][0]=name` +
      `&populate[vehicle][fields][0]=brand` +
      `&populate[vehicle][fields][1]=model` +
      `&populate[vehicle][fields][2]=plate` +
      `&sort=createdAt:desc` +
      `&pagination[pageSize]=50`

    const res = await fetch(endpoint, {
      headers: { Authorization: `Bearer ${jwt}` },
    })

    if (!res.ok) {
      return NextResponse.json({ success: false, error: 'Teklifler alınamadı' }, { status: res.status })
    }

    const raw = await res.json()

    const data = (raw.data || []).map((item: Record<string, unknown>) => ({
      id: item.id,
      city: (item.city as string) ?? '',
      district: (item.district as string) ?? '',
      scope: (item.scope as string) ?? 'all',
      status: (item.status as string) ?? 'bekliyor',
      notes: (item.notes as string) ?? '',
      createdAt: (item.createdAt as string) ?? '',
      serviceName: (item.service as Record<string, unknown>)?.name as string ?? '',
      serviceLocation: (item.service as Record<string, unknown>)?.location as string ?? '',
      serviceId: (item.service as Record<string, unknown>)?.id as number ?? null,
      categoryName: (item.category as Record<string, unknown>)?.name as string ?? '',
      vehicleInfo: item.vehicle
        ? `${(item.vehicle as Record<string, unknown>).brand ?? ''} ${(item.vehicle as Record<string, unknown>).model ?? ''}`.trim()
        : '',
      vehiclePlate: (item.vehicle as Record<string, unknown>)?.plate as string ?? '',
    }))

    return NextResponse.json({ success: true, data })
  } catch {
    return NextResponse.json({ success: false, error: 'Sunucu hatası' }, { status: 500 })
  }
}
