# 🚗 TamirHanem Web Platform

Modern, responsive ve standalone HTML/CSS/JavaScript web platformu.

## 📁 Proje Yapısı

```
/web
├── index.html              # Landing page (Uber-style)
├── login.html              # Login sayfası
├── register.html           # Kayıt sayfası
├── dashboard.html          # Dashboard (Migros/N11-style)
│
├── /css
│   ├── main.css           # Base styles, utilities
│   ├── components.css     # UI component styles
│   ├── landing.css        # Landing page styles
│   ├── auth.css           # Auth pages styles
│   └── dashboard.css      # Dashboard styles
│
├── /js
│   ├── config.js          # Configuration & constants
│   ├── api.js             # API service layer (Strapi)
│   ├── auth.js            # Authentication manager
│   ├── store.js           # State management
│   └── utils.js           # Helper functions
│
├── /assets
│   ├── /images            # Görseller
│   └── /icons             # İkonlar
│
└── /pages                 # Ek sayfalar (opsiyonel)
    ├── services.html
    ├── service-detail.html
    ├── appointments.html
    └── campaigns.html
```

## 🎨 Özellikler

### ✅ PHASE 1 - MVP (Tamamlandı)

#### 1. **Landing Page** (index.html)
- ✅ Uber-style modern hero section
- ✅ Servis tipi kartları (5 adet)
- ✅ Nasıl çalışır? (3 adım)
- ✅ İstatistikler (animated counter)
- ✅ CTA sections
- ✅ Responsive footer

#### 2. **Authentication**
- ✅ Modern split-screen design
- ✅ Login/Register forms
- ✅ JWT token yönetimi
- ✅ LocalStorage persistence
- ✅ Password toggle
- ✅ Form validation

#### 3. **Dashboard**
- ✅ Migros/N11 tarzı layout
- ✅ Sticky navigation bar
- ✅ Tabs menu (Anasayfa, Randevular, Kampanyalar, Asistan, Profil)
- ✅ Servis tipi switcher
- ✅ Kategori grid
- ✅ Servis kartları
- ✅ Kampanya carousel
- ✅ Search functionality

#### 4. **API Entegrasyonu**
- ✅ Strapi backend bağlantısı
- ✅ JWT authentication
- ✅ Services, Categories, Campaigns endpoints
- ✅ User profile management
- ✅ Error handling

#### 5. **State Management**
- ✅ Simple reactive store
- ✅ Service type selection
- ✅ User authentication state
- ✅ UI state (modals, sidebars)

## 🚀 Kurulum ve Kullanım

### 1. Web Sunucusuna Yükleme

Bu proje **standalone HTML/CSS/JavaScript** ile çalışır. Herhangi bir build işlemi gerektirmez.

```bash
# Web klasörünü sunucunuza yükleyin
scp -r web/* user@server:/var/www/html/
```

### 2. Nginx Konfigürasyonu

```nginx
server {
    listen 80;
    server_name tamirhanem.com;
    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # API Proxy (opsiyonel)
    location /api {
        proxy_pass https://api.tamirhanem.net;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 3. Apache Konfigürasyonu

```apache
<VirtualHost *:80>
    ServerName tamirhanem.com
    DocumentRoot /var/www/html

    <Directory /var/www/html>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted

        # Rewrite for SPA
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>
</VirtualHost>
```

### 4. API Konfigürasyonu

`/js/config.js` dosyasını düzenleyin:

```javascript
const CONFIG = {
  API_BASE_URL: 'https://api.tamirhanem.net/api',
  // ...
};
```

## 🎨 Tasarım Sistemi

### Renkler

```css
--color-primary: #ffc507          /* Ana sarı */
--color-primary-accent: #ffab00   /* Vurgu sarı */
--color-bg: #F7F8FA               /* Arka plan */
--color-text-primary: #1A1A1A     /* Ana metin */
```

### Typography

- **Font Family**: Inter, Roboto, system-ui
- **Headings**: 700 (Bold)
- **Body**: 400 (Regular)
- **Buttons**: 600 (Semibold)

### Shadows

```css
--shadow-sm: 0 1px 2px rgba(0,0,0,0.05)
--shadow-md: 0 4px 6px rgba(0,0,0,0.1)
--shadow-lg: 0 10px 15px rgba(0,0,0,0.1)
```

### Border Radius

```css
--radius-sm: 6px
--radius-md: 12px
--radius-lg: 16px
--radius-xl: 24px
```

## 📱 Responsive Breakpoints

```css
Desktop:  1280px+
Laptop:   1024px - 1279px
Tablet:   768px - 1023px
Mobile:   320px - 767px
```

## 🔐 Authentication Flow

1. **Login**
   - Email/Phone + Password
   - JWT token alınır
   - LocalStorage'a kaydedilir
   - Dashboard'a yönlendirilir

2. **Register**
   - User bilgileri toplanır
   - Strapi'ye POST edilir
   - Otomatik login olur
   - Dashboard'a yönlendirilir

3. **Logout**
   - LocalStorage temizlenir
   - Landing page'e yönlendirilir

## 📊 API Endpoints

### Auth
```
POST /api/auth/local              # Login
POST /api/auth/local/register     # Register
GET  /api/users/me                # Current user
```

### Services
```
GET  /api/services                # List services
GET  /api/services/:id            # Service detail
GET  /api/categories              # List categories
```

### Campaigns
```
GET  /api/campaigns               # List campaigns
GET  /api/campaigns/:id           # Campaign detail
```

### Appointments
```
GET  /api/appointments            # List appointments
POST /api/appointments            # Create appointment
PUT  /api/appointments/:id        # Update appointment
```

## 🔧 Özelleştirme

### Tema Rengini Değiştirme

`/css/main.css` içindeki CSS variables'ı düzenleyin:

```css
:root {
  --color-primary: #YOUR_COLOR;
  --gradient-primary: linear-gradient(135deg, #YOUR_COLOR 0%, #YOUR_ACCENT 100%);
}
```

### Logo Değiştirme

HTML dosyalarındaki emoji logosunu değiştirin:

```html
<span class="navbar-logo-icon">🚗</span>
```

veya bir görsel kullanın:

```html
<img src="/assets/images/logo.png" alt="Logo">
```

## 📈 Phase 2 - Gelecek Özellikler

- [ ] Servis detay sayfası
- [ ] Randevu oluşturma wizard
- [ ] Harita entegrasyonu
- [ ] Gerçek zamanlı sohbet (Socket.io)
- [ ] Ödeme entegrasyonu
- [ ] Bildirim sistemi
- [ ] AI Asistan
- [ ] Profil düzenleme
- [ ] Araç yönetimi
- [ ] Cüzdan sayfası

## 🐛 Bilinen Sorunlar

- Mobilde menü açılma animasyonu eksik
- Kampanya carousel otomatik geçiş yok
- Search sadece servis isimlerinde çalışıyor

## 📝 Notlar

- **Hiçbir npm paketi yok**, tamamıyla vanilla JavaScript
- **Responsive**, tüm cihazlarda çalışır
- **SEO friendly**, meta tagları hazır
- **Modern tarayıcılar** için optimize edilmiş (Chrome, Firefox, Safari, Edge)
- **API first**, tüm data Strapi'den gelir

## 📞 Destek

Sorularınız için: [email protected]

## 📄 Lisans

© 2025 TamirHanem. Tüm hakları saklıdır.
