'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Shield,
  Search,
  ChevronRight,
  Car,
  Heart,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Clock,
  DollarSign,
  HelpCircle,
  Scale,
  Star,
  Umbrella,
} from 'lucide-react'
import AnimatedSection from '@/components/shared/AnimatedSection'
import { cn } from '@/lib/utils'

const insuranceTypes = [
  {
    title: 'Zorunlu Trafik',
    description: 'Yasal zorunluluk olan üçüncü şahıs mali sorumluluk sigortası',
    icon: FileText,
    coverage: 'Karşı taraf hasar güvencesi',
    highlight: 'Yasal Zorunluluk',
  },
  {
    title: 'Kasko',
    description: 'Aracınızı her türlü hasara karşı koruma altına alan kapsamlı sigorta',
    icon: Shield,
    coverage: 'Kendi aracınız dahil tam koruma',
    highlight: 'En Popüler',
  },
  {
    title: 'Mini Kasko',
    description: 'Bütçe dostu, temel risklere karşı koruma sağlayan paket',
    icon: Umbrella,
    coverage: 'Hırsızlık, yangın, doğal afet',
    highlight: 'Uygun Fiyat',
  },
  {
    title: 'İMM (İhtiyari)',
    description: 'Zorunlu trafik sigortası limitlerini aşan teminat genişletmesi',
    icon: Scale,
    coverage: 'Yüksek limitli güvence',
    highlight: 'Ekstra Koruma',
  },
]

const benefits = [
  {
    icon: DollarSign,
    title: 'Uygun Fiyat Karşılaştırma',
    description: 'Onlarca sigorta şirketinin tekliflerini tek ekranda karşılaştırın.',
  },
  {
    icon: Clock,
    title: 'Anında Poliçe',
    description: 'Online başvuru ile dakikalar içinde poliçenizi oluşturun.',
  },
  {
    icon: Star,
    title: 'Güvenilir Şirketler',
    description: 'Türkiye\'nin en büyük sigorta şirketleri ile çalışıyoruz.',
  },
  {
    icon: Heart,
    title: 'Hasar Desteği',
    description: 'Hasar anında 7/24 destek ve hızlı süreç yönetimi.',
  },
]

const faqs = [
  {
    question: 'Zorunlu trafik sigortası yaptırmak şart mı?',
    answer: 'Evet, Türkiye\'de trafiğe çıkan her motorlu aracın zorunlu trafik sigortası yaptırması yasal zorunluluktur. Sigortasız araç kullanmak cezai yaptırıma tabidir.',
  },
  {
    question: 'Kasko ile trafik sigortası arasındaki fark nedir?',
    answer: 'Trafik sigortası sadece karşı tarafa verdiğiniz hasarları karşılarken, kasko kendi aracınıza gelen hasarları da kapsar. Kasko daha geniş teminat sunar.',
  },
  {
    question: 'Kasko fiyatını etkileyen faktörler nelerdir?',
    answer: 'Araç değeri, marka/model, üretim yılı, sürücü yaşı, hasar geçmişi, kullanım amacı ve ikamet edilen şehir kasko fiyatını doğrudan etkiler.',
  },
  {
    question: 'Hasar anında ne yapmalıyım?',
    answer: 'Güvenli bir alana çekilin, kaza tespit tutanağı doldurun, sigorta şirketinizi bilgilendirin ve hasar fotoğraflarını çekin. Yaralanma varsa hemen 112\'yi arayın.',
  },
]

const steps = [
  { step: '01', title: 'Bilgileri Girin', description: 'Araç ve sürücü bilgilerinizi girerek teklif alın' },
  { step: '02', title: 'Teklifleri Karşılaştırın', description: 'Farklı şirketlerin fiyat ve teminatlarını inceleyin' },
  { step: '03', title: 'Poliçeyi Seçin', description: 'Size en uygun teminat paketini seçin' },
  { step: '04', title: 'Güvende Olun', description: 'Ödemenizi yapın, poliçeniz anında aktif olsun' },
]

