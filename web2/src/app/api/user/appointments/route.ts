import { NextRequest, NextResponse } from 'next/server'

const STRAPI_API = (process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api').trim()
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN || ''

// Mobil referans: 10 durum — Strapi Türkçe ↔ Frontend canonical mapping
const STATUS_FROM_STRAPI: Record<string, string> = {
  'beklemede': 'pending',
  'pending': 'pending',
  'bekliyor': 'pending',
  'tarih belirlendi': 'date_proposed',
  'date_proposed': 'date_proposed',
  'onaylandı': 'confirmed',
  'onaylandi': 'confirmed',
  'confirmed': 'confirmed',
  'işlem başladı': 'in_progress',
  'islem basladi': 'in_progress',
  'in_progress': 'in_progress',
  'işlem bekliyor': 'waiting_process',
  'islem bekliyor': 'waiting_process',
  'waiting_process': 'waiting_process',
  'tamamlandı': 'completed',
  'tamamlandi': 'completed',
  'completed': 'completed',
  'iptal': 'cancelled',
  'cancelled': 'cancelled',
  'reddedildi': 'rejected',
  'rejected': 'rejected',
  'kullanıcı gelmedi': 'no_show',
  'kullanici gelmedi': 'no_show',
  'no_show': 'no_show',
  'ödeme bekliyor': 'awaiting_payment',
  'odeme bekliyor': 'awaiting_payment',
  'awaiting_payment': 'awaiting_payment',
}

const STATUS_TO_STRAPI: Record<string, string> = {
  pending: 'Beklemede',
  date_proposed: 'Tarih Belirlendi',
  confirmed: 'Onaylandı',
  in_progress: 'İşlem Başladı',
  waiting_process: 'İşlem Bekliyor',
  completed: 'Tamamlandı',
  cancelled: 'İptal',
  rejected: 'Reddedildi',
  no_show: 'Kullanıcı Gelmedi',
  awaiting_payment: 'Ödeme Bekliyor',
}

function normalizeStatus(raw: string): string {
  return STATUS_FROM_STRAPI[raw.toLowerCase().trim()] || 'pending'
}

// GET /api/user/appointments?jwt=X&status=PENDING
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const jwt = searchParams.get('jwt')
    const status = searchParams.get('status')
    const isOffer = searchParams.get('isOffer')

    if (!jwt) return NextResponse.json({ success: false, error: 'jwt gerekli' }, { status: 400 })

    let endpoint =
      `${STRAPI_API}/appointments` +
      `?populate[service][populate]=ProfilePicture` +
      `&populate[vehicle][populate]=*` +
      `&populate[category][populate]=*` +
      `&sort=createdAt:desc`

    if (status) endpoint += `&filters[status][$eq]=${status}`
    if (isOffer === 'true') endpoint += `&filters[isOfferRequest][$eq]=true`

    const res = await fetch(endpoint, { headers: { Authorization: `Bearer ${jwt}` } })

    if (!res.ok) return NextResponse.json({ success: false, error: 'Randevular alınamadı' }, { status: res.status })

    const raw = await res.json()

    // Strapi v5: doğrudan array döner (data wrapper yok, attributes wrapper yok)
    const items: Array<Record<string, unknown>> = Array.isArray(raw) ? raw : (Array.isArray(raw?.data) ? raw.data : [])

    const data = items.map((item) => {
      const service = item.service as Record<string, unknown> | null | undefined
      const vehicle = item.vehicle as Record<string, unknown> | null | undefined
      const category = item.category as Record<string, unknown> | null | undefined

      // Strapi v4/v5 uyumluluğu
      const serviceAttrs = (service as { attributes?: Record<string, unknown> } | null)?.attributes || service
      const vehicleAttrs = (vehicle as { attributes?: Record<string, unknown> } | null)?.attributes || vehicle
      const categoryAttrs = (category as { attributes?: Record<string, unknown> } | null)?.attributes || category

      // matchedDate: [{ date, timeSlot }] formatından al
      const matchedDate = item.matchedDate as Array<{ date?: string; timeSlot?: string }> | null | undefined
      const firstMatch = Array.isArray(matchedDate) ? matchedDate[0] : null

      const appointmentDate = firstMatch?.date || String(item.appointmentDate || item.preferredDateTime || '')
      const timeSlot = firstMatch?.timeSlot || String(item.timeSlot || '')

      const serviceId = service
        ? ((service as { id?: number }).id || (service as { data?: { id?: number } })?.data?.id || null)
        : null

      // Profil resmi
      const profilePic = serviceAttrs?.ProfilePicture as Record<string, unknown> | null | undefined
      const profilePicAttrs = (profilePic as { attributes?: Record<string, unknown> } | null)?.attributes || profilePic
      const serviceImage = profilePicAttrs?.url ? String(profilePicAttrs.url) : null

      return {
        id: item.id,
        status: normalizeStatus(String(item.status || 'pending')),
        rawStatus: String(item.status || ''),
        offerStatus: String(item.offerStatus || ''),
        offerPrice: Number(item.offerPrice || 0),
        isOfferRequest: Boolean(item.isOfferRequest),
        note: String(item.note || ''),
        cancelReason: String(item.cancelReason || ''),
        createdAt: String(item.createdAt || ''),
        updatedAt: String(item.updatedAt || ''),
        appointmentDate,
        timeSlot,
        serviceName: String(serviceAttrs?.name || ''),
        serviceAddress: String(serviceAttrs?.address || serviceAttrs?.adress || serviceAttrs?.location || ''),
        servicePhone: String(serviceAttrs?.phone || serviceAttrs?.phoneNumber || ''),
        serviceId,
        serviceImage,
        vehicleBrand: String(vehicleAttrs?.brand || ''),
        vehicleModel: String(vehicleAttrs?.model || ''),
        vehiclePlate: String(vehicleAttrs?.plate || ''),
        vehicleYear: String(vehicleAttrs?.year || ''),
        vehicleColor: String(vehicleAttrs?.color || ''),
        categoryName: String(categoryAttrs?.name || ''),
        // Mobil referans: ek alanlar
        hasUserRated: Boolean(item.hasUserRated),
        serviceCompletionConfirmed: Boolean(item.serviceCompletionConfirmed),
        userCompletionConfirmed: Boolean(item.userCompletionConfirmed),
        vehicleDelivered: Boolean(item.vehicleDelivered),
        serviceStartedAt: String(item.serviceStartedAt || ''),
        processStartedAt: String(item.processStartedAt || ''),
      }
    })

    return NextResponse.json({ success: true, data })
  } catch {
    return NextResponse.json({ success: false, error: 'Sunucu hatası' }, { status: 500 })
  }
}

