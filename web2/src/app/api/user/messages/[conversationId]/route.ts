import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const STRAPI_API = (process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api').trim()

// GET /api/user/messages/[conversationId]
// Bir conversation'ın tüm mesajlarını döner
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  try {
    const { conversationId } = await params
    const authHeader = request.headers.get('Authorization')
    const jwt = authHeader?.replace('Bearer ', '').trim()

    if (!jwt) {
      return NextResponse.json({ success: false, error: 'JWT gerekli' }, { status: 400 })
    }

    // JWT ile kullanıcı doğrula
    const meRes = await fetch(`${STRAPI_API}/users/me`, {
      headers: { Authorization: `Bearer ${jwt}` },
    })

    if (!meRes.ok) {
      return NextResponse.json({ success: false, error: 'Kullanıcı doğrulanamadı' }, { status: 401 })
    }

    const me = await meRes.json()

    // Mesajları JWT ile çek (Strapi v5 flat format)
    const msgsRes = await fetch(
      `${STRAPI_API}/messages?filters[conversation][id][$eq]=${conversationId}&sort=createdAt:asc&pagination[pageSize]=100&populate[senderUser][fields][0]=id&populate[senderUser][fields][1]=username&populate[senderService][fields][0]=id&populate[senderService][fields][1]=name`,
      { headers: { Authorization: `Bearer ${jwt}` } }
    )

    if (!msgsRes.ok) {
      return NextResponse.json({ success: false, error: 'Mesajlar alınamadı' }, { status: msgsRes.status })
    }

    const msgsData = await msgsRes.json()
    const rawMsgs = msgsData.data || []

    // Strapi v5 flat format — no .attributes wrapper
    const messages = rawMsgs.map((msg: Record<string, unknown>) => {
      const senderUser = msg.senderUser as Record<string, unknown> | null
      const senderService = msg.senderService as Record<string, unknown> | null

      return {
        id: msg.id as number,
        text: String(msg.text || ''),
        isRead: Boolean(msg.isRead),
        createdAt: String(msg.createdAt || ''),
        senderType: senderUser ? 'user' : 'service',
        senderName: senderUser
          ? String(senderUser.username || '')
          : senderService
            ? String(senderService.name || '')
            : '',
      }
    })

    return NextResponse.json({ success: true, messages, userId: me.id })
  } catch (err) {
    console.error('[messages/conv] GET hata:', err)
    return NextResponse.json({ success: false, error: 'Sunucu hatası' }, { status: 500 })
  }
}

// PUT /api/user/messages/[conversationId] — Servis mesajlarını okundu yap
// JWT from Authorization header
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  try {
    const { conversationId } = await params
    const authHeader = request.headers.get('Authorization')
    const jwt = authHeader?.replace('Bearer ', '').trim()

    if (!jwt) {
      return NextResponse.json({ success: false, error: 'JWT gerekli' }, { status: 400 })
    }

    // JWT ile kullanıcı doğrula
    const meRes = await fetch(`${STRAPI_API}/users/me`, {
      headers: { Authorization: `Bearer ${jwt}` },
    })

    if (!meRes.ok) {
      return NextResponse.json({ success: false, error: 'Kullanıcı doğrulanamadı' }, { status: 401 })
    }

    // Okunmamış servis mesajlarını bul (senderUser yoksa = servis mesajı)
    const msgsRes = await fetch(
      `${STRAPI_API}/messages?filters[conversation][id][$eq]=${conversationId}&filters[isRead][$eq]=false&filters[senderUser][id][$null]=true&pagination[pageSize]=100`,
      { headers: { Authorization: `Bearer ${jwt}` } }
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
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwt}`,
          },
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
