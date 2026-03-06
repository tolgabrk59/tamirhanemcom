import { NextRequest, NextResponse } from 'next/server';
import { createLogger } from '@/lib/logger';

const registerLogger = createLogger('AUTH:REGISTER');

const STRAPI_API = process.env.STRAPI_API_URL || 'https://api.tamirhanem.net/api';
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

interface RegisterRequest {
  phone: string;
  username: string;
  email: string;
  password: string;
  name?: string;
  brand?: string;
  model?: string;
  plate?: string;
  city?: string;
  district?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: RegisterRequest = await request.json();
    const { phone, username, email, password, name, brand, model, plate, city, district } = body;

    if (!phone || !username || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Tum zorunlu alanlari doldurunuz' },
        { status: 400 }
      );
    }

    const cleanPhone = phone.replace(/[\s-]/g, '');
    if (!/^[5][0-9]{9}$/.test(cleanPhone)) {
      return NextResponse.json(
        { success: false, error: 'Gecersiz telefon numarasi' },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Gecersiz e-posta adresi' },
        { status: 400 }
      );
    }

    if (!/^[a-zA-Z0-9_]{3,50}$/.test(username)) {
      return NextResponse.json(
        { success: false, error: 'Kullanici adi 3-50 karakter, harf, rakam ve alt cizgi icerebilir' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Sifre en az 6 karakter olmali' },
        { status: 400 }
      );
    }

    // Register via Strapi
    const strapiData = {
      data: {
        phone: '+90' + cleanPhone,
        username: username.toLowerCase(),
        email: email.toLowerCase(),
        password: password,
        name: name || null,
        brand: brand || null,
        model: model || null,
        plate: plate || null,
        city: city || null,
        district: district || null,
        phone_verified: true,
        status: 'active'
      }
    };

    const response = await fetch(STRAPI_API + '/users-customers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(STRAPI_TOKEN && { Authorization: 'Bearer ' + STRAPI_TOKEN }),
      },
      body: JSON.stringify(strapiData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      registerLogger.error({ error: errorData }, 'Strapi registration failed');
      
      if (response.status === 400) {
        const errorMsg = errorData?.error?.message || 'Bu bilgiler zaten kayitli';
        return NextResponse.json({ success: false, error: errorMsg }, { status: 400 });
      }
      
      return NextResponse.json(
        { success: false, error: 'Kayit islemi basarisiz' },
        { status: 500 }
      );
    }

    const result = await response.json();
    registerLogger.info({ userId: result.data?.id, phone: cleanPhone }, 'User registered via Strapi');

    return NextResponse.json(
      { success: true, message: 'Kayit basarili!', userId: result.data?.id },
      { status: 201 }
    );

  } catch (error: any) {
    registerLogger.error({ error: error.message }, 'Registration failed');
    return NextResponse.json(
      { success: false, error: 'Kayit islemi basarisiz. Lutfen tekrar deneyin.' },
      { status: 500 }
    );
  }
}
