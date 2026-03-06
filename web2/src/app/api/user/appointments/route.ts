import { NextRequest, NextResponse } from 'next/server'

const STRAPI_API = (process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api').trim()

// GET /api/user/appointments?jwt=X&status=PENDING
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const jwt = searchParams.get('jwt')
    const status = searchParams.get('status')
    const isOffer = searchParams.get('isOffer')

    if (!jwt) return NextResponse.json({ success: false, error: 'jwt gerekli' }, { status: 400 })

    let endpoint =
      `${STRAPI_API}/appointments` +
      `?populate[service][populate]=ProfilePicture` +
      `&populate[vehicle][populate]=*` +
      `&populate[category][populate]=*` +
      `&sort=createdAt:desc`

    if (status) endpoint += `&filters[status][$eq]=${status}`
    if (isOffer === 'true') endpoint += `&filters[isOfferRequest][$eq]=true`

    const res = await fetch(endpoint, { headers: { Authorization: `Bearer ${jwt}` } })

    if (!res.ok) return NextResponse.json({ success: false, error: 'Randevular alınamadı' }, { status: res.status })

    const raw = await res.json()

    // Strapi v5: doğrudan array döner (data wrapper yok, attributes wrapper yok)
    const items: Array<Record<string, unknown>> = Array.isArray(raw) ? raw : (Array.isArray(raw?.data) ? raw.data : [])

    const data = items.map((item) => {
      // Strapi v5: ilişkili veriler doğrudan obje (attributes wrapper yok)
      const service = item.service as Record<string, unknown> | null | undefined
      const vehicle = item.vehicle as Record<string, unknown> | null | undefined
      const category = item.category as Record<string, unknown> | null | undefined

      // Strapi v4 uyumluluğu için attributes kontrolü
      const serviceAttrs = (service as { attributes?: Record<string, unknown> } | null)?.attributes || service
      const vehicleAttrs = (vehicle as { attributes?: Record<string, unknown> } | null)?.attributes || vehicle
      const categoryAttrs = (category as { attributes?: Record<string, unknown> } | null)?.attributes || category

      // matchedDate: [{ date, timeSlot }] formatından al
      const matchedDate = item.matchedDate as Array<{ date?: string; timeSlot?: string }> | null | undefined
      const firstMatch = Array.isArray(matchedDate) ? matchedDate[0] : null

      const appointmentDate = firstMatch?.date || String(item.appointmentDate || item.preferredDateTime || '')
      const timeSlot = firstMatch?.timeSlot || String(item.timeSlot || '')

      // Status normalize et
      const rawStatus = String(item.status || 'pending').toLowerCase()
      const statusMap: Record<string, string> = {
        beklemede: 'pending',
        pending: 'pending',
        bekliyor: 'pending',
        onaylandi: 'confirmed',
        'onaylandı': 'confirmed',
        confirmed: 'confirmed',
        tamamlandi: 'completed',
        'tamamlandı': 'completed',
        completed: 'completed',
        iptal: 'cancelled',
        cancelled: 'cancelled',
      }
      const normalizedStatus = statusMap[rawStatus] || 'pending'

      const serviceId = service
        ? ((service as { id?: number }).id || (service as { data?: { id?: number } })?.data?.id || null)
        : null

      return {
        id: item.id,
        status: normalizedStatus,
        offerStatus: String(item.offerStatus || ''),
        offerPrice: Number(item.offerPrice || 0),
        isOfferRequest: Boolean(item.isOfferRequest),
        note: String(item.note || ''),
        createdAt: String(item.createdAt || ''),
        appointmentDate,
        timeSlot,
        serviceName: String(serviceAttrs?.name || ''),
        serviceAddress: String(serviceAttrs?.address || serviceAttrs?.adress || serviceAttrs?.location || ''),
        serviceId,
        vehicleBrand: String(vehicleAttrs?.brand || ''),
        vehicleModel: String(vehicleAttrs?.model || ''),
        vehiclePlate: String(vehicleAttrs?.plate || ''),
        categoryName: String(categoryAttrs?.name || ''),
      }
    })

    return NextResponse.json({ success: true, data })
  } catch {
    return NextResponse.json({ success: false, error: 'Sunucu hatası' }, { status: 500 })
  }
}
