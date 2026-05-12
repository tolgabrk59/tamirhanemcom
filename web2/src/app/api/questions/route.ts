import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/mailer'

export const dynamic = 'force-dynamic'

const STRAPI_API = (process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api').trim()
const ADMIN_EMAIL = process.env.ADMIN_NOTIFY_EMAIL || process.env.STRAPI_ADMIN_EMAIL || ''

// GET /api/questions?jwt=X  → kullanıcının sorularını listeler
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const jwt = searchParams.get('jwt')

    if (!jwt) return NextResponse.json({ success: false, error: 'jwt gerekli' }, { status: 400 })

    const res = await fetch(
      `${STRAPI_API}/service-questions?populate[service]=*&populate[user]=*&sort=createdAt:desc`,
      { headers: { Authorization: `Bearer ${jwt}` }, cache: 'no-store' }
    )

    if (!res.ok) {
      return NextResponse.json({ success: false, error: 'Sorular alınamadı' }, { status: res.status })
    }

    const raw = await res.json()
    const items: Array<Record<string, unknown>> = Array.isArray(raw)
      ? raw
      : Array.isArray(raw?.data)
        ? raw.data
        : []

    const data = items.map((item) => {
      const service = item.service as Record<string, unknown> | null
      const serviceAttrs = (service as { attributes?: Record<string, unknown> } | null)?.attributes || service || {}

      return {
        id: item.id as number,
        serviceName: String(serviceAttrs.name || item.serviceName || ''),
        question: String(item.question || item.content || ''),
        date: new Date(String(item.createdAt || '')).toLocaleDateString('tr-TR', {
          day: 'numeric', month: 'long', year: 'numeric',
        }),
        status: (item.status === 'answered' || item.answeredAt) ? 'yanitlandi' : 'yanitsiz',
        answer: String(item.answer || ''),
        answeredBy: String(item.answeredBy || ''),
        answeredAt: item.answeredAt
          ? new Date(String(item.answeredAt)).toLocaleDateString('tr-TR', {
              day: 'numeric', month: 'long', year: 'numeric',
            })
          : '',
      }
    })

    return NextResponse.json({ success: true, data })
  } catch {
    return NextResponse.json({ success: false, error: 'Sunucu hatası' }, { status: 500 })
  }
}

// POST /api/questions  → yeni soru gönder
export async function POST(request: NextRequest) {
  try {
    const { jwt, serviceName, question } = await request.json()

    if (!jwt || !serviceName || !question) {
      return NextResponse.json({ success: false, error: 'Eksik parametre' }, { status: 400 })
    }

    if (question.trim().length < 10) {
      return NextResponse.json({ success: false, error: 'Soru en az 10 karakter olmalıdır' }, { status: 400 })
    }

    // JWT doğrula
    const meRes = await fetch(`${STRAPI_API}/users/me`, {
      headers: { Authorization: `Bearer ${jwt}` },
      cache: 'no-store',
    })
    if (!meRes.ok) return NextResponse.json({ success: false, error: 'Yetkisiz' }, { status: 401 })
    const me = await meRes.json()

    // Strapi'ye kaydet
    let savedId: number | null = null
    const strapiRes = await fetch(`${STRAPI_API}/service-questions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        data: {
          serviceName,
          question,
          status: 'pending',
          user: me.id,
        },
      }),
    })

    if (strapiRes.ok) {
      const saved = await strapiRes.json()
      savedId = saved?.data?.id || saved?.id || null
    }
    // Strapi koleksiyon yoksa da e-posta gönder, hata döndürme

    // Admin'e e-posta bildirimi
    if (ADMIN_EMAIL) {
      await sendEmail(
        ADMIN_EMAIL,
        `TamirHanem — Yeni Soru: ${serviceName}`,
        `
          <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:24px">
            <h2 style="color:#d4a017;margin-bottom:4px">TamirHanem</h2>
            <p style="color:#666;font-size:13px;margin-bottom:20px">Yeni bir kullanıcı sorusu geldi</p>
            <table style="width:100%;border-collapse:collapse;font-size:14px">
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #eee;color:#888;width:120px">Kullanıcı</td>
                <td style="padding:10px 0;border-bottom:1px solid #eee;color:#111;font-weight:600">
                  ${me.name || me.username} (${me.email || ''})
                </td>
              </tr>
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #eee;color:#888">Servis</td>
                <td style="padding:10px 0;border-bottom:1px solid #eee;color:#111;font-weight:600">${serviceName}</td>
              </tr>
            </table>
            <div style="background:#f9f9f9;border-radius:10px;padding:16px;margin-top:20px">
              <div style="font-size:12px;color:#888;margin-bottom:6px;text-transform:uppercase;letter-spacing:.5px">Soru</div>
              <p style="color:#111;font-size:15px;line-height:1.6;margin:0">${question}</p>
            </div>
            <p style="color:#aaa;font-size:12px;margin-top:20px">
              Soru ID: ${savedId ?? 'kaydedilemedi'} · ${new Date().toLocaleString('tr-TR')}
            </p>
          </div>
        `
      )
    }

    // Kullanıcıya onay e-postası
    if (me.email) {
      await sendEmail(
        me.email,
        'TamirHanem — Sorunuz Alındı',
        `
          <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px">
            <h2 style="color:#d4a017;margin-bottom:8px">TamirHanem</h2>
            <p style="color:#333;font-size:15px">Merhaba <strong>${me.name || me.username}</strong>,</p>
            <p style="color:#555;font-size:14px">
              "<strong>${serviceName}</strong>" servisi hakkındaki sorunuz başarıyla iletildi.
              Servis ekibi en kısa sürede yanıt verecektir.
            </p>
            <div style="background:#f5f5f5;border-radius:10px;padding:16px;margin:20px 0">
              <div style="font-size:12px;color:#888;margin-bottom:6px">Sorunuz</div>
              <p style="color:#111;font-size:14px;line-height:1.6;margin:0">${question}</p>
            </div>
            <p style="color:#aaa;font-size:12px">Bu e-postayı siz talep etmediyseniz görmezden gelebilirsiniz.</p>
          </div>
        `
      )
    }

    return NextResponse.json({ success: true, message: 'Sorunuz iletildi' })
  } catch {
    return NextResponse.json({ success: false, error: 'Sunucu hatası' }, { status: 500 })
  }
}
