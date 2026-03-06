# Tamirhanem Next.js Projesi

> **⚠️ ÖNEMLİ:** "tamirhanem.com projesine devam edelim" veya "web2 - kaldığımız yerden devam et" dendiğinde önce `PROJECT_CONTEXT.md` dosyasını oku!

Bu proje araç tamir ve bakım hizmetleri için Next.js tabanlı bir web uygulamasıdır.

## Proje Yapısı

```
src/
├── app/           # Next.js App Router sayfaları
├── components/    # React bileşenleri
├── lib/           # Yardımcı fonksiyonlar
├── services/      # API servisleri
└── types/         # TypeScript tipleri
```

## Teknolojiler

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Strapi CMS (Backend)

## Geliştirme Komutları

```bash
npm run dev      # Geliştirme sunucusu
npm run build    # Production build
npm run start    # Production sunucusu
```

## Skills

Bu projede aşağıdaki skill'ler kullanılabilir:

### Next.js Skills
- `nextjs-best-practices` - Next.js en iyi pratikleri
- `nextjs-app-router` - App Router kullanımı
- `nextjs-server-client` - Server/Client component ayrımı

### React Skills
- `react-patterns` - React tasarım kalıpları
- `frontend-design` - Frontend tasarım prensipleri

### Genel Skills
- `clean-code` - Temiz kod yazımı
- `testing-patterns` - Test stratejileri
- `api-patterns` - API tasarım kalıpları
- `database-design` - Veritabanı tasarımı
- `security-checklist` - Güvenlik kontrol listesi

## Agents

Kullanılabilir agent'lar:

- `orchestrator` - Ana orkestratör
- `debugger` - Hata ayıklama uzmanı
- `frontend-specialist` - Frontend uzmanı
- `backend-specialist` - Backend uzmanı
- `security-auditor` - Güvenlik denetçisi
- `performance-optimizer` - Performans optimizasyonu
- `test-engineer` - Test mühendisi

## Commands

Slash command'lar:

- `/implement` - Özellik implementasyonu
- `/test` - Test yazımı
- `/analyze` - Kod analizi
- `/research` - Araştırma
- `/deploy` - Deployment

## Kurallar

1. TypeScript kullan, any tipinden kaçın
2. Server component'leri tercih et
3. Tailwind CSS kullan
4. Türkçe commit mesajları yaz
5. Her değişiklik için test yaz

## Ortam Değişkenleri

`.env` dosyasında tanımlı:
- `STRAPI_API_TOKEN` - Strapi API anahtarı
- `NEXT_PUBLIC_MAPBOX_TOKEN` - Mapbox token

## Referanslar

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Strapi Docs](https://docs.strapi.io)

## BMAD Method

Bu projede BMAD Method (Breakthrough Method for Agile AI Driven Development) kurulu.

### Başlangıç Komutları

- /bmad-help - Yardım ve rehberlik al
- /product-brief - Ürün tanımı oluştur
- /create-prd - Detaylı gereksinimler
- /create-architecture - Sistem mimarisi
- /create-epics-and-stories - Epic ve story oluştur
- /sprint-planning - Sprint planla
- /dev-story - Story'yi kodla
- /code-review - Kod incelemesi

### Hızlı Akış (Quick Flow)

Bug fix veya küçük özellikler için:
1. /quick-spec - Analiz ve tech-spec
2. /dev-story - Implementasyon
3. /code-review - Kalite kontrolü

### Agents

BMAD agent'ları _bmad/bmm/agents/ altında:
- nalyst.agent.yaml - İş analisti
- pm.agent.yaml - Ürün yöneticisi
- rchitect.agent.yaml - Sistem mimarı
- dev.agent.yaml - Geliştirici
- sm.agent.yaml - Scrum Master
- quinn.agent.yaml - QA uzmanı
- ux-designer.agent.yaml - UX tasarımcı

### Daha Fazla Bilgi

- Docs: http://docs.bmad-method.org/
- GitHub: https://github.com/bmad-code-org/BMAD-METHOD/
