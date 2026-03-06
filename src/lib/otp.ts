import { createLogger } from './logger';
import { getRedisClient, isConnected } from './cache';

const otpLogger = createLogger('OTP');

// OTP Configuration
const OTP_CONFIG = {
  length: 6,
  ttl: 300, // 5 minutes in seconds
  maxAttempts: 3,
  rateLimit: 60, // 60 seconds between resend attempts
  cooldown: 3600, // 1 hour cooldown after max attempts
};

export interface OTPData {
  code: string;
  phone: string;
  expiresAt: number;
  attempts: number;
  createdAt: number;
  lastSentAt?: number;
  rateLimitUntil?: number;
}

/**
 * Generate random OTP code
 * @param length - Number of digits (default: 6)
 * @returns 6-digit OTP code
 */
export function generateOTP(length: number = OTP_CONFIG.length): string {
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  return Math.floor(min + Math.random() * (max - min + 1)).toString();
}

/**
 * Store OTP in Redis with expiration
 * @param phone - Phone number (clean format: 10 digits)
 * @param otp - OTP code
 * @returns Promise<void>
 */
export async function storeOTP(phone: string, otp: string): Promise<void> {
  const client = getRedisClient();

  if (!client) {
    throw new Error('Redis not available for OTP storage');
  }

  // Force connection if using lazy connect
  if (!isConnected) {
    try {
      await client.connect();
    } catch (err) {
      // Connection already established or error, ignore
    }
  }

  try {
    const otpData: OTPData = {
      code: otp,
      phone,
      expiresAt: Math.floor(Date.now() / 1000) + OTP_CONFIG.ttl,
      attempts: 0,
      createdAt: Math.floor(Date.now() / 1000),
      lastSentAt: Math.floor(Date.now() / 1000),
    };

    const redisKey = `otp:${phone}`;
    await client.setex(
      redisKey,
      OTP_CONFIG.ttl,
      JSON.stringify(otpData)
    );

    // Store rate limit key
    const rateLimitKey = `otp:ratelimit:${phone}`;
    await client.setex(
      rateLimitKey,
      OTP_CONFIG.rateLimit,
      '1'
    );

    otpLogger.info({ phone, expiresAt: otpData.expiresAt }, 'OTP stored in Redis');
  } catch (error: any) {
    otpLogger.error({ error: error.message, phone }, 'Failed to store OTP');
    throw new Error('Failed to store OTP');
  }
}

/**
 * Verify OTP code
 * @param phone - Phone number
 * @param otp - OTP code to verify
 * @returns Promise with success status and remaining attempts
 */
export async function verifyOTP(
  phone: string,
  otp: string
): Promise<{ success: boolean; remainingAttempts?: number; error?: string }> {
  const client = getRedisClient();

  if (!client) {
    throw new Error('Redis not available for OTP verification');
  }

  // Force connection if using lazy connect
  if (!isConnected) {
    try {
      await client.connect();
    } catch (err) {
      // Connection already established or error, ignore
    }
  }

  try {
    const redisKey = `otp:${phone}`;
    const data = await client.get(redisKey);

    if (!data) {
      otpLogger.warn({ phone }, 'OTP not found or expired');
      return {
        success: false,
        error: 'OTP bulunamadı veya süresi doldu. Lütfen yeni bir kod isteyin.',
      };
    }

    const otpData: OTPData = JSON.parse(data);

    // Check if expired
    const currentTime = Math.floor(Date.now() / 1000);
    if (currentTime > otpData.expiresAt) {
      await client.del(redisKey);
      otpLogger.warn({ phone, expiresAt: otpData.expiresAt, currentTime }, 'OTP expired');
      return {
        success: false,
        error: 'OTP süresi doldu. Lütfen yeni bir kod isteyin.',
      };
    }

    // Check if max attempts reached
    if (otpData.attempts >= OTP_CONFIG.maxAttempts) {
      await client.del(redisKey);

      // Apply cooldown
      const cooldownKey = `otp:cooldown:${phone}`;
      await client.setex(cooldownKey, OTP_CONFIG.cooldown, '1');

      otpLogger.warn({ phone, attempts: otpData.attempts }, 'OTP max attempts reached');
      return {
        success: false,
        error: `Maksimum deneme sayısına ulaşıldınız. Lütfen ${Math.floor(OTP_CONFIG.cooldown / 60)} dakika sonra tekrar deneyin.`,
      };
    }

    // Verify code
    if (otpData.code === otp) {
      // Success - delete OTP
      await client.del(redisKey);

      // Clear rate limit
      const rateLimitKey = `otp:ratelimit:${phone}`;
      await client.del(rateLimitKey);

      otpLogger.info({ phone }, 'OTP verified successfully');
      return { success: true };
    } else {
      // Wrong code - increment attempts
      otpData.attempts += 1;
      await client.setex(redisKey, OTP_CONFIG.ttl, JSON.stringify(otpData));

      const remainingAttempts = OTP_CONFIG.maxAttempts - otpData.attempts;
      otpLogger.warn({ phone, attempts: otpData.attempts }, 'OTP verification failed');

      return {
        success: false,
        error: 'Hatalı doğrulama kodu',
        remainingAttempts,
      };
    }
  } catch (error: any) {
    otpLogger.error({ error: error.message, phone }, 'OTP verification failed');
    throw new Error('OTP verification failed');
  }
}

