import { NextRequest, NextResponse } from 'next/server'
import { sendSMS } from '@/lib/netgsm'

export const dynamic = 'force-dynamic'

const STRAPI_API = (process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api').trim()
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN

const getHeaders = () => ({
  'Content-Type': 'application/json',
  ...(STRAPI_TOKEN && { Authorization: `Bearer ${STRAPI_TOKEN}` }),
})

/**
 * Plaka'ya ait telefon numarasını bul.
 * 1) arac-plakalar → owner_phone
 * 2) vehicles (populate user) → user.phone
 */
async function findOwnerPhone(plaka: string): Promise<{ phone: string; recordId?: number } | null> {
  // 1) arac-plakalar
  try {
    const res = await fetch(
      `${STRAPI_API}/arac-plakalar?filters[plaka][$eq]=${plaka}&filters[is_active][$eq]=true`,
      { headers: getHeaders(), cache: 'no-store' }
    )
    if (res.ok) {
      const json = await res.json()
      const record = json.data?.[0]
      if (record) {
        const phone = record.attributes?.owner_phone || record.owner_phone
        console.log('[send] arac-plakalar bulundu, id:', record.id, 'phone:', phone ? 'VAR' : 'YOK')
        if (phone) return { phone, recordId: record.id }
      }
    }
  } catch (e) {
    console.error('[send] arac-plakalar hatası:', e)
  }

  // 2) vehicles — $contains ile boşluklu/boşluksuz eşleşme
  try {
    const res = await fetch(
      `${STRAPI_API}/vehicles?filters[plate][$contains]=${plaka}&populate=user`,
      { headers: getHeaders(), cache: 'no-store' }
    )
    if (res.ok) {
      const json = await res.json()
      const vehicles = json.data || []
      console.log('[send] vehicles sonuç:', vehicles.length, 'adet')

      for (const v of vehicles) {
        const attrs = v.attributes || v
        const vPlate = (attrs.plate || '').replace(/\s+/g, '').toUpperCase()
        if (vPlate !== plaka) continue

        // User relation'dan telefonu çek
        const userData = attrs.user?.data?.attributes || attrs.user
        const phone = userData?.phone
        console.log('[send] vehicle eşleşti, plate:', attrs.plate, 'phone:', phone || 'YOK')

        if (phone) return { phone }

        // Eğer populate çalışmadıysa, user ID ile ayrıca çek
        const userId = attrs.user?.data?.id || attrs.user?.id
        if (userId && !phone) {
          console.log('[send] User populate boş, userId ile ayrıca çekiliyor:', userId)
          try {
            const userRes = await fetch(
              `${STRAPI_API}/users-customers/${userId}`,
              { headers: getHeaders(), cache: 'no-store' }
            )
            if (userRes.ok) {
              const userJson = await userRes.json()
              const userAttrs = userJson.data?.attributes || userJson.data
              const userPhone = userAttrs?.phone
              console.log('[send] users-customers phone:', userPhone || 'YOK')
              if (userPhone) return { phone: userPhone }
            }
          } catch {
            console.error('[send] users-customers fetch hatası')
          }
        }
      }
    }
  } catch (e) {
    console.error('[send] vehicles hatası:', e)
  }

  return null
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { plaka: plakaRaw, message } = body

    if (!plakaRaw) {
      return NextResponse.json(
        { success: false, error: 'Plaka gerekli' },
        { status: 400 }
      )
    }

    if (!message || message.trim().length < 5) {
      return NextResponse.json(
        { success: false, error: 'Mesaj en az 5 karakter olmalıdır' },
        { status: 400 }
      )
    }

    const plaka = plakaRaw.replace(/\s+/g, '').toUpperCase()
    console.log('[send] Plaka:', plaka, 'Mesaj uzunluk:', message.trim().length)

    // Plaka sahibinin telefonunu bul
    const owner = await findOwnerPhone(plaka)

    if (!owner) {
      console.log('[send] Plaka sahibi bulunamadı:', plaka)
      return NextResponse.json(
        { success: false, error: 'Bu plaka sistemde kayıtlı değil veya iletişim bilgisi bulunamadı' },
        { status: 404 }
      )
    }

    console.log('[send] Telefon bulundu, SMS gönderiliyor...')

    // Strapi'ye mesajı kaydet
    try {
      await fetch(`${STRAPI_API}/park-mesajlari`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          data: {
            target_plaka: owner.recordId || undefined,
            plaka_text: plaka,
            message: message.trim().substring(0, 500),
            status: 'sent',
          },
        }),
      })
    } catch {
      console.error('[send] Strapi park-mesaj kayıt başarısız, SMS devam ediyor')
    }

    // SMS gönder
    const shortMessage = message.trim().length > 80
      ? message.trim().substring(0, 77) + '...'
      : message.trim()

    const smsText = `TamirHanem - Araciniz hatali park bildirimi almistir: ${shortMessage} tamirhanem.com`

    const smsResult = await sendSMS(owner.phone, smsText)

    if (!smsResult.success) {
      console.error('[send] SMS gönderilemedi:', smsResult.error, smsResult.message)
      return NextResponse.json({
        success: true,
        smsSent: false,
        message: 'Bildiriminiz kaydedildi ancak SMS gönderilemedi. Lütfen daha sonra tekrar deneyin.',
      })
    }

    console.log('[send] SMS başarılı, messageId:', smsResult.messageId)

    return NextResponse.json({
      success: true,
      smsSent: true,
      message: 'Bildiriminiz araç sahibine SMS olarak iletildi.',
    })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Bilinmeyen hata'
    console.error('[send] Park mesaj gönderme hatası:', msg)
    return NextResponse.json(
      { success: false, error: 'Mesaj gönderilemedi' },
      { status: 500 }
    )
  }
}
