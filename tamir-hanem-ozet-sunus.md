# TamirHanem: Özet Sunum ve Acil Eylem Planı

**Hazırlanma Tarihi:** Aralık 2025
**Durum:** Stratejik Tavsiye - Hazır Uygulama

---

## 1. PAZAR OLANAĞININ ÖZETİ

### Pazar Büyüklüğü: 26+ Milyon Servis İşlemi/Yıl

```
10.5 Milyon araç x 2.5 servis/yıl = 26.25 M servis
├─ Motosiklet servis: 5M+
├─ Ticari araç servis: 8M+
└─ Hususi araç servis: 13M+
```

### Mevcut Rekabet: FRAGMENTASYON (Büyük Fırsat!)

| Platform | Güç | Zayıflık |
|----------|------|----------|
| **Armut** | Geniş ağ (5K+ servis) | Genel hizmet (araç focusu yok) |
| **Rabam** | Unique (kapı kapı) | Sadece İstanbul, sınırlı |
| **arabam.com** | Ilan pazarı lideri | Garaj ek feature, ikincil |
| **Servis Yazılımları** | 10+ seçenek | B2B yönelimli, müşteri kazanımı yok |
| **Fiyat Platformları** | Veri analizi | Hizmet bulma entegrasyonu yok |

**Sonuç:** Hiçbir platform tam entegrasyon sunmuyor = **TamirHanem'in Avantajı**

---

## 2. TamirHanem'in REKABET POZİSYONU

### Farklılaştırıcı Unsurlar (Türkiye'de İlk)

```
┌─────────────────────────────────────────────────────┐
│  ARAÇ BAKIMI UZMANLAŞMIŞ PLATFORM                  │
│  ┌──────────────────────────────────────────────┐  │
│  │ 1. Entegre Bakım Defteri + Muayene Takvimi   │  │
│  │ 2. Adil Fiyat Karşılaştırması (Bölgesel)     │  │
│  │ 3. OBD Arıza Kodu -> Servis Önerileri        │  │
│  │ 4. Yedek Parça Entegrasyonu                  │  │
│  │ 5. Araç Değer Takibi                         │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

### Konumlandırma

```
ARMUT ← Genel Hizmet Finder
                ↓
        TamirHanem ← Araç Bakım Uzmanı
                ↓
           RABAM ← Pickup/Dropoff (Sınırlı)
```

---

## 3. 10 ÖNCELİKLİ ÖNERİ (Uygulama Sırası)

### FAZE 1: MVP Temeleri (1-3 AY) - Unique Value

#### 🔴 Öncelik 1: Entegre Bakım Defteri + Muayene Hatırlatması
```
MÜŞTERİ PERSPEKTİFİ:
"Benim araç tarihi"
├─ Tüm bakım geçmişi (servisler tarafından otomatik)
├─ Muayene tarihleri (TÜVTÜRK entegrasyonu)
├─ Sigorta yenileme
├─ Trafik tescil tarihleri
└─ Hatırlatmalar (30 gün öncesi -> SMS/Push)

İŞ ETKISI:
• Yapıştırma (Retention): 70%+ (alışkanlık)
• Müşteri yaşam değeri: +300%
• Referral: Yüksek (iyi tool)

