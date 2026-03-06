import axios from 'axios';
import { createLogger } from './logger';

const netgsmLogger = createLogger('NETGSM');

// NetGSM Configuration
const NETGSM_CONFIG = {
  usercode: process.env.NETGSM_USERNAME || '',
  password: process.env.NETGSM_PASSWORD || '',
  header: process.env.NETGSM_HEADER || '',
  otpUrl: 'https://api.netgsm.com.tr/sms/send/otp',
  xmlUrl: process.env.NETGSM_BASE_URL || 'https://api.netgsm.com.tr/sms/send/xml',
};

// Validate NetGSM configuration
if (!NETGSM_CONFIG.usercode || !NETGSM_CONFIG.password) {
  netgsmLogger.warn('NetGSM credentials not configured in environment variables');
}

export interface SMSResponse {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}

/**
 * Send SMS via NetGSM OTP API (GET method with query parameters)
 * Documentation: https://www.netgsm.com.tr/dokuman/
 *
 * @param phone - Phone number (can be with or without country code)
 * @param message - SMS message content (max 160 chars for OTP)
 * @returns Promise with success status and details
 */
export async function sendSMS(
  phone: string,
  message: string
): Promise<SMSResponse> {
  try {
    // Validate phone number
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length !== 10 && cleanPhone.length !== 12) {
      throw new Error('Invalid phone number format');
    }

    // Add country code if not present (90 for Turkey)
    const fullPhone = cleanPhone.length === 10 ? `90${cleanPhone}` : cleanPhone;

    // OTP SMS has 160 char limit and no Turkish character support
    if (message.length > 160) {
      netgsmLogger.warn({ length: message.length }, 'OTP SMS message exceeds 160 characters');
    }

    netgsmLogger.info(
      { phone: fullPhone, messageLength: message.length, header: NETGSM_CONFIG.header },
      'Sending SMS via NetGSM OTP API'
    );

    // Build OTP API URL with query parameters
    // Format: https://api.netgsm.com.tr/sms/send/otp?usercode=XXX&password=XXX&msgheader=XXX&msg=XXX&no=XXX
    const params = new URLSearchParams({
      usercode: NETGSM_CONFIG.usercode,
      password: NETGSM_CONFIG.password,
      msgheader: NETGSM_CONFIG.header,
      msg: message,
      no: fullPhone,
    });

    const url = `${NETGSM_CONFIG.otpUrl}?${params.toString()}`;

    netgsmLogger.debug({ url: url.replace(NETGSM_CONFIG.password, '***') }, 'OTP API Request URL');

    const response = await axios.get(url, {
      timeout: 30000, // 30 seconds timeout
    });

    // NetGSM OTP API returns plain text response:
    // Success: "00 JOBID" (e.g., "00 123456789")
    // Error: "ERROR_CODE" (e.g., "30", "40", "70")
    const responseText = String(response.data).trim();

    netgsmLogger.info({ response: responseText }, 'NetGSM OTP API response');

    // Parse response - success starts with "00"
    if (responseText.startsWith('00')) {
      const parts = responseText.split(' ');
      const messageId = parts[1] || 'unknown';

      netgsmLogger.info({ messageId, response: responseText }, 'SMS sent successfully via NetGSM OTP API');

      return {
        success: true,
        message: 'SMS sent successfully',
        data: {
          messageId,
          code: '00',
          rawResponse: responseText,
        },
      };
    } else {
      // NetGSM error codes
      const errorCode = responseText;
      const errorMessage = getNetGSMErrorMessage(errorCode);

      netgsmLogger.error({ errorCode, errorMessage }, 'NetGSM OTP API error');

      return {
        success: false,
        message: errorMessage,
        error: errorCode,
      };
    }
  } catch (error: any) {
    netgsmLogger.error({ error: error.message, stack: error.stack }, 'SMS sending failed');

    return {
      success: false,
      message: 'Failed to send SMS',
      error: error.message,
    };
  }
}

/**
 * Get human-readable error message for NetGSM error codes
 */
function getNetGSMErrorMessage(code: string): string {
  const errorMessages: Record<string, string> = {
    '20': 'Mesaj metni boş veya geçersiz',
    '30': 'Geçersiz kullanıcı adı, şifre veya API erişim izni yok',
    '40': 'Mesaj başlığı (msgheader) tanımsız veya hatalı',
    '50': 'Abone hesabınızda OTP paketi tanımlı değil',
    '51': 'Yetersiz OTP kredisi',
    '70': 'Geçersiz veya hatalı parametre',
    '80': 'Gönderim sınırı aşıldı',
    '85': 'Mükerrer gönderim (aynı numara/mesaj kısa sürede)',
  };

  return errorMessages[code] || `NetGSM hata kodu: ${code}`;
}

/**
 * Send OTP code via SMS
 * @param phone - Phone number
 * @param otp - 6-digit OTP code
 * @returns Promise with SMSResponse (includes error details)
 */
export async function sendOTP(
  phone: string,
  otp: string
): Promise<SMSResponse> {
  try {
    // OTP message format - no Turkish characters allowed
    const message = `Tamirhanem dogrulama kodunuz: ${otp}`;
    const result = await sendSMS(phone, message);

    return result;
  } catch (error: any) {
    netgsmLogger.error({ error: error.message }, 'OTP sending failed');
    return {
      success: false,
      message: 'OTP sending failed',
      error: error.message,
    };
  }
}

/**
 * Validate NetGSM configuration
 * @returns true if configured, false otherwise
 */
export function isNetGSMConfigured(): boolean {
  return !!(NETGSM_CONFIG.usercode && NETGSM_CONFIG.password && NETGSM_CONFIG.header);
}
