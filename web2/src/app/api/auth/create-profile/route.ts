import { NextRequest } from 'next/server'
import { sendSMS } from '@/lib/netgsm'
import { success, badRequest, serverError } from '@/lib/api-response'
import { rateLimit } from '@/lib/rate-limit'

const STRAPI_API = (process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api').trim()
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN

function generateUsername(phone: string): string {
  const last4 = phone.slice(-4)
  const random = Math.random().toString(36).substring(2, 6)
  return 'user_' + last4 + random
}

function generatePassword(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let password = ''
  for (let i = 0; i < 8; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return password
}

export async function POST(request: NextRequest) {
  try {
    // Rate limit: write preset for POST
    const rateLimitResponse = await rateLimit(request, 'write')
    if (rateLimitResponse) return rateLimitResponse

    const body = await request.json()
    const { phone, name, city, district, brand, model, year, fuelType } = body

    if (!phone) {
      return badRequest('Telefon numarasi gerekli')
    }

    if (!STRAPI_TOKEN) {
      console.error('[create-profile] STRAPI_API_TOKEN not configured')
      return serverError('Sunucu yapilandirma hatasi')
    }

    const cleanPhone = phone.replace(/[\s\-\+\(\)]/g, '').replace(/^90/, '')

    const username = generateUsername(cleanPhone)
    const password = generatePassword()
    const email = cleanPhone + '@tamirhanem.auto'

    const plate = `WEB-${cleanPhone.slice(-4)}-${Date.now().toString().slice(-4)}`

    // Strapi'de kullanıcı oluştur
    const response = await fetch(STRAPI_API + '/users-customers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + STRAPI_TOKEN,
      },
      body: JSON.stringify({
        data: {
          phone: '+90' + cleanPhone,
          username,
          email,
          password,
          name: name || null,
          brand: brand || null,
          model: model || null,
          plate: plate,
          year: year ? parseInt(year) : null,
          fuelType: fuelType || null,
          city: city || null,
          district: district || null,
          phone_verified: true,
          status: 'active',
          auto_registered: true,
        },
      }),
    })

    let userId = null

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('[create-profile] Strapi profil olusturma hatasi:', response.status, errorData)
      return serverError('Profil olusturulamadi. Kullanici mevcut olabilir.')
    } else {
      const result = await response.json()
      userId = result.data?.id
    }

    // userId null check: if Strapi returned 200 but no ID, something is wrong
    if (!userId) {
      console.error('[create-profile] Strapi 200 döndü ama userId null — beklenmeyen durum')
      return serverError('Profil olusturuldu ancak kullanici ID alinamadi')
    }

    // Kullanıcıya SMS gönder
    const smsMessage = 'TamirHanem hesabiniz olusturuldu. Kullanici: ' + username + ' Sifre: ' + password + ' tamirhanem.com'

    try {
      await sendSMS(cleanPhone, smsMessage)
    } catch (smsError: unknown) {
      // SMS failure is non-critical — profile was already created, log and continue
      console.warn('[create-profile] Profil SMS gonderilemedi (profil olusturuldu, SMS atlanamaz degil):', smsError instanceof Error ? smsError.message : smsError)
    }

    return success({
      message: 'Profiliniz olusturuldu, bilgileriniz SMS ile gonderildi',
      userId,
      username,
    })
  } catch (error: unknown) {
    console.error('[create-profile] Profil olusturma hatasi:', error instanceof Error ? error.message : error)
    return serverError('Profil olusturulamadi')
  }
}
