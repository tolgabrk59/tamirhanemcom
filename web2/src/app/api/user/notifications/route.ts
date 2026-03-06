import { NextRequest, NextResponse } from 'next/server'

const STRAPI_API = (process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api').trim()
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN

// GET /api/user/notifications?jwt=X
// Kullanıcının teklif taleplerinden cevap gelenlerin sayısını döner
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const jwt = searchParams.get('jwt')

    if (!jwt) {
      return NextResponse.json({ success: false, count: 0 }, { status: 400 })
    }

    // JWT'den kullanıcıyı al
    const meRes = await fetch(`${STRAPI_API}/users/me`, {
      headers: { Authorization: `Bearer ${jwt}` },
    })

    if (!meRes.ok) {
      return NextResponse.json({ success: false, count: 0 }, { status: 401 })
    }

    const me = await meRes.json()
    const userId = me.id

    // isOfferRequest=true ve offerStatus "Teklif Bekliyor" dışındaki randevuları getir (cevap gelmiş)
    const res = await fetch(
      `${STRAPI_API}/appointments?filters[user][id][$eq]=${userId}&filters[isOfferRequest][$eq]=true&filters[offerStatus][$ne]=Teklif Bekliyor&pagination[pageSize]=50`,
      { headers: { Authorization: `Bearer ${STRAPI_TOKEN}` } }
    )

    if (!res.ok) {
      return NextResponse.json({ success: true, count: 0 })
    }

    const data = await res.json()
    const count = data?.meta?.pagination?.total || data?.data?.length || 0

    // Bildirim detayları
    const notifications = (data?.data || []).map((item: {
      id: number
      attributes: {
        offerStatus?: string
        offerPrice?: number
        offerDate?: string
        createdAt?: string
        service?: { data?: { id?: number; attributes?: { name?: string } } }
      }
    }) => ({
      id: item.id,
      offerStatus: item.attributes?.offerStatus || '',
      offerPrice: item.attributes?.offerPrice || null,
      offerDate: item.attributes?.offerDate || null,
      createdAt: item.attributes?.createdAt || '',
      serviceName: item.attributes?.service?.data?.attributes?.name || 'Bilinmiyor',
    }))

    return NextResponse.json({ success: true, count, notifications })
  } catch {
    return NextResponse.json({ success: false, count: 0 }, { status: 500 })
  }
}
