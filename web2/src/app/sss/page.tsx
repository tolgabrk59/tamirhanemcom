'use client'

import { useState } from 'react'
import Link from 'next/link'
import AnimatedSection from '@/components/shared/AnimatedSection'
import { cn } from '@/lib/utils'
import {
  HelpCircle,
  ChevronDown,
  ArrowRight,
  MessageSquare,
} from 'lucide-react'

interface FAQItem {
  question: string
  answer: string
  category: string
}

const faqItems: FAQItem[] = [
  {
    category: 'genel',
    question: 'TamirHanem nedir?',
    answer:
      "TamirHanem, arac sahiplerini guvenilir oto servislerle bulusturan Turkiye'nin onde gelen dijital platformudur. Fiyat karsilastirma, OBD kod sorgulama, arac analizi ve servis bulma gibi hizmetler sunuyoruz.",
  },
  {
    category: 'genel',
    question: "TamirHanem'i kullanmak ucretli mi?",
    answer:
      "Hayir, TamirHanem'i kullanmak tamamen ucretsizdir. Arac sahipleri hicbir ucret odemeden tum ozelliklerden faydalanabilir.",
  },
  {
    category: 'genel',
    question: 'Hangi sehirlerde hizmet veriyorsunuz?',
    answer:
      "Su an pilot bolge olarak Tekirdag/Corlu'da aktif hizmet vermekteyiz. Yakinda diger illere de genisleyecegiz.",
  },
  {
    category: 'servisler',
    question: 'Servislerin guvenilirligini nasil sagliyorsunuz?',
    answer:
      'Platformumuza kayit olan tum servisler dogrulama surecinden gecer. Ayrica kullanici yorumlari ve puanlamalari ile seffaf bir degerlendirme sistemi sunuyoruz.',
  },
  {
    category: 'servisler',
    question: 'Servis olarak nasil kayit olabilirim?',
    answer:
      'app.tamirhanem.com/register.html adresinden servis basvurusu yapabilirsiniz. Basvurunuz incelendikten sonra sizinle iletisime gececegiz.',
  },
  {
    category: 'servisler',
    question: 'Fiyatlar neden tahmini olarak gosteriliyor?',
    answer:
      'Gercek fiyatlar arac modeli, kullanilan parca kalitesi ve servisin konumuna gore degisir. Gosterilen fiyatlar piyasa ortalamasina dayali tahmini degerlerdir. Kesin fiyat icin servislerden teklif almanizi oneririz.',
  },
  {
    category: 'obd',
    question: 'OBD kodu nedir?',
    answer:
      'OBD (On-Board Diagnostics) kodlari, aracinizin elektronik sistemlerinden gelen ariza bilgileridir. Check Engine lambasi yandiginda arac bir veya birden fazla OBD kodu uretir.',
  },
  {
    category: 'obd',
    question: 'OBD kodumu nasil ogrenebilirim?',
    answer:
      'Bir OBD-II tarayici cihazi veya akilli telefon uygulamasi ile aracinizin OBD portuna baglanarak kodlari okuyabilirsiniz. Kod belirlendikten sonra sitemizde arayarak detayli bilgi alabilirsiniz.',
  },
  {
    category: 'hesap',
    question: 'Uyelik zorunlu mu?',
    answer:
      'Hayir, sitemizin cogu ozelligini uye olmadan kullanabilirsiniz. Ancak randevu takibi, arac gecmisi ve kisisellestirmis oneriler icin uyelik gerekebilir.',
  },
  {
    category: 'hesap',
    question: 'Verilerim guvende mi?',
    answer:
      'Evet, tum verileriniz sifrelenerek saklanir ve ucuncu taraflarla paylasilmaz. Detayli bilgi icin Gizlilik Politikamizi inceleyebilirsiniz.',
  },
]

const categories = [
  { id: 'all', name: 'Tumu' },
  { id: 'genel', name: 'Genel' },
  { id: 'servisler', name: 'Servisler' },
  { id: 'obd', name: 'OBD Kodlari' },
  { id: 'hesap', name: 'Hesap & Guvenlik' },
]

export default function SSSPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const filteredFAQs =
    selectedCategory === 'all'
      ? faqItems
      : faqItems.filter((f) => f.category === selectedCategory)

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
                Yardim Merkezi
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-extrabold mb-3">
              Sik Sorulan <span className="text-brand-500">Sorular</span>
            </h1>
            <p className="text-th-fg-sub text-lg max-w-2xl mx-auto">
              TamirHanem hakkinda merak ettiklerinizin yanitlari
            </p>
          </div>
        </AnimatedSection>
      </section>

      {/* Main Content */}
      <section className="section-container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Category Filters */}
        <AnimatedSection delay={0.1}>
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id)
                  setOpenIndex(null)
                }}
                className={cn(
                  'px-4 py-2 rounded-xl text-sm font-medium transition-all',
                  selectedCategory === cat.id
                    ? 'bg-brand-500 text-th-bg'
                    : 'bg-th-overlay/[0.05] border border-th-border/[0.12] text-th-fg-sub hover:border-brand-500/30 hover:text-brand-500'
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </AnimatedSection>

        {/* FAQ Accordion */}
        <div className="space-y-3">
          {filteredFAQs.map((faq, index) => (
            <AnimatedSection key={`${faq.category}-${index}`} delay={index * 0.05}>
              <div className="glass-card overflow-hidden">
                <button
                  onClick={() =>
                    setOpenIndex(openIndex === index ? null : index)
                  }
                  className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-th-overlay/[0.03] transition-colors"
                >
                  <span className="font-semibold text-th-fg pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={cn(
                      'w-5 h-5 text-brand-500 transition-transform shrink-0',
                      openIndex === index && 'rotate-180'
                    )}
                  />
                </button>
                {openIndex === index && (
                  <div className="px-6 pb-5 text-th-fg-sub leading-relaxed text-sm border-t border-th-border/[0.08] pt-4">
                    {faq.answer}
                  </div>
                )}
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Still Have Questions */}
        <AnimatedSection delay={0.3}>
          <div className="mt-12 glass-card p-8 md:p-12 text-center border-brand-500/20">
            <MessageSquare className="w-10 h-10 text-brand-500 mx-auto mb-4" />
            <h2 className="text-2xl font-display font-extrabold text-th-fg mb-4">
              Hala sorunuz mu var?
            </h2>
            <p className="text-th-fg-sub mb-6">
              Aradiginiz cevabi bulamadiysiniz bizimle iletisime gecin
            </p>
            <Link
              href="/iletisim"
              className="inline-flex items-center gap-2 bg-brand-500 text-th-bg px-6 py-3 rounded-xl font-bold hover:bg-brand-600 transition-colors"
            >
              Iletisime Gec
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </AnimatedSection>
      </section>
    </div>
  )
}
