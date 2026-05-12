'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Play,
  Cog,
  Disc3,
  Zap,
  Flame,
  ArrowUpDown,
  CircleDot,
  CheckCircle2,
  Lightbulb,
  MapPin,
} from 'lucide-react'
import AnimatedSection from '@/components/shared/AnimatedSection'
import { cn } from '@/lib/utils'

interface Video {
  id: string
  title: string
  youtubeId: string
  duration: string
  channel: string
}

interface VideoCategory {
  id: string
  title: string
  description: string
  icon: typeof Cog
  color: string
  videos: Video[]
}

const categories: VideoCategory[] = [
  {
    id: 'bakim',
    title: 'Temel Bakim',
    description: 'Yag degisimi, filtre degisimi ve rutin bakim islemleri',
    icon: Cog,
    color: 'text-brand-500',
    videos: [
      { id: '1', title: 'Evde Motor Yagi Degisimi Nasil Yapilir?', youtubeId: 'O1hF25Cowv8', duration: '15:42', channel: 'ChrisFix TR' },
      { id: '2', title: 'Hava Filtresi Degisimi - Tum Araclar', youtubeId: 'KjHTMGBv0LA', duration: '8:23', channel: 'Oto Destekcim' },
      { id: '3', title: 'Yag Filtresi ve Motor Yagi Secimi Rehberi', youtubeId: 'TWoWQMeomz0', duration: '12:15', channel: 'Alaatin61' },
      { id: '4', title: 'Klima Bakimi ve Temizligi', youtubeId: 'QqJXx_X2aR0', duration: '10:30', channel: 'Dogan Kabak' },
    ],
  },
  {
    id: 'fren',
    title: 'Fren Sistemi',
    description: 'Balata, disk ve fren hidroligi bakimi',
    icon: Disc3,
    color: 'text-red-400',
    videos: [
      { id: '5', title: 'On Fren Balatasi Degisimi', youtubeId: 'HnYVL6kv7Vw', duration: '18:30', channel: 'ChrisFix TR' },
      { id: '6', title: 'Fren Diski Degisimi Rehberi', youtubeId: '6RQ9UabOyDQ', duration: '22:15', channel: 'Oto Destekcim' },
      { id: '7', title: 'Fren Hidroligi Degisimi', youtubeId: 'n1NvtxQLV9M', duration: '14:45', channel: 'Benzin TV' },
      { id: '8', title: 'Arka Kampana Fren Bakimi', youtubeId: 'BqHkUn3Z7F4', duration: '20:10', channel: 'Alaatin61' },
    ],
  },
  {
    id: 'elektrik',
    title: 'Elektrik Sistemi',
    description: 'Aku, ampul, sigorta ve elektrik arizalari',
    icon: Zap,
    color: 'text-yellow-400',
    videos: [
      { id: '9', title: 'Araba Akusu Nasil Degistirilir?', youtubeId: 'aS-6TQjF5Po', duration: '11:20', channel: 'Dogan Kabak' },
      { id: '10', title: 'Far Ampulu Degisimi (H7, H4, LED)', youtubeId: 'WEE21NyTqXU', duration: '9:45', channel: 'Otomobil Dunyam' },
      { id: '11', title: 'Sigorta Kutusu ve Ariza Tespiti', youtubeId: 'oJdSJhR0vOs', duration: '13:30', channel: 'Oto Destekcim' },
      { id: '12', title: 'Mars Motoru Arizasi ve Cozumu', youtubeId: 'Gm4LQvTcwxg', duration: '16:55', channel: 'Alaatin61' },
    ],
  },
  {
    id: 'motor',
    title: 'Motor Bakimi',
    description: 'Buji, kayis, termostat ve motor parcalari',
    icon: Flame,
    color: 'text-orange-400',
    videos: [
      { id: '13', title: 'Buji Degisimi ve Kontrol', youtubeId: 'qCZP3UVoWGE', duration: '10:15', channel: 'ChrisFix TR' },
      { id: '14', title: 'V Kayis (Triger Kayisi) Degisimi', youtubeId: 'iJ3c3h9Lp8s', duration: '25:40', channel: 'Benzin TV' },
      { id: '15', title: 'Termostat Degisimi ve Test', youtubeId: '3z5V9TgHqeE', duration: '17:20', channel: 'Oto Destekcim' },
      { id: '16', title: 'Bobinlerin Test Edilmesi', youtubeId: 'Y_9bnQxV5e0', duration: '12:35', channel: 'Alaatin61' },
    ],
  },
  {
    id: 'suspansiyon',
    title: 'Suspansiyon',
    description: 'Amortisor, rotil, rot basi ve sasi parcalari',
    icon: ArrowUpDown,
    color: 'text-blue-400',
    videos: [
      { id: '17', title: 'On Amortisor Degisimi', youtubeId: 'sT0RG3_owQY', duration: '28:15', channel: 'Dogan Kabak' },
      { id: '18', title: 'Rotil ve Rot Basi Degisimi', youtubeId: 'X7xAq4Y0M4c', duration: '19:45', channel: 'Oto Destekcim' },
      { id: '19', title: 'Salincak (Alt Tabla) Degisimi', youtubeId: 'fWpP8N9k5aw', duration: '23:30', channel: 'Alaatin61' },
      { id: '20', title: 'Balans ve Rot Ayari Onemi', youtubeId: 'HfM1X8sLG8c', duration: '15:20', channel: 'Benzin TV' },
    ],
  },
  {
    id: 'lastik',
    title: 'Lastik ve Jant',
    description: 'Lastik degisimi, tamir ve bakimi',
    icon: CircleDot,
    color: 'text-purple-400',
    videos: [
      { id: '21', title: 'Yolda Lastik Patlamasi - Stepne Takma', youtubeId: 'joBmbh0AGSQ', duration: '12:40', channel: 'ChrisFix TR' },
      { id: '22', title: 'Lastik Tamir Kiti Kullanimi', youtubeId: 'QR3BkYQxVeE', duration: '8:15', channel: 'Otomobil Dunyam' },
      { id: '23', title: 'Lastik Basinc Kontrolu ve TPMS', youtubeId: 'sKhH-Rp9zSE', duration: '10:50', channel: 'Dogan Kabak' },
      { id: '24', title: 'Jant Temizligi ve Bakimi', youtubeId: 'GE76dz9KMwA', duration: '14:25', channel: 'Oto Destekcim' },
    ],
  },
]

