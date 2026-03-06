# TamirHanem Proje İnceleme Raporu

## 1. Proje Yapısı ve Mimari Sorunlar

### ⚠️ İkili Frontend Yapısı (Major Sorun)
Projede iki farklı frontend mimarisi tespit edildi:
1. **Modern Next.js Uygulaması** (`src/app`): Güncel, React tabanlı, Server Side Rendering (SSR) destekli ana uygulama.
2. **Statik Web Uygulaması** (`web/`): Vanilla JS, HTML ve CSS ile yazılmış, Strapi'ye bağlanan bağımsız bir yapı.

**Risk:**
- Kod tekrarı ve bakım zorluğu.
- `src/app/page.tsx` (Next.js ana sayfası) içindeki bazı linkler (örn: `https://tamirhanem.net/register.html`), Next.js rotaları yerine statik dosyalara yönlendiriyor. Bu durum kullanıcı deneyimini böler ve Next.js'in avantajlarını (SPA geçişleri, state koruma) devre dışı bırakır.

**Öneri:**
- `web/` klasörünün amacı netleştirilmeli (Legacy mi, alternatif mi?). Eğer legacy ise arşivlenmeli.
- Next.js uygulamasındaki tüm harici `.html` linkleri, dahili Next.js rotalarına (`/register`, `/login` vb.) çevrilmeli.

## 2. Veritabanı ve Backend Durumu

### 🗄️ Veritabanı Karmaşası
- **MySQL**: Ana veritabanı olarak yapılandırılmış (`src/lib/db.ts`).
- **Redis**: Bağımlılıklar arasında var, muhtemelen cache için.
- **SQLite**: Kök dizinde boş bir `tamirhanem.db` dosyası var. Bu dosya muhtemelen gereksiz ve silinmeli.

### 🔗 API Bağımlılığı
- Proje `https://api.tamirhanem.net/api` adresindeki harici bir Strapi servisine sıkı sıkıya bağlı.
- Lokal geliştirme ortamında bu API'ye erişim olup olmadığı kontrol edilmeli.

## 3. Diğer Tespitler

- **Servis Ayrımı**: `ev-charging-api` adında ayrı bir mikroservis veya modül var. Bunun ana proje ile entegrasyonu kontrol edilmeli.
- **Eksik Dosyalar**: `.env` dosyası var ancak `.env.example` ile uyumlu olup olmadığı ve gerekli tüm anahtarların (özellikle DB ve API URL'leri) tanımlı olduğu doğrulanmalı.

## 4. Aksiyon Planı

1. **Temizlik**: `tamirhanem.db` gibi gereksiz dosyaların temizlenmesi.
2. **Rota Düzeltme**: Next.js içindeki `.html` uzantılı linklerin Next.js rotalarına (`Link` component'i ile) çevrilmesi.
3. **Karar**: `web/` klasörünün akıbetine karar verilmesi.
