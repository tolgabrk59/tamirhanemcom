# Component Oluştur

TamirHanem stil rehberine uygun React component oluştur.

## Kullanım
```
/component-olustur [ComponentAdi]
```

## Yapılacaklar

1. Kullanıcıdan component adını ve amacını al

2. `/src/components/[ComponentAdi].tsx` dosyası oluştur:

```typescript
'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react'; // Gerekli ikonu import et

interface ComponentAdiProps {
  // Props tanımları
}

export default function ComponentAdi({ }: ComponentAdiProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      {/* Component içeriği */}
    </div>
  );
}
```

## TamirHanem Stil Rehberi

- **Primary renk:** `bg-blue-600`, `text-blue-600`
- **Secondary renk:** `bg-orange-500`, `text-orange-500`
- **Border radius:** `rounded-lg` veya `rounded-xl`
- **Shadow:** `shadow-md` veya `shadow-lg`
- **Padding:** `p-4`, `p-6`
- **İkonlar:** `lucide-react` kütüphanesinden

## Kontroller

- 'use client' direktifi gerekli mi kontrol et
- TypeScript interface tanımla
- Tailwind class'larını kullan
- Responsive tasarım ekle (`sm:`, `md:`, `lg:`)
