# Sayfa Ekle

Yeni bir sayfa route'u oluştur (SEO meta tags ile).

## Kullanım
```
/sayfa-ekle [sayfa-yolu]
```

## Yapılacaklar

1. Kullanıcıdan sayfa yolunu al (örn: "hakkimizda", "iletisim", "blog/[slug]")

2. `/src/app/[sayfa-yolu]/page.tsx` dosyası oluştur:

```typescript
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sayfa Başlığı | TamirHanem',
  description: 'Sayfa açıklaması - SEO için optimize edilmiş',
  openGraph: {
    title: 'Sayfa Başlığı | TamirHanem',
    description: 'Sayfa açıklaması',
    type: 'website',
    locale: 'tr_TR',
    siteName: 'TamirHanem',
  },
};

export default async function SayfaAdi() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Sayfa Başlığı
        </h1>

        {/* Sayfa içeriği */}
      </div>
    </main>
  );
}
```

## Dinamik Sayfa İçin

Eğer `[slug]` veya `[id]` parametresi varsa:

```typescript
interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  // Dinamik metadata
}

export default async function Page({ params }: PageProps) {
  // Dinamik içerik
}
```

## SEO Kontrolleri

- Title 60 karakterden kısa olmalı
- Description 155 karakterden kısa olmalı
- OpenGraph image ekle (varsa)
- Canonical URL ayarla (gerekirse)
