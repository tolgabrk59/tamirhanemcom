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
    const { phone } = body

    if (!phone) {
      return NextResponse.json(
        { success: false, error: 'Telefon numarası gerekli' },
        { status: 400 }
      )
    }

    const cleanPhone = phone.replace(/[\s\-\+]/g, '').replace(/^90/, '')

    if (!/^[5][0-9]{9}$/.test(cleanPhone)) {
      return NextResponse.json(
        { success: false, error: 'Geçersiz telefon numarası formatı' },
        { status: 400 }
      )
    }

    const response = await fetch(`${STRAPI_API}/web-guest-booking/send-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Web-Form-Token': WEB_FORM_TOKEN,
        'Origin': 'https://tamirhanem.com',
        'Referer': 'https://tamirhanem.com/',
      },
      body: JSON.stringify({ phone: cleanPhone }),
    })

    const responseText = await response.text()
    let result: Record<string, unknown>
    try {
      result = JSON.parse(responseText)
    } catch {
      console.error('[OTP send] Strapi JSON değil:', response.status, responseText.slice(0, 200))
      return NextResponse.json(
        { success: false, error: 'Strapi sunucusuna erişilemiyor. Lütfen daha sonra tekrar deneyin.' },
        { status: 502 }
      )
    }

    if (!response.ok || result.success === false) {
      return NextResponse.json(
        { success: false, error: (result.message || (result.error as { message?: string })?.message || 'SMS gönderilemedi') as string },
        { status: response.status }
      )
    }

    return NextResponse.json({
      success: true,
      message: result.message || 'Doğrulama kodu SMS ile gönderildi',
      expiresAt: Math.floor(Date.now() / 1000) + 300,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('OTP send failed:', message)
    return NextResponse.json(
      { success: false, error: 'SMS gönderilirken hata oluştu' },
      { status: 500 }
    )
  }
}
