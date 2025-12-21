# API Endpoint Oluştur

Yeni bir Next.js API Route Handler oluştur (Strapi entegrasyonu ile).

## Kullanım
```
/api-endpoint-olustur [endpoint-adi]
```

## Yapılacaklar

1. Kullanıcıdan endpoint adını al (örn: "services", "reviews")

2. `/src/app/api/[endpoint]/route.ts` dosyası oluştur:

```typescript
import { NextRequest, NextResponse } from 'next/server';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'https://api.tamirhanem.net';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const response = await fetch(`${STRAPI_URL}/api/[ENDPOINT]?${searchParams}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 3600 } // 1 saat cache
    });

    if (!response.ok) {
      throw new Error('Strapi API hatası');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('[ENDPOINT] API Error:', error);
    return NextResponse.json(
      { error: 'Veri alınamadı' },
      { status: 500 }
    );
  }
}
```

3. Gerekirse POST handler ekle
4. TypeScript interface tanımla
5. Kullanıcıya endpoint URL'ini bildir: `/api/[endpoint]`
