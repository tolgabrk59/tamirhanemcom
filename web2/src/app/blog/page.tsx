'use client'

import { useState } from 'react'
import AnimatedSection from '@/components/shared/AnimatedSection'
import { cn } from '@/lib/utils'
import {
  BookOpen,
  Clock,
  ChevronRight,
  ImageIcon,
  Mail,
} from 'lucide-react'

const blogPosts = [
  {
    id: 1,
    title: 'Kis Aylarinda Arac Bakimi: 10 Altin Kural',
    excerpt:
      'Soguk havalarda aracinizi korumak icin yapmaniz gereken bakimlar ve kontroller.',
    category: 'Bakim Ipuclari',
    date: '15 Aralik 2025',
    readTime: '5 dk',
    slug: 'kis-aylarinda-arac-bakimi',
  },
  {
    id: 2,
    title: 'Check Engine Lambasi Yandi: Ne Yapmali?',
    excerpt:
      'Motor ariza lambasi yandiginda panik yapmayin. Adim adim yapmaniz gerekenleri acikliyoruz.',
    category: 'Ariza Rehberi',
    date: '12 Aralik 2025',
    readTime: '4 dk',
    slug: 'check-engine-lambasi-yandi',
  },
  {
    id: 3,
    title: 'Lastik Secimi Rehberi: Yaz, Kis ve 4 Mevsim',
    excerpt:
      'Dogru lastik secimi guvenliginiz icin kritik. Lastik turleri arasindaki farklari ogrenin.',
    category: 'Lastik',
    date: '10 Aralik 2025',
    readTime: '6 dk',
    slug: 'lastik-secimi-rehberi',
  },
  {
    id: 4,
    title: 'Motor Yagi Ne Zaman Degismeli?',
    excerpt:
      'Motor yagi degisim araliklari ve dogru yag secimi hakkinda bilmeniz gerekenler.',
    category: 'Bakim Ipuclari',
    date: '8 Aralik 2025',
    readTime: '4 dk',
    slug: 'motor-yagi-degisim-zamani',
  },
  {
    id: 5,
    title: 'OBD-II Kodlari: Temel Rehber',
    excerpt:
      'OBD kodlarini anlamak ve yorumlamak icin ihtiyaciniz olan tum bilgiler.',
    category: 'Teknik',
    date: '5 Aralik 2025',
    readTime: '7 dk',
    slug: 'obd-kodlari-temel-rehber',
  },
  {
    id: 6,
    title: 'Fren Sistemi Bakimi ve Uyari Isaretleri',
    excerpt:
      'Fren sisteminizdeki sorunlarin erken belirtilerini taniyin ve guvende kalin.',
    category: 'Guvenlik',
    date: '1 Aralik 2025',
    readTime: '5 dk',
    slug: 'fren-sistemi-bakimi',
  },
]

const categories = [
  'Tumu',
  'Bakim Ipuclari',
  'Ariza Rehberi',
  'Lastik',
  'Teknik',
  'Guvenlik',
]

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('Tumu')

  const filteredPosts =
    selectedCategory === 'Tumu'
      ? blogPosts
      : blogPosts.filter((p) => p.category === selectedCategory)

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="glow-dot w-96 h-96 top-0 left-1/2 -translate-x-1/2 opacity-20" />

      {/* Hero */}
      <section className="section-container mb-12">
        <AnimatedSection>
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/20 px-4 py-2 rounded-full mb-6">
              <BookOpen className="w-4 h-4 text-brand-500" />
              <span className="text-sm font-semibold text-brand-500">
                Guncel Icerikler
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-extrabold mb-3">
              TamirHanem <span className="text-brand-500">Blog</span>
            </h1>
            <p className="text-th-fg-sub text-lg max-w-2xl mx-auto">
              Arac bakimi, tamir ipuclari ve otomotiv dunyasindan guncel bilgiler
            </p>
          </div>
        </AnimatedSection>
      </section>

      {/* Category Filters */}
      <section className="section-container mb-8">
        <AnimatedSection delay={0.1}>
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  'px-4 py-2 rounded-xl text-sm font-medium transition-all',
                  selectedCategory === cat
                    ? 'bg-brand-500 text-th-bg'
                    : 'bg-th-overlay/[0.05] border border-th-border/[0.12] text-th-fg-sub hover:border-brand-500/30 hover:text-brand-500'
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </AnimatedSection>
      </section>

      {/* Blog Posts Grid */}
      <section className="section-container mb-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post, idx) => (
            <AnimatedSection key={post.id} delay={idx * 0.08}>
              <article className="glass-card overflow-hidden group hover:-translate-y-1 hover:shadow-glow-sm transition-all duration-300 h-full flex flex-col">
                {/* Image Placeholder */}
                <div className="h-48 bg-gradient-to-br from-brand-500/10 to-brand-500/5 flex items-center justify-center border-b border-th-border/[0.08]">
                  <ImageIcon className="w-12 h-12 text-brand-500/30" />
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-3 py-1 bg-brand-500/10 text-brand-500 rounded-full text-xs font-medium">
                      {post.category}
                    </span>
                    <span className="flex items-center gap-1 text-th-fg-muted text-xs">
                      <Clock className="w-3 h-3" />
                      {post.readTime} okuma
                    </span>
                  </div>

                  <h2 className="text-lg font-display font-bold text-th-fg mb-2 group-hover:text-brand-500 transition-colors">
                    {post.title}
                  </h2>

                  <p className="text-th-fg-sub text-sm mb-4 line-clamp-2 flex-1">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-xs text-th-fg-muted">
                      {post.date}
                    </span>
                    <span className="text-brand-500 font-medium text-sm group-hover:translate-x-1 transition-transform inline-flex items-center">
                      Devamini Oku
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </span>
                  </div>
                </div>
              </article>
            </AnimatedSection>
          ))}
        </div>

        {/* Coming Soon */}
        <AnimatedSection delay={0.4}>
          <div className="mt-10 text-center">
            <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/20 text-brand-500 px-6 py-3 rounded-full">
              <Clock className="w-4 h-4" />
              <span className="font-medium text-sm">
                Daha fazla icerik yakinda eklenecek!
              </span>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Newsletter */}
      <section className="section-container">
        <AnimatedSection>
          <div className="glass-card p-8 md:p-12 text-center border-brand-500/20">
            <Mail className="w-10 h-10 text-brand-500 mx-auto mb-4" />
            <h2 className="text-2xl font-display font-extrabold text-th-fg mb-4">
              Yeni Yazilardan Haberdar Olun
            </h2>
            <p className="text-th-fg-sub mb-6">
              Arac bakimi hakkinda ipuclari ve guncellemeler icin bultenimize
              abone olun
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="E-posta adresiniz"
                className="flex-1 px-4 py-3 rounded-xl bg-th-overlay/[0.05] border border-th-border/[0.12] text-th-fg placeholder:text-th-fg-muted focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500/40 transition-all"
              />
              <button className="bg-brand-500 text-th-bg px-6 py-3 rounded-xl font-bold hover:bg-brand-600 transition-colors whitespace-nowrap">
                Abone Ol
              </button>
            </div>
          </div>
        </AnimatedSection>
      </section>
    </div>
  )
}
