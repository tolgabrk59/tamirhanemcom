import { NextRequest, NextResponse } from 'next/server'

const STRAPI_API = (process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api').trim()
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN || ''

function apiHeaders(): HeadersInit {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${STRAPI_TOKEN}`,
  }
}

// GET /api/user/messages/[conversationId]?jwt=X
// Bir conversation'ın tüm mesajlarını döner
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  try {
    const { conversationId } = await params
    const { searchParams } = new URL(request.url)
    const jwt = searchParams.get('jwt')

    if (!jwt) {
      return NextResponse.json({ success: false, error: 'jwt gerekli' }, { status: 400 })
    }

    // JWT ile kullanıcı doğrula
    const meRes = await fetch(`${STRAPI_API}/users/me`, {
      headers: { Authorization: `Bearer ${jwt}` },
    })

    if (!meRes.ok) {
      return NextResponse.json({ success: false, error: 'Kullanıcı doğrulanamadı' }, { status: 401 })
    }

    // Conversation bilgisini API token ile çek
    const convRes = await fetch(
      `${STRAPI_API}/conversations/${conversationId}?populate=*`,
      { headers: apiHeaders() }
    )

    if (!convRes.ok) {
      return NextResponse.json({ success: false, error: 'Konuşma bulunamadı' }, { status: 404 })
    }

    const convData = await convRes.json()
    const conv = convData.data || {}
    const convAttrs = (conv.attributes || conv) as Record<string, unknown>
    const service = (convAttrs.service as Record<string, unknown>) || {}
    const sData = (service as Record<string, unknown>).data as Record<string, unknown> | undefined
    const serviceAttrs = (sData?.attributes || (service as Record<string, unknown>).attributes || service) as Record<string, unknown>

    // Mesajları API token ile çek
    const msgsRes = await fetch(
      `${STRAPI_API}/messages?filters[conversation][id][$eq]=${conversationId}&sort=createdAt:asc&pagination[pageSize]=200&populate=senderUser,senderService`,
      { headers: apiHeaders() }
    )

    if (!msgsRes.ok) {
      return NextResponse.json({ success: false, error: 'Mesajlar alınamadı' }, { status: msgsRes.status })
    }

    const msgsData = await msgsRes.json()
    const rawMsgs = msgsData.data || []

    const messages = rawMsgs.map((msg: Record<string, unknown>) => {
      const attrs = (msg.attributes || msg) as Record<string, unknown>
      const senderUser = attrs.senderUser as Record<string, unknown> | null
      const senderService = attrs.senderService as Record<string, unknown> | null
      const suData = senderUser ? (senderUser as Record<string, unknown>).data as Record<string, unknown> | undefined : undefined
      const ssData = senderService ? (senderService as Record<string, unknown>).data as Record<string, unknown> | undefined : undefined
      const suAttrs = (suData?.attributes || (senderUser as Record<string, unknown> | null)?.attributes || senderUser) as Record<string, unknown> | null
      const ssAttrs = (ssData?.attributes || (senderService as Record<string, unknown> | null)?.attributes || senderService) as Record<string, unknown> | null

      return {
        id: msg.id as number,
        text: String(attrs.text || ''),
        isRead: Boolean(attrs.isRead),
        createdAt: String(attrs.createdAt || ''),
        senderType: ssAttrs && (ssData || (senderService as Record<string, unknown> | null)?.id) ? 'service' : 'user',
        senderName: ssAttrs && (ssData || (senderService as Record<string, unknown> | null)?.id)
          ? String(ssAttrs.name || 'Servis')
          : suAttrs
            ? String((suAttrs as Record<string, unknown>).name || (suAttrs as Record<string, unknown>).username || 'Kullanıcı')
            : 'Bilinmeyen',
      }
    })

    return NextResponse.json({
      success: true,
      conversation: {
        id: conv.id,
        type: String(convAttrs.type || 'general'),
        service: {
          id: ((sData?.id || (service as Record<string, unknown>).id || 0) as number),
          name: String(serviceAttrs.name || 'Bilinmeyen Servis'),
          location: String(serviceAttrs.location || ''),
          phone: String(serviceAttrs.phone || ''),
        },
      },
      messages,
    })
  } catch (err) {
    console.error('[messages/conv] Hata:', err)
    return NextResponse.json({ success: false, error: 'Sunucu hatası' }, { status: 500 })
  }
}

// PUT /api/user/messages/[conversationId] — Mesajları okundu yap
// Body: { jwt }
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  try {
    const { conversationId } = await params
    const { jwt } = await request.json()

    if (!jwt) {
      return NextResponse.json({ success: false, error: 'jwt gerekli' }, { status: 400 })
    }

    // JWT ile kullanıcı doğrula
    const meRes = await fetch(`${STRAPI_API}/users/me`, {
      headers: { Authorization: `Bearer ${jwt}` },
    })

    if (!meRes.ok) {
      return NextResponse.json({ success: false, error: 'Kullanıcı doğrulanamadı' }, { status: 401 })
    }

    // Okunmamış mesajları API token ile bul
    const msgsRes = await fetch(
      `${STRAPI_API}/messages?filters[conversation][id][$eq]=${conversationId}&filters[isRead][$eq]=false&filters[senderService][id][$notNull]=true&pagination[pageSize]=100`,
      { headers: apiHeaders() }
    )

    if (!msgsRes.ok) {
      return NextResponse.json({ success: false, error: 'Mesajlar alınamadı' }, { status: msgsRes.status })
    }

    const msgsData = await msgsRes.json()
    const unreadMsgs = msgsData.data || []

    // Hepsini okundu yap
    await Promise.all(
      unreadMsgs.map((msg: Record<string, unknown>) =>
        fetch(`${STRAPI_API}/messages/${msg.id}`, {
          method: 'PUT',
          headers: apiHeaders(),
          body: JSON.stringify({ data: { isRead: true } }),
        })
      )
    )

    return NextResponse.json({ success: true, markedCount: unreadMsgs.length })
  } catch (err) {
    console.error('[messages/conv] PUT hata:', err)
    return NextResponse.json({ success: false, error: 'Sunucu hatası' }, { status: 500 })
  }
}
