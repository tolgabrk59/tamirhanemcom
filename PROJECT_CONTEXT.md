# TamirHanem Web2 Projesi - Context

**Son Güncelleme:** 2026-03-05

## Proje Özeti
TamirHanem için Next.js web uygulaması (web2). Ana özellikler:
- Şarj istasyonları bulucu (Strapi + Serper.dev entegrasyonu)
- Servis arama ve detay sayfaları
- Randevu sistemi

## Kaldığımız Yer (2026-03-05)

### ✅ Tamamlananlar

1. **Şarj İstasyonları Sayfası** (`/sarj-istasyonlari`)
   - Strapi'den veri çekme ✅
   - Strapi boşsa Serper.dev'den arama ✅
   - Tüm sonuçları Strapi'ye kaydetme ✅
   - İl/İlçe filtreleme + alfabetik sıralama ✅
   - Sayfalama (15 istasyon/sayfa) ✅
   - Türkçe karakter düzeltmeleri ✅
   - Aylık sync PM2 cron job ✅

2. **Servis Detay Sayfası** (`/servis-ara/[id]`)
   - Breadcrumb navigation ✅
   - Tabs: Hizmetler / Yorumlar / Hakkında ✅
   - Hizmetler listesi (Strapi'den) ✅
   - İletişim bilgileri ✅
   - Randevu Al, Ara, Soru Sor, Paylaş butonları ✅
   - Yetkili Servis / Yol Yardımı badge'leri ✅

3. **API Endpoints**
   - `/api/ev-chargers` - Şarj istasyonları
   - `/api/services/[id]` - Servis detay

### ⚠️ Yapılacaklar / Eksikler

1. **Servis Detay Sayfası:**
   - ❌ Çalışma saatleri Strapi'de yok (null dönüyor)
   - ❌ Desteklenen araçlar Strapi'de yok (null)
   - ❌ Yorumlar sistemi henüz yok

2. **Şarj İstasyonları:**
   - ✅ Aylık sync script hazır
   - ⏳ PM2 cron job test edilmeli

### 📁 Önemli Dosyalar

```
web2/
├── src/app/sarj-istasyonlari/page.tsx      # Şarj istasyonları sayfası
├── src/app/servis-ara/[id]/page.tsx        # Servis detay sayfası
├── src/app/api/ev-chargers/route.ts        # Şarj istasyonları API
├── src/app/api/services/[id]/route.ts      # Servis detay API
├── src/components/service-search/ServiceDetailPanel.tsx  # Modal
└── scripts/sync-charging-stations.js       # Aylık sync script
```

### 🔑 Environment Variables (Vercel)
```env
STRAPI_API_URL=https://api.tamirhanem.com/api
STRAPI_API_TOKEN=540f117558fc18755aaf9d668122b6155aa80cfd59377f718c4fbf5fcfc450f95e477d98b331148f36ab17453263859557eb4c1fa54a7fbe320a67849b9a35c4
SERPER_API_KEY=c54a2c0b18f493218783bd24abef63aceb9c1b18
```

### 🌐 Test URL'leri
- Production: https://tamirhanem.com
- Şarj İstasyonları: https://tamirhanem.com/sarj-istasyonlari
- Servis Detay: https://tamirhanem.com/servis-ara/4

### 📝 Komutlar

```bash
# Proje dizinine git
cd /home/tolgabrk/Documents/ProjelerTamirhanem/tamirhanem-next/web2

# Sync script manuel çalıştır
node scripts/sync-charging-stations.js

# PM2 logları izle
pm2 logs charging-sync

# Deploy
vercel --prod
```

---

## Talimatlar

**"tamirhanem.com projesine devam edelim"** veya **"web2 - kaldığımız yerden devam et"** dendiğinde:

1. Bu dosyayı oku
2. Kaldığımız yerden devam et
3. Yapılacaklar listesine öncelik ver
4. Her değişiklikten sonra test et
