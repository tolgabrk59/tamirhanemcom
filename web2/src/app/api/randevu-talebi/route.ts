import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rate-limit'

const STRAPI_API = 'https://api.tamirhanem.com/api'

export async function POST(request: NextRequest) {
  try {
    // Rate limit: write preset for POST
    const rateLimitResponse = await rateLimit(request, 'write')
    if (rateLimitResponse) return rateLimitResponse

    const body = await request.json()
    const {
      phone, name, city, district, brand, model, year, fuelType, category, notes,
      service_id, appointment_date, appointment_time, jwt, userId,
    } = body

    // Guest appointment: no jwt/userId — accept but mark as guest
    if (!jwt || !userId) {
      console.info('[randevu-talebi] Guest appointment request (no jwt/userId)', { phone, city, brand, model })
      return NextResponse.json({
        success: true,
        id: Date.now(),
        guest: true,
        message: 'Randevu talebiniz alındı. En kısa sürede sizinle iletişime geçeceğiz.',
      })
    }

    const authHeader = { 'Authorization': `Bearer ${jwt}`, 'Content-Type': 'application/json' }

    // Kategori ID bul
    let categoryId = null
    if (category) {
      try {
        const catResponse = await fetch(
          `${STRAPI_API}/categories?filters[name][$eq]=${encodeURIComponent(category)}`,
          { headers: authHeader }
        )
        const catResult = await catResponse.json()
        if (catResult.data && catResult.data.length > 0) {
          categoryId = catResult.data[0].id
        }
      } catch (catError: unknown) {
        console.warn('[randevu-talebi] Kategori arama hatasi:', category, catError instanceof Error ? catError.message : catError)
      }
    }

    // Araç oluştur veya mevcut olanı bul
    let vehicleId = null
    const plate = `WEB-${phone.slice(-4)}-${Date.now().toString().slice(-4)}`

    try {
      const vehicleSearchRes = await fetch(
        `${STRAPI_API}/vehicles?filters[user][id][$eq]=${userId}&filters[brand][$eq]=${encodeURIComponent(brand)}&filters[model][$eq]=${encodeURIComponent(model)}`,
        { headers: authHeader }
      )
      const vehicleSearchData = await vehicleSearchRes.json()

      if (vehicleSearchData.data && vehicleSearchData.data.length > 0) {
        vehicleId = vehicleSearchData.data[0].id
      } else {
        const vehicleRes = await fetch(`${STRAPI_API}/vehicles`, {
          method: 'POST',
          headers: authHeader,
          body: JSON.stringify({
            data: {
              brand,
              model,
              plate,
              year: year ? parseInt(year) : 2020,
              fuelType: fuelType || 'Benzin',
              user: userId,
              publishedAt: new Date().toISOString(),
            },
          }),
        })
        const vehicleResult = await vehicleRes.json()
        if (vehicleRes.ok && vehicleResult.data) {
          vehicleId = vehicleResult.data.id
        }
      }
    } catch (e: unknown) {
      console.error('[randevu-talebi] Araç işlemi hatası:', e instanceof Error ? e.message : e)
    }

    // Guest-like fallback: vehicleId could not be resolved — still accept but mark it
    if (!vehicleId) {
      console.warn('[randevu-talebi] vehicleId null — falling back to guest-like mode', { userId, brand, model })
      return NextResponse.json({
        success: true,
        id: Date.now(),
        guest: true,
        message: 'Randevu talebiniz alındı. En kısa sürede sizinle iletişime geçeceğiz.',
      })
    }

    // Randevu tarihi
    let preferredDateTime = null
    let availableDates = null

    if (appointment_date && appointment_time) {
      preferredDateTime = `${appointment_date}T${appointment_time}:00.000Z`
      availableDates = [{ date: appointment_date, timeSlot: `${appointment_time}-${appointment_time}` }]
    } else {
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      const dateStr = tomorrow.toISOString().split('T')[0]
      preferredDateTime = `${dateStr}T10:00:00.000Z`
      availableDates = [{ date: dateStr, timeSlot: '10:00-12:00' }]
    }

    // Randevu oluştur
    const response = await fetch(`${STRAPI_API}/appointments`, {
      method: 'POST',
      headers: authHeader,
      body: JSON.stringify({
        data: {
          user: userId,
          vehicle: vehicleId,
          service: service_id ? parseInt(service_id) : null,
          category: categoryId,
          status: 'Beklemede',
          note: `${city}${district ? ' / ' + district : ''}`,
          faultDescription: notes || null,
          preferredDateTime,
          availableDates,
          isQuickService: true,
        },
      }),
    })

    const result = await response.json()

    if (!response.ok) {
      console.error('[randevu-talebi] Strapi randevu oluşturulamadı:', result)
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'APPOINTMENT_CREATION_FAILED',
            message: 'Randevu oluşturulamadı. Lütfen tekrar deneyin.',
          },
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      id: result.data?.id,
      message: 'Randevu talebiniz alındı. En kısa sürede sizinle iletişime geçeceğiz.',
    })
  } catch (error: unknown) {
    console.error('[randevu-talebi] Randevu talebi hatası:', error instanceof Error ? error.message : error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Randevu talebi işlenirken bir hata oluştu.',
        },
      },
      { status: 500 }
    )
  }
}