// PUT /api/user/appointments — Randevu durumunu güncelle
// Mobil referans: action parametresiyle farklı senaryolar
// action: cancel | reject-offer | accept | confirm-completion | vehicle-received | confirm-attendance
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { jwt, id, action, status, cancelReason } = body

    if (!jwt || !id) {
      return NextResponse.json({ success: false, error: 'jwt ve id gerekli' }, { status: 400 })
    }

    // Kullanıcı doğrula
    const meRes = await fetch(`${STRAPI_API}/users/me`, {
      headers: { Authorization: `Bearer ${jwt}` },
    })
    if (!meRes.ok) {
      return NextResponse.json({ success: false, error: 'Kullanıcı doğrulanamadı' }, { status: 401 })
    }

    // Mobil referans: action bazlı endpoint routing
    const { cancelChoice } = body as { cancelChoice?: 'wallet_refund' | 'free_rebooking' }
    const resolvedAction = action || (status === 'cancelled' ? 'cancel' : 'update-status')

    switch (resolvedAction) {
      // ─── İptal: Müşteri randevuyu iptal eder ───
      // Mobil referans (apphakan) ceza şartları:
      // >24h=%100 iade | 6-24h=%70 iade | 3-6h=%50 iade | <3h=%0 iade + ücretsiz randevu
      case 'cancel': {
        // Önce randevuyu çek — tarih ve fiyat bilgisi lazım
        const aptRes = await fetch(`${STRAPI_API}/appointments/${id}?populate=*`, {
          headers: { Authorization: `Bearer ${STRAPI_TOKEN}` },
        })
        const aptRaw = await aptRes.json()
        const aptData = aptRaw.data || aptRaw

        // Randevu tarihini hesapla
        const matchedDate = aptData?.matchedDate as Array<{ date?: string; timeSlot?: string }> | null | undefined
        const firstMatch = Array.isArray(matchedDate) ? matchedDate[0] : null
        const aptDateStr = firstMatch?.date || String(aptData?.appointmentDate || aptData?.preferredDateTime || '')
        const aptTimeSlot = firstMatch?.timeSlot || String(aptData?.timeSlot || '')
        const aptTime = aptTimeSlot?.split('-')[0]?.trim() || '00:00'

        let hoursLeft = 999
        try {
          const aptDate = new Date(`${aptDateStr}T${aptTime}:00`)
          hoursLeft = (aptDate.getTime() - Date.now()) / (1000 * 60 * 60)
        } catch { /* tarih parse edilemezse ücretsiz iptal */ }

        // Ceza hesapla — apphakan 4 kademeli politika
        const totalPrice = Number(aptData?.offerPrice || aptData?.total_price || 0)
        let refundPercent = 100
        let penaltyLevel = 'free'
        let refundAmount = totalPrice
        let penaltyAmount = 0
        let platformCommission = 0
        let servicePayment = 0
        let hasRebookingRight = false

        if (hoursLeft > 24) {
          // >24 saat: %100 iade
          refundPercent = 100
          penaltyLevel = 'free'
          refundAmount = totalPrice
          penaltyAmount = 0
        } else if (hoursLeft > 6) {
          // 6-24 saat: %70 iade veya ücretsiz randevu (seçenek)
          refundPercent = 70
          penaltyLevel = 'partial_high'
          hasRebookingRight = true
          if (cancelChoice === 'free_rebooking') {
            refundAmount = 0
          } else {
            refundAmount = Number((totalPrice * 0.70).toFixed(2))
          }
          servicePayment = Number((totalPrice * 0.24).toFixed(2))
          platformCommission = Number((totalPrice * 0.06).toFixed(2))
          penaltyAmount = totalPrice - refundAmount
        } else if (hoursLeft >= 3) {
          // 3-6 saat: %50 iade veya ücretsiz randevu (seçenek)
          refundPercent = 50
          penaltyLevel = 'partial'
          hasRebookingRight = true
          if (cancelChoice === 'free_rebooking') {
            refundAmount = 0
          } else {
            refundAmount = Number((totalPrice * 0.50).toFixed(2))
          }
          servicePayment = Number((totalPrice * 0.40).toFixed(2))
          platformCommission = Number((totalPrice * 0.10).toFixed(2))
          penaltyAmount = totalPrice - refundAmount
        } else {
          // <3 saat: %0 iade, sadece ücretsiz yeniden randevu hakkı
          refundPercent = 0
          penaltyLevel = 'full'
          refundAmount = 0
          hasRebookingRight = true
          servicePayment = Number((totalPrice * 0.80).toFixed(2))
          platformCommission = Number((totalPrice * 0.20).toFixed(2))
          penaltyAmount = totalPrice
        }

        const updateData: Record<string, unknown> = {
          status: 'İptal',
          cancelledAt: new Date().toISOString(),
          cancelledBy: 'user',
          refundPercent,
          refundAmount,
          penaltyAmount,
          platformCommission,
          servicePayment,
          penaltyLevel,
          cancelChoice: cancelChoice || null,
          hasRebookingRight,
        }
        if (cancelReason) updateData.cancelReason = cancelReason

        const res = await fetch(`${STRAPI_API}/appointments/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${STRAPI_TOKEN}`,
          },
          body: JSON.stringify(updateData),
        })
        if (!res.ok) return NextResponse.json({ success: false, error: 'Randevu iptal edilemedi' }, { status: res.status })
        const data = await res.json()

        // ─── Cüzdana iade yansıt + Transaction kaydı oluştur ───
        const meData = await meRes.json()
        const userId = meData.id

        if (refundAmount > 0) {
          try {
            const walletRes = await fetch(
              `${STRAPI_API}/wallets?filters[user][id][$eq]=${userId}`,
              { headers: { Authorization: `Bearer ${STRAPI_TOKEN}` } }
            )
            const walletRaw = await walletRes.json()
            const wallets = Array.isArray(walletRaw) ? walletRaw : (walletRaw?.data || [])
            if (wallets.length > 0) {
              const wallet = wallets[0]
              const walletId = wallet.id
              const currentBalance = Number(wallet.attributes?.balance ?? wallet.balance ?? 0)

              // Bakiyeyi güncelle
              await fetch(`${STRAPI_API}/wallets/${walletId}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${STRAPI_TOKEN}`,
                },
                body: JSON.stringify({ data: { balance: currentBalance + refundAmount } }),
              })

              // Transaction kaydı oluştur
              await fetch(`${STRAPI_API}/wallet-transactions`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${STRAPI_TOKEN}`,
                },
                body: JSON.stringify({
                  data: {
                    type: 'refund',
                    amount: refundAmount,
                    description: `Randevu #${id} iptal iadesi (%${refundPercent})`,
                    status: 'completed',
                    user: userId,
                    appointment: id,
                    notes: JSON.stringify({
                      appointmentId: id,
                      refundPercent,
                      penaltyLevel,
                      cancelChoice: cancelChoice || 'wallet_refund',
                      hoursLeft: Math.max(0, Math.floor(hoursLeft)),
                    }),
                  },
                }),
              }).catch(() => { /* transaction oluşturulamazsa iptal geçerli */ })
            }
          } catch {
            // Cüzdan işlemi başarısız olsa bile iptal geçerli
          }
        }

        return NextResponse.json({
          success: true,
          data,
          message: cancelChoice === 'free_rebooking'
            ? 'Randevu iptal edildi. 24 saat içinde aynı servisten ücretsiz randevu alabilirsiniz.'
            : refundAmount > 0
              ? `Randevu iptal edildi. %${refundPercent} iade cüzdanınıza yansıtıldı.`
              : 'Randevu iptal edildi.',
          penalty: {
            refundPercent, refundAmount, penaltyAmount, platformCommission,
            servicePayment, penaltyLevel, hasRebookingRight,
            cancelChoice: cancelChoice || null,
            hoursLeft: Math.max(0, Math.floor(hoursLeft)),
          },
        })
      }

      // ─── Teklif Reddi: Müşteri tarih teklifini reddeder ───
      case 'reject-offer': {
        const res = await fetch(`${STRAPI_API}/appointments/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${STRAPI_TOKEN}`,
          },
          body: JSON.stringify({ status: 'Reddedildi' }),
        })
        if (!res.ok) return NextResponse.json({ success: false, error: 'Teklif reddedilemedi' }, { status: res.status })
        const data = await res.json()
        return NextResponse.json({ success: true, data, message: 'Tarih teklifi reddedildi' })
      }

      // ─── Kabul: Müşteri tarih teklifini kabul eder ───
      case 'accept': {
        const res = await fetch(`${STRAPI_API}/appointments/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${STRAPI_TOKEN}`,
          },
          body: JSON.stringify({ status: 'Onaylandı' }),
        })
        if (!res.ok) return NextResponse.json({ success: false, error: 'Randevu onaylanamadı' }, { status: res.status })
        const data = await res.json()
        return NextResponse.json({ success: true, data, message: 'Randevu onaylandı' })
      }

      // ─── Tamamlandı Onayı: Müşteri işin bittiğini onaylar ───
      case 'confirm-completion': {
        const res = await fetch(`${STRAPI_API}/appointments/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${STRAPI_TOKEN}`,
          },
          body: JSON.stringify({ userCompletionConfirmed: true }),
        })
        if (!res.ok) return NextResponse.json({ success: false, error: 'Tamamlanma onaylanamadı' }, { status: res.status })
        const data = await res.json()
        return NextResponse.json({ success: true, data, message: 'İşlem tamamlanması onaylandı' })
      }

      // ─── Araç Teslim Alındı ───
      case 'vehicle-received': {
        const res = await fetch(`${STRAPI_API}/appointments/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${STRAPI_TOKEN}`,
          },
          body: JSON.stringify({ vehicleReceivedAt: new Date().toISOString() }),
        })
        if (!res.ok) return NextResponse.json({ success: false, error: 'Araç teslim kaydı yapılamadı' }, { status: res.status })
        const data = await res.json()
        return NextResponse.json({ success: true, data, message: 'Araç teslim alındı' })
      }

      // ─── Katılım Onayı ───
      case 'confirm-attendance': {
        const res = await fetch(`${STRAPI_API}/appointments/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${STRAPI_TOKEN}`,
          },
          body: JSON.stringify({ katilim_durumu: 'katilacak', katilim_bildirim_zamani: new Date().toISOString() }),
        })
        if (!res.ok) return NextResponse.json({ success: false, error: 'Katılım onaylanamadı' }, { status: res.status })
        const data = await res.json()
        return NextResponse.json({ success: true, data, message: 'Katılım onaylandı' })
      }

      // ─── Genel Status Güncelleme (eski uyumluluk) ───
      case 'update-status':
      default: {
        if (!status) {
          return NextResponse.json({ success: false, error: 'status veya action gerekli' }, { status: 400 })
        }
        const strapiStatus = STATUS_TO_STRAPI[status] || status
        const updateData: Record<string, unknown> = { status: strapiStatus }
        if (cancelReason) updateData.cancelReason = cancelReason

        const res = await fetch(`${STRAPI_API}/appointments/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${STRAPI_TOKEN}`,
          },
          body: JSON.stringify(updateData),
        })
        if (!res.ok) return NextResponse.json({ success: false, error: 'Randevu güncellenemedi' }, { status: res.status })
        const data = await res.json()
        return NextResponse.json({ success: true, data })
      }
    }
  } catch {
    return NextResponse.json({ success: false, error: 'Sunucu hatası' }, { status: 500 })
  }
}
