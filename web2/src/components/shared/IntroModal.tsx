'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Droplets,
  Wrench,
  Truck,
  Shield,
  CarFront,
  MapPin,
  CalendarCheck,
  MessageSquareText,
  Receipt,
  Search,
  Clock,
  Star,
  Zap,
  Tag,
  Gift,
  Timer,
  BadgePercent,
  Rocket,
  UserPlus,
  CarIcon,
  CircleCheckBig,
} from 'lucide-react'
import { cn } from '@/lib/utils'

/* ------------------------------------------------------------------ */
/*  Slide 1 — Yolculuğumuz                                           */
/* ------------------------------------------------------------------ */

const journeyServices = [
  { icon: Droplets, label: 'Oto Yıkama', active: true },
  { icon: Wrench, label: 'Oto Sanayi', active: false },
  { icon: Truck, label: 'Çekici', active: false },
  { icon: Shield, label: 'Sigorta/Kasko', active: false },
  { icon: CarFront, label: 'Araç Kiralama', active: false },
]

function Slide1() {
  return (
    <div className="flex flex-col items-center gap-4">
      {/* Icon */}
      <div className="w-16 h-16 rounded-full bg-brand-500 flex items-center justify-center shadow-lg shadow-brand-500/20">
        <span className="text-brand-950 font-display font-black text-2xl">t</span>
      </div>

      <div className="text-center">
        <h3 className="font-display font-bold text-xl text-th-fg">Yolculuğumuz</h3>
        <p className="text-th-fg-sub text-sm mt-1 max-w-xs mx-auto leading-relaxed">
          Araç bakım ihtiyaçlarınız için tek adres. Şimdi oto yıkama ile başlıyoruz!
        </p>
      </div>

      {/* Journey map */}
      <div className="w-full max-w-xs relative">
        {/* Dotted path line */}
        <div className="absolute left-1/2 top-4 bottom-4 w-px border-l-2 border-dashed border-th-border/20 -translate-x-1/2" />

        <div className="relative flex flex-col gap-3">
          {journeyServices.map((svc, i) => (
            <div key={svc.label} className="flex items-center gap-3 relative z-10">
              <div
                className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all',
                  svc.active
                    ? 'bg-brand-500 text-brand-950 shadow-md shadow-brand-500/20'
                    : 'bg-th-bg-alt border border-th-border/10 text-th-fg-muted'
                )}
              >
                <svc.icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <span className={cn('text-sm font-medium', svc.active ? 'text-th-fg' : 'text-th-fg-muted')}>
                  {svc.label}
                </span>
              </div>
              <span
                className={cn(
                  'text-[10px] font-semibold px-2 py-0.5 rounded-full',
                  svc.active
                    ? 'bg-green-500/15 text-green-400'
                    : 'bg-brand-500/10 text-brand-500'
                )}
              >
                {svc.active ? 'Aktif' : 'Yakında'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom banner */}
      <div className="w-full max-w-xs rounded-xl bg-brand-500/10 border border-brand-500/20 p-3 flex items-center gap-3">
        <Droplets className="w-5 h-5 text-brand-500 shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="text-xs font-semibold text-th-fg">Oto Yıkama şimdi aktif!</div>
          <div className="text-[10px] text-th-fg-muted">Hemen randevu almaya başla</div>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Slide 2 — TamirHanem Oto Yıkama ile Tanışın                      */
/* ------------------------------------------------------------------ */

const features = [
  { icon: MapPin, title: 'Yakınındaki Yıkamalar', desc: 'Konumuna göre en yakın oto yıkamaları keşfet' },
  { icon: CalendarCheck, title: 'Kolay Randevu', desc: 'Tek tıkla randevu al, sıra bekleme' },
  { icon: MessageSquareText, title: 'Değerlendirmeler', desc: 'Gerçek kullanıcı yorumlarını incele' },
  { icon: Receipt, title: 'Şeffaf Fiyatlar', desc: 'Tüm paketleri ve fiyatları önceden gör' },
]

function Slide2() {
  return (
    <div className="flex flex-col items-center gap-4">
      {/* Icon */}
      <div className="w-16 h-16 rounded-full bg-green-500/15 flex items-center justify-center">
        <CarFront className="w-8 h-8 text-green-400" />
      </div>

      <div className="text-center">
        <h3 className="font-display font-bold text-xl text-th-fg">
          TamirHanem<br />Oto Yıkama ile Tanışın
        </h3>
        <p className="text-th-fg-sub text-sm mt-1">Aracınızı profesyonel ellere bırakın</p>
      </div>

      {/* Feature cards */}
      <div className="flex flex-col gap-2 w-full max-w-xs">
        {features.map((f) => (
          <div
            key={f.title}
            className="flex items-center gap-3 rounded-xl bg-th-bg-alt border border-th-border/10 p-3"
          >
            <div className="w-9 h-9 rounded-lg bg-brand-500/10 flex items-center justify-center shrink-0">
              <f.icon className="w-4.5 h-4.5 text-brand-500" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-th-fg">{f.title}</div>
              <div className="text-[11px] text-th-fg-muted leading-snug">{f.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Slide 3 — Nasıl Çalışır?                                         */
/* ------------------------------------------------------------------ */

const steps = [
  { num: 1, icon: Search, title: 'Ara ve Seç', desc: 'Yakınındaki oto yıkamaları keşfet ve birini seç', color: 'text-blue-400 bg-blue-500/10' },
  { num: 2, icon: CalendarCheck, title: 'Randevu Al', desc: 'Uygun tarih ve saati belirle, paketini seç', color: 'text-brand-500 bg-brand-500/10' },
  { num: 3, icon: CarFront, title: 'Git ve Yıkat', desc: 'Randevu saatinde git, aracını teslim et', color: 'text-green-400 bg-green-500/10' },
  { num: 4, icon: Star, title: 'Değerlendir', desc: 'Hizmeti puanla, deneyimini paylaş', color: 'text-orange-400 bg-orange-500/10' },
]

function Slide3() {
  return (
    <div className="flex flex-col items-center gap-4">
      {/* Icon */}
      <div className="w-16 h-16 rounded-full bg-brand-500/15 flex items-center justify-center">
        <Zap className="w-8 h-8 text-brand-500" />
      </div>

      <div className="text-center">
        <h3 className="font-display font-bold text-xl text-th-fg">Nasıl Çalışır?</h3>
        <p className="text-th-fg-sub text-sm mt-1">4 kolay adımda aracınızı yıkatın</p>
      </div>

      {/* Steps */}
      <div className="flex flex-col gap-2 w-full max-w-xs">
        {steps.map((s) => (
          <div
            key={s.num}
            className="flex items-center gap-3 rounded-xl bg-th-bg-alt border border-th-border/10 p-3"
          >
            <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center shrink-0', s.color.split(' ').slice(1).join(' '))}>
              <span className={cn('font-display font-bold text-sm', s.color.split(' ')[0])}>{s.num}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-th-fg">{s.title}</div>
              <div className="text-[11px] text-th-fg-muted leading-snug">{s.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Slide 4 — İndirimler ve Kampanyalar                               */
/* ------------------------------------------------------------------ */

const campaigns = [
  { icon: Gift, title: 'İlk Yıkama İndirimi', desc: 'İlk randevuna özel hoş geldin indirimi kazan', color: 'text-pink-400 bg-pink-500/10' },
  { icon: Timer, title: 'Müdavim İndirimi', desc: 'Düzenli gittiğin yıkamalardan sadakat ödülü al!', color: 'text-purple-400 bg-purple-500/10' },
  { icon: Clock, title: 'Fırsat Saatleri', desc: 'Belirli gün ve saatlerde ekstra indirimlerden yararlan!', color: 'text-green-400 bg-green-500/10' },
  { icon: BadgePercent, title: 'Genel İndirimler', desc: 'Yıkamaların sunduğu kampanyaları keşfet!', color: 'text-brand-500 bg-brand-500/10' },
]

function Slide4() {
  return (
    <div className="flex flex-col items-center gap-4">
      {/* Icon */}
      <div className="w-16 h-16 rounded-full bg-brand-500/15 flex items-center justify-center">
        <Tag className="w-8 h-8 text-brand-500" />
      </div>

      <div className="text-center">
        <h3 className="font-display font-bold text-xl text-th-fg">İndirimler ve Kampanyalar</h3>
        <p className="text-th-fg-sub text-sm mt-1">Oto yıkamalarda sizi bekleyen fırsatlar</p>
      </div>

      {/* 2x2 grid */}
      <div className="grid grid-cols-2 gap-2 w-full max-w-xs">
        {campaigns.map((c) => (
          <div
            key={c.title}
            className="rounded-xl bg-th-bg-alt border border-th-border/10 p-3 flex flex-col items-center text-center"
          >
            <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mb-2', c.color.split(' ').slice(1).join(' '))}>
              <c.icon className={cn('w-5 h-5', c.color.split(' ')[0])} />
            </div>
            <div className="text-xs font-semibold text-th-fg mb-0.5">{c.title}</div>
            <div className="text-[10px] text-th-fg-muted leading-snug">{c.desc}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Slide 5 — Hemen Başla                                             */
/* ------------------------------------------------------------------ */

const onboardSteps = [
  { icon: UserPlus, label: 'Hızlı Kayıt' },
  { icon: CarIcon, label: 'Araç Ekle' },
  { icon: CircleCheckBig, label: 'Hazırsın!' },
]

function Slide5() {
  return (
    <div className="flex flex-col items-center gap-5">
      {/* Icon */}
      <div className="w-16 h-16 rounded-full bg-brand-500/15 flex items-center justify-center">
        <Rocket className="w-8 h-8 text-brand-500" />
      </div>

      <div className="text-center">
        <h3 className="font-display font-bold text-xl text-th-fg">Hemen Başla</h3>
        <p className="text-th-fg-sub text-sm mt-1 max-w-xs mx-auto leading-relaxed">
          Hesap oluştur ve aracını ekle, hemen randevu almaya başla!
        </p>
      </div>

      {/* 3 step icons */}
      <div className="flex items-center gap-4">
        {onboardSteps.map((s, i) => (
          <div key={s.label} className="flex items-center gap-4">
            <div className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-2xl bg-th-bg-alt border border-th-border/10 flex items-center justify-center">
                <s.icon className="w-6 h-6 text-brand-500" />
              </div>
              <span className="text-[11px] font-medium text-th-fg-sub">{s.label}</span>
            </div>
            {i < onboardSteps.length - 1 && (
              <ChevronRight className="w-4 h-4 text-th-fg-muted/40 -mt-5" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Slides config                                                     */
/* ------------------------------------------------------------------ */

const slides = [
  { Illustration: Slide1, cta: 'Keşfet' },
  { Illustration: Slide2, cta: 'Devam Et' },
  { Illustration: Slide3, cta: 'Anladım' },
  { Illustration: Slide4, cta: 'Devam Et' },
  { Illustration: Slide5, cta: 'Haydi Başlayalım!' },
]

/* ------------------------------------------------------------------ */
/*  Modal                                                             */
/* ------------------------------------------------------------------ */

export default function IntroModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(0)

  useEffect(() => {
    const seen = localStorage.getItem('tamirhanem-intro-seen')
    if (!seen) {
      const timer = setTimeout(() => setIsOpen(true), 800)
      return () => clearTimeout(timer)
    }
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
    localStorage.setItem('tamirhanem-intro-seen', '1')
  }, [])

  const next = useCallback(() => {
    if (current === slides.length - 1) {
      close()
    } else {
      setDirection(1)
      setCurrent((p) => p + 1)
    }
  }, [current, close])

  const prev = useCallback(() => {
    if (current > 0) {
      setDirection(-1)
      setCurrent((p) => p - 1)
    }
  }, [current])

  const goTo = useCallback(
    (idx: number) => {
      setDirection(idx > current ? 1 : -1)
      setCurrent(idx)
    },
    [current]
  )

  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next()
      else if (e.key === 'ArrowLeft') prev()
      else if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, next, prev, close])

  if (!isOpen) return null

  const isLast = current === slides.length - 1
  const slide = slides[current]

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -300 : 300, opacity: 0 }),
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={close}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md bg-th-bg border border-th-border/10 rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header — skip button */}
        <div className="flex items-center justify-between px-5 pt-4 pb-1">
          <div className="flex items-center gap-2 text-brand-500">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-semibold tracking-wider uppercase font-display">
              TamirHanem
            </span>
          </div>
          <button
            type="button"
            onClick={close}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs text-th-fg-muted hover:text-th-fg hover:bg-th-bg-alt transition-colors font-display"
          >
            Geç <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Slide Content */}
        <div className="relative overflow-hidden" style={{ minHeight: 460 }}>
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={current}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="px-5 py-3"
            >
              <slide.Illustration />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="px-5 pb-5 pt-1">
          {/* Dots */}
          <div className="flex items-center justify-center gap-2 mb-4">
            {slides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => goTo(idx)}
                className={cn(
                  'h-1.5 rounded-full transition-all duration-300',
                  idx === current
                    ? 'w-6 bg-brand-500'
                    : 'w-1.5 bg-th-fg-muted/30 hover:bg-th-fg-muted/50'
                )}
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-3">
            {current > 0 && (
              <button
                type="button"
                onClick={prev}
                className="flex items-center justify-center w-10 h-10 rounded-xl border border-th-border/10 text-th-fg-sub hover:text-th-fg hover:bg-th-bg-alt transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}

            <button
              type="button"
              onClick={next}
              className="flex-1 h-10 rounded-xl bg-brand-500 text-brand-950 font-semibold text-sm font-display hover:bg-brand-600 transition-colors flex items-center justify-center gap-2"
            >
              {slide.cta}
              {isLast && <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
