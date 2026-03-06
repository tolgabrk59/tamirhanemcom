'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Search,
  Cog,
  AlertTriangle,
  Sun,
  Clock,
  CheckCircle2,
  Wrench,
  ChevronRight,
  HelpCircle,
  BookOpen,
} from 'lucide-react'
import AnimatedSection from '@/components/shared/AnimatedSection'
import { cn } from '@/lib/utils'

const categories = [
  {
    title: 'Genel Bakım',
    description: 'Yağ değişimi, filtreler ve rutin kontroller hakkında her şey.',
    icon: Cog,
    href: '/arac/genel-bakim',
    color: 'text-brand-500',
  },
  {
    title: 'Sorun Giderme',
    description: 'Motor ışığı, garip sesler ve sızıntılar ne anlama geliyor?',
    icon: AlertTriangle,
    href: '/ariza-rehberi',
    color: 'text-red-400',
  },
  {
    title: 'Mevsimsel Bakım',
    description: 'Aracınızı kışa ve yaza hazırlamak için yapılması gerekenler.',
    icon: Sun,
    href: '/arac/mevsimsel-bakim',
    color: 'text-yellow-400',
  },
  {
    title: 'Lastik Rehberi',
    description: 'Doğru lastik seçimi, basınç kontrolü ve rot balans.',
    icon: Clock,
    href: '/arac/lastik-secimi',
    color: 'text-blue-400',
  },
  {
    title: 'Sürüş İpuçları',
    description: 'Yakıt tasarrufu ve güvenli sürüş teknikleri.',
    icon: CheckCircle2,
    href: '/arac/surus-ipuclari',
    color: 'text-green-400',
  },
  {
    title: 'Kendin Yap (DIY)',
    description: 'Basit tamirler ve bakımları kendiniz nasıl yapabilirsiniz?',
    icon: Wrench,
    href: '/arac/diy',
    color: 'text-purple-400',
  },
]

const featuredArticles = [
  {
    id: 1,
    title: 'Motor Işığı Neden Yanar? En Sık Görülen 5 Sebep',
    excerpt: 'Gösterge panelindeki o korkutucu ışığın arkasındaki en yaygın nedenleri öğrenin.',
    category: 'Sorun Giderme',
    date: '10 Ara 2025',
  },
  {
    id: 2,
    title: 'Kış Lastiği Ne Zaman Takılmalı?',
    excerpt: 'Hava sıcaklığı 7 derecenin altına düştüğünde neden kış lastiğine geçmelisiniz?',
    category: 'Mevsimsel Bakım',
    date: '08 Ara 2025',
  },
  {
    id: 3,
    title: 'Yağ Değişimi: 10.000 km mi, 15.000 km mi?',
    excerpt: 'Modern motorlarda yağ değişim aralıkları ve doğru yağ seçiminin önemi.',
    category: 'Genel Bakım',
    date: '05 Ara 2025',
  },
]

const faqs = [
  { q: 'Hangi sıklıkla bakım yaptırmalıyım?', a: 'Genellikle her 10.000-15.000 km\'de veya yılda bir kez periyodik bakım önerilir.' },
  { q: 'Garanti kapsamındaki aracımı yetkili servise mi götürmeliyim?', a: 'Evet, garantinizin bozulmaması için üreticinin belirlediği standartlarda hizmet veren servisleri tercih etmelisiniz.' },
  { q: 'TamirHanem servisleri güvenilir mi?', a: 'Platformumuzdaki tüm servisler ön elemeden geçer ve kullanıcı yorumlarına göre sürekli denetlenir.' },
]

