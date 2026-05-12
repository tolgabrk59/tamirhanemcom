import { NextRequest, NextResponse } from 'next/server'
import { adminFetch } from '@/lib/strapi-admin'

const STRAPI_API = (process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api').trim()
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN || ''

const NOTIFICATION_CM = '/content-manager/collection-types/api::notification.notification'

function apiHeaders(): HeadersInit {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${STRAPI_TOKEN}`,
  }
}

// JWT'den kullanıcı id'sini doğrula ve döndür
async function authenticateUser(jwt: string): Promise<{ ok: true; userId: number } | { ok: false }> {
  const meRes = await fetch(`${STRAPI_API}/users/me`, {
    headers: { Authorization: `Bearer ${jwt}` },
  })
  if (!meRes.ok) return { ok: false }
  const me = await meRes.json()
  return { ok: true, userId: me.id }
}

// GET — okuma REST API token ile (çalışıyor)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const jwt = searchParams.get('jwt')

    if (!jwt) {
      return NextResponse.json({ success: false, error: 'jwt gerekli' }, { status: 400 })
    }

    const auth = await authenticateUser(jwt)
    if (!auth.ok) {
      return NextResponse.json({ success: false, error: 'Kullanıcı doğrulanamadı' }, { status: 401 })
    }

    const res = await fetch(
      `${STRAPI_API}/notifications?filters[user][id][$eq]=${auth.userId}&populate=*&sort=createdAt:desc&pagination[pageSize]=100`,
      { headers: apiHeaders() }
    )

    if (!res.ok) {
      return NextResponse.json({ success: false, error: 'Bildirimler alınamadı' }, { status: res.status })
    }

    const data = await res.json()
    return NextResponse.json({ success: true, data })
  } catch {
    return NextResponse.json({ success: false, error: 'Sunucu hatası' }, { status: 500 })
  }
}

// PUT — yazma admin content-manager API ile (REST token yazma izni yok)
// Body: { jwt, id }
export async function PUT(request: NextRequest) {
  try {
    const { jwt, id } = await request.json()

    if (!jwt || !id) {
      return NextResponse.json({ success: false, error: 'jwt ve id gerekli' }, { status: 400 })
    }

    const auth = await authenticateUser(jwt)
    if (!auth.ok) {
      return NextResponse.json({ success: false, error: 'Kullanıcı doğrulanamadı' }, { status: 401 })
    }

    const res = await adminFetch(`${NOTIFICATION_CM}/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ read: true }),
    })

    if (!res.ok) {
      const text = await res.text()
      console.error(`Bildirim güncelleme hatası [${id}]:`, res.status, text.substring(0, 200))
      return NextResponse.json({ success: false, error: 'Bildirim güncellenemedi' }, { status: res.status })
    }

    const data = await res.json()
    return NextResponse.json({ success: true, data })
  } catch {
    return NextResponse.json({ success: false, error: 'Sunucu hatası' }, { status: 500 })
  }
}

// DELETE — silme admin content-manager API ile
// Body: { jwt, id } veya { jwt, ids: number[] } veya { jwt, clearAll: true }
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { jwt, id, ids, clearAll } = body as {
      jwt?: string
      id?: number
      ids?: number[]
      clearAll?: boolean
    }

    if (!jwt) {
      return NextResponse.json({ success: false, error: 'jwt gerekli' }, { status: 400 })
    }

    const auth = await authenticateUser(jwt)
    if (!auth.ok) {
      return NextResponse.json({ success: false, error: 'Kullanıcı doğrulanamadı' }, { status: 401 })
    }

    // Silinecek id'leri belirle
    let deleteIds: number[]

    if (clearAll) {
      deleteIds = await fetchUserNotificationIds(auth.userId)
    } else {
      deleteIds = ids && Array.isArray(ids) ? ids : id ? [id] : []
    }

    if (deleteIds.length === 0) {
      return NextResponse.json({ success: true, deleted: 0, failed: 0, total: 0 })
    }

    const batchSize = 20
    let deleted = 0
    let failed = 0

    for (let i = 0; i < deleteIds.length; i += batchSize) {
      const batch = deleteIds.slice(i, i + batchSize)
      const results = await Promise.allSettled(
        batch.map(notifId =>
          adminFetch(`${NOTIFICATION_CM}/${notifId}`, { method: 'DELETE' })
        )
      )

      for (const r of results) {
        if (r.status === 'fulfilled' && r.value.ok) {
          deleted++
        } else {
          failed++
        }
      }
    }

    return NextResponse.json({ success: true, deleted, failed, total: deleteIds.length })
  } catch {
    return NextResponse.json({ success: false, error: 'Sunucu hatası' }, { status: 500 })
  }
}

// Kullanıcıya ait tüm bildirim id'lerini sayfalayarak topla
async function fetchUserNotificationIds(userId: number): Promise<number[]> {
  const allIds: number[] = []
  let page = 1
  const pageSize = 100

  while (true) {
    const res = await fetch(
      `${STRAPI_API}/notifications?filters[user][id][$eq]=${userId}&fields[0]=id&pagination[page]=${page}&pagination[pageSize]=${pageSize}`,
      { headers: apiHeaders() }
    )
    if (!res.ok) break

    const json = await res.json()
    const items = json.data || []
    if (items.length === 0) break

    for (const item of items) {
      allIds.push(item.id)
    }

    const totalPages = json.meta?.pagination?.pageCount
    if (totalPages && page >= totalPages) break
    if (items.length < pageSize) break
    page++
  }

  return allIds
}
