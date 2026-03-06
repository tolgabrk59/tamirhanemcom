import { NextRequest, NextResponse } from "next/server";
import { createLogger } from "@/lib/logger";
import { checkRouteRateLimit, getClientIdentifier } from "@/lib/route-rate-limit";

const logger = createLogger("OTP:SEND");

const STRAPI_API = "https://api.tamirhanem.com/api";
const OTP_RATE_LIMIT = 3; // 3 requests
const OTP_RATE_WINDOW = 60000; // 1 minute

export async function POST(request: NextRequest) {
  try {
    // Rate limiting check
    const identifier = getClientIdentifier(request.headers, "otp-send");
    const rateLimit = await checkRouteRateLimit(identifier, OTP_RATE_LIMIT, OTP_RATE_WINDOW);
    
    if (!rateLimit.allowed) {
      logger.warn({ identifier }, "OTP rate limit exceeded");
      return NextResponse.json(
        {
          success: false,
          error: "Çok fazla istek gönderildi. Lütfen bekleyin.",
          retryAfter: rateLimit.retryAfter,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimit.retryAfter || 60),
            "X-RateLimit-Remaining": "0",
          },
        }
      );
    }

    const WEB_FORM_TOKEN = process.env.WEB_FORM_TOKEN;
    
    if (!WEB_FORM_TOKEN) {
      logger.error("WEB_FORM_TOKEN not configured");
      return NextResponse.json(
        { success: false, error: "Sunucu yapılandırma hatası" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { phone } = body;

    if (!phone) {
      return NextResponse.json(
        { success: false, error: "Telefon numarası gerekli" },
        { status: 400 }
      );
    }

    const cleanPhone = phone.replace(/[\s\-\+]/g, "").replace(/^90/, "");

    if (!/^[5][0-9]{9}$/.test(cleanPhone)) {
      return NextResponse.json(
        { success: false, error: "Geçersiz telefon numarası formatı" },
        { status: 400 }
      );
    }

    logger.info({ phone: cleanPhone }, "Sending OTP via Strapi");

    const response = await fetch(STRAPI_API + "/web-guest-booking/send-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Web-Form-Token": WEB_FORM_TOKEN,
        "Origin": "https://tamirhanem.com",
        "Referer": "https://tamirhanem.com/",
      },
      body: JSON.stringify({ phone: cleanPhone }),
    });

    const result = await response.json();

    if (!response.ok || result.success === false) {
      logger.error({ phone: cleanPhone, error: result }, "Strapi OTP failed");
      return NextResponse.json(
        { success: false, error: result.message || result.error?.message || "SMS gönderilemedi" },
        { status: response.status }
      );
    }

    logger.info({ phone: cleanPhone }, "OTP sent successfully");

    return NextResponse.json(
      {
        success: true,
        message: result.message || "Doğrulama kodu SMS ile gönderildi",
        expiresAt: Math.floor(Date.now() / 1000) + 300,
      },
      {
        headers: {
          "X-RateLimit-Remaining": String(rateLimit.remaining),
        },
      }
    );

  } catch (error: any) {
    logger.error({ error: error.message }, "OTP send failed");
    return NextResponse.json(
      { success: false, error: "SMS gönderilirken hata oluştu" },
      { status: 500 }
    );
  }
}