export default function OtoSigortaPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Background glow */}
      <div className="glow-dot w-96 h-96 top-0 left-1/2 -translate-x-1/2 opacity-20" />

      {/* Hero Section */}
      <section className="section-container mb-16">
        <AnimatedSection>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 mb-6">
              <Shield className="w-4 h-4 text-brand-500" />
              <span className="text-sm font-semibold text-brand-500">Oto Sigorta</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-extrabold mb-4">
              Araç Sigortanızı <span className="text-gold">Karşılaştırın</span>
            </h1>
            <p className="text-th-fg-sub text-lg max-w-2xl mx-auto">
              Zorunlu trafik, kasko ve ihtiyari mali sorumluluk sigortanızı karşılaştırın, en uygun fiyatı bulun.
            </p>
          </div>
        </AnimatedSection>

        {/* CTA Card */}
        <AnimatedSection delay={0.1}>
          <div className="glass-card p-6 md:p-8 text-center">
            <p className="text-th-fg-sub text-sm mb-6">
              Aracınıza uygun sigorta tekliflerini görmek için hemen servis arama sayfamızı ziyaret edin.
            </p>
            <Link
              href="/servis-ara?tip=insurance"
              className="btn-gold px-10 py-4 text-sm inline-flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              Sigorta Noktası Ara
            </Link>
          </div>
        </AnimatedSection>
      </section>

      {/* Insurance Types */}
      <section className="section-container mb-16">
        <AnimatedSection>
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-display font-extrabold text-th-fg mb-3">
              Sigorta <span className="text-gold">Türleri</span>
            </h2>
            <p className="text-th-fg-sub text-sm max-w-xl mx-auto">
              İhtiyacınıza uygun sigorta türünü keşfedin
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {insuranceTypes.map((type, index) => (
            <AnimatedSection key={type.title} delay={0.15 + index * 0.08}>
              <motion.div
                className="glass-card p-6 h-full"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
                    <type.icon className="w-6 h-6 text-brand-500" />
                  </div>
                  <span className="badge-gold text-[10px]">{type.highlight}</span>
                </div>
                <h3 className="text-lg font-display font-bold text-th-fg mb-1">{type.title}</h3>
                <p className="text-sm text-th-fg-sub mb-3">{type.description}</p>
                <div className="flex items-center gap-2 text-xs text-brand-500">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{type.coverage}</span>
                </div>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="section-container mb-16">
        <AnimatedSection>
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-display font-extrabold text-th-fg mb-3">
              Nasıl <span className="text-gold">Çalışır</span>?
            </h2>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item, index) => (
            <AnimatedSection key={item.step} delay={0.1 + index * 0.08}>
              <div className="glass-card p-6 h-full relative">
                <span className="text-4xl font-display font-extrabold text-brand-500/20 absolute top-4 right-4">
                  {item.step}
                </span>
                <h3 className="text-lg font-display font-bold text-th-fg mb-2">{item.title}</h3>
                <p className="text-sm text-th-fg-sub">{item.description}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="section-container mb-16">
        <AnimatedSection>
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-display font-extrabold text-th-fg mb-3">
              Neden <span className="text-gold">Tamirhanem</span>?
            </h2>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {benefits.map((benefit, index) => (
            <AnimatedSection key={benefit.title} delay={0.1 + index * 0.08}>
              <motion.div
                className="glass-card p-6 flex items-start gap-4 h-full"
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center shrink-0">
                  <benefit.icon className="w-5 h-5 text-brand-500" />
                </div>
                <div>
                  <h3 className="text-base font-display font-bold text-th-fg mb-1">{benefit.title}</h3>
                  <p className="text-sm text-th-fg-sub">{benefit.description}</p>
                </div>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="section-container mb-16">
        <AnimatedSection>
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-display font-extrabold text-th-fg mb-3">
              Sıkça Sorulan <span className="text-gold">Sorular</span>
            </h2>
          </div>
        </AnimatedSection>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <AnimatedSection key={index} delay={0.1 + index * 0.06}>
              <div className="glass-card overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full p-5 flex items-center justify-between text-left"
                >
                  <div className="flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 text-brand-500 shrink-0" />
                    <span className="text-sm font-display font-bold text-th-fg">{faq.question}</span>
                  </div>
                  <ChevronRight
                    className={cn(
                      'w-4 h-4 text-th-fg-muted transition-transform duration-300 shrink-0',
                      openFaq === index && 'rotate-90'
                    )}
                  />
                </button>
                {openFaq === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                    className="px-5 pb-5"
                  >
                    <div className="pl-8">
                      <p className="text-sm text-th-fg-sub leading-relaxed">{faq.answer}</p>
                    </div>
                  </motion.div>
                )}
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="section-container">
        <AnimatedSection delay={0.2}>
          <div className="glass-card p-8 md:p-12 text-center">
            <h3 className="text-2xl md:text-3xl font-display font-extrabold text-th-fg mb-4">
              Aracınızı <span className="text-gold">Güvence</span> Altına Alın
            </h3>
            <p className="text-th-fg-sub text-sm max-w-lg mx-auto mb-8">
              En uygun sigorta tekliflerini karşılaştırın ve aracınızı her türlü riske karşı koruyun.
            </p>
            <Link
              href="/servis-ara?tip=insurance"
              className="btn-gold px-10 py-4 text-sm inline-flex items-center gap-2"
            >
              Sigorta Tekliflerini Gör
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </AnimatedSection>
      </section>
    </div>
  )
}
