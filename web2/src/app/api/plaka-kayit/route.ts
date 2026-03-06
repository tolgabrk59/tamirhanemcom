import { NextRequest, NextResponse } from 'next/server'
import { createUser, createVehicle } from '@/lib/strapi-admin'

export const dynamic = 'force-dynamic'

const STRAPI_API = (process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api').trim()
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN

const PLAKA_REGEX = /^(0[1-9]|[1-7][0-9]|8[01])[A-Z]{1,3}\d{1,4}$/i
const PHONE_REGEX = /^5[0-9]{9}$/

function normalizePlaka(raw: string): string {
  return raw.replace(/\s+/g, '').toUpperCase()
}

function normalizePhone(raw: string): string {
  return raw.replace(/[\s\-\+]/g, '').replace(/^90/, '').replace(/^0/, '')
}

const getHeaders = () => ({
  'Content-Type': 'application/json',
  ...(STRAPI_TOKEN && { Authorization: `Bearer ${STRAPI_TOKEN}` }),
})

/**
 * Plaka'nın vehicles koleksiyonunda olup olmadığını kontrol et.
 * Not: $contains filtresi tam çalışmayabiliyor, JS tarafında da kontrol yapılır.
 */
async function isPlateRegistered(plaka: string): Promise<boolean> {
  try {
    const res = await fetch(
      `${STRAPI_API}/vehicles?filters[plate][$contains]=${plaka}&populate=user`,
      { headers: getHeaders(), cache: 'no-store' }
    )
    if (!res.ok) return false

    const json = await res.json()
    const vehicles = json.data || []

    for (const v of vehicles) {
      const attrs = v.attributes || v
      const vPlate = (attrs.plate || '').replace(/\s+/g, '').toUpperCase()
      if (vPlate === plaka) {
        const userData = attrs.user?.data?.attributes || attrs.user
        if (userData?.phone) return true
      }
    }
  } catch (e) {
    console.error('[plaka-kayit] Duplicate kontrol hatası:', e)
  }
  return false
}

/**
 * Telefon numarasına göre mevcut kullanıcıyı bul.
 */
async function findUserByPhone(phone: string): Promise<number | null> {
  try {
    const res = await fetch(
      `${STRAPI_API}/users?filters[phone]=${phone}`,
      { headers: getHeaders(), cache: 'no-store' }
    )
    if (!res.ok) return null

    const users = await res.json()
    const list = Array.isArray(users) ? users : (users.data || [])
    for (const u of list) {
      if (u.phone === phone) return u.id
    }
  } catch (e) {
    console.error('[plaka-kayit] User arama hatası:', e)
  }
  return null
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { plaka: plakaRaw, telefon: telefonRaw, isim, kvkkConsent } = body

    // Validation
    if (!plakaRaw || !telefonRaw) {
      return NextResponse.json(
        { success: false, error: 'Plaka ve telefon numarası zorunludur' },
        { status: 400 }
      )
    }

    if (!kvkkConsent) {
      return NextResponse.json(
        { success: false, error: 'KVKK onayı zorunludur' },
        { status: 400 }
      )
    }

    const plaka = normalizePlaka(plakaRaw)
    const telefon = normalizePhone(telefonRaw)

    if (!PLAKA_REGEX.test(plaka)) {
      return NextResponse.json(
        { success: false, error: 'Geçersiz plaka formatı (örn: 34ABC123)' },
        { status: 400 }
      )
    }

    if (!PHONE_REGEX.test(telefon)) {
      return NextResponse.json(
        { success: false, error: 'Geçersiz telefon numarası (5XX XXX XX XX)' },
        { status: 400 }
      )
    }

    // Duplicate check — bu plaka zaten telefon numaralı bir kullanıcıya bağlı mı?
    const alreadyExists = await isPlateRegistered(plaka)
    if (alreadyExists) {
      return NextResponse.json(
        { success: false, error: 'Bu plaka zaten kayıtlı' },
        { status: 409 }
      )
    }

    console.log('[plaka-kayit] Yeni kayıt:', plaka, 'telefon:', telefon)

    // Mevcut kullanıcı var mı?
    let userId = await findUserByPhone(telefon)

    // Kullanıcı yoksa oluştur
    if (!userId) {
      const ts = Date.now()
      const rnd = Math.random().toString(36).substring(2, 8)
      const user = await createUser({
        username: `Plaka_${ts}_${rnd}`,
        email: `plaka_${ts}_${rnd}@plaka.tamirhanem.com`,
        password: `PK${ts}${rnd}!`,
        phone: telefon,
        isWebGuest: true,
      })
      userId = user.id
      console.log('[plaka-kayit] Kullanıcı oluşturuldu, id:', userId)
    } else {
      console.log('[plaka-kayit] Mevcut kullanıcı bulundu, id:', userId)
    }

    // Araç oluştur
    const vehicle = await createVehicle({
      plate: plaka,
      brand: 'BELIRLENECEK',
      model: isim || '-',
      year: new Date().getFullYear(),
      user: userId,
    })

    console.log('[plaka-kayit] Araç oluşturuldu, id:', vehicle.id)

    return NextResponse.json({
      success: true,
      message: 'Plakanız başarıyla kaydedildi. Artık size mesaj gönderilebilir.',
    })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Bilinmeyen hata'
    console.error('[plaka-kayit] Hata:', msg)
    return NextResponse.json(
      { success: false, error: 'Kayıt oluşturulamadı. Lütfen daha sonra tekrar deneyin.' },
      { status: 500 }
    )
  }
}
