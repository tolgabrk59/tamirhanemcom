# EV Charging Stations API

OpenChargeMap + Google Places entegrasyonu ile şarj istasyonları veri pipeline'ı.

## Kurulum

```bash
cd ev-charging-api
npm install
cp .env.example .env
# .env dosyasını düzenle
```

## Veritabanı

```bash
# Prisma client generate
npm run db:generate

# Migration oluştur ve uygula
npm run db:migrate

# Veya direkt push (dev için)
npm run db:push

# Prisma Studio (GUI)
npm run db:studio
```

## Kullanım

### Pipeline Çalıştır

```bash
# Tam pipeline: OCM fetch + normalize + Google enrich
npm run import

# Sadece OCM fetch
npm run import:ocm

# Sadece normalize + enrich (fetch atla)
npm run import -- --skip-fetch

# Sadece fetch + normalize (enrich atla)
npm run import -- --skip-enrich

# Enrichment limiti
npm run import -- --enrich-limit 50

# Farklı ülke
npm run import -- --country DE
```

### Server Başlat

```bash
# Development
npm run dev

# Production
npm run build
npm start
```

## API Endpoints

```
GET /api/v1/health              - Health check
GET /api/v1/stations            - Tüm istasyonlar (filter, pagination)
GET /api/v1/stations/:id        - Tek istasyon detayı
GET /api/v1/stations/nearby     - Yakındaki istasyonlar
GET /api/v1/cities              - Şehir listesi
GET /api/v1/stats/connectors    - Konnektör istatistikleri
GET /api/v1/sync/logs           - Sync logları
```

### Query Parameters

```
city        - Şehir filtresi
district    - İlçe filtresi
lat, lng    - Konum (mesafe hesabı için)
radius      - Arama yarıçapı (km)
status      - İstasyon durumu
connectorType - Konnektör tipi
minPower    - Minimum güç (kW)
maxPower    - Maximum güç (kW)
is24Hours   - 24 saat açık
limit       - Sayfa boyutu
offset      - Offset
```

## Veri Akışı

```
OpenChargeMap API
       ↓
  stations_raw (ham JSON)
       ↓
  normalize()
       ↓
  stations (normalize edilmiş)
       ↓
  Google Places API (eksik alanlar için)
       ↓
  stations_enriched (zenginleştirme)
       ↓
  stations (güncellenmiş)
```

## Verified Source

- `OCM` - Sadece OpenChargeMap verisi
- `OCM_GOOGLE` - OCM + Google ile zenginleştirilmiş
- `USER` - Kullanıcı doğrulaması (placeholder)
- `OPERATOR` - Operatör doğrulaması (placeholder)
- `VERIFIED` - Tam doğrulanmış

## Ortam Değişkenleri

| Değişken | Açıklama |
|----------|----------|
| DATABASE_URL | PostgreSQL bağlantı URL'i |
| OCM_API_KEY | OpenChargeMap API anahtarı |
| GOOGLE_PLACES_API_KEY | Google Places API anahtarı |
| PORT | Server portu (default: 3001) |
| BATCH_SIZE | Pipeline batch boyutu |
| ENRICHMENT_DELAY_MS | Google API rate limit delay |
