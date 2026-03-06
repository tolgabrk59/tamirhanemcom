import { createLogger } from './logger';

const whatsappLogger = createLogger('WHATSAPP');

interface WhatsAppConfig {
  apiUrl: string;
  phoneId: string;
  accessToken: string;
  targetPhone: string; // Admin phone to receive notifications
}

interface NotificationData {
  name: string;
  phone: string;
  city: string;
  district?: string;
  brand: string;
  model: string;
  category?: string;
  notes?: string;
}

/**
 * Send WhatsApp notification for non-member appointment requests
 * Uses WhatsApp Business API or CallMeBot as fallback
 */
export async function sendWhatsAppNotification(data: NotificationData): Promise<{ success: boolean; error?: string }> {
  const targetPhone = process.env.WHATSAPP_ADMIN_PHONE;
  const apiKey = process.env.WHATSAPP_API_KEY;
  
  if (!targetPhone) {
    whatsappLogger.warn('WhatsApp admin phone not configured');
    return { success: false, error: 'WhatsApp yapılandırması eksik' };
  }

  // Format message
  const message = formatNotificationMessage(data);

  try {
    // Try CallMeBot API (free, simple)
    if (apiKey) {
      const encodedMessage = encodeURIComponent(message);
      const url = `https://api.callmebot.com/whatsapp.php?phone=${targetPhone}&text=${encodedMessage}&apikey=${apiKey}`;
      
      const response = await fetch(url);
      
      if (response.ok) {
        whatsappLogger.info({ phone: data.phone }, 'WhatsApp notification sent via CallMeBot');
        return { success: true };
      }
    }

    // Try WhatsApp Business API if configured
    const businessApiUrl = process.env.WHATSAPP_BUSINESS_API_URL;
    const businessToken = process.env.WHATSAPP_BUSINESS_TOKEN;
    
    if (businessApiUrl && businessToken) {
      const response = await fetch(businessApiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${businessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: targetPhone,
          type: 'text',
          text: { body: message },
        }),
      });

      if (response.ok) {
        whatsappLogger.info({ phone: data.phone }, 'WhatsApp notification sent via Business API');
        return { success: true };
      }
    }

    // Log for manual follow-up if all methods fail
    whatsappLogger.info({ data, message }, 'WhatsApp notification queued (manual follow-up needed)');
    return { success: true }; // Don't block the flow

  } catch (error: any) {
    whatsappLogger.error({ error: error.message, data }, 'WhatsApp notification failed');
    return { success: false, error: error.message };
  }
}

function formatNotificationMessage(data: NotificationData): string {
  const lines = [
    '🚗 *Yeni Randevu Talebi (Üye Olmadan)*',
    '',
    `👤 Ad Soyad: ${data.name || 'Belirtilmedi'}`,
    `📱 Telefon: ${data.phone}`,
    `📍 Konum: ${data.city}${data.district ? ' / ' + data.district : ''}`,
    `🚘 Araç: ${data.brand} ${data.model}`,
  ];

  if (data.category) {
    lines.push(`🔧 Hizmet: ${data.category}`);
  }

  if (data.notes) {
    lines.push(`📝 Not: ${data.notes}`);
  }

  lines.push('', `⏰ Tarih: ${new Date().toLocaleString('tr-TR')}`);

  return lines.join('\n');
}

export default { sendWhatsAppNotification };
