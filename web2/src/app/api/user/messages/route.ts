import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const STRAPI_API = (process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api').trim()

interface StrapiUser {
  id: number
  username: string
  email: string
  name?: string
  surname?: string
  phone?: string
}

// GET /api/user/messages
// Kullanıcının conversation'larını ve son mesajlarını döner
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization')
    const jwt = authHeader?.replace('Bearer ', '').trim()

    if (!jwt) {
      return NextResponse.json({ success: false, error: 'JWT gerekli' }, { status: 400 })
    }

    // 1. Kullanıcı bilgisini JWT ile doğrula
    const meRes = await fetch(`${STRAPI_API}/users/me`, {
      headers: { Authorization: `Bearer ${jwt}` },
    })

    if (!meRes.ok) {
      return NextResponse.json({ success: false, error: 'Kullanıcı doğrulanamadı' }, { status: 401 })
    }

    const me: StrapiUser = await meRes.json()

    // 2. Kullanıcının conversation'larını JWT ile çek (Strapi v5 flat format)
    const convsRes = await fetch(
      `${STRAPI_API}/conversations?filters[user][id][$eq]=${me.id}&populate[service][fields][0]=name&populate[service][fields][1]=phone&populate[service][fields][2]=location&sort=updatedAt:desc&pagination[pageSize]=50`,
      { headers: { Authorization: `Bearer ${jwt}` } }
    )

    if (!convsRes.ok) {
      return NextResponse.json({ success: false, error: 'Konuşmalar alınamadı' }, { status: convsRes.status })
    }

    const convsData = await convsRes.json()
    const conversations = convsData.data || []

    // 3. Her conversation için son mesajı ve okunmamış sayısını çek
    const results = await Promise.all(
      conversations.map(async (conv: Record<string, unknown>) => {
        const convId = conv.id as number
        // Strapi v5: flat format, no attributes wrapper
        const service = (conv.service as Record<string, unknown>) || {}

        // Son mesajı çek
        const msgsRes = await fetch(
          `${STRAPI_API}/messages?filters[conversation][id][$eq]=${convId}&sort=createdAt:desc&pagination[pageSize]=1&populate[senderUser][fields][0]=id&populate[senderService][fields][0]=id`,
          { headers: { Authorization: `Bearer ${jwt}` } }
        )

        let lastMessage = null
        let unreadCount = 0

        if (msgsRes.ok) {
          const msgsData = await msgsRes.json()
          const msgs = msgsData.data || []
          if (msgs.length > 0) {
            const msg = msgs[0] as Record<string, unknown>
            lastMessage = {
              id: msg.id as number,
              text: String(msg.text || ''),
              isRead: Boolean(msg.isRead),
              createdAt: String(msg.createdAt || ''),
              senderType: msg.senderUser ? 'user' : 'service',
            }
          }

          // Okunmamış mesaj sayısı (servisten gelen, senderUser yoksa service mesajı)
          const unreadRes = await fetch(
            `${STRAPI_API}/messages?filters[conversation][id][$eq]=${convId}&filters[isRead][$eq]=false&filters[senderUser][id][$null]=true&pagination[pageSize]=1`,
            { headers: { Authorization: `Bearer ${jwt}` } }
          )
          if (unreadRes.ok) {
            const unreadData = await unreadRes.json()
            unreadCount = unreadData.meta?.pagination?.total || 0
          }
        }

        return {
          id: convId,
          type: String(conv.type ?? 'general'),
          createdAt: String(conv.createdAt || ''),
          updatedAt: String(conv.updatedAt || ''),
          service: {
            id: (service.id as number) || 0,
            name: String(service.name ?? 'Servis'),
            location: String(service.location ?? ''),
            phone: String(service.phone ?? ''),
          },
          lastMessage,
          unreadCount,
        }
      })
    )

    return NextResponse.json({ success: true, conversations: results, userId: me.id })
  } catch (err) {
    console.error('[messages] Hata:', err)
    return NextResponse.json({ success: false, error: 'Sunucu hatası' }, { status: 500 })
  }
}

// POST /api/user/messages — Yeni mesaj gönder
// Body: { conversationId, text }  —  JWT from Authorization header
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization')
    const jwt = authHeader?.replace('Bearer ', '').trim()

    if (!jwt) {
      return NextResponse.json({ success: false, error: 'JWT gerekli' }, { status: 400 })
    }

    const { conversationId, text } = await request.json()

    if (!conversationId || !text) {
      return NextResponse.json({ success: false, error: 'conversationId ve text gerekli' }, { status: 400 })
    }

    // Kullanıcı bilgisini JWT ile doğrula
    const meRes = await fetch(`${STRAPI_API}/users/me`, {
      headers: { Authorization: `Bearer ${jwt}` },
    })

    if (!meRes.ok) {
      return NextResponse.json({ success: false, error: 'Kullanıcı doğrulanamadı' }, { status: 401 })
    }

    const me: StrapiUser = await meRes.json()

    // Mesajı kullanıcı JWT ile oluştur
    const res = await fetch(`${STRAPI_API}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        data: {
          text: text.trim(),
          isRead: false,
          conversation: conversationId,
          senderUser: me.id,
        },
      }),
    })

    if (!res.ok) {
      return NextResponse.json({ success: false, error: 'Mesaj gönderilemedi' }, { status: res.status })
    }

    const data = await res.json()
    return NextResponse.json({ success: true, message: data.data })
  } catch (err) {
    console.error('[messages] POST hata:', err)
    return NextResponse.json({ success: false, error: 'Sunucu hatası' }, { status: 500 })
  }
}
