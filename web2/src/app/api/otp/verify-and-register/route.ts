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

    const responseText = await response.text()
    let result: Record<string, unknown>
    try {
      result = JSON.parse(responseText)
    } catch {
      console.error('[OTP verify] Strapi JSON değil:', response.status, responseText.slice(0, 200))
      return NextResponse.json(
        { success: false, error: 'Strapi sunucusuna erişilemiyor. Lütfen daha sonra tekrar deneyin.' },
        { status: 502 }
      )
    }

    console.log('[OTP verify] Strapi status:', response.status)
    console.log('[OTP verify] Strapi response:', JSON.stringify(result, null, 2))

    if (!response.ok || result.success === false) {
      console.error('[OTP verify] Doğrulama başarısız:', result.message || result.error)
      return NextResponse.json(
        {
          success: false,
          error: (result.message || (result.error as { message?: string })?.message || 'Doğrulama başarısız') as string,
          remainingAttempts: result.remainingAttempts as number | undefined,
        },
        { status: response.status }
      )
    }

    const user = result.user as { id?: number; username?: string } | undefined
    console.log('[OTP verify] User found:', user?.id, user?.username, 'JWT:', !!result.jwt)

    return NextResponse.json({
      success: true,
      message: (result.message || 'Doğrulama başarılı') as string,
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
