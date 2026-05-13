import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const STRAPI = process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api'

export async function POST(request: NextRequest) {
  try {
    const jwt = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!jwt) {
      return NextResponse.json({ success: false, error: 'Yetkilendirme gerekli' }, { status: 401 })
    }

    const { campaignIds } = (await request.json()) as { campaignIds: number[] }
    if (!Array.isArray(campaignIds) || campaignIds.length === 0) {
      return NextResponse.json({ success: true, data: {} })
    }

    const ids = campaignIds.slice(0, 20)
    const results = await Promise.allSettled(
      ids.map(id =>
        fetch(`${STRAPI}/wash-home-campaigns/${id}/eligibility`, {
          headers: { Authorization: `Bearer ${jwt}`, 'Content-Type': 'application/json' },
        })
          .then(r => r.json())
          .then(data => ({ id, eligible: data?.eligible === true || data?.data?.eligible === true }))
          .catch(() => ({ id, eligible: true }))
      )
    )

    const out: Record<number, { eligible: boolean }> = {}
    for (const r of results) {
      if (r.status === 'fulfilled') {
        out[r.value.id] = { eligible: r.value.eligible }
      }
    }

    return NextResponse.json({ success: true, data: out })
  } catch {
    return NextResponse.json({ success: false, error: 'Uygunluk kontrolü başarısız' }, { status: 500 })
  }
}
