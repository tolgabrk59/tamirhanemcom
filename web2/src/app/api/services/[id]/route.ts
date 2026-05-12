import { NextResponse } from 'next/server'

const STRAPI_API_URL = (process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api').trim()
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN

export const dynamic = 'force-dynamic'

// working_hours zaman formatını normalize et: "09:00:00.000" → "09:00"
function normalizeTimeStr(t: string | null | undefined): string | null {
  if (!t) return null
  return t.length > 5 ? t.substring(0, 5) : t
}

// working_hours'u normalize et
function normalizeAdminWorkingHours(wh: any): any | null {
  if (!wh || typeof wh !== 'object') return null
  const DAY_KEYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  const hasRealData = DAY_KEYS.some((key) => key in wh && typeof wh[key] === 'object' && wh[key] !== null)
  if (!hasRealData) return null
  const result: Record<string, any> = {}
  for (const day of DAY_KEYS) {
    const d = wh[day]
    if (d && typeof d === 'object') {
      result[day] = {
        open: normalizeTimeStr(d.open),
        close: normalizeTimeStr(d.close),
        closed: d.closed ?? false,
        isOpen: !(d.closed ?? false),
      }
    } else {
      result[day] = { open: null, close: null, closed: true, isOpen: false }
    }
  }
  return result
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const serviceId = params.id

    if (!STRAPI_TOKEN) {
      return NextResponse.json(
        { success: false, error: 'API token yok' },
        { status: 500 }
      )
    }

    const response = await fetch(
      `${STRAPI_API_URL}/services/${serviceId}`,
      {
        headers: { Authorization: `Bearer ${STRAPI_TOKEN}` },
        cache: 'no-store',
      }
    )

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: response.status === 404 ? 'Servis bulunamadı' : 'Sunucu hatası' },
        { status: response.status === 404 ? 404 : 500 }
      )
    }

    const strapiData = await response.json()
    const data = strapiData.data

    if (!data) {
      return NextResponse.json(
        { success: false, error: 'Servis bulunamadı' },
        { status: 404 }
      )
    }

    const workingHours = normalizeAdminWorkingHours(data.working_hours)

    const service = {
      id: data.id,
      attributes: {
        name: data.name || 'Servis',
        location: data.location || '',
        address: data.address || '',
        rating: data.rating || null,
        reviewCount: data.reviewCount || data.ratingCount || 0,
        phone: data.phone || null,
        ProfilePicture: data.ProfilePicture || null,
        pic: data.pic || null,
        image: data.image || null,
        is_official_service: data.is_official_service || data.isOfficialService || false,
        provides_roadside_assistance: data.provides_roadside_assistance || false,
        categories: data.categories?.data?.map((c: any) => c.attributes || c) || data.categories || [],
        description: data.description || '',
        working_hours: workingHours,
        is_open_24_7: data.is_open_24_7 || false,
        supports_all_vehicles: data.supports_all_vehicles || data.supportsAllVehicles || false,
        latitude: data.latitude || null,
        longitude: data.longitude || null,
        gallery: data.gallery || null,
        Gallery: data.Gallery || null,
        verified: data.verified || false,
        discounts: data.discounts || [],
        campaigns: data.campaigns || [],
        car_wash_pricing: data.car_wash_pricing || null,
        has_waiting_room: data.has_waiting_room || false,
        has_tea_coffee: data.has_tea_coffee || false,
        has_wifi: data.has_wifi || false,
        has_tv: data.has_tv || false,
        has_ac: data.has_ac || false,
        has_toilet: data.has_toilet || false,
        has_parking: data.has_parking || false,
        accepts_online_payment: data.accepts_online_payment || false,
        accepts_credit_card: data.accepts_credit_card || false,
        has_valet_service: data.has_valet_service || false,
        accepts_walk_in: data.accepts_walk_in ?? true,
      },
    }

    return NextResponse.json({ success: true, data: service })
  } catch (error) {
    console.error('Servis detay hatası:', error)
    return NextResponse.json(
      { success: false, error: 'Servis yüklenemedi' },
      { status: 500 }
    )
  }
}
