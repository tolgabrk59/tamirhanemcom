# Tailwind Tema Güncelle

TamirHanem marka renklerini ve tema ayarlarını güncelle.

## Kullanım
```
/tailwind-tema-guncelle
```

## Dosya Konumu
`/tailwind.config.js`

## Mevcut Tema

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        50: '#eff6ff',
        500: '#3b82f6',
        600: '#2563eb',
        700: '#1d4ed8',
      },
      secondary: {
        500: '#f97316',
        600: '#ea580c',
      }
    }
  }
}
```

## Yapılacaklar

1. Kullanıcıdan ne güncellemek istediğini sor:
   - Renk paleti
   - Font ailesi
   - Spacing/sizing
   - Animasyonlar
   - Breakpoint'ler

2. `tailwind.config.js` dosyasını güncelle

3. Değişiklikleri test etmek için örnek component göster

## Renk Paleti Oluşturma

Bir ana renk verildiğinde, tüm tonları oluştur:
- 50: En açık
- 100-400: Açık tonlar
- 500: Ana renk
- 600-900: Koyu tonlar

## Font Ekleme

```javascript
fontFamily: {
  sans: ['Inter', 'sans-serif'],
  display: ['Poppins', 'sans-serif'],
}
```

## Animasyon Ekleme

```javascript
animation: {
  'fade-in': 'fadeIn 0.3s ease-in-out',
  'slide-up': 'slideUp 0.4s ease-out',
},
keyframes: {
  fadeIn: {
    '0%': { opacity: '0' },
    '100%': { opacity: '1' },
  },
}
```

## Global CSS Kontrolü

`/src/app/globals.css` dosyasını da kontrol et ve gerekirse güncelle.
