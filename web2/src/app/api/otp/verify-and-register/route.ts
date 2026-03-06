import { NextRequest, NextResponse } from 'next/server'

const STRAPI_API = 'https://api.tamirhanem.com/api'

export async function POST(request: NextRequest) {
  try {
    const WEB_FORM_TOKEN = process.env.WEB_FORM_TOKEN

    if (!WEB_FORM_TOKEN) {
      console.error('WEB_FORM_TOKEN not configured')
      return NextResponse.json(
        { success: false, error: 'Sunucu yapılandırma hatası' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { phone, code, name, brand, model, plate, year } = body

    if (!phone || !code) {
      return NextResponse.json(
        { success: false, error: 'Telefon ve doğrulama kodu gerekli' },
        { status: 400 }
      )
    }

    const cleanPhone = phone.replace(/[\s\-\+]/g, '').replace(/^90/, '')

    // Strapi plugin araç bilgisini vehicle nesnesi altında bekliyor
    const vehicle = {
      brand: brand || 'BELIRLENECEK',
      model: model || 'BELIRLENECEK',
      plate: plate || `WEB-${cleanPhone.slice(-4)}`,
      year: year || new Date().getFullYear(),
    }

    const response = await fetch(`${STRAPI_API}/web-guest-booking/verify-and-register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Web-Form-Token': WEB_FORM_TOKEN,
        'Origin': 'https://tamirhanem.com',
        'Referer': 'https://tamirhanem.com/',
      },
      body: JSON.stringify({
        phone: cleanPhone,
        code,
        name: name || undefined,
        vehicle,
      }),
    })

    const result = await response.json()

    if (!response.ok || result.success === false) {
      return NextResponse.json(
        {
          success: false,
          error: result.message || result.error?.message || 'Doğrulama başarısız',
          remainingAttempts: result.remainingAttempts,
        },
        { status: response.status }
      )
    }

    return NextResponse.json({
      success: true,
      message: result.message || 'Doğrulama başarılı',
      jwt: result.jwt,
      user: result.user,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Verify-register failed:', message)
    return NextResponse.json(
      { success: false, error: 'Doğrulama işlemi başarısız' },
      { status: 500 }
    )
  }
}
