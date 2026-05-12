import { NextResponse } from 'next/server'

const STRAPI_API_URL = (process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api').trim()
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN

export const dynamic = 'force-dynamic'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!STRAPI_TOKEN) {
      return NextResponse.json({ success: false, error: 'API token yok' }, { status: 500 })
    }

    const url = `${STRAPI_API_URL}/ratings?filters[service][id][$eq]=${params.id}`

    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${STRAPI_TOKEN}` },
      cache: 'no-store',
    })

    if (!response.ok) {
      return NextResponse.json({ success: false, error: 'Yorumlar alınamadı' }, { status: 500 })
    }

    const strapiData = await response.json()
    const items = strapiData.data || []

    const reviews = items
      .filter((r: any) => r.comment)
      .map((r: any) => ({
        id: r.id,
        value: r.value || null,
        comment: r.comment,
        user: r.user
          ? { username: r.user.username || 'Kullanıcı', email: r.user.email || null }
          : null,
        createdAt: r.createdAt || null,
      }))

    return NextResponse.json({ success: true, data: reviews })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Yorumlar yüklenemedi' }, { status: 500 })
  }
}
