import { NextRequest, NextResponse } from 'next/server'

const STRAPI_API = (process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api').trim()
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN || ''

// POST /api/user/appointments/[id]/cancel — apphakan ile aynı endpoint yapısı
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { jwt, cancelReason, cancelReasonKey, cancelChoice } = body as {
      jwt: string
      cancelReason?: string
      cancelReasonKey?: string
      cancelChoice?: 'wallet_refund' | 'free_rebooking'
    }

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
    const meData = await meRes.json()
    const userId = meData.id

    // Randevuyu çek — tarih ve fiyat bilgisi lazım
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
      refundPercent = 100
      penaltyLevel = 'free'
      refundAmount = totalPrice
      penaltyAmount = 0
    } else if (hoursLeft > 6) {
      refundPercent = 70
      penaltyLevel = 'partial_high'
      hasRebookingRight = true
      refundAmount = cancelChoice === 'free_rebooking' ? 0 : Number((totalPrice * 0.70).toFixed(2))
      servicePayment = Number((totalPrice * 0.24).toFixed(2))
      platformCommission = Number((totalPrice * 0.06).toFixed(2))
      penaltyAmount = totalPrice - refundAmount
    } else if (hoursLeft >= 3) {
      refundPercent = 50
      penaltyLevel = 'partial'
      hasRebookingRight = true
      refundAmount = cancelChoice === 'free_rebooking' ? 0 : Number((totalPrice * 0.50).toFixed(2))
      servicePayment = Number((totalPrice * 0.40).toFixed(2))
      platformCommission = Number((totalPrice * 0.10).toFixed(2))
      penaltyAmount = totalPrice - refundAmount
    } else {
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
    if (cancelReasonKey) updateData.cancelReasonKey = cancelReasonKey

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

    // Cüzdana iade + Transaction kaydı
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

          await fetch(`${STRAPI_API}/wallets/${walletId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${STRAPI_TOKEN}` },
            body: JSON.stringify({ data: { balance: currentBalance + refundAmount } }),
          })

          await fetch(`${STRAPI_API}/wallet-transactions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${STRAPI_TOKEN}` },
            body: JSON.stringify({
              data: {
                type: 'refund',
                amount: refundAmount,
                description: `Randevu #${id} iptal iadesi (%${refundPercent})`,
                status: 'completed',
                user: userId,
                appointment: Number(id),
                notes: JSON.stringify({ appointmentId: id, refundPercent, penaltyLevel, cancelChoice: cancelChoice || 'wallet_refund', hoursLeft: Math.max(0, Math.floor(hoursLeft)) }),
              },
            }),
          }).catch(() => {})
        }
      } catch { /* cüzdan başarısız olsa bile iptal geçerli */ }
    }

    return NextResponse.json({
      success: true,
      data,
      message: cancelChoice === 'free_rebooking'
        ? 'Randevu iptal edildi. 24 saat içinde aynı servisten ücretsiz randevu alabilirsiniz.'
        : refundAmount > 0
          ? `Randevu iptal edildi. %${refundPercent} iade cüzdanınıza yansıtıldı.`
          : 'Randevu iptal edildi.',
      penalty: { refundPercent, refundAmount, penaltyAmount, platformCommission, servicePayment, penaltyLevel, hasRebookingRight, cancelChoice: cancelChoice || null, hoursLeft: Math.max(0, Math.floor(hoursLeft)) },
    })
  } catch {
    return NextResponse.json({ success: false, error: 'Sunucu hatası' }, { status: 500 })
  }
}
