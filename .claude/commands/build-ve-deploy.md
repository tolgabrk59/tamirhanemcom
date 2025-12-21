# Build ve Deploy

Projeyi derle, hataları kontrol et ve Vercel'e deploy et.

## Kullanım
```
/build-ve-deploy
```

## Adımlar

### 1. Lint Kontrolü
```bash
cd /home/dietpi/tamirhanem-next && npm run lint
```
- ESLint hatalarını listele
- Kritik hataları düzelt
- Warning'leri raporla

### 2. TypeScript Kontrolü
```bash
cd /home/dietpi/tamirhanem-next && npx tsc --noEmit
```
- Type hatalarını listele
- Düzeltme önerileri sun

### 3. Production Build
```bash
cd /home/dietpi/tamirhanem-next && npm run build
```
- Build sürecini izle
- Hataları analiz et
- Bundle size raporla

### 4. Deploy (Build başarılıysa)
```bash
cd /home/dietpi/tamirhanem-next && vercel --prod --yes
```
- Git kullanmadan direkt deploy
- Production URL'i göster

## Hata Durumunda

Build başarısız olursa:
1. Hata mesajını analiz et
2. Sorunu tespit et
3. Düzeltme öner veya uygula
4. Tekrar build dene

## Yaygın Hatalar ve Çözümleri

| Hata | Çözüm |
|------|-------|
| `Module not found` | `npm install` çalıştır |
| `Type error` | TypeScript hatalarını düzelt |
| `ESLint error` | Lint kurallarına uy |
| `Build timeout` | Memory limit artır |

## Memory Limit Sorunu

Raspberry Pi'da memory yetersizse:
```bash
NODE_OPTIONS="--max-old-space-size=2048" npm run build
```

## Deploy Sonrası

- Production URL'i kontrol et
- Temel sayfaları test et
- Console hatalarını kontrol et