KOLAY ÖLÇÜMLENDIRME:
✓ Veritabanı: Araç profilleri + bakım logları
✓ Tarih hatırlatma: İşletim sistemi calendar + push
✓ TÜVTÜRK: Muayene takvimi CSV (başlangıç)
✓ Zaman: 6 hafta (orta güçlük)
✓ Bütçe: ₺50.000
```

---

#### 🟡 Öncelik 2: Servis Bulma + Harita Görünümü
```
MÜŞTERİ PERSPEKTİFİ:
"Motor yağı değişimi yapmam lazım"
├─ Konum seç (harita veya GPS)
├─ Servis listesi (harita pin'leri)
├─ Filtreler: Açık saatler, yorum puanı, fiyat
└─ Detay: Telefon, adres, yorum, randevu

İŞ ETKISI:
• Müşteri dönüşümü: 20%+ (harita = güvenilir)
• Servis kazanımı: Armut'a göre ucuz
• Reklam potansiyeli: "Lokaldaki en iyi servis"

KOLAY ÖLÇÜMLENDIRME:
✓ Google Maps API + lokalizasyon
✓ Servis DB: Web scrape (Armut, Rabam) + input
✓ Zaman: 4 hafta
✓ Bütçe: ₺30.000
```

---

#### 🟢 Öncelik 3: Yorum Sistemi (Hizmet Bazında)
```
MÜŞTERİ PERSPEKTİFİ:
"Bu servise güvenebilir miyim?"
├─ Genel puan: 1-5 yıldız
├─ Hizmet bazında puan:
│  ├─ Fiyat adaleti
│  ├─ Hız/verimlilik
│  └─ Profesyonellik
├─ Yorum + Fotoğraf
└─ Yardımcı oldu mu? (Upvote)

İŞ ETKISI:
• Kalite çiftliği: Yüksek standartlar
• SEO: "X servisi yorumu" -> Organik trafik
• Viral: "Sahte yorum" arayışı WOM

KOLAY ÖLÇÜMLENDIRME:
✓ Rating sistem (PostgreSQL + Sequelize)
✓ Moderasyon: İnsan kontrol (başlang)
✓ Fake review detection: Basit regex (ileri: ML)
✓ Zaman: 3 hafta
✓ Bütçe: ₺20.000
```

---

### FAZE 2: Rekabetçi Diferansiasyon (3-6 AY)

#### 🔴 Öncelik 4: Adil Fiyat Estimatörü (AutoMD-style)
```
MÜŞTERİ PERSPEKTİFİ:
"Motor yağı değişimi kaça yapılmalı?"
├─ Türkiye ortalaması: ₺450
├─ Bölgesel ortalama: ₺380
├─ Senin fiyat: ₺350 ✓ (Yeşil, -22%)
├─ Aykırı değer eşiği: ₺495 (Kırmızı)
└─ Fiyat aralığı: ₺300-₺600

İŞ ETKISI:
• ASIL ROI SÜRÜCÜ: Müşteri inanması
• Servis seçimi: Şeffaf -> Daha fazla booking
• Ortalama işlem değeri: +15% (uygun fiyat)

ZORLUK:
⚠️ Veri toplama: OSD, servis işlem verileri
⚠️ Malzeme fiyatları: Yedekparca.com.tr, OEM
⚠️ Aykırı değer tespiti: ML algorithm
⚠️ Zaman: 8 hafta (en uzun)
⚠️ Bütçe: ₺100.000

BAŞLANGIC (Hafif Versiyon):
✓ 5 hizmet ile başla: Yağ, filtre, lastik, fren, akü
✓ İll bazlı: İstanbul, Ankara, İzmir
✓ OSD ortaklığını kontrol et
✓ Sonra: Machine Learning ile optimize
```

---

#### 🟡 Öncelik 5: OBD Arıza Kodu Entegrasyonu
```
MÜŞTERİ PERSPEKTİFİ:
"P0300 hatasım var, ne yapmalı?"
├─ Hata açıklaması: "Random/Multiple Cylinder Misfire"
├─ Olası nedenler: Bujiler, ignition coil, veya fuel injector
├─ YouTube videolar: 5 DIY tutorial
├─ Profesyonel tamir: Bu kodu çözen 3 servis
└─ Tahmini maliyet: ₺500-₺1.200

İŞ ETKISI:
• Servis kazanımı: Hata -> Servis bağlantısı
• DIY çeşitlemesi: Gençler, meraklılar
• Content SEO: "P0300" -> Organik traﬁk

UYGULANABILIRLIK:
✓ DtcFix API entegrasyonu (19.000 kod)
✓ YouTube API embed (tutorial arama)
✓ Zaman: 2 hafta
✓ Bütçe: ₺15.000
```

---

#### 🟢 Öncelik 6: Yedek Parça Entegrasyonu
```
MÜŞTERİ PERSPEKTİFİ:
"Servis söyledi, ambrage yağlı hava filtresi gerek"
├─ OEM parça: Bosch (₺150)
├─ Aftermarket: Febi (₺80)
├─ Kolaylık: "Şu serviste al" linki
└─ Kargo: 2 gün içinde

İŞ ETKISI:
• Servis ek geliri: Komiser + niyet
• Müşteri tutma: "Paranın karşılığını aldığını biliyor"
• B2B ortaklık: Yedekparca.com.tr, Aloparca

UYGULANABILIRLIK:
✓ Yedekparca API entegrasyonu
✓ Fiyat karşılaştırması: OEM vs. Aftermarket
✓ Zaman: 3 hafta
✓ Bütçe: ₺20.000
```

---

### FAZE 3: Servis İşletmesi Özellikleri (6-9 AY)

#### 🔴 Öncelik 7: Servis Tarafı Dashboard
```
SERVİS İŞLETMESİ PERSPEKTİFİ:
"Yeni müşteri talebim nedir?"
├─ Talep listesi: Motor yağı (3), fren (1), lastik (2)
├─ Detay: Müşteri, araç, zamanı, olay
├─ Otomatik tekliflenme: Sistem önerir
├─ Randevu takvimi: Google Calendar sync
├─ Müşteri yönetimi: Profil, geçmiş, şikayet
└─ Premium paket: Daha yüksek görünürlük

İŞ ETKISI:
• PARA KAZANMA BAŞLANGIÇ: Lead başına küçük kesinti
• Premium paketi: ₺299/ay (3x görünürlük)
• Servis kazanımı: Armut alternatiﬁ

UYGULANABILIRLIK:
✓ Backend: Servis profili, talep sistemi
✓ Frontend: React dashboard
✓ Entegrasyon: Google Calendar, SMS
✓ Zaman: 6 hafta
✓ Bütçe: ₺50.000

PARA MODELI:
💰 ₺0-₺99: Ücretsiz liste
💰 ₺299: Premium (3x görünürlük, lead garantisi)
💰 ₺499: Super Premium (analitik, özel desteği)
```

---

#### 🟡 Öncelik 8: Müşteri İlişkileri Yönetimi (CRM)
```
SERVİS İŞLETMESİ PERSPEKTİFİ:
"Müşteri tarihçem nerde?"
├─ Müşteri profili: Otomatik
├─ Araç: Bakım geçmişi
├─ İletişim: SMS/Push gönderim
├─ Muhasebe: Basit invoice/fatura
└─ Periyodik hatırlatma: "İlk servisinin 10.000 km"

İŞ ETKISI:
• Tekrar müşteri: +50% (hatırlatmadan)
• Sigorta + muhasebe: Servis başka yere gitmiyor
• Otomasyon: El çalışması azalıyor

UYGULANABILIRLIK:
✓ CRM modülü: Müşteri, araç, işlem
✓ SMS API: Twilio / lokal
✓ Invoice: Basit PDF oluştur
✓ Zaman: 5 hafta
✓ Bütçe: ₺40.000
```

---

### FAZE 4: İçerik + Ortaklık (9-12 AY)

#### 🟡 Öncelik 9: Araç Değer Takibi
```
MÜŞTERİ PERSPEKTİFİ:
"Aracım ne kadar değer kaldı?"
├─ Arabam Kaç Para API
├─ Bakım puanı: İyi bakılmış = +5% değer
├─ Satış zamanı: "Bu ay iyi satılıyor"
├─ Ön hazırlık: "Satmadan 2 hafta servis"
└─ Doğrudan satış: Platformda potansiyel alıcılar

İŞ ETKISI:
• Müşteri yaşam döngüsü: Satış önerileri
• arabam.com ortaklığı: Refer edilen satışlar
• Finansal: Kredi/leasing önerileri

UYGULANABILIRLIK:
✓ Arabam Kaç Para API entegrasyonu
✓ Bakım skoru: ML algoritması
✓ Zaman: 3 hafta
✓ Bütçe: ₺25.000
```

---

#### 🟢 Öncelik 10: DIY Content Hub
```
SEO + MÜŞTERİ ÇEKİCİ:
"Motor yağı nasıl değiştirilir?"
├─ YouTube: 100+ video (embed)
├─ Yazılı rehber: Adım adım
├─ OBD eğitimi: Hata kodları
├─ Servis seçimi: Karar ağacı
└─ Forum: Mu cevaplandırın

İŞ ETKISI:
• SEO: Organik müşteri (₺0 CAC)
• Patreon/Premium: ₺49/ay (ileri dersler)
• YouTube Partner: Reklam geliri
• Brand authority

UYGULANABILIRLIK:
✓ YouTube embed + blog platform
✓ Video prodüksyon: ₺5K/ay (freelance)
✓ Zaman: 4 hafta
✓ Bütçe: ₺25.000 (ilk batch)
```

---

## 4. BAŞLAMANIN ADIM ADIM PLANI (HER HAFTA)

### HAFTA 1-2: Temel Altyapı
- [ ] Database schema: Araç, bakım, muayene, servis
- [ ] Google Maps JS SDK: Konum servisi
- [ ] TÜVTÜRK muayene takvimi: CSV import (başlang)

### HAFTA 3-4: İlk Feature
- [ ] Araç profili CRUD
- [ ] Muayene tarihlerinin hatırlatması
- [ ] Servis harita bulgusu (5 test şehir)

### HAFTA 5-6: QA + Kullanıcı Testi
- [ ] Beta: 100 servis işletmesini davet et
- [ ] Feedback döngüsü (weekly sync)
- [ ] İlk müşteri kazanımı (Instagram, Armut)

### HAFTA 7-8: Yorum Sistemi + Fiyat
- [ ] Yorum mekanizması: Rating + yazı + foto
- [ ] Basit fiyat tahmin: İl bazlı ortalamalar
- [ ] Moderasyon: İnsan kontrol

### HAFTA 9-10: Servis Dashboard
- [ ] Servis profili yönetimi
- [ ] Talep sistemi: Müşteri ihtiyaçları
- [ ] Premium paket bilgisi

### HAFTA 11-12: OBD + Parça Entegrasyonu
- [ ] DtcFix API entegrasyonu
- [ ] Yedekparca.com.tr ortaklığı
- [ ] Content SEO başlatılması

### HAFTA 13-16: İçerik + Ölçekleme
- [ ] DIY video prodüksyon
- [ ] YouTube channel kurulması
- [ ] Press release: Pazar sunumu

---

## 5. KRİTİK BAŞARIŞIZLIK RİSKLERİ

### ⚠️ Risk 1: Rabam'ı Kopyalamak
- **Yanlış:** Pickup/dropoff servisi (Rabam zaten yapıyor)
- **Doğru:** Marketplace finder (Armut-style ama uzmanlaşmış)

### ⚠️ Risk 2: Armut'u Yenmek Yolunda Uğraşmak
- **Yanlış:** Armut'a rakip olma (₺100M+ funding, 14 ülke)
- **Doğru:** "Araç bakım uzmanı" olarak konumlan

### ⚠️ Risk 3: Hiç Fiyat Modeli Olmaksızın Başlamak
- **Yanlış:** Tüm hizmetler ücretsiz
- **Doğru:** Servisler -> Premium paket (₺299/ay)

### ⚠️ Risk 4: Fiyat Estimatörü Olmaksızın Müşteri Güveni
- **Yanlış:** "Herhangi bir fiyat" (Servisler sör söyler)
- **Doğru:** "Ortalama ₺450, sensinde ₺350 OK" -> Anında güven

### ⚠️ Risk 5: Coğrafi Sinırlamalar
- **Yanlış:** Sadece 3 şehir (Rabam sorunu)
- **Doğru:** T1 şehirlerle başla, haftalık 1 şehir ekle

---

## 6. ÖLÇÜM KRİTERLERİ (KPI)

### Ay 1-3 (MVP Dönemi)
```
🎯 MAU: 10.000+
🎯 Kayıtlı Servis: 500+
🎯 Aylık İşlem: 2.000+
🎯 NPS: 50+
🎯 CAR (Konuşma Oranı): 15%+
🎯 Dönem Oranı: 20%+
```

### Ay 6 (Series A Hazırlığı)
```
🎯 MAU: 100.000+
🎯 Kayıtlı Servis: 5.000+
🎯 Aylık İşlem: 20.000+
🎯 Aylık Gelir: ₺500K+
🎯 NPS: 60+
🎯 CAR: 25%+
```

### Yıl 2 (Ölçekleme)
```
🎯 MAU: 1M+
🎯 Kayıtlı Servis: 50.000+
🎯 Aylık İşlem: 500.000+
🎯 Yıllık Gelir: ₺50M+
🎯 Dominasyon: 5 ana şehir
```

---

## 7. PARA KAZANMA MODELI

### Çoklu Gelir Akışları

```
SERVISLERDEN:
├─ Lead başına kesinti: 1-2% (Armut = 5-10%)
├─ Premium paket: ₺299/ay (3x görünürlük)
└─ Super Premium: ₺499/ay (analitik)
     → Beklenti: 20% servis = Premium
     → Yıl 2: 50K servis x ₺299 x 20% = ₺3M

TÜKETICILERDEN:
├─ Araç değer sorgusu: ₺9 (RepairPal-style)
├─ DIY Premium: ₺49/ay (ileri dersler)
└─ Müşteri destek: ₺0 (free retention)
     → Beklenti: 1% x 100K = 1K kullanıcı
     → Yıl 2: 1K x ₺49 x 12 = ₺588K

REKLAMCILARDAN:
├─ Yedek parça: Sponsored listing
├─ Akaryakıt: Banner ads
├─ Sigorta: Referral ortaklığı
└─ Fintech: Kredi önerileri
     → Beklenti: ₺50K-₺100K/ay
     → Yıl 2: ₺1.2M

ORTAKLARDAN:
├─ TÜVTÜRK: Referral trafiği
├─ Sigorta: DRP program
└─ ODD/OSD: Veri lisansı
     → Beklenti: ₺500K/yıl
```

**Toplam Yıl 2 Gelir:** ~₺5.3M (Conservative)

---

## 8. HEMEN BAŞLAN: İLK 48 SAAT

### SAĞ TARAF (GELİŞTİRME)
- [ ] Database schema: Araç, bakım, muayene
- [ ] Git branch: `feature/vehicle-dashboard`
- [ ] React component: Araç profili CRUD

### SOL TARAF (BİZNES)
- [ ] TÜVTÜRK API: Muayene takvimi araştır
- [ ] 20 servis işletmesi: WhatsApp'ta "ücretsiz 3 ay" sunusu
- [ ] Pazar çalışması: "Armut'ta en popüler oto servis nedir?"

### ÜRÜNMarket
- [ ] Landing page: "Aracın sağlığını takip et"
- [ ] Instagram: İlk 5 post (araç bakım ipuçları)
- [ ] YouTube: 3 kısa video (motor yağı nasıl değişir)

---

## 9. SONUÇ: ÇIKMAZ VE ÇÖZÜMÜ

### Sorun
Türkiye'de araç bakım pazarı **fragmentasyon**dan muşturlıyor:
- Armut: Genel hizmet (araç focusu yok)
- Rabam: Sadece İstanbul, sınırlı
- Servis yazılımları: B2B yönelimli
- Fiyat platformları: Hizmet bulma yok

### TamirHanem'in Çözümü
**Araç bakım uzmanı platform**:
- Entegre bakım defteri
- Adil fiyat karşılaştırması
- OBD/Parça entegrasyonu
- Müşteri + Servis yönetimi

### Avantaj
- **Niche'den başla**: Araç bakımı = Büyük pazar
- **Hızlı ölçekle**: B2B2C model = Çok müşteri
- **Türkiye optimized**: Global'den uyarla (DIY, SMS, nakite göre)

### Beklenti (Yıl 2)
- 1M+ aktif kullanıcı
- 50K+ servis işletmesi
- ₺50M+ yıllık gelir
- 5 ana şehirde dominans

---

## 10. KAYNAKLAR

**Rapor Kaynakları:**
- Servisbir, arabam.com, Rabam, Armut, DtcFix
- RepairPal, YourMechanic, AutoMD, Openbay
- ODD, OSD, TÜİK, TÜVTÜRK istatistikleri
- 10+ web araştırması makalesi

**Devam Etme:**
1. `/tamir-hanem-kompetitif-analiz.md` dosyasını oku (tam rapor)
2. Uygulamaya başla (ilk feature: Araç profili)
3. Haftalık geri bildirim döngüsü kur
4. Series A hazırlığını Ay 6'da başlat

---

**Sunuş Tarihi:** Aralık 2025
**Durumu:** BAŞLAMAYA HAZIR
**İlk Adım:** Veritabanı tasarlanı + Servis İşletmesi Temas

