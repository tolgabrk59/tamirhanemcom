import { NextRequest, NextResponse } from 'next/server'
import { getRedis } from '@/lib/cache/redis'
import { sendSMS } from '@/lib/netgsm'
import { sendEmail } from '@/lib/mailer'

export const dynamic = 'force-dynamic'

const OTP_TTL = 300 // 5 dakika

// Redis yoksa in-memory fallback
const memStore = new Map<string, { otp: string; exp: number }>()

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

function otpKey(type: 'phone' | 'email', userId: number, value: string): string {
  return `profile-otp:${type}:${userId}:${value.replace(/[^a-zA-Z0-9]/g, '')}`
}

function memSet(key: string, otp: string) {
  memStore.set(key, { otp, exp: Date.now() + OTP_TTL * 1000 })
}

function memGet(key: string): string | null {
  const entry = memStore.get(key)
  if (!entry) return null
  if (Date.now() > entry.exp) { memStore.delete(key); return null }
  return entry.otp
}

function memDel(key: string) {
  memStore.delete(key)
}

// POST /api/profile/verify  → OTP gönder
export async function POST(request: NextRequest) {
  try {
    const { jwt, userId, type, value } = await request.json()

    if (!jwt || !userId || !type || !value) {
      return NextResponse.json({ success: false, error: 'Eksik parametre' }, { status: 400 })
    }

    if (type !== 'phone' && type !== 'email') {
      return NextResponse.json({ success: false, error: 'Geçersiz tip' }, { status: 400 })
    }

    // Kullanıcının JWT'si gerçekten kendisine ait mi kontrol et
    const STRAPI_API = (process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api').trim()
    const meRes = await fetch(`${STRAPI_API}/users/me`, {
      headers: { Authorization: `Bearer ${jwt}` },
      cache: 'no-store',
    })
    if (!meRes.ok) return NextResponse.json({ success: false, error: 'Yetkisiz' }, { status: 401 })
    const me = await meRes.json()
    if (me.id !== userId) return NextResponse.json({ success: false, error: 'Yetkisiz' }, { status: 401 })

    const otp = generateOTP()
    const redis = getRedis()
    const key = otpKey(type, userId, value)

    if (redis) {
      await redis.set(key, otp, { ex: OTP_TTL })
    } else {
      memSet(key, otp)
    }

    if (type === 'phone') {
      const cleanPhone = value.replace(/\D/g, '')
      if (!/^[5][0-9]{9}$/.test(cleanPhone)) {
        return NextResponse.json({ success: false, error: 'Geçersiz telefon numarası' }, { status: 400 })
      }
      const sms = await sendSMS(cleanPhone, `TamirHanem dogrulama kodunuz: ${otp}. 5 dakika gecerlidir.`)
      if (!sms.success) {
        return NextResponse.json({ success: false, error: sms.message }, { status: 500 })
      }
      return NextResponse.json({ success: true, message: 'SMS gönderildi' })
    }

    // email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return NextResponse.json({ success: false, error: 'Geçersiz e-posta adresi' }, { status: 400 })
    }

    const emailResult = await sendEmail(
      value,
      'TamirHanem — E-posta Doğrulama',
      `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px">
          <h2 style="color:#d4a017;margin-bottom:8px">TamirHanem</h2>
          <p style="color:#333;font-size:15px">E-posta adresinizi doğrulamak için aşağıdaki kodu kullanın:</p>
          <div style="background:#f5f5f5;border-radius:12px;padding:20px;text-align:center;margin:20px 0">
            <span style="font-size:32px;font-weight:bold;letter-spacing:8px;color:#111">${otp}</span>
          </div>
          <p style="color:#888;font-size:13px">Bu kod 5 dakika süreyle geçerlidir.</p>
          <p style="color:#888;font-size:13px">Bu isteği siz yapmadıysanız e-postayı görmezden gelin.</p>
        </div>
      `
    )

    if (!emailResult.success) {
      // SMTP yapılandırılmamışsa kullanıcıya bildir
      return NextResponse.json(
        { success: false, error: 'E-posta gönderilemedi. Lütfen yönetici ile iletişime geçin.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, message: 'E-posta gönderildi' })
  } catch {
    return NextResponse.json({ success: false, error: 'Sunucu hatası' }, { status: 500 })
  }
}

// PUT /api/profile/verify  → OTP doğrula ve güncelle
export async function PUT(request: NextRequest) {
  try {
    const { jwt, userId, type, value, otp } = await request.json()

    if (!jwt || !userId || !type || !value || !otp) {
      return NextResponse.json({ success: false, error: 'Eksik parametre' }, { status: 400 })
    }

    const redis = getRedis()
    const key = otpKey(type, userId, value)

    let stored: string | null = null
    if (redis) {
      stored = await redis.get<string>(key)
    } else {
      stored = memGet(key)
    }

    if (!stored || String(stored) !== String(otp)) {
      return NextResponse.json({ success: false, error: 'Doğrulama kodu hatalı veya süresi dolmuş' }, { status: 400 })
    }

    // OTP doğruysa sil
    if (redis) await redis.del(key)
    else memDel(key)

    // Strapi'de güncelle
    const STRAPI_API = (process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api').trim()
    const body = type === 'phone'
      ? { phone: value.replace(/\D/g, '') }
      : { email: value }

    const res = await fetch(`${STRAPI_API}/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      return NextResponse.json(
        { success: false, error: err?.error?.message || 'Güncelleme başarısız' },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true, message: type === 'phone' ? 'Telefon güncellendi' : 'E-posta güncellendi' })
  } catch {
    return NextResponse.json({ success: false, error: 'Sunucu hatası' }, { status: 500 })
  }
}
