import { NextRequest, NextResponse } from 'next/server'

const STRAPI_API = (process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api').trim()
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN

// GET /api/user/vehicles?jwt=X
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const jwt = searchParams.get('jwt')

    if (!jwt) {
      return NextResponse.json({ success: false, error: 'jwt gerekli' }, { status: 400 })
    }

    const meRes = await fetch(`${STRAPI_API}/users/me`, {
      headers: { Authorization: `Bearer ${jwt}` },
    })

    if (!meRes.ok) {
      return NextResponse.json({ success: false, error: 'Geçersiz oturum' }, { status: 401 })
    }

    const me = await meRes.json()
    const userId = me.id

    const vehiclesRes = await fetch(
      `${STRAPI_API}/vehicles?filters[user][id][$eq]=${userId}&pagination[pageSize]=50&sort=createdAt:desc`,
      { headers: { Authorization: `Bearer ${STRAPI_TOKEN}` } }
    )

    if (!vehiclesRes.ok) {
      return NextResponse.json({ success: false, error: 'Araçlar alınamadı' }, { status: 500 })
    }

    const vehiclesData = await vehiclesRes.json()
    const vehicles = (vehiclesData.data || []).map((v: {
      id: number
      attributes: { brand?: string; model?: string; year?: number; plate?: string; fuelType?: string }
    }) => ({
      id: v.id,
      brand: v.attributes?.brand || '',
      model: v.attributes?.model || '',
      year: v.attributes?.year || '',
      plate: v.attributes?.plate || '',
      fuelType: v.attributes?.fuelType || '',
    }))

    return NextResponse.json({ success: true, vehicles })
  } catch {
    return NextResponse.json({ success: false, error: 'Sunucu hatası' }, { status: 500 })
  }
}
