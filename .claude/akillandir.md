# Claude Code Akıl Haritası

Bu dosya, Claude Code'a entegre edilen tüm skill, command, mode, MCP server, template, agent ve yardımcı araçların Türkçe açıklamalarını içerir.

**Son Güncelleme:** 2026-01-02
**Toplam Dosya:** 634

---

## İçindekiler

1. [Agents (51 adet)](#agents)
2. [Skills (317 adet)](#skills)
3. [Commands (39 adet)](#commands)
4. [Modes (7 adet)](#modes)
5. [MCP Servers (10 adet)](#mcp-servers)
6. [Templates (14 adet)](#templates)
7. [Standards (5 adet)](#standards)
8. [Hooks (6 adet)](#hooks)
9. [CLI Araçları (6 adet)](#cli-araçları)
10. [Execution Engine (4 adet)](#execution-engine)
11. [PM Agent (5 adet)](#pm-agent)
12. [Scripts (12 adet)](#scripts)
13. [Docs (131 adet)](#docs)

---

## Agents

### Mimari ve Tasarım Ajanları

| Dosya | Türkçe Açıklama | Ne Zaman Kullanılır |
|-------|-----------------|---------------------|
| `backend-architect.md` | Backend sistem mimarı - API tasarımı, veritabanı şeması, servis katmanları | Büyük ölçekli backend sistemleri tasarlarken |
| `frontend-architect.md` | Frontend sistem mimarı - Component yapısı, state yönetimi, UI/UX | React/Next.js uygulama mimarisi kurarken |
| `systems-architect.md` | Genel sistem mimarı - ADR (Mimari Karar Kayıtları), kanıt tabanlı tasarım | Kritik mimari kararlar alırken |
| `devops-architect.md` | DevOps mimarı - CI/CD pipeline, altyapı tasarımı, ölçeklendirme | Deployment ve altyapı planlarken |
| `database-architect.md` | Veritabanı mimarı - Şema tasarımı, indeksleme, sorgu optimizasyonu | Veritabanı yapısı tasarlarken |

### Uzman Geliştirici Ajanları

| Dosya | Türkçe Açıklama | Ne Zaman Kullanılır |
|-------|-----------------|---------------------|
| `backend-specialist.md` | Backend uzmanı - Node.js, Express, API geliştirme, veritabanı işlemleri | REST API ve sunucu kodu yazarken |
| `frontend-specialist.md` | Frontend uzmanı - React, Next.js, CSS, responsive tasarım | Kullanıcı arayüzü geliştirirken |
| `mobile-developer.md` | Mobil geliştirici - React Native, Flutter, cross-platform | Mobil uygulama geliştirirken |
| `devops-engineer.md` | DevOps mühendisi - Docker, Kubernetes, deployment, izleme | Deployment ve sunucu işlemleri yaparken |
| `test-engineer.md` | Test mühendisi - Unit test, integration test, e2e test stratejileri | Test yazarken ve test altyapısı kurarken |

### Güvenlik Ajanları

| Dosya | Türkçe Açıklama | Ne Zaman Kullanılır |
|-------|-----------------|---------------------|
| `security-auditor.md` | Güvenlik denetçisi - OWASP Top 10, XSS, SQL injection, güvenlik açıkları | Kod güvenlik incelemesi yaparken |
| `security-engineer.md` | Güvenlik mühendisi - Tehdit modelleme, güvenlik açığı analizi | Güvenlik sistemi tasarlarken |
| `penetration-tester.md` | Sızma testi uzmanı - Red team taktikleri, exploit geliştirme | Güvenlik testi ve sızma testi yaparken |

### Analiz ve Debug Ajanları

| Dosya | Türkçe Açıklama | Ne Zaman Kullanılır |
|-------|-----------------|---------------------|
| `debugger.md` | Hata ayıklama uzmanı - Hata takibi, stack trace analizi, çözüm | Karmaşık hataları çözerken |
| `root-cause-analyzer.md` | Kök neden analizcisi - 4 aşamalı sistematik debug yöntemi | Hatanın gerçek nedenini bulmak için |
| `root-cause-analyst.md` | Kök neden analisti - Kanıt tabanlı problem çözme | Sistemik sorunları analiz ederken |
| `performance-optimizer.md` | Performans optimizasyonu - Profiling, caching, darboğaz tespiti | Yavaş kodları hızlandırırken |
| `performance-tuner.md` | Performans ayarlayıcı - Benchmark, metrik analizi | İnce ayar performans iyileştirmeleri |
| `explorer-agent.md` | Kod tarayıcı - Codebase keşfi, dosya analizi, yapı haritalama | Yeni bir projeyi tanımak için |

### Araştırma Ajanları

| Dosya | Türkçe Açıklama | Ne Zaman Kullanılır |
|-------|-----------------|---------------------|
| `deep-research-agent.md` | Derin araştırma ajanı - Web araştırması, çoklu kaynak, sentez | Kapsamlı araştırma yaparken |
| `deep-research.md` | Araştırma iş akışı - Kanıt toplama, kaynak doğrulama | Araştırma metodolojisi için |

### Kod Kalitesi Ajanları

| Dosya | Türkçe Açıklama | Ne Zaman Kullanılır |
|-------|-----------------|---------------------|
| `refactor-expert.md` | Refactoring uzmanı - SOLID prensipleri, kod kokusu tespiti | Kodu yeniden yapılandırırken |
| `refactoring-expert.md` | Yeniden düzenleme rehberi - Temiz kod dönüşümü | Legacy kod iyileştirirken |
| `quality-engineer.md` | Kalite mühendisi - QA stratejisi, metrikler, standartlar | Kalite süreçleri kurarken |
| `self-review.md` | Öz-değerlendirme - Kendi kodunu inceleme | Commit öncesi kod kontrolü |

### Dokümantasyon Ajanları

| Dosya | Türkçe Açıklama | Ne Zaman Kullanılır |
|-------|-----------------|---------------------|
| `documentation-writer.md` | Dokümantasyon yazarı - README, API docs, teknik belgeler | Proje belgeleri yazarken |
| `technical-writer.md` | Teknik yazar - Açık ve anlaşılır teknik içerik | Kullanıcı kılavuzları yazarken |

### Öğretim ve Mentorluk Ajanları

| Dosya | Türkçe Açıklama | Ne Zaman Kullanılır |
|-------|-----------------|---------------------|
| `learning-guide.md` | Öğrenme rehberi - Kademeli öğrenme, pratik örnekler | Yeni teknoloji öğrenirken |
| `socratic-mentor.md` | Sokratik mentor - Soru sorarak öğretme, keşif yoluyla öğrenme | Derin anlayış geliştirmek için |
| `python-expert.md` | Python uzmanı - Pythonic kod, best practices | Python kodu yazarken |

### Proje Yönetimi Ajanları

| Dosya | Türkçe Açıklama | Ne Zaman Kullanılır |
|-------|-----------------|---------------------|
| `pm-agent.md` | Proje yöneticisi - Otonom PM, görev takibi, planlama | Proje yönetimi yaparken |
| `project-planner.md` | Proje planlayıcı - Görev dağılımı, bağımlılık analizi | Proje planı hazırlarken |
| `orchestrator.md` | Orkestratör - Çoklu agent koordinasyonu, paralel işlem | Karmaşık görevleri yönetirken |
| `requirements-analyst.md` | Gereksinim analisti - Spec'ten gereksinimlere dönüşüm | Proje gereksinimlerini belirlerken |

### Diğer Ajanlar

| Dosya | Türkçe Açıklama | Ne Zaman Kullanılır |
|-------|-----------------|---------------------|
| `repo-index.md` | Repo indeksleyici - Codebase haritalama, dosya ilişkileri | Büyük projeleri anlamak için |
| `seo-specialist.md` | SEO uzmanı - Arama motoru optimizasyonu | Web sitesi SEO'su için |
| `business-panel-experts.md` | İş stratejisi paneli - Çoklu uzman tartışması | İş kararları alırken |
| `api-designer.md` | API tasarımcısı - REST, GraphQL, OpenAPI | API tasarlarken |

---

## Skills

### Engineering Team (116 dosya)

Her skill klasöründe `SKILL.md`, `references/` ve `scripts/` bulunur.

| Klasör | Türkçe Açıklama | İçerik |
|--------|-----------------|--------|
| `senior-architect/` | Kıdemli Mimar - Sistem tasarımı, mimari kararlar | Mimari pattern'ler, karar rehberi, diagram oluşturucu |
| `senior-backend/` | Kıdemli Backend - API, veritabanı, sunucu | API tasarım pattern'leri, güvenlik pratikleri, DB optimizasyonu |
| `senior-frontend/` | Kıdemli Frontend - React, Next.js, UI | Frontend best practices, Next.js optimizasyonu, React pattern'leri |
| `senior-fullstack/` | Kıdemli Fullstack - Uçtan uca geliştirme | Mimari pattern'ler, workflow'lar, tech stack rehberi |
| `senior-devops/` | Kıdemli DevOps - CI/CD, deployment | Pipeline rehberi, deployment stratejileri, IaC |
| `senior-security/` | Kıdemli Güvenlik - Şifreleme, pentest | Kriptografi, sızma testi, güvenlik mimarisi |
| `senior-secops/` | Kıdemli SecOps - Uyumluluk, güvenlik operasyonları | Uyumluluk gereksinimleri, standartlar, zafiyet yönetimi |
| `senior-qa/` | Kıdemli QA - Test stratejileri | QA best practices, test otomasyon, test stratejileri |
| `senior-data-scientist/` | Kıdemli Veri Bilimci - ML, analiz | Deney tasarımı, feature engineering, istatistik |
| `senior-data-engineer/` | Kıdemli Veri Mühendisi - ETL, pipeline | Veri modelleme, pipeline mimarisi, DataOps |
| `senior-ml-engineer/` | Kıdemli ML Mühendisi - MLOps, RAG | LLM entegrasyonu, MLOps pattern'leri, RAG sistemi |
| `senior-computer-vision/` | Kıdemli CV Uzmanı - Görüntü işleme | CV mimarileri, nesne tespiti, production sistemleri |
| `senior-prompt-engineer/` | Kıdemli Prompt Mühendisi - LLM optimizasyonu | Agentic tasarım, LLM değerlendirme, prompt pattern'leri |
| `code-reviewer/` | Kod İnceleyici - PR review | Kod kalite kontrolü, standartlar, antipattern'ler |

### Product Team (21 dosya)

| Klasör | Türkçe Açıklama | İçerik |
|--------|-----------------|--------|
| `product-manager-toolkit/` | Ürün Yöneticisi Araç Seti | PRD şablonları, müşteri görüşme analizi, RICE önceliklendirme |
| `product-strategist/` | Ürün Stratejisti | OKR cascade oluşturucu |
| `agile-product-owner/` | Agile Ürün Sahibi | User story oluşturucu |
| `ux-researcher-designer/` | UX Araştırmacı/Tasarımcı | Persona oluşturucu |
| `ui-design-system/` | UI Tasarım Sistemi | Design token oluşturucu |

### C-Level Advisor (CEO/CTO Danışmanları)

| Klasör | Türkçe Açıklama | İçerik |
|--------|-----------------|--------|
| `ceo-advisor/` | CEO Danışmanı - Stratejik kararlar, yönetim kurulu, yatırımcı ilişkileri | Strateji analizörü, finansal senaryo analizi |
| `cto-advisor/` | CTO Danışmanı - Teknoloji değerlendirme, ekip ölçekleme | Tech debt analizi, ekip ölçekleme hesaplayıcı |

### Marketing Skill (Pazarlama)

| Klasör | Türkçe Açıklama | İçerik |
|--------|-----------------|--------|
| `content-creator/` | İçerik Oluşturucu - Blog, sosyal medya, marka sesi | Marka sesi analizi, SEO optimizasyonu, içerik takvimi |
| `marketing-demand-acquisition/` | Talep Yaratma - Lead gen, CAC hesaplama | CAC hesaplayıcı |
| `marketing-strategy-pmm/` | Pazarlama Stratejisi - GTM, konumlandırma | Pazar stratejisi |

### Project Management (Proje Yönetimi)

| Klasör | Türkçe Açıklama |
|--------|-----------------|
| `atlassian-admin/` | Atlassian Yönetici - Jira/Confluence kurulumu ve yönetimi |
| `confluence-expert/` | Confluence Uzmanı - Wiki, dokümantasyon, bilgi tabanı |
| `jira-expert/` | Jira Uzmanı - Issue takibi, board yönetimi, raporlama |
| `scrum-master/` | Scrum Master - Sprint planlama, retrospektif, velocity |
| `senior-pm/` | Kıdemli Proje Yöneticisi - Proje planlama, risk yönetimi |

### RA-QM Team (Düzenleyici İşler ve Kalite Yönetimi)

| Klasör | Türkçe Açıklama |
|--------|-----------------|
| `capa-officer/` | CAPA Sorumlusu - Düzeltici ve önleyici faaliyetler |
| `fda-consultant-specialist/` | FDA Danışmanı - ABD düzenleyici uyumluluk |
| `gdpr-dsgvo-expert/` | GDPR/DSGVO Uzmanı - Veri koruma, gizlilik |
| `information-security-manager-iso27001/` | ISO 27001 Yöneticisi - Bilgi güvenliği yönetim sistemi |
| `isms-audit-expert/` | ISMS Denetim Uzmanı - Güvenlik denetimi |
| `mdr-745-specialist/` | MDR 745 Uzmanı - Avrupa tıbbi cihaz yönetmeliği |
| `qms-audit-expert/` | QMS Denetim Uzmanı - Kalite yönetim sistemi denetimi |
| `quality-documentation-manager/` | Kalite Dokümantasyon Yöneticisi - SOP, prosedürler |
| `quality-manager-qmr/` | Kalite Yöneticisi (QMR) - Kalite temsilcisi |
| `quality-manager-qms-iso13485/` | ISO 13485 Kalite Yöneticisi - Tıbbi cihaz QMS |
| `regulatory-affairs-head/` | Düzenleyici İşler Başkanı - FDA, CE onayları |
| `risk-management-specialist/` | Risk Yönetimi Uzmanı - ISO 14971, risk analizi |

### Next.js ve React Skills

| Dosya | Türkçe Açıklama |
|-------|-----------------|
| `nextjs-app-router.md` | Next.js App Router Temelleri - Yeni yönlendirme sistemi, sayfa yapısı |
| `nextjs-server-client.md` | Server/Client Component Ayrımı - RSC (React Server Components) kullanımı |
| `nextjs-server-client-components.md` | Detaylı Component Rehberi - "use client" direktifi, hydration |
| `nextjs-dynamic-routes.md` | Dinamik Routing - [slug], [...params], [[...catchAll]] pattern'leri |
| `nextjs-anti-patterns.md` | Kaçınılması Gereken Hatalar - Performans sorunları, yaygın yanlışlar |
| `nextjs-advanced-routing.md` | İleri Seviye Routing - Parallel routes, intercepting routes |
| `nextjs-search-params.md` | URL Search Params - useSearchParams hook'u, Suspense boundary |
| `nextjs-client-cookie.md` | Client-side Cookie Yönetimi - Auth token, cookie işlemleri |
| `nextjs-server-navigation.md` | Server-side Navigation - redirect(), revalidatePath() |
| `nextjs-pathname-fetch.md` | Pathname ve Data Fetch - Route handler'lar, veri çekme |
| `nextjs-best-practices.md` | Next.js En İyi Pratikler - Genel rehber ve öneriler |
| `react-patterns.md` | Modern React Pattern'leri - Hooks, composition, render props |
| `vercel-ai-sdk.md` | Vercel AI SDK Kullanımı - AI uygulamaları, streaming |

### API ve Backend Skills

| Dosya | Türkçe Açıklama |
|-------|-----------------|
| `api-patterns.md` | REST API Tasarım Pattern'leri - Endpoint isimlendirme, HTTP metodları |
| `api-security-testing.md` | API Güvenlik Testleri - OWASP API Security Top 10 |
| `nodejs-best-practices.md` | Node.js En İyi Pratikler - Express, async pattern'ler, hata yönetimi |
| `database-design.md` | Veritabanı Tasarımı - Şema, normalizasyon, indeksleme |

### Test ve Debugging Skills

| Dosya | Türkçe Açıklama |
|-------|-----------------|
| `systematic-debugging.md` | Sistematik Hata Ayıklama - 4 aşamalı debug yöntemi, kök neden analizi |
| `test-driven-development.md` | Test Güdümlü Geliştirme - TDD metodolojisi |
| `tdd-workflow.md` | TDD İş Akışı - Kırmızı-Yeşil-Refactor döngüsü |
| `testing-patterns.md` | Test Pattern'leri - Unit, integration, e2e test yaklaşımları |
| `verification-before-completion.md` | Tamamlama Öncesi Doğrulama - Kanıt tabanlı iddia kontrolü |

### Güvenlik Skills

| Dosya | Türkçe Açıklama |
|-------|-----------------|
| `security-checklist.md` | Güvenlik Kontrol Listesi - OWASP, XSS, CSRF, SQL injection kontrolleri |
| `vulnerability-scanner.md` | Güvenlik Açığı Tarama - DAST, SAST, SCA araçları ve teknikleri |
| `red-team-tactics.md` | Kırmızı Takım Taktikleri - Sızma testi teknikleri, exploit geliştirme |

### Tasarım ve UI/UX Skills

| Dosya | Türkçe Açıklama |
|-------|-----------------|
| `frontend-design.md` | Frontend Tasarım Rehberi - React/Tailwind ile UI geliştirme |
| `modern-design-system.md` | 2025 UI Trendleri - Glassmorphism, bento grid, micro-animation |
| `tailwind-patterns.md` | Tailwind CSS Pattern'leri - Responsive tasarım, dark mode |
| `mobile-patterns.md` | Mobil Uygulama Pattern'leri - React Native, Flutter yaklaşımları |
| `mobile-ux-patterns.md` | Mobil UX Pattern'leri - Dokunmatik, jest, haptic feedback |
| `mobile-typography.md` | Mobil Tipografi Sistemi - Font ölçekleri, satır yükseklikleri |
| `artifacts-builder.md` | HTML Artifact Oluşturucu - shadcn/ui, Tailwind component'leri |

### Araç ve Metodoloji Skills

| Dosya | Türkçe Açıklama |
|-------|-----------------|
| `brainstorming.md` | Beyin Fırtınası - Sokratik diyalog ile fikir üretme |
| `plan-writing.md` | Plan Yazma - Görev dağılımı, bağımlılık analizi |
| `writing-plans.md` | Detaylı Plan Yazımı - 2-5 dakikalık task'lara bölme |
| `subagent-driven-development.md` | Alt-agent Geliştirme - 2 aşamalı review süreci |
| `parallel-agents.md` | Paralel Agent Çalıştırma - Eş zamanlı görev yürütme |
| `conversation-manager.md` | Diyalog Yönetimi - Açıklama isteme, ilerleme bildirimi |
| `code-review-checklist.md` | Kod İnceleme Listesi - PR review kontrol noktaları |
| `documentation-templates.md` | Dokümantasyon Şablonları - README, API docs formatları |
| `architecture.md` | Mimari Framework - ADR, trade-off değerlendirme |
| `app-builder.md` | Uygulama Oluşturucu - Full-stack proje iskeleti |
| `mcp-builder.md` | MCP Server Oluşturma - Model Context Protocol entegrasyonu |
| `behavioral-modes.md` | Davranış Modları - Odaklanma, beyin fırtınası modları |

### Performans ve SEO Skills

| Dosya | Türkçe Açıklama |
|-------|-----------------|
| `performance-profiling.md` | Performans Profilleme - Core Web Vitals, bundle analizi |
| `seo-fundamentals.md` | SEO Temelleri - Meta etiketler, E-E-A-T, Google algoritmaları |
| `geo-fundamentals.md` | GEO (AI Arama Optimizasyonu) - ChatGPT, Perplexity için optimize etme |
| `webapp-testing.md` | Web Uygulama Testi - Playwright ile browser testi |

### Diğer Skills

| Dosya | Türkçe Açıklama |
|-------|-----------------|
| `powershell-windows.md` | PowerShell Scripting - Windows otomasyon, syntax hatalarından kaçınma |
| `python-patterns.md` | Python Pattern'leri - Decorator, generator, async/await |
| `clean-code.md` | Temiz Kod - Okunabilir, bakımı kolay kod yazma prensipleri |
| `git-worktrees.md` | Git Worktree - Paralel branch çalışması |
| `deployment-procedures.md` | Deployment Prosedürleri - Checklist, rollback planı |
| `server-management.md` | Sunucu Yönetimi - PM2, loglama, izleme |

---

## Commands

### Geliştirme Komutları

| Dosya | Komut | Türkçe Açıklama |
|-------|-------|-----------------|
| `implement.md` | `/implement` | Kod yazma ve implementasyon - Özellik geliştirme |
| `build.md` | `/build` | Build işlemi çalıştırma - Derleme ve paketleme |
| `test.md` | `/test` | Test çalıştırma - Unit, integration, e2e testleri |
| `deploy.md` | `/deploy` | Deployment yapma - Canlıya alma işlemi |
| `git.md` | `/git` | Git işlemleri - Commit, push, branch yönetimi |
| `cleanup.md` | `/cleanup` | Kod temizleme - Kullanılmayan kod, import silme |

### Analiz ve Planlama Komutları

| Dosya | Komut | Türkçe Açıklama |
|-------|-------|-----------------|
| `analyze.md` | `/analyze` | Kod analizi - Yapı, bağımlılık, kalite inceleme |
| `research.md` | `/research` | Araştırma yapma - Konu hakkında bilgi toplama |
| `brainstorm.md` | `/brainstorm` | Beyin fırtınası - Fikir üretme oturumu |
| `design.md` | `/design` | Tasarım oluşturma - Mimari, UI/UX tasarımı |
| `estimate.md` | `/estimate` | Tahmin yapma - Zaman ve efor tahmini |
| `recommend.md` | `/recommend` | Öneri sunma - En iyi yaklaşımı önerme |

### Dokümantasyon Komutları

| Dosya | Komut | Türkçe Açıklama |
|-------|-------|-----------------|
| `document.md` | `/document` | Dokümantasyon yazma - README, API docs |
| `explain.md` | `/explain` | Kod açıklama - Kodun ne yaptığını anlatma |

### İş Akışı Komutları

| Dosya | Komut | Türkçe Açıklama |
|-------|-------|-----------------|
| `workflow.md` | `/workflow` | İş akışı yönetimi - Süreç tanımlama |
| `task.md` | `/task` | Görev yönetimi - Todo listesi işlemleri |
| `spawn.md` | `/spawn` | Alt-agent oluşturma - Paralel çalışan agent |
| `pm.md` | `/pm` | Proje yönetimi modu - PM agent aktifleştirme |

### Yardımcı Komutlar

| Dosya | Komut | Türkçe Açıklama |
|-------|-------|-----------------|
| `help.md` | `/help` | Yardım - Komut listesi ve kullanım |
| `sc.md` | `/sc` | SuperClaude kısayolu - Hızlı erişim |
| `save.md` | `/save` | Kaydetme - Context kaydetme |
| `load.md` | `/load` | Yükleme - Kaydedilmiş context yükleme |
| `reflect.md` | `/reflect` | Düşünme - Öz değerlendirme yapma |
| `improve.md` | `/improve` | İyileştirme - Kod/süreç iyileştirme önerisi |
| `troubleshoot.md` | `/troubleshoot` | Sorun giderme - Hata analizi ve çözüm |
| `select-tool.md` | `/select-tool` | Araç seçimi - Uygun aracı belirleme |

### İndeksleme Komutları

| Dosya | Komut | Türkçe Açıklama |
|-------|-------|-----------------|
| `index.md` | `/index` | Genel indeksleme - İçerik kataloglama |
| `index-repo.md` | `/index-repo` | Repo indeksleme - Proje yapısını haritalama |

### Özel Panel Komutları

| Dosya | Komut | Türkçe Açıklama |
|-------|-------|-----------------|
| `business-panel.md` | `/business-panel` | İş paneli - Çoklu uzman iş tartışması |
| `spec-panel.md` | `/spec-panel` | Spec paneli - Teknik şartname tartışması |
| `agent.md` | `/agent` | Agent yönetimi - Agent seçme ve çalıştırma |

### Türkçe Özel Komutlar

| Dosya | Komut | Türkçe Açıklama |
|-------|-------|-----------------|
| `api-endpoint-olustur.md` | `/api-endpoint-olustur` | API endpoint oluşturma - Next.js route handler |
| `build-ve-deploy.md` | `/build-ve-deploy` | Build ve deploy - Tam deployment süreci |
| `chatbot-prompt-guncelle.md` | `/chatbot-prompt-guncelle` | Chatbot prompt güncelleme - AI prompt değişikliği |
| `component-olustur.md` | `/component-olustur` | Component oluşturma - React component iskeleti |
| `sayfa-ekle.md` | `/sayfa-ekle` | Yeni sayfa ekleme - Next.js page oluşturma |
| `strapi-sorgu.md` | `/strapi-sorgu` | Strapi sorgusu - Strapi API çağrısı |
| `tailwind-tema-guncelle.md` | `/tailwind-tema-guncelle` | Tailwind tema güncelleme - Renk, font değişikliği |

---

## Modes

| Dosya | Mod | Türkçe Açıklama |
|-------|-----|-----------------|
| `MODE_Brainstorming.md` | Beyin Fırtınası Modu | Yaratıcı düşünme, fikir üretme, serbest çağrışım |
| `MODE_Business_Panel.md` | İş Paneli Modu | Çoklu uzman tartışması, iş stratejisi değerlendirme |
| `MODE_DeepResearch.md` | Derin Araştırma Modu | Kapsamlı araştırma, çoklu kaynak analizi |
| `MODE_Introspection.md` | İç Gözlem Modu | Öz-değerlendirme, refleksiyon, hata analizi |
| `MODE_Orchestration.md` | Orkestrasyon Modu | Çoklu agent koordinasyonu, paralel görev yönetimi |
| `MODE_Task_Management.md` | Görev Yönetimi Modu | Todo takibi, ilerleme izleme, önceliklendirme |
| `MODE_Token_Efficiency.md` | Token Verimliliği Modu | Kısa yanıtlar, özet çıktılar, maliyet optimizasyonu |

---

## MCP Servers

| Dosya | Sunucu | Türkçe Açıklama |
|-------|--------|-----------------|
| `MCP_Airis-Agent.md` | Airis Agent | AI agent entegrasyonu - Otonom görev yürütme |
| `MCP_Chrome-DevTools.md` | Chrome DevTools | Tarayıcı kontrolü - DOM manipülasyonu, debug |
| `MCP_Context7.md` | Context7 | Dokümantasyon arama - Kütüphane docs lookup |
| `MCP_Magic.md` | Magic | Büyülü kısayollar - Hızlı işlem makroları |
| `MCP_Mindbase.md` | Mindbase | Bilgi yönetimi - Not ve bağlantı takibi |
| `MCP_Morphllm.md` | MorphLLM | LLM dönüştürme - Model adaptasyonu |
| `MCP_Playwright.md` | Playwright | Tarayıcı otomasyonu - E2E test, scraping |
| `MCP_Sequential.md` | Sequential | Sıralı işlemler - Adım adım workflow |
| `MCP_Serena.md` | Serena | Sakin iş akışları - Düşünceli işlem |
| `MCP_Tavily.md` | Tavily | AI destekli arama - Akıllı web araştırma |

---

## Templates

### Web Uygulama Şablonları

| Dosya | Şablon | Türkçe Açıklama |
|-------|--------|-----------------|
| `nextjs-fullstack.md` | Next.js Full-Stack | Tam yığın Next.js projesi - API routes, veritabanı, auth |
| `nextjs-saas.md` | Next.js SaaS | SaaS uygulama şablonu - Abonelik, ödeme, dashboard |
| `nextjs-static.md` | Next.js Static | Statik site şablonu - Blog, landing page |
| `astro-static.md` | Astro Static | Astro ile statik site - Hızlı, SEO dostu |

### API ve Backend Şablonları

| Dosya | Şablon | Türkçe Açıklama |
|-------|--------|-----------------|
| `express-api.md` | Express API | Express.js REST API - CRUD, auth, middleware |
| `python-fastapi.md` | Python FastAPI | FastAPI backend - Async, OpenAPI, validation |

### Mobil Uygulama Şablonları

| Dosya | Şablon | Türkçe Açıklama |
|-------|--------|-----------------|
| `react-native-app.md` | React Native | Cross-platform mobil - iOS ve Android |
| `flutter-app.md` | Flutter | Flutter mobil uygulama - Material Design |

### Desktop ve Extension Şablonları

| Dosya | Şablon | Türkçe Açıklama |
|-------|--------|-----------------|
| `electron-desktop.md` | Electron | Masaüstü uygulama - Windows, Mac, Linux |
| `chrome-extension.md` | Chrome Extension | Tarayıcı eklentisi - Popup, content script |

### CLI ve Monorepo Şablonları

| Dosya | Şablon | Türkçe Açıklama |
|-------|--------|-----------------|
| `cli-tool.md` | CLI Tool | Komut satırı aracı - Interaktif CLI |
| `monorepo-turborepo.md` | Monorepo | Turborepo monorepo - Çoklu paket yönetimi |

---

## Standards

| Klasör | Standart | Türkçe Açıklama |
|--------|----------|-----------------|
| `security/` | Güvenlik Standartları | OWASP kuralları, güvenli kodlama prensipleri |
| `quality/` | Kalite Standartları | Kod kalite metrikleri, coverage gereksinimleri |
| `git/` | Git Workflow Standartları | Branch stratejisi, commit mesaj formatı |
| `documentation/` | Dokümantasyon Standartları | README formatı, API docs yapısı |
| `communication/` | İletişim Standartları | Takım iletişim kuralları, PR review etiketi |

---

## Hooks

| Dosya | Hook | Türkçe Açıklama |
|-------|------|-----------------|
| `hooks.json` | Konfigürasyon | Hook ayarları ve tetikleyiciler |
| `pre-commit` | Pre-Commit | Commit öncesi kontroller - Lint, type check |
| `pre-push` | Pre-Push | Push öncesi kontroller - Build, test, güvenlik taraması |
| `post-checkout` | Post-Checkout | Branch değiştirme sonrası - Bağımlılık güncelleme |
| `session_hooks.py` | Session Hooks | Python session yönetimi - Oturum başlatma/sonlandırma |
| `README.md` | README | Hook dokümantasyonu ve kullanım rehberi |

---

## CLI Araçları

| Dosya | Araç | Türkçe Açıklama |
|-------|------|-----------------|
| `main.py` | Ana CLI | Ana komut satırı arayüzü giriş noktası |
| `doctor.py` | Doktor | Sistem sağlık kontrolü - Bağımlılık ve yapılandırma doğrulama |
| `install_commands.py` | Komut Kurulumu | Claude Code komutlarını kurma |
| `install_mcp.py` | MCP Kurulumu | MCP sunucularını kurma ve yapılandırma |
| `install_skill.py` | Skill Kurulumu | Yeni skill'leri kurma |

---

## Execution Engine

| Dosya | Modül | Türkçe Açıklama |
|-------|-------|-----------------|
| `parallel.py` | Paralel İşlem | Eş zamanlı görev yürütme - Çoklu agent koordinasyonu |
| `reflection.py` | Refleksiyon | Öz-değerlendirme sistemi - Sonuç analizi |
| `self_correction.py` | Otomatik Düzeltme | Hata tespiti ve otomatik düzeltme mekanizması |

---

## PM Agent

| Dosya | Modül | Türkçe Açıklama |
|-------|-------|-----------------|
| `confidence.py` | Güven Skoru | Karar güvenilirliği hesaplama - %0-100 arası skor |
| `reflexion.py` | Refleksiyon | Geçmiş kararları değerlendirme - Öğrenme döngüsü |
| `self_check.py` | Otomatik Kontrol | Çıktı doğrulama - Kalite kontrolü |
| `token_budget.py` | Token Bütçesi | Token kullanım takibi - Maliyet yönetimi |

---

## Scripts

| Dosya | Script | Türkçe Açıklama |
|-------|--------|-----------------|
| `auto_preview.py` | Otomatik Önizleme | Değişiklikleri otomatik önizleme |
| `dependency_scanner.py` | Bağımlılık Tarayıcı | Proje bağımlılıklarını analiz etme |
| `explorer_helper.py` | Keşif Yardımcısı | Codebase keşfi için yardımcı fonksiyonlar |
| `parallel_orchestrator.py` | Paralel Orkestratör | Çoklu görev koordinasyonu |
| `session_hooks.py` | Session Hook'ları | Oturum yaşam döngüsü yönetimi |
| `session_manager.py` | Session Yöneticisi | Oturum state yönetimi |
| `setup.py` | Kurulum | SuperClaude kurulum scripti |
| `clean_command_names.py` | Komut Temizleyici | Komut isimlerini standartlaştırma |
| `session-init.sh` | Session Başlatma | Bash session başlatma scripti |
| `mcp-setup.sh` | MCP Kurulumu | MCP sunucularını kurma (manfromtunis) |

---

## Docs

Kapsamlı dokümantasyon (131 dosya):

| Klasör | Türkçe Açıklama |
|--------|-----------------|
| `Development/` | Geliştirme rehberi, yol haritası, görev listesi |
| `architecture/` | Mimari kararlar, migration planları, faz tamamlama raporları |
| `developer-guide/` | Geliştirici rehberi, katkıda bulunma kuralları |
| `getting-started/` | Kurulum rehberi, hızlı başlangıç |
| `mcp/` | MCP entegrasyon politikası, isteğe bağlı tasarım |
| `memory/` | Session belleği, öğrenilen pattern'ler, refleksiyon örnekleri |
| `mistakes/` | Hata öğrenmeleri - Geçmiş hatalardan çıkarılan dersler |
| `reference/` | Komut referansı, ileri seviye pattern'ler, sorun giderme |
| `research/` | Araştırma notları, LLM token verimliliği, migration planları |
| `sessions/` | Oturum özetleri, tarihsel kayıtlar |
| `testing/` | Test prosedürleri, PM workflow test sonuçları |
| `troubleshooting/` | Sorun giderme rehberleri, yaygın hatalar |
| `user-guide/` | Kullanıcı rehberi - Türkçe, İngilizce, Japonca, Korece, Çince |

---

## Hızlı Başvuru

### En Çok Kullanılan Skill'ler

```bash
# Debug yaparken
/skill systematic-debugging

# Yeni proje başlatırken
/skill brainstorming

# Next.js geliştirirken
/skill nextjs-best-practices

# Güvenlik kontrolü için
/skill security-checklist

# Plan yaparken
/skill plan-writing

# Kod incelemesi için
/skill code-review-checklist
```

### En Çok Kullanılan Komutlar

```bash
# Kod yazma
/implement <görev>

# Test çalıştırma
/test

# Deploy etme
/deploy

# Araştırma yapma
/research <konu>

# Beyin fırtınası
/brainstorm

# Kod analizi
/analyze
```

### Agent Kullanımı

```bash
# Güvenlik denetimi
/agent security-auditor

# Hata kök neden analizi
/agent root-cause-analyzer

# Performans iyileştirme
/agent performance-tuner

# Kapsamlı araştırma
/agent deep-research

# Mimari tasarım
/agent systems-architect
```

### Mod Değiştirme

```bash
# Yaratıcı mod
/mode brainstorming

# Araştırma modu
/mode deep-research

# Görev yönetimi
/mode task-management

# Token tasarrufu
/mode token-efficiency
```

---

## Dosya Yapısı

```
.claude/
├── agents/              # 51 agent dosyası
├── skills/              # 317 skill dosyası
│   ├── engineering-team/    # 116 dosya (references/, scripts/)
│   ├── product-team/        # 21 dosya
│   ├── c-level-advisor/     # CEO/CTO danışmanları
│   ├── marketing-skill/     # Pazarlama skill'leri
│   ├── project-management/  # Proje yönetimi
│   └── ra-qm-team/          # Düzenleyici ve kalite
├── commands/            # 39 komut dosyası
├── modes/               # 7 mod dosyası
├── mcp/                 # 10 MCP konfigürasyonu
├── templates/           # 14 şablon dosyası
├── standards/           # 5 standart klasörü
├── hooks/               # 6 hook dosyası
├── cli/                 # 6 CLI aracı
├── execution/           # 4 execution modülü
├── pm_agent/            # 5 PM agent modülü
├── docs/                # 131 dokümantasyon
├── data/                # Veri dosyaları
├── scripts/             # 12 yardımcı script
├── examples/            # Örnek workflow'lar
├── akillandir.md        # Bu dosya (Türkçe rehber)
├── KNOWLEDGE.md         # Bilgi tabanı
├── PLANNING.md          # Planlama rehberi
├── AGENTS.md            # Agent listesi
├── RULES.md             # Kurallar
├── PRINCIPLES.md        # Prensipler
├── FLAGS.md             # Flag tanımları
└── settings.local.json  # Yerel ayarlar
```

---

## Kaynak Repolar

| Repo | Türkçe Açıklama |
|------|-----------------|
| [alirezarezvani/claude-skills](https://github.com/alirezarezvani/claude-skills) | Mühendislik, Ürün, Pazarlama, RA-QM ekip skill'leri |
| [wsimmonds/claude-nextjs-skills](https://github.com/wsimmonds/claude-nextjs-skills) | Next.js özel skill'leri |
| [manfromtunis/claude-config](https://github.com/manfromtunis/claude-config) | TypeScript/Next.js yapılandırması, hook'lar |
| [SuperClaude-Org/SuperClaude_Framework](https://github.com/SuperClaude-Org/SuperClaude_Framework) | Komutlar, Modlar, MCP, CLI araçları |
| [xenitV1/claude-code-maestro](https://github.com/xenitV1/claude-code-maestro) | 50+ skill, şablonlar, dokümantasyon |

---

*Bu dosya Claude Code için Türkçe referans rehberidir. Son güncelleme: 2026-01-02*
