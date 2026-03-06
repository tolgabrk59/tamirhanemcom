import { NextRequest, NextResponse } from "next/server";
import { createLogger } from "@/lib/logger";

const logger = createLogger("OTP:VERIFY-REGISTER");

const STRAPI_API = "https://api.tamirhanem.com/api";

export async function POST(request: NextRequest) {
  try {
    const WEB_FORM_TOKEN = process.env.WEB_FORM_TOKEN;
    
    if (!WEB_FORM_TOKEN) {
      logger.error("WEB_FORM_TOKEN not configured");
      return NextResponse.json(
        { success: false, error: "Sunucu yapılandırma hatası" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { phone, code, name } = body;

    if (!phone || !code) {
      return NextResponse.json(
        { success: false, error: "Telefon ve doğrulama kodu gerekli" },
        { status: 400 }
      );
    }

    const cleanPhone = phone.replace(/[\s\-\+]/g, "").replace(/^90/, "");

    logger.info({ phone: cleanPhone }, "Verifying OTP and registering via Strapi");

    const response = await fetch(STRAPI_API + "/web-guest-booking/verify-and-register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Web-Form-Token": WEB_FORM_TOKEN,
        "Origin": "https://tamirhanem.com",
        "Referer": "https://tamirhanem.com/",
      },
      body: JSON.stringify({ 
        phone: cleanPhone, 
        code: code,
        name: name || undefined
      }),
    });

    const result = await response.json();

    if (!response.ok || result.success === false) {
      logger.error({ phone: cleanPhone, error: result }, "Strapi verify-register failed");
      return NextResponse.json(
        { 
          success: false, 
          error: result.message || result.error?.message || "Doğrulama başarısız",
          remainingAttempts: result.remainingAttempts
        },
        { status: response.status }
      );
    }

    logger.info({ phone: cleanPhone, userId: result.user?.id }, "User verified and registered");

    return NextResponse.json({
      success: true,
      message: result.message || "Doğrulama başarılı",
      jwt: result.jwt,
      user: result.user,
    });

  } catch (error: any) {
    logger.error({ error: error.message }, "Verify-register failed");
    return NextResponse.json(
      { success: false, error: "Doğrulama işlemi başarısız" },
      { status: 500 }
    );
  }
}
