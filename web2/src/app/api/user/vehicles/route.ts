import { NextRequest, NextResponse } from 'next/server'

const STRAPI_API = (process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api').trim()

// GET /api/user/vehicles?jwt=X
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const jwt = searchParams.get('jwt')
    if (!jwt) return NextResponse.json({ success: false, error: 'jwt gerekli' }, { status: 400 })

    const res = await fetch(
      `${STRAPI_API}/vehicles?populate=*&pagination[pageSize]=50&sort=createdAt:desc`,
      { headers: { Authorization: `Bearer ${jwt}` } }
    )

    if (!res.ok) return NextResponse.json({ success: false, error: 'Araçlar alınamadı' }, { status: res.status })

    const raw = await res.json()
    const data = (raw.data || []).map((v: {
      id: number
      attributes: {
        brand?: string; model?: string; year?: number; plate?: string
        fuelType?: string; color?: string; mileage?: number; transmission?: string; vin?: string
      }
    }) => ({
      id: v.id,
      brand: v.attributes?.brand || '',
      model: v.attributes?.model || '',
      year: v.attributes?.year || 0,
      plate: v.attributes?.plate || '',
      fuelType: v.attributes?.fuelType || '',
      color: v.attributes?.color || '',
      mileage: v.attributes?.mileage || 0,
      transmission: v.attributes?.transmission || '',
      vin: v.attributes?.vin || '',
    }))

    return NextResponse.json({ success: true, data })
  } catch {
    return NextResponse.json({ success: false, error: 'Sunucu hatası' }, { status: 500 })
  }
}

// POST /api/user/vehicles — araç ekle
export async function POST(request: NextRequest) {
  try {
    const { jwt, ...vehicleData } = await request.json()
    if (!jwt) return NextResponse.json({ success: false, error: 'jwt gerekli' }, { status: 400 })

    const res = await fetch(`${STRAPI_API}/vehicles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${jwt}` },
      body: JSON.stringify({ data: vehicleData }),
    })

    const data = await res.json().catch(() => ({}))
    return NextResponse.json({ success: res.ok, data })
  } catch {
    return NextResponse.json({ success: false, error: 'Sunucu hatası' }, { status: 500 })
  }
}
