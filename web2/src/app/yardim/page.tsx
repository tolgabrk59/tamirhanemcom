'use client'

import Link from 'next/link'
import AnimatedSection from '@/components/shared/AnimatedSection'
import {
  HelpCircle,
  Rocket,
  Wrench,
  Settings,
  BookOpen,
  Building2,
  Lock,
  ChevronRight,
  Search,
  MessageSquare,
  MapPin,
  Info,
  ArrowRight,
} from 'lucide-react'

const helpCategories = [
  {
    title: 'Baslarken',
    icon: Rocket,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    items: [
      { title: "TamirHanem'e Hos Geldiniz", link: '/sss' },
      { title: 'Nasil Servis Bulurum?', link: '/servis-ara' },
      { title: 'Randevu Nasil Alirim?', link: '/randevu' },
    ],
  },
  {
    title: 'Arac Sorunlari',
    icon: Wrench,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    items: [
      { title: 'OBD Kodu Sorgulama', link: '/obd' },
      { title: 'Arac Analizi', link: '/arac' },
    ],
  },
  {
    title: 'Arac Bakimi',
    icon: Settings,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
    items: [
      { title: 'Bakim Rehberi', link: '/arac' },
      { title: 'Servis Arama', link: '/servis-ara' },
    ],
  },
  {
    title: 'Arac Bilgisi',
    icon: BookOpen,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    items: [
      { title: 'OBD Kodlari Ansiklopedisi', link: '/obd' },
      { title: 'Blog Yazilari', link: '/blog' },
    ],
  },
  {
    title: 'Servisler Icin',
    icon: Building2,
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/20',
    items: [
      {
        title: 'Servis Kaydi Nasil Yapilir?',
        link: 'https://app.tamirhanem.com/register.html',
      },
      { title: 'Isletme Paneli', link: 'https://app.tamirhanem.com' },
    ],
  },
  {
    title: 'Hesap & Guvenlik',
    icon: Lock,
    color: 'text-rose-400',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/20',
    items: [
      { title: 'Gizlilik Politikasi', link: '/gizlilik' },
      { title: 'Kullanim Sartlari', link: '/kullanim-sartlari' },
      { title: 'Iletisim', link: '/iletisim' },
    ],
  },
]

const quickActions = [
  { label: 'SSS', href: '/sss', icon: HelpCircle },
  { label: 'Iletisim', href: '/iletisim', icon: MessageSquare },
  { label: 'Servis Bul', href: '/servis-ara', icon: MapPin },
  { label: 'Hakkimizda', href: '/kurumsal', icon: Info },
]

export default function YardimPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="glow-dot w-96 h-96 top-0 left-1/2 -translate-x-1/2 opacity-20" />

      {/* Hero */}
      <section className="section-container mb-12">
        <AnimatedSection>
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/20 px-4 py-2 rounded-full mb-6">
              <HelpCircle className="w-4 h-4 text-brand-500" />
              <span className="text-sm font-semibold text-brand-500">
                Destek Merkezi
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-extrabold mb-3">
              Yardim <span className="text-brand-500">Merkezi</span>
            </h1>
            <p className="text-th-fg-sub text-lg max-w-2xl mx-auto mb-8">
              TamirHanem&apos;i nasil kullanacaginizi ogrenin
            </p>

            {/* Search Box */}
            <div className="max-w-xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ne aramak istiyorsunuz?"
                  className="w-full px-6 py-4 pr-12 rounded-xl bg-th-overlay/[0.05] border border-th-border/[0.12] text-th-fg placeholder:text-th-fg-muted focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500/40 transition-all text-lg"
                />
                <Search className="w-5 h-5 text-th-fg-muted absolute right-4 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Help Categories */}
      <section className="section-container mb-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {helpCategories.map((category, idx) => {
            const Icon = category.icon
            return (
              <AnimatedSection key={category.title} delay={idx * 0.08}>
                <div className="glass-card p-6 hover:-translate-y-1 hover:shadow-glow-sm transition-all duration-300 h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`w-10 h-10 rounded-xl ${category.bg} border ${category.border} flex items-center justify-center`}
                    >
                      <Icon className={`w-5 h-5 ${category.color}`} />
                    </div>
                    <h2 className="text-lg font-display font-bold text-th-fg">
                      {category.title}
                    </h2>
                  </div>
                  <ul className="space-y-2.5">
                    {category.items.map((item) => (
                      <li key={item.title}>
                        <Link
                          href={item.link}
                          className="flex items-center text-th-fg-sub hover:text-brand-500 transition-colors group text-sm"
                        >
                          <ChevronRight className="w-4 h-4 mr-2 text-brand-500/50 group-hover:text-brand-500" />
                          <span className="group-hover:underline">
                            {item.title}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimatedSection>
            )
          })}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="section-container mb-16">
        <AnimatedSection>
          <h2 className="text-xl font-display font-extrabold text-th-fg text-center mb-8">
            Hizli Erisim
          </h2>
        </AnimatedSection>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
          {quickActions.map((action, idx) => {
            const Icon = action.icon
            return (
              <AnimatedSection key={action.href} delay={idx * 0.1}>
                <Link
                  href={action.href}
                  className="glass-card p-5 flex flex-col items-center text-center hover:-translate-y-1 hover:shadow-glow-sm transition-all duration-300"
                >
                  <Icon className="w-8 h-8 text-brand-500 mb-3" />
                  <span className="font-medium text-th-fg-sub text-sm">
                    {action.label}
                  </span>
                </Link>
              </AnimatedSection>
            )
          })}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="section-container">
        <AnimatedSection>
          <div className="glass-card p-8 md:p-12 text-center border-brand-500/20">
            <h2 className="text-2xl font-display font-extrabold text-th-fg mb-4">
              Yardima mi ihtiyaciniz var?
            </h2>
            <p className="text-th-fg-sub mb-6">
              Ekibimiz sorularinizi yanitlamak icin hazir
            </p>
            <Link
              href="/iletisim"
              className="inline-flex items-center gap-2 bg-brand-500 text-th-bg px-8 py-3 rounded-xl font-bold hover:bg-brand-600 transition-colors"
            >
              Bize Ulasin
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </AnimatedSection>
      </section>
    </div>
  )
}
