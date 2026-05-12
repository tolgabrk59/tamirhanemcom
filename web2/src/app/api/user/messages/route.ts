import { NextRequest, NextResponse } from 'next/server'

const STRAPI_API = (process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api').trim()
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN || ''

function apiHeaders(): HeadersInit {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${STRAPI_TOKEN}`,
  }
}

interface StrapiUser {
  id: number
  username: string
  email: string
  name?: string
  surname?: string
  phone?: string
}

// GET /api/user/messages?jwt=X
// Kullanıcının conversation'larını ve son mesajlarını döner
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const jwt = searchParams.get('jwt')

    if (!jwt) {
      return NextResponse.json({ success: false, error: 'jwt gerekli' }, { status: 400 })
    }

    // 1. Kullanıcı bilgisini JWT ile doğrula
    const meRes = await fetch(`${STRAPI_API}/users/me`, {
      headers: { Authorization: `Bearer ${jwt}` },
    })

    if (!meRes.ok) {
      return NextResponse.json({ success: false, error: 'Kullanıcı doğrulanamadı' }, { status: 401 })
    }

    const me: StrapiUser = await meRes.json()

    // 2. Kullanıcının conversation'larını API token ile çek
    const convsRes = await fetch(
      `${STRAPI_API}/conversations?populate=*&filters[user][id][$eq]=${me.id}&sort=updatedAt:desc&pagination[pageSize]=50`,
      { headers: apiHeaders() }
    )

    if (!convsRes.ok) {
      return NextResponse.json({ success: false, error: 'Konuşmalar alınamadı' }, { status: convsRes.status })
    }

    const convsData = await convsRes.json()
    const conversations = convsData.data || []

    // 3. Her conversation için son mesajı çek
    const results = await Promise.all(
      conversations.map(async (conv: Record<string, unknown>) => {
        const convId = conv.id as number
        const convAttrs = (conv.attributes || conv) as Record<string, unknown>
        const service = (convAttrs.service as Record<string, unknown>) || {}
        const sData = (service as Record<string, unknown>).data as Record<string, unknown> | undefined
        const serviceAttrs = (sData?.attributes || (service as Record<string, unknown>).attributes || service) as Record<string, unknown>

        // Son mesajı çek
        const msgsRes = await fetch(
          `${STRAPI_API}/messages?filters[conversation][id][$eq]=${convId}&sort=createdAt:desc&pagination[pageSize]=1&populate=senderUser,senderService`,
          { headers: apiHeaders() }
        )

        let lastMessage = null
        let unreadCount = 0

        if (msgsRes.ok) {
          const msgsData = await msgsRes.json()
          const msgs = msgsData.data || []
          if (msgs.length > 0) {
            const msg = msgs[0]
            const msgAttrs = (msg.attributes || msg) as Record<string, unknown>
            lastMessage = {
              id: msg.id as number,
              text: String(msgAttrs.text || ''),
              isRead: Boolean(msgAttrs.isRead),
              createdAt: String(msgAttrs.createdAt || ''),
              senderType: msgAttrs.senderService ? 'service' : 'user',
            }
          }

          // Okunmamış mesaj sayısı (servisten gelen okunmamışlar)
          const unreadRes = await fetch(
            `${STRAPI_API}/messages?filters[conversation][id][$eq]=${convId}&filters[isRead][$eq]=false&filters[senderService][id][$notNull]=true&pagination[pageSize]=1`,
            { headers: apiHeaders() }
          )
          if (unreadRes.ok) {
            const unreadData = await unreadRes.json()
            unreadCount = unreadData.meta?.pagination?.total || 0
          }
        }

        return {
          id: convId,
          type: String(convAttrs.type || 'general'),
          createdAt: String(convAttrs.createdAt || ''),
          updatedAt: String(convAttrs.updatedAt || ''),
          service: {
            id: ((sData?.id || (service as Record<string, unknown>).id || 0) as number),
            name: String(serviceAttrs.name || 'Bilinmeyen Servis'),
            location: String(serviceAttrs.location || ''),
            phone: String(serviceAttrs.phone || ''),
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
// Body: { jwt, conversationId, text }
export async function POST(request: NextRequest) {
  try {
    const { jwt, conversationId, text } = await request.json()

    if (!jwt || !conversationId || !text) {
      return NextResponse.json({ success: false, error: 'jwt, conversationId ve text gerekli' }, { status: 400 })
    }

    // Kullanıcı bilgisini JWT ile doğrula
    const meRes = await fetch(`${STRAPI_API}/users/me`, {
      headers: { Authorization: `Bearer ${jwt}` },
    })

    if (!meRes.ok) {
      return NextResponse.json({ success: false, error: 'Kullanıcı doğrulanamadı' }, { status: 401 })
    }

    const me: StrapiUser = await meRes.json()

    // Mesajı API token ile oluştur
    const res = await fetch(`${STRAPI_API}/messages`, {
      method: 'POST',
      headers: apiHeaders(),
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
