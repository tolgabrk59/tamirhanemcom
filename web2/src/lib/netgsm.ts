const NETGSM_OTP_URL = 'https://api.netgsm.com.tr/sms/send/otp'

interface SMSResponse {
  success: boolean
  message: string
  messageId?: string
  error?: string
}

const turkishToAscii = (text: string): string =>
  text
    .replace(/ç/g, 'c').replace(/Ç/g, 'C')
    .replace(/ğ/g, 'g').replace(/Ğ/g, 'G')
    .replace(/ı/g, 'i').replace(/İ/g, 'I')
    .replace(/ö/g, 'o').replace(/Ö/g, 'O')
    .replace(/ş/g, 's').replace(/Ş/g, 'S')
    .replace(/ü/g, 'u').replace(/Ü/g, 'U')

export async function sendSMS(phone: string, message: string): Promise<SMSResponse> {
  const username = process.env.NETGSM_USERNAME
  const password = process.env.NETGSM_PASSWORD
  const header = process.env.NETGSM_HEADER

  if (!username || !password || !header) {
    console.error('NetGSM credentials not configured')
    return { success: false, message: 'SMS yapilandirmasi eksik', error: 'CONFIG_MISSING' }
  }

  const cleanPhone = phone.replace(/\D/g, '')
  const fullPhone = cleanPhone.length === 10 ? `90${cleanPhone}` : cleanPhone

  const asciiMessage = turkishToAscii(message)

  const params = new URLSearchParams({
    usercode: username,
    password: password,
    msgheader: header,
    msg: asciiMessage,
    no: fullPhone,
  })

  try {
    const response = await fetch(`${NETGSM_OTP_URL}?${params.toString()}`, {
      method: 'GET',
      signal: AbortSignal.timeout(30000),
    })

    const responseText = (await response.text()).trim()

    if (responseText.startsWith('00')) {
      const messageId = responseText.split(' ')[1] || 'unknown'
      return { success: true, message: 'SMS gonderildi', messageId }
    }

    const errorMessages: Record<string, string> = {
      '20': 'Mesaj metni bos veya gecersiz',
      '30': 'Gecersiz kullanici adi veya sifre',
      '40': 'Mesaj basligi tanimsiz',
      '50': 'OTP paketi tanimli degil',
      '51': 'Yetersiz OTP kredisi',
      '70': 'Gecersiz parametre',
      '80': 'Gonderim siniri asildi',
      '85': 'Mukerrer gonderim',
    }

    return {
      success: false,
      message: errorMessages[responseText] || `NetGSM hata: ${responseText}`,
      error: responseText,
    }
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Bilinmeyen hata'
    console.error('NetGSM SMS gonderim hatasi:', msg)
    return { success: false, message: 'SMS gonderilemedi', error: msg }
  }
}
