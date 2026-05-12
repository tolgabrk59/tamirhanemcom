import { NextRequest } from 'next/server'
import { success, badRequest, serverError } from '@/lib/api-response'
import { rateLimit } from '@/lib/rate-limit'

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TELEGRAM_CHAT_IDS = process.env.TELEGRAM_CHAT_IDS

export async function POST(request: NextRequest) {
  try {
    // Rate limit: write preset for POST
    const rateLimitResponse = await rateLimit(request, 'write')
    if (rateLimitResponse) return rateLimitResponse

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_IDS) {
      console.warn('[notifications/whatsapp] TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_IDS not configured — skipping notification')
      return success({ sent: false, reason: 'notification_service_not_configured' })
    }

    const body = await request.json()
    const {
      name, phone, city, district, brand, model, year,
      category, notes, service,
      isRegistered, username,
      appointmentDate, appointmentTime,
    } = body

    if (!phone || !city || !brand || !model) {
      return badRequest('Eksik bilgi: phone, city, brand, model zorunludur')
    }

    const lines = [
      '🔔 *Yeni Randevu Talebi*',
      '',
      `👤 *Ad:* ${name || 'Belirtilmedi'}`,
      `📞 *Telefon:* ${phone}`,
      `📍 *Konum:* ${city}${district ? ' / ' + district : ''}`,
      `🚗 *Araç:* ${brand} ${model}${year ? ' (' + year + ')' : ''}`,
      `🔧 *Kategori:* ${category || 'Belirtilmedi'}`,
      ...(service ? [`🏪 *Servis:* ${service}`] : []),
      ...(appointmentDate ? [`📅 *Tarih:* ${appointmentDate}${appointmentTime ? ' ' + appointmentTime : ''}`] : []),
      ...(notes ? [`📝 *Not:* ${notes}`] : []),
      '',
      `✅ *Kayıt:* ${isRegistered ? 'Evet' : 'Hayır'}${username ? ' (@' + username + ')' : ''}`,
      '',
      '🌐 _TamirHanem Web_',
    ]

    const text = lines.join('\n')
    const chatIds = TELEGRAM_CHAT_IDS.split(',').map((id) => id.trim())

    for (const chatId of chatIds) {
      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: 'Markdown',
        }),
      }).catch((sendError: unknown) => {
        console.error(`[notifications/whatsapp] Telegram mesaj gonderilemedi chatId=${chatId}:`, sendError instanceof Error ? sendError.message : sendError)
      })
    }

    return success({ sent: true })
  } catch (error: unknown) {
    console.error('[notifications/whatsapp] Notification error:', error instanceof Error ? error.message : error)
    return serverError('Bildirim gonderilemedi')
  }
}
