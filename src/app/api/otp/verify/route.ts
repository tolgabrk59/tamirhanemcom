import { NextRequest, NextResponse } from 'next/server';
import { verifyOTP, deleteOTP } from '@/lib/otp';
import { createLogger } from '@/lib/logger';

const otpVerifyLogger = createLogger('OTP:VERIFY');

/**
 * POST /api/otp/verify
 * Verify OTP code for phone number
 *
 * Request Body:
 * {
 *   phone: string,  // Format: "5XX XXX XX XX" or "5XXXXXXXXX"
 *   otp: string     // 6-digit code
 * }
 *
 * Response:
 * Success: {
 *   success: true,
 *   phone: string
 * }
 *
 * Error: {
 *   success: false,
 *   error: string,
 *   remainingAttempts?: number
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, otp } = body;

    // Validate phone number
    if (!phone) {
      return NextResponse.json(
        { success: false, error: 'Telefon numarası gerekli' },
        { status: 400 }
      );
    }

    // Validate OTP code
    if (!otp) {
      return NextResponse.json(
        { success: false, error: 'Doğrulama kodu gerekli' },
        { status: 400 }
      );
    }

    // Clean phone number
    const cleanPhone = phone.replace(/[\s-]/g, '');

    // Validate phone format
    if (!/^[5][0-9]{9}$/.test(cleanPhone)) {
      return NextResponse.json(
        { success: false, error: 'Geçersiz telefon numarası formatı' },
        { status: 400 }
      );
    }

    // Validate OTP format (should be 6 digits)
    if (!/^[0-9]{6}$/.test(otp)) {
      return NextResponse.json(
        { success: false, error: 'Doğrulama kodu 6 haneli olmalı' },
        { status: 400 }
      );
    }

    otpVerifyLogger.info({ phone: cleanPhone }, 'OTP verify request received');

    // Verify OTP
    const result = await verifyOTP(cleanPhone, otp);

    if (result.success) {
      otpVerifyLogger.info(
        { phone: cleanPhone },
        'OTP verified successfully'
      );

      return NextResponse.json(
        {
          success: true,
          phone: cleanPhone,
          message: 'Telefon numaranız başarıyla doğrulandı',
        },
        { status: 200 }
      );
    } else {
      otpVerifyLogger.warn(
        { phone: cleanPhone, error: result.error },
        'OTP verification failed'
      );

      const response: any = {
        success: false,
        error: result.error,
      };

      if (result.remainingAttempts !== undefined) {
        response.remainingAttempts = result.remainingAttempts;
      }

      // Determine HTTP status code
      const statusCode = result.error?.includes('süresi doldu')
        ? 400
        : 401;

      return NextResponse.json(response, { status: statusCode });
    }
  } catch (error: any) {
    otpVerifyLogger.error(
      { error: error.message, stack: error.stack },
      'OTP verification failed'
    );

    return NextResponse.json(
      { success: false, error: 'Doğrulama işlemi başarısız. Lütfen tekrar deneyin.' },
      { status: 500 }
    );
  }
}

// Handle non-POST requests
export async function GET() {
  return NextResponse.json(
    { success: false, error: 'Method not allowed' },
    { status: 405 }
  );
}
