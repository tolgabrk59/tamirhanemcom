import { NextRequest, NextResponse } from 'next/server'
import { sendSMS } from '@/lib/netgsm'

function buildProfileMessage(body: Record<string, string | undefined>): string {
  const { name, username } = body
  const parts: string[] = []

  if (name) {
    parts.push(`Merhaba ${name}`)
  } else {
    parts.push('Merhaba')
  }

  parts.push('TamirHanem uyeliginiz olusturuldu.')

  if (username) {
    parts.push(`Kullanici adiniz: ${username}`)
  }

  parts.push('Giris icin: tamirhanem.com')

  return parts.join(', ')
}

function buildAppointmentMessage(body: Record<string, string | boolean | undefined>): string {
  const { name, serviceName, categoryName, appointmentDate, appointmentTime, isGuest } = body
  const parts: string[] = []

  if (name) {
    parts.push(`Merhaba ${name as string}`)
  } else {
    parts.push('Merhaba')
  }

  parts.push('TamirHanem randevunuz olusturuldu.')

  if (serviceName) {
    parts.push(`Servis: ${serviceName as string}`)
  }

  if (categoryName) {
    parts.push(`Hizmet: ${categoryName as string}`)
  }

  if (appointmentDate) {
    const timeStr = appointmentTime ? ` Saat: ${appointmentTime as string}` : ''
    parts.push(`Tarih: ${appointmentDate as string}${timeStr}`)
  }

  if (isGuest) {
    parts.push('Uye ol: tamirhanem.com/kayit')
  } else {
    parts.push('Detaylar icin: tamirhanem.com')
  }

  return parts.join(', ')
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { phone, type } = body

    if (!phone) {
      return NextResponse.json(
        { success: false, error: 'Telefon numarasi gerekli' },
        { status: 400 }
      )
    }

    const message = type === 'profile-created'
      ? buildProfileMessage(body)
      : buildAppointmentMessage(body)

    const result = await sendSMS(phone, message)

    return NextResponse.json({
      success: result.success,
      message: result.success ? 'SMS gonderildi' : result.message,
      messageId: result.messageId,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Bilinmeyen hata'
    console.error('SMS bildirim hatasi:', message)
    return NextResponse.json(
      { success: false, error: 'SMS gonderilemedi' },
      { status: 500 }
    )
  }
}
