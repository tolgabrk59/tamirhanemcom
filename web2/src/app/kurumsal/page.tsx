'use client'

import Link from 'next/link'
import AnimatedSection from '@/components/shared/AnimatedSection'
import {
  Building2,
  Target,
  Eye,
  Rocket,
  Brain,
  MapPin,
  CalendarCheck,
  BarChart3,
  Search,
  Wrench,
  Car,
  ArrowRight,
  ShieldCheck,
  Database,
  Cpu,
  Globe,
  Users,
  Star,
  Sparkles,
  MessageSquare,
  TrendingUp,
  Store,
  FileText,
  Zap,
  CheckCircle,
  Flag,
} from 'lucide-react'

export default function KurumsalPage() {
  return (
    <div className="min-h-screen pt-24 pb-20 lg:pb-24">
      <div className="glow-dot w-96 h-96 top-0 left-1/2 -translate-x-1/2 opacity-20" />

      {/* ═══ Hero ═══ */}
      <section className="section-container mb-16">
        <AnimatedSection>
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/20 px-4 py-2 rounded-full mb-6">
              <Building2 className="w-4 h-4 text-brand-500" />
              <span className="text-sm font-semibold text-brand-500">Kurumsal</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-display font-extrabold mb-6">
              Yapay Zekâ Destekli <span className="text-gold">Otomotiv Ekosistemi</span>
            </h1>
            <p className="text-th-fg-sub text-lg max-w-3xl mx-auto leading-relaxed">
              TamirHanem, <strong className="text-th-fg">Next AI Teknoloji ve Yazılım Sanayi ve Ticaret Ltd. Şti.</strong> tarafından
              geliştirilen, araç sahipleri ile oto servislerini tek bir dijital platformda buluşturan yapay zekâ destekli
              otomotiv ekosistemidir.
            </p>
          </div>
        </AnimatedSection>
      </section>

      {/* ═══ Giriş Açıklamaları ═══ */}
      <section className="section-container mb-16">
        <AnimatedSection delay={0.1}>
          <div className="glass-card p-8 md:p-10 space-y-5 text-th-fg-sub leading-relaxed">
            <p>
              TamirHanem; araç bakım, onarım ve servis süreçlerini şeffaf, hızlı ve güvenilir hale getirirken,
              servis işletmelerine uçtan uca dijital dönüşüm altyapısı sunar.
            </p>
            <p>
              Next AI&apos;nin yapay zekâ, büyük veri ve SaaS alanındaki mühendislik gücüyle geliştirilen TamirHanem;
              klasik randevu uygulamalarından farklı olarak, <strong className="text-th-fg">veri odaklı karar destek sistemleri</strong> üzerine kuruludur.
            </p>
          </div>
        </AnimatedSection>
      </section>

      {/* ═══ Next AI Hakkında ═══ */}
      <section className="section-container mb-16">
        <AnimatedSection delay={0.15}>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-px bg-brand-500/50" />
            <h2 className="font-display text-2xl md:text-3xl font-extrabold text-th-fg">Next AI Hakkında</h2>
            <div className="flex-1 h-px bg-brand-500/20" />
          </div>
        </AnimatedSection>

        <div className="grid lg:grid-cols-2 gap-8">
          <AnimatedSection delay={0.2}>
            <div className="glass-card p-8 h-full">
              <Cpu className="w-10 h-10 text-brand-500 mb-4" />
              <p className="text-th-fg-sub leading-relaxed mb-6">
                Next AI Teknoloji ve Yazılım, yapay zekâ tabanlı dikey sektör çözümleri geliştiren
                Türkiye merkezli bir teknoloji şirketidir.
              </p>
              <p className="text-th-fg-sub leading-relaxed">
                Next AI, yalnızca yazılım üretmez; gerçek sahadan veri toplayarak çalışan,
                ölçeklenebilir ve ticari değeri olan ürünler geliştirir.
              </p>
              <p className="text-brand-500 font-semibold mt-4">
                TamirHanem, Next AI&apos;nin otomotiv sektörü için hayata geçirdiği amiral projedir.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.25}>
            <div className="glass-card p-8 h-full">
              <h3 className="font-display font-bold text-lg text-th-fg mb-5">Odak Noktaları</h3>
              <div className="space-y-4">
                {[
                  { icon: Brain, text: 'Yapay zekâ destekli karar sistemleri' },
                  { icon: Database, text: 'Büyük veri analitiği' },
                  { icon: Globe, text: 'SaaS platformları' },
                  { icon: Sparkles, text: 'Sektöre özel AI modelleri' },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center shrink-0">
                      <item.icon className="w-5 h-5 text-brand-500" />
                    </div>
                    <span className="text-th-fg font-medium">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ═══ Vizyon & Misyon ═══ */}
      <section className="section-container mb-16">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Vizyon */}
          <AnimatedSection delay={0.1}>
            <div className="glass-card p-8 h-full bg-gradient-to-br from-brand-500/5 to-transparent">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-xl bg-brand-500/15 flex items-center justify-center">
                  <Eye className="w-6 h-6 text-brand-500" />
                </div>
                <h2 className="font-display text-2xl font-extrabold text-th-fg">Vizyonumuz</h2>
              </div>
              <p className="text-th-fg-sub leading-relaxed mb-4">
                Türkiye&apos;nin en kapsamlı otomotiv dijital platformunu oluşturmak.
              </p>
              <p className="text-th-fg-sub leading-relaxed mb-4">
                Uzun vadede hedefimiz; TamirHanem&apos;i sadece bir randevu veya teklif uygulaması değil,
                araç sahipleri için <strong className="text-th-fg">akıllı bakım asistanı</strong>, servisler için ise{' '}
                <strong className="text-th-fg">tam kapsamlı iş yönetim sistemi</strong> haline getirmektir.
              </p>
              <p className="text-brand-500 font-semibold text-sm">
                Next AI&apos;nin mühendislik altyapısıyla, otomotiv sektöründe yapay zekâ tabanlı standartları yeniden tanımlıyoruz.
              </p>
            </div>
          </AnimatedSection>

          {/* Misyon */}
          <AnimatedSection delay={0.2}>
            <div className="glass-card p-8 h-full bg-gradient-to-br from-brand-500/5 to-transparent">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-xl bg-brand-500/15 flex items-center justify-center">
                  <Target className="w-6 h-6 text-brand-500" />
                </div>
                <h2 className="font-display text-2xl font-extrabold text-th-fg">Misyonumuz</h2>
              </div>
              <p className="text-th-fg-sub leading-relaxed mb-4">
                Araç sahiplerinin yaşadığı belirsizliği ortadan kaldırmak.
              </p>
              <p className="text-th-fg-sub leading-relaxed mb-4">
                Servis seçiminden fiyatlandırmaya, kronik arıza analizinden bakım planlamasına kadar tüm süreci dijitalleştirerek:
              </p>
              <ul className="space-y-2 mb-4">
                {[
                  'Daha doğru kararlar alınmasını',
                  'Daha adil fiyatlandırmayı',
                  'Daha kaliteli hizmet sunulmasını',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-th-fg-sub">
                    <CheckCircle className="w-4 h-4 text-brand-500 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-th-fg-sub leading-relaxed text-sm">
                Aynı zamanda servis işletmelerinin müşteri kazanımı, operasyon yönetimi ve dijital görünürlük
                problemlerini tek platformda çözmek.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ═══ Neler Sunuyoruz ═══ */}
      <section className="section-container mb-16">
        <AnimatedSection>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-px bg-brand-500/50" />
            <h2 className="font-display text-2xl md:text-3xl font-extrabold text-th-fg">Neler Sunuyoruz?</h2>
            <div className="flex-1 h-px bg-brand-500/20" />
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Araç Sahipleri İçin */}
          <AnimatedSection delay={0.1}>
            <div className="glass-card p-8 h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center">
                  <Car className="w-6 h-6 text-th-bg" />
                </div>
                <h3 className="font-display text-xl font-bold text-th-fg">Araç Sahipleri İçin</h3>
              </div>
              <div className="space-y-3">
                {[
                  { icon: MapPin, text: 'Konuma göre servis bulma' },
                  { icon: CalendarCheck, text: 'Online randevu oluşturma' },
                  { icon: BarChart3, text: 'Fiyat teklifi alma' },
                  { icon: Search, text: 'Servis karşılaştırma' },
                  { icon: Brain, text: 'Yapay zekâ destekli arıza analizi' },
                  { icon: Database, text: 'Kronik sorun veritabanı' },
                  { icon: FileText, text: 'Dijital bakım geçmişi' },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-3">
                    <item.icon className="w-4 h-4 text-brand-500 shrink-0" />
                    <span className="text-th-fg-sub text-sm">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>

          {/* Servisler İçin */}
          <AnimatedSection delay={0.2}>
            <div className="glass-card p-8 h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center">
                  <Wrench className="w-6 h-6 text-th-bg" />
                </div>
                <h3 className="font-display text-xl font-bold text-th-fg">Servisler İçin</h3>
              </div>
              <div className="space-y-3">
                {[
                  { icon: Store, text: 'Dijital mağaza profili' },
                  { icon: MessageSquare, text: 'Teklif yönetimi' },
                  { icon: CalendarCheck, text: 'Randevu takibi' },
                  { icon: Users, text: 'Müşteri kazanımı' },
                  { icon: TrendingUp, text: 'Performans istatistikleri' },
                  { icon: Sparkles, text: 'Yapay zekâ destekli iş önerileri' },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-3">
                    <item.icon className="w-4 h-4 text-brand-500 shrink-0" />
                    <span className="text-th-fg-sub text-sm">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ═══ Yapay Zekâ Altyapımız ═══ */}
      <section className="section-container mb-16">
        <AnimatedSection>
          <div className="glass-card p-8 md:p-10 bg-gradient-to-r from-brand-500/5 to-brand-500/10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-brand-500/15 flex items-center justify-center">
                <Brain className="w-6 h-6 text-brand-500" />
              </div>
              <h2 className="font-display text-2xl md:text-3xl font-extrabold text-th-fg">Yapay Zekâ Altyapımız</h2>
            </div>
            <p className="text-th-fg-sub leading-relaxed mb-6">
              TamirHanem, Next AI tarafından geliştirilen özel bir yapay zekâ altyapısı üzerinde çalışır.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                'Araç modellerine göre kronik arızaları analiz eder',
                'Kullanıcı şikayetlerini sınıflandırır',
                'Usta çözümlerini karşılaştırır',
                'En olası ve mantıklı çözüm yollarını önerir',
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 bg-th-overlay/[0.03] border border-th-border/[0.06] rounded-xl p-4">
                  <Sparkles className="w-5 h-5 text-brand-500 shrink-0 mt-0.5" />
                  <span className="text-th-fg text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>
            <p className="text-brand-500 font-semibold text-sm mt-6">
              Amaç, kullanıcıyı tahminlerle değil veriyle yönlendiren bir platform oluşturmaktır.
            </p>
          </div>
        </AnimatedSection>
      </section>

      {/* ═══ Neden TamirHanem? ═══ */}
      <section className="section-container mb-16">
        <AnimatedSection>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-px bg-brand-500/50" />
            <h2 className="font-display text-2xl md:text-3xl font-extrabold text-th-fg">Neden TamirHanem?</h2>
            <div className="flex-1 h-px bg-brand-500/20" />
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <div className="glass-card p-8">
            <p className="text-th-fg-sub leading-relaxed mb-6">Çünkü biz:</p>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[
                'Sadece yazılım üretmiyoruz',
                'Sektörü sahadan öğreniyoruz',
                'Gerçek ustalarla çalışıyoruz',
                'Gerçek araç verileri topluyoruz',
                'Gerçek problemleri çözüyoruz',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 bg-brand-500/[0.04] border border-brand-500/10 rounded-xl p-4">
                  <CheckCircle className="w-5 h-5 text-brand-500 shrink-0" />
                  <span className="text-th-fg text-sm font-semibold">{item}</span>
                </div>
              ))}
            </div>
            <p className="text-th-fg-sub mt-6">
              TamirHanem bir fikir değil, <strong className="text-th-fg">aktif olarak geliştirilen ve büyüyen bir Next AI ürünüdür.</strong>
            </p>
          </div>
        </AnimatedSection>
      </section>

      {/* ═══ Yerli Teknoloji ═══ */}
      <section className="section-container mb-16">
        <AnimatedSection>
          <div className="glass-card p-8 md:p-10 text-center bg-gradient-to-br from-brand-500/5 to-transparent">
            <Flag className="w-12 h-12 text-brand-500 mx-auto mb-4" />
            <h2 className="font-display text-2xl md:text-3xl font-extrabold text-th-fg mb-4">
              Yerli Teknoloji, Yerli Vizyon
            </h2>
            <div className="max-w-2xl mx-auto space-y-4 text-th-fg-sub leading-relaxed">
              <p>
                TamirHanem ve tüm altyapısı Next AI tarafından <strong className="text-th-fg">Türkiye&apos;de</strong> geliştirilmiştir.
              </p>
              <p>
                Yazılım mimarisi, veri sistemleri ve yapay zekâ modelleri tamamen yerli mühendislik ürünüdür.
              </p>
              <p className="text-brand-500 font-bold text-lg">
                Hedefimiz, Türkiye&apos;den çıkan global bir otomotiv teknoloji platformu oluşturmaktır.
              </p>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="section-container">
        <AnimatedSection>
          <div className="glass-card p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-display font-extrabold text-th-fg mb-4">
              Bize Ulaşın
            </h2>
            <p className="text-th-fg-sub mb-8 max-w-2xl mx-auto">
              Sorularınız, önerileriniz veya iş birliği teklifleriniz için bizimle iletişime geçebilirsiniz.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/servis-ara"
                className="inline-flex items-center justify-center gap-2 bg-brand-500 text-th-bg px-8 py-3.5 rounded-xl font-bold hover:bg-brand-400 hover:shadow-glow-sm transition-all"
              >
                <Car className="w-5 h-5" />
                Servis Ara
              </Link>
              <Link
                href="/iletisim"
                className="inline-flex items-center justify-center gap-2 border-2 border-brand-500/30 text-brand-500 px-8 py-3.5 rounded-xl font-bold hover:bg-brand-500/10 transition-all"
              >
                İletişim
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </AnimatedSection>
      </section>
    </div>
  )
}
