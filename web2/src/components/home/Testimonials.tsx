'use client'

import { Star, Quote } from 'lucide-react'
import AnimatedSection from '@/components/shared/AnimatedSection'
import { cn } from '@/lib/utils'

interface TestimonialItem {
  name: string
  city: string
  role: string
  rating: number
  quote: string
  initials: string
}

const testimonials: TestimonialItem[] = [
  {
    name: 'Ahmet Y.',
    city: 'İstanbul',
    role: 'BMW 320i Sahibi',
    rating: 5,
    quote:
      'TamirHanem sayesinde güvenilir bir servis buldum. Fiyat karşılaştırması yapabilmek çok büyük avantaj. Aracımın kronik sorunlarını da buradan öğrendim.',
    initials: 'AY',
  },
  {
    name: 'Elif K.',
    city: 'Ankara',
    role: 'VW Golf Sahibi',
    rating: 5,
    quote:
      'Randevu sistemi çok pratik. Daha önce servise gidince saatlerce beklerdim, şimdi randevumla gidiyorum ve hemen ilgileniyorlar.',
    initials: 'EK',
  },
  {
    name: 'Mehmet D.',
    city: 'İzmir',
    role: 'Ford Focus Sahibi',
    rating: 4,
    quote:
      'OBD kodu araştırma özelliği sayesinde sorunumu tespit ettim ve gereksiz masraftan kurtuldum. Harika bir platform.',
    initials: 'MD',
  },
  {
    name: 'Zeynep A.',
    city: 'Bursa',
    role: 'Toyota Corolla Sahibi',
    rating: 5,
    quote:
      'Kadın olarak servislerde genelde tedirgin olurdum. TamirHanem ile yorumları okuyup güvenilir yerleri seçtim, çok memnunum.',
    initials: 'ZA',
  },
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            'w-4 h-4',
            i < rating
              ? 'fill-brand-500 text-brand-500'
              : 'fill-surface-700 text-surface-700'
          )}
        />
      ))}
    </div>
  )
}

export default function Testimonials() {
  return (
    <section className="relative py-24 md:py-32">
      <div className="section-container">
        {/* Section Header */}
        <AnimatedSection className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-px bg-brand-500/50" />
            <span className="text-brand-500 text-sm font-semibold tracking-widest uppercase">
              Yorumlar
            </span>
            <div className="w-8 h-px bg-brand-500/50" />
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-extrabold mb-4">
            Kullanıcılarımız Ne <span className="text-gold">Diyor?</span>
          </h2>
          <p className="text-th-fg text-lg max-w-xl mx-auto">
            Binlerce mutlu kullanıcının deneyimlerinden bazıları
          </p>
        </AnimatedSection>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((testimonial, idx) => (
            <AnimatedSection key={testimonial.name} delay={idx * 0.1}>
              <div className="glass-card p-8 h-full flex flex-col hover:shadow-glow-sm transition-all duration-300">
                {/* Quote icon + Stars */}
                <div className="flex items-center justify-between mb-5">
                  <Quote className="w-8 h-8 text-brand-500/20" />
                  <StarRating rating={testimonial.rating} />
                </div>

                {/* Quote */}
                <blockquote className="flex-1 mb-6">
                  <p className="text-surface-200 text-base leading-relaxed">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                </blockquote>

                {/* Author */}
                <div className="flex items-center gap-3 pt-5 border-t border-th-border/[0.06]">
                  {/* Avatar placeholder */}
                  <div className="w-10 h-10 rounded-full bg-brand-500/10 border border-brand-500/20 flex items-center justify-center shrink-0">
                    <span className="text-brand-500 text-xs font-semibold font-display">
                      {testimonial.initials}
                    </span>
                  </div>
                  <div>
                    <div className="font-display font-semibold text-sm text-th-fg">
                      {testimonial.name}
                    </div>
                    <div className="text-th-fg-muted text-xs">
                      {testimonial.role} &middot; {testimonial.city}
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>

      {/* Section divider */}
      <div className="section-divider mt-24" />
    </section>
  )
}
