import { NextRequest, NextResponse } from 'next/server'
import { serverError } from '@/lib/api-response'

const STRAPI_API = (process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api').trim()
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN

interface StrapiUserAttributes {
  name?: string
  username?: string
  phone?: string
}

interface StrapiUserEntry {
  id: number
  attributes?: StrapiUserAttributes
  name?: string
  username?: string
  phone?: string
}

interface StrapiUserResponse {
  data?: StrapiUserEntry[]
}

interface StrapiVehicleAttributes {
  brand?: string
  model?: string
  year?: number | null
  fuelType?: string | null
  plate?: string | null
}

interface StrapiVehicleEntry {
  id: number
  attributes?: StrapiVehicleAttributes
  brand?: string
  model?: string
  year?: number | null
  fuelType?: string | null
  plate?: string | null
}

interface StrapiVehiclesResponse {
  data?: StrapiVehicleEntry[]
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const phone = searchParams.get('phone')

    if (!phone) {
      return NextResponse.json(
        { success: false, error: 'Telefon numarasi gerekli' },
        { status: 400 }
      )
    }

    if (!STRAPI_TOKEN) {
      return NextResponse.json(
        { success: false, error: 'Sunucu yapilandirma hatasi' },
        { status: 500 }
      )
    }

    const cleanPhone = phone.replace(/[\s\-\+\(\)]/g, '').replace(/^90/, '')
    const fullPhone = '+90' + cleanPhone

    console.log('[check-phone] Searching for phone:', { input: phone, cleanPhone, fullPhone })

    // Strapi'de users-customers'ta telefon ile ara — birden fazla format dene
    // 1. Önce $contains ile son 10 haneyi ara (format bağımsız)
    const last10 = cleanPhone.slice(-10)
    const res = await fetch(
      `${STRAPI_API}/users-customers?filters[phone][$contains]=${encodeURIComponent(last10)}&populate=*`,
      {
        headers: {
          Authorization: 'Bearer ' + STRAPI_TOKEN,
          'Content-Type': 'application/json',
        },
      }
    )

    if (!res.ok) {
      console.error('[check-phone] Strapi response not ok:', res.status, res.statusText)
      return serverError('Telefon kontrolu sirasinda bir hata olustu')
    }

    const result: StrapiUserResponse = await res.json()

    console.log('[check-phone] Strapi result count:', result.data?.length || 0, 'for', fullPhone)

    if (!result.data || result.data.length === 0) {
      // +90 ile bulamadıysa, 0 veya düz numara ile de dene
      const altPhones = [cleanPhone, '0' + cleanPhone]
      console.log('[check-phone] Not found with +90, trying alternatives:', altPhones)
      for (const altPhone of altPhones) {
        try {
          const altRes = await fetch(
            `${STRAPI_API}/users-customers?filters[phone][$eq]=${encodeURIComponent(altPhone)}&populate=*`,
            {
              headers: {
                Authorization: 'Bearer ' + STRAPI_TOKEN,
                'Content-Type': 'application/json',
              },
            }
          )
          if (altRes.ok) {
            const altResult: StrapiUserResponse = await altRes.json()
            if (altResult.data && altResult.data.length > 0) {
              // Alternatif format ile bulundu — ana akışa devam
              result.data = altResult.data
              break
            }
          }
        } catch (altError: unknown) {
          console.warn('[check-phone] Alternatif arama hatasi:', altPhone, altError instanceof Error ? altError.message : altError)
        }
      }
    }

    if (!result.data || result.data.length === 0) {
      console.log('[check-phone] User NOT FOUND after all attempts for:', phone)
      return NextResponse.json({ success: true, exists: false, vehicles: [] })
    }

    const rawUser: StrapiUserEntry = result.data[0]
    // Strapi v4: data[].attributes içinde, Strapi v5+: data[] düz
    const userAttrs: StrapiUserAttributes = rawUser.attributes || rawUser
    const userId = rawUser.id

    // Kullanıcının araçlarını çek
    let vehicles: { id: number; brand: string; model: string; year: number | null; fuelType: string | null; plate: string | null }[] = []
    try {
      const vehiclesRes = await fetch(
        `${STRAPI_API}/vehicles?filters[user][id][$eq]=${userId}&filters[brand][$ne]=BELIRLENECEK`,
        {
          headers: {
            Authorization: 'Bearer ' + STRAPI_TOKEN,
            'Content-Type': 'application/json',
          },
        }
      )
      const vehiclesData: StrapiVehiclesResponse = await vehiclesRes.json()
      if (vehiclesData.data) {
        vehicles = vehiclesData.data.map((v: StrapiVehicleEntry) => {
          const va: StrapiVehicleAttributes = v.attributes || v
          return {
            id: v.id,
            brand: va.brand || '',
            model: va.model || '',
            year: va.year || null,
            fuelType: va.fuelType || null,
            plate: va.plate || null,
          }
        })
      }
    } catch (vehicleError: unknown) {
      console.error('[check-phone] Arac cekilemedi userId=' + userId + ':', vehicleError instanceof Error ? vehicleError.message : vehicleError)
    }

    console.log(`[check-phone] Phone: ${fullPhone}, UserId: ${userId}, Name: ${userAttrs.name}, Vehicles: ${vehicles.length}`)

    return NextResponse.json({
      success: true,
      exists: true,
      user: {
        id: userId,
        name: userAttrs.name || null,
        username: userAttrs.username || null,
      },
      vehicles,
    })
  } catch (error: unknown) {
    console.error('[check-phone] Telefon kontrol hatasi:', error instanceof Error ? error.message : error)
    return serverError('Telefon kontrolu sirasinda bir hata olustu')
  }
}
