import { createLogger } from './logger';

const telegramLogger = createLogger('TELEGRAM');

interface NotificationData {
  name: string;
  phone: string;
  city: string;
  district?: string;
  brand: string;
  model: string;
  year?: string;
  category?: string;
  notes?: string;
  service?: string;
  // Randevu tarihi/saati
  appointmentDate?: string;
  appointmentTime?: string;
  // Üyelik bilgileri
  isRegistered?: boolean;
  username?: string;
  email?: string;
  plate?: string;
}

export async function sendTelegramNotification(data: NotificationData): Promise<{ success: boolean; error?: string }> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatIds = process.env.TELEGRAM_CHAT_IDS?.split(',').map(id => id.trim()) || [];
  
  // Eski tek chat ID desteği (geriye uyumluluk)
  const singleChatId = process.env.TELEGRAM_CHAT_ID;
  if (singleChatId && !chatIds.includes(singleChatId)) {
    chatIds.push(singleChatId);
  }

  if (!botToken || chatIds.length === 0) {
    telegramLogger.warn('Telegram credentials not configured');
    return { success: false, error: 'Telegram yapılandırması eksik' };
  }

  const message = formatNotificationMessage(data);
  const results: boolean[] = [];

  for (const chatId of chatIds) {
    try {
      const url = 'https://api.telegram.org/bot' + botToken + '/sendMessage';
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'HTML'
        })
      });

      const result = await response.json();

      if (result.ok) {
        telegramLogger.info({ phone: data.phone, chatId }, 'Telegram notification sent');
        results.push(true);
      } else {
        telegramLogger.error({ error: result.description, chatId }, 'Telegram API error');
        results.push(false);
      }
    } catch (error: any) {
      telegramLogger.error({ error: error.message, chatId }, 'Telegram notification failed');
      results.push(false);
    }
  }

  const successCount = results.filter(r => r).length;
  return { 
    success: successCount > 0, 
    error: successCount === 0 ? 'Tüm bildirimler başarısız' : undefined 
  };
}

function formatNotificationMessage(data: NotificationData): string {
  const isRegistered = data.isRegistered === true;
  
  const lines = [
    isRegistered 
      ? '<b>🚗 Yeni Randevu Talebi (Üye)</b>'
      : '<b>🚗 Yeni Randevu Talebi (Üye Olmadan)</b>',
    '',
  ];

  // Üye bilgileri
  if (isRegistered) {
    lines.push('👤 <b>Üye Bilgileri:</b>');
    lines.push('   • Ad Soyad: ' + (data.name || 'Belirtilmedi'));
    if (data.username) lines.push('   • Kullanıcı Adı: ' + data.username);
    if (data.email) lines.push('   • E-posta: ' + data.email);
    lines.push('   • Telefon: ' + data.phone);
    if (data.plate) lines.push('   • Plaka: ' + data.plate);
    lines.push('');
  } else {
    lines.push('👤 <b>Ad Soyad:</b> ' + (data.name || 'Belirtilmedi'));
    lines.push('📱 <b>Telefon:</b> ' + data.phone);
  }

  lines.push('📍 <b>Konum:</b> ' + data.city + (data.district ? ' / ' + data.district : ''));
  
  if (data.appointmentDate || data.appointmentTime) {
    const dateStr = data.appointmentDate ? new Date(data.appointmentDate).toLocaleDateString('tr-TR') : '';
    const timeStr = data.appointmentTime || '';
    lines.push('📅 <b>Randevu:</b> ' + dateStr + (timeStr ? ' saat ' + timeStr : ''));
  }
  lines.push('🚘 <b>Araç:</b> ' + data.brand + ' ' + data.model + (data.year ? ' (' + data.year + ')' : ''));

  if (data.category) {
    lines.push('🔧 <b>Hizmet:</b> ' + data.category);
  }

  if (data.service) {
    lines.push('🏪 <b>Servis:</b> ' + data.service);
  }

  if (data.notes) {
    lines.push('📝 <b>Not:</b> ' + data.notes);
  }

  lines.push('', '⏰ <b>Tarih:</b> ' + new Date().toLocaleString('tr-TR'));

  return lines.join('\n');
}

export default { sendTelegramNotification };