const totalVideos = categories.reduce((acc, c) => acc + c.videos.length, 0)

export default function VideoContentPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [playingVideo, setPlayingVideo] = useState<string | null>(null)

  const filteredCategories = selectedCategory
    ? categories.filter(c => c.id === selectedCategory)
    : categories

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="glow-dot w-96 h-96 top-0 left-1/2 -translate-x-1/2 opacity-20" />

      {/* Header */}
      <section className="section-container mb-8">
        <AnimatedSection>
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-px bg-brand-500/50" />
              <span className="text-brand-500 text-sm font-semibold tracking-widest uppercase">Video Rehberleri</span>
              <div className="w-8 h-px bg-brand-500/50" />
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-extrabold mb-4">
              Video <span className="text-gold">Icerik</span> Merkezi
            </h1>
            <p className="text-th-fg-sub text-lg max-w-2xl mx-auto mb-8">
              Aracinizin bakim ve onarimini kendiniz yapabilmeniz icin hazirlanan adim adim video rehberleri
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8">
              <div className="text-center">
                <div className="text-3xl font-display font-extrabold text-th-fg">{categories.length}</div>
                <div className="text-sm text-brand-500 font-medium">Kategori</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-display font-extrabold text-th-fg">{totalVideos}+</div>
                <div className="text-sm text-brand-500 font-medium">Video</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-display font-extrabold text-th-fg">10+</div>
                <div className="text-sm text-brand-500 font-medium">Saat Icerik</div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Category Filter */}
      <section className="section-container mb-10">
        <AnimatedSection delay={0.1}>
          <div className="glass-card p-4">
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onClick={() => setSelectedCategory(null)}
                className={cn(
                  'px-5 py-2.5 rounded-xl text-sm font-medium transition-all',
                  !selectedCategory ? 'bg-brand-500 text-th-fg-invert' : 'bg-th-overlay/[0.05] text-th-fg-sub hover:text-th-fg'
                )}
              >
                Tumu
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={cn(
                    'px-5 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2',
                    selectedCategory === cat.id ? 'bg-brand-500 text-th-fg-invert' : 'bg-th-overlay/[0.05] text-th-fg-sub hover:text-th-fg'
                  )}
                >
                  <cat.icon className="w-4 h-4" />
                  {cat.title}
                </button>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Video Categories */}
      <section className="section-container mb-12">
        <div className="space-y-8">
          {filteredCategories.map((category, catIndex) => (
            <AnimatedSection key={category.id} delay={0.15 + catIndex * 0.05}>
              <div className="glass-card overflow-hidden">
                {/* Category Header */}
                <div className="p-5 border-b border-th-border/10 flex items-center gap-4">
                  <div className={cn('w-10 h-10 rounded-xl bg-th-overlay/[0.05] flex items-center justify-center', category.color)}>
                    <category.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg font-display font-bold text-th-fg">{category.title}</h2>
                    <p className="text-xs text-th-fg-sub">{category.description}</p>
                  </div>
                  <span className="badge-gold text-[10px]">{category.videos.length} video</span>
                </div>

                {/* Videos Grid */}
                <div className="p-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {category.videos.map((video) => (
                      <div
                        key={video.id}
                        className="group cursor-pointer"
                        onClick={() => setPlayingVideo(playingVideo === video.youtubeId ? null : video.youtubeId)}
                      >
                        {playingVideo === video.youtubeId ? (
                          <div className="aspect-video rounded-xl overflow-hidden">
                            <iframe
                              src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1`}
                              title={video.title}
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              className="w-full h-full"
                            />
                          </div>
                        ) : (
                          <div className="relative aspect-video rounded-xl overflow-hidden">
                            <img
                              src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                              alt={video.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                              <div className="w-12 h-12 bg-brand-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-glow-sm">
                                <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                              </div>
                            </div>
                            <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-0.5 rounded text-white text-xs font-medium">
                              {video.duration}
                            </div>
                          </div>
                        )}

                        <div className="mt-3">
                          <h3 className="font-display font-bold text-th-fg text-sm line-clamp-2 group-hover:text-brand-500 transition-colors">
                            {video.title}
                          </h3>
                          <p className="text-th-fg-muted text-xs mt-1 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            {video.channel}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Tips */}
      <section className="section-container mb-12">
        <AnimatedSection delay={0.3}>
          <div className="glass-card p-6 md:p-8 border-brand-500/20">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-brand-500/10 flex items-center justify-center shrink-0">
                <Lightbulb className="w-6 h-6 text-brand-500" />
              </div>
              <h3 className="text-xl font-display font-extrabold text-th-fg">Kendin Yap Ipuclari</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                'Her islemden once aracinizi guvenli bir sekilde kaldirin ve destekleyin',
                'Dogru arac ve yedek parca kullandiginizdan emin olun',
                'Karmasik islemlerde profesyonel yardim almaktan cekinmeyin',
                'Guvenlik ekipmanlarinizi (eldiven, gozluk) kullanmayi ihmal etmeyin',
              ].map((tip, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-th-fg">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* CTA */}
      <section className="section-container">
        <AnimatedSection delay={0.35}>
          <div className="glass-card p-8 text-center border-brand-500/20">
            <h3 className="text-2xl font-display font-extrabold text-th-fg mb-3">Profesyonel Yardim mi Lazim?</h3>
            <p className="text-th-fg-sub mb-6 max-w-lg mx-auto">
              Bazi islemler icin profesyonel ekipman ve deneyim gerekebilir. Size en yakin guvenilir servisi bulun.
            </p>
            <Link href="/servis-ara" className="btn-gold px-8 py-3 text-sm inline-flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Servis Bul
            </Link>
          </div>
        </AnimatedSection>
      </section>
    </div>
  )
}
