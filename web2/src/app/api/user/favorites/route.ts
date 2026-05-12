import { NextRequest, NextResponse } from 'next/server'

const STRAPI_API = (process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api').trim()

// GET /api/user/favorites?jwt=X
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const jwt = searchParams.get('jwt')

    if (!jwt) {
      return NextResponse.json({ success: false, error: 'jwt gerekli' }, { status: 400 })
    }

    const res = await fetch(
      `${STRAPI_API}/favorites?populate[service][populate]=ProfilePicture&sort=createdAt:desc`,
      { headers: { Authorization: `Bearer ${jwt}` } }
    )

    if (!res.ok) {
      return NextResponse.json({ success: false, error: 'Favoriler alınamadı' }, { status: res.status })
    }

    const raw = await res.json()

    const data = (raw.data || []).map((item: {
      id: number
      attributes: Record<string, unknown>
    }) => {
      const a = item.attributes || {}
      const service = (a.service as { data?: { id?: number; attributes?: Record<string, unknown> } } | null)?.data
      const sa = service?.attributes || {}

      const profilePicture = (sa.ProfilePicture as { data?: { attributes?: { url?: string } } } | null)?.data?.attributes?.url || ''
      const photoUrl = profilePicture
        ? (profilePicture.startsWith('http') ? profilePicture : `https://api.tamirhanem.net${profilePicture}`)
        : ''

      return {
        id: item.id,
        serviceId: service?.id || null,
        serviceName: String(sa.name || ''),
        rating: Number(sa.rating || sa.averageRating || 0),
        reviewCount: Number(sa.reviewCount || 0),
        address: String(sa.address || sa.adress || ''),
        district: String(sa.district || ''),
        city: String(sa.city || ''),
        photo: photoUrl,
        category: String(sa.category || ''),
      }
    })

    return NextResponse.json({ success: true, data })
  } catch {
    return NextResponse.json({ success: false, error: 'Sunucu hatası' }, { status: 500 })
  }
}

// DELETE /api/user/favorites?id=X&jwt=Y
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const jwt = searchParams.get('jwt')
    const id = searchParams.get('id')

    if (!jwt || !id) {
      return NextResponse.json({ success: false, error: 'jwt ve id gerekli' }, { status: 400 })
    }

    const res = await fetch(`${STRAPI_API}/favorites/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${jwt}` },
    })

    return NextResponse.json({ success: res.ok })
  } catch {
    return NextResponse.json({ success: false, error: 'Sunucu hatası' }, { status: 500 })
  }
}