export default function BakimTavsiyeleriPage() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="glow-dot w-96 h-96 top-0 left-1/2 -translate-x-1/2 opacity-20" />

      {/* Header */}
      <section className="section-container mb-12">
        <AnimatedSection>
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-px bg-brand-500/50" />
              <span className="text-brand-500 text-sm font-semibold tracking-widest uppercase">Bakım Tavsiyeleri</span>
              <div className="w-8 h-px bg-brand-500/50" />
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-extrabold mb-4">
              Araç Bakım <span className="text-gold">Tavsiyeleri</span>
            </h1>
            <p className="text-th-fg-sub text-lg max-w-2xl mx-auto mb-8">
              Uzmanlardan güvenilir bilgiler, bakım ipuçları ve sorun giderme rehberleri.
            </p>

            {/* Search */}
            <div className="max-w-2xl mx-auto">
              <div className="glass-card p-2">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-th-fg-sub" />
                  <input
                    type="text"
                    placeholder="Hangi konuda yardıma ihtiyacınız var?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input-dark pl-12 py-4 w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Categories Grid */}
      <section className="section-container mb-12">
        <AnimatedSection delay={0.1}>
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-8 h-px bg-brand-500/50" />
            <span className="text-brand-500 text-sm font-semibold tracking-widest uppercase">Konu Başlıkları</span>
            <div className="w-8 h-px bg-brand-500/50" />
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <AnimatedSection key={category.title} delay={0.15 + index * 0.05} className="h-full">
              <Link
                href={category.href}
                className="glass-card p-6 h-full flex flex-col group hover:-translate-y-1 hover:shadow-glow-sm transition-all duration-300"
              >
                <div className={cn('w-14 h-14 rounded-2xl flex items-center justify-center bg-th-overlay/[0.05] mb-5', category.color)}>
                  <category.icon className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-display font-bold text-th-fg mb-2 group-hover:text-brand-500 transition-colors">
                  {category.title}
                </h3>
                <p className="text-sm text-th-fg-sub leading-relaxed flex-1">{category.description}</p>
                <ChevronRight className="w-4 h-4 text-th-fg-muted mt-4 group-hover:text-brand-500 group-hover:translate-x-1 transition-all" />
              </Link>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Featured Articles */}
      <section className="section-container mb-12">
        <AnimatedSection delay={0.25}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-display font-extrabold text-th-fg mb-1">Öne Çıkan Makaleler</h2>
              <p className="text-sm text-th-fg-sub">Editörlerimizin seçtiği en popüler içerikler</p>
            </div>
            <Link href="/blog" className="text-brand-500 text-sm font-semibold hover:text-brand-400 transition-colors flex items-center gap-1">
              Tümünü Gör
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredArticles.map((article, index) => (
            <AnimatedSection key={article.id} delay={0.3 + index * 0.05}>
              <div className="glass-card p-6 group hover:-translate-y-1 hover:shadow-glow-sm transition-all duration-300 cursor-pointer">
                <div className="flex items-center gap-3 mb-4">
                  <span className="badge-gold text-[10px]">{article.category}</span>
                  <span className="text-xs text-th-fg-muted">{article.date}</span>
                </div>
                <h3 className="text-lg font-display font-bold text-th-fg mb-2 group-hover:text-brand-500 transition-colors">
                  {article.title}
                </h3>
                <p className="text-sm text-th-fg-sub line-clamp-2">{article.excerpt}</p>
                <div className="flex items-center gap-1 mt-4 text-brand-500 text-sm font-medium">
                  <BookOpen className="w-4 h-4" />
                  <span>Devamını Oku</span>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="section-container">
        <AnimatedSection delay={0.35}>
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-8 h-px bg-brand-500/50" />
            <span className="text-brand-500 text-sm font-semibold tracking-widest uppercase">Sıkça Sorulan Sorular</span>
            <div className="w-8 h-px bg-brand-500/50" />
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="glass-card p-6 hover:-translate-y-0.5 hover:shadow-glow-sm transition-all duration-300">
                <div className="flex items-start gap-3">
                  <HelpCircle className="w-5 h-5 text-brand-500 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-display font-bold text-th-fg mb-2">{faq.q}</h3>
                    <p className="text-sm text-th-fg-sub leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </section>
    </div>
  )
}