/**
 * Check if phone number is rate limited
 * @param phone - Phone number
 * @returns Promise with isLimited and remainingSeconds
 */
export async function isRateLimited(
  phone: string
): Promise<{ isLimited: boolean; remainingSeconds: number }> {
  const client = getRedisClient();

  if (!client || !isConnected) {
    return { isLimited: false, remainingSeconds: 0 };
  }

  try {
    // Check rate limit (60s between sends)
    const rateLimitKey = `otp:ratelimit:${phone}`;
    const rateLimit = await client.ttl(rateLimitKey);

    if (rateLimit > 0) {
      return { isLimited: true, remainingSeconds: rateLimit };
    }

    // Check cooldown (after max attempts)
    const cooldownKey = `otp:cooldown:${phone}`;
    const cooldown = await client.ttl(cooldownKey);

    if (cooldown > 0) {
      return { isLimited: true, remainingSeconds: cooldown };
    }

    return { isLimited: false, remainingSeconds: 0 };
  } catch (error) {
    otpLogger.error({ error, phone }, 'Rate limit check failed');
    return { isLimited: false, remainingSeconds: 0 };
  }
}

/**
 * Check if OTP exists and is not expired
 * @param phone - Phone number
 * @returns Promise with exists and expiresAt
 */
export async function isOTPExists(
  phone: string
): Promise<{ exists: boolean; expiresAt?: number }> {
  const client = getRedisClient();

  if (!client || !isConnected) {
    return { exists: false };
  }

  try {
    const redisKey = `otp:${phone}`;
    const data = await client.get(redisKey);

    if (!data) {
      return { exists: false };
    }

    const otpData: OTPData = JSON.parse(data);
    const currentTime = Math.floor(Date.now() / 1000);

    if (currentTime > otpData.expiresAt) {
      await client.del(redisKey);
      return { exists: false };
    }

    return {
      exists: true,
      expiresAt: otpData.expiresAt,
    };
  } catch (error) {
    otpLogger.error({ error, phone }, 'OTP existence check failed');
    return { exists: false };
  }
}

/**
 * Delete OTP for a phone number
 * @param phone - Phone number
 * @returns Promise<boolean>
 */
export async function deleteOTP(phone: string): Promise<boolean> {
  const client = getRedisClient();

  if (!client || !isConnected) {
    return false;
  }

  try {
    const redisKey = `otp:${phone}`;
    await client.del(redisKey);

    // Clear related keys
    await client.del(`otp:ratelimit:${phone}`);
    await client.del(`otp:cooldown:${phone}`);

    otpLogger.info({ phone }, 'OTP deleted');
    return true;
  } catch (error) {
    otpLogger.error({ error, phone }, 'OTP deletion failed');
    return false;
  }
}

/**
 * Get remaining time for OTP expiration
 * @param phone - Phone number
 * @returns Promise with remainingSeconds or null if not found
 */
export async function getOTPExpiry(
  phone: string
): Promise<{ remainingSeconds: number } | null> {
  const client = getRedisClient();

  if (!client || !isConnected) {
    return null;
  }

  try {
    const redisKey = `otp:${phone}`;
    const ttl = await client.ttl(redisKey);

    if (ttl === -2) {
      // Key doesn't exist
      return null;
    }

    if (ttl === -1) {
      // Key exists but no expiry (shouldn't happen)
      return { remainingSeconds: OTP_CONFIG.ttl };
    }

    return { remainingSeconds: ttl };
  } catch (error) {
    otpLogger.error({ error, phone }, 'OTP expiry check failed');
    return null;
  }
}

// Export OTP config for testing purposes
export const OTP_CONFIG_EXPORT = OTP_CONFIG;
