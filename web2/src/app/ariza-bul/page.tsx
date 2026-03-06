'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Search,
  AlertTriangle,
  Zap,
  Fuel,
  Volume2,
  KeyRound,
  Wind,
  Thermometer,
  Eye,
  ArrowRight,
  ChevronRight,
} from 'lucide-react'
import AnimatedSection from '@/components/shared/AnimatedSection'
import { cn } from '@/lib/utils'
import Link from 'next/link'

const symptoms = [
  {
    id: 1,
    title: 'Motor Titremesi / Sarsinti',
    description: 'Rolantide veya seyir halinde motor titriyor',
    icon: AlertTriangle,
    relatedCodes: ['P0300', 'P0301', 'P0302'],
    possibleCauses: ['Buji arizasi', 'Atesleme bobini', 'Vakum kacagi'],
    color: 'text-red-400',
  },
  {
    id: 2,
    title: 'Guc Kaybi',
    description: 'Arac yeterli guc uretmiyor, hizlanmada zorluk',
    icon: Zap,
    relatedCodes: ['P0171', 'P0101', 'P0300'],
    possibleCauses: ['Yakit sistemi sorunu', 'Hava filtresi tikali', 'Turbo arizasi'],
    color: 'text-yellow-400',
  },
  {
    id: 3,
    title: 'Check Engine Lambasi',
    description: 'Motor ariza lambasi yaniyor',
    icon: AlertTriangle,
    relatedCodes: ['P0420', 'P0455', 'P0171'],
    possibleCauses: ['Cesitli motor ve emisyon sorunlari'],
    color: 'text-orange-400',
  },
  {
    id: 4,
    title: 'Yakit Tuketimi Artisi',
    description: 'Normalden fazla yakit harciyor',
    icon: Fuel,
    relatedCodes: ['P0171', 'P0172', 'P0128'],
    possibleCauses: ['Oksijen sensoru', 'MAF sensoru', 'Termostat'],
    color: 'text-green-400',
  },
  {
    id: 5,
    title: 'Egzozdan Duman',
    description: 'Siyah, beyaz veya mavi duman cikiyor',
    icon: Wind,
    relatedCodes: ['P0420', 'P0300'],
    possibleCauses: ['Zengin yakit karisimi', 'Yag yakma', 'Sogutma suyu kacagi'],
    color: 'text-blue-400',
  },
  {
    id: 6,
    title: 'Calistirma Zorlugu',
    description: 'Arac zor calisiyor veya hic calismiyor',
    icon: KeyRound,
    relatedCodes: ['P0340', 'P0335'],
    possibleCauses: ['Aku zayif', 'Mars motoru', 'Yakit pompasi'],
    color: 'text-purple-400',
  },
  {
    id: 7,
    title: 'Anormal Sesler',
    description: 'Motordan veya sasiden garip sesler geliyor',
    icon: Volume2,
    relatedCodes: ['P0300', 'P0340'],
    possibleCauses: ['Rulman asinmasi', 'Kayis gevsemesi', 'Egzoz kacagi'],
    color: 'text-pink-400',
  },
  {
    id: 8,
    title: 'Motor Asiri Isiniyor',
    description: 'Sicaklik gostergesi yuksek veya uyari lambasi yaniyor',
    icon: Thermometer,
    relatedCodes: ['P0128', 'P0217'],
    possibleCauses: ['Termostat arizasi', 'Su pompasi', 'Radyator kacagi'],
    color: 'text-red-400',
  },
]

const brandProblems: Record<string, string[]> = {
  BMW: ['Zincir Gergi Sorunu', 'Vanos Solenoidi', 'Yag Kacagi'],
  Mercedes: ['Atesleme Bobini', 'Suspansiyon Buslukleri', 'Cam Motoru'],
  Toyota: ['Triger Kayisi Uzamasi', 'Oksijen Sensoru', 'Katalitik Konvertor'],
  Volkswagen: ['DSG Sanziman', 'Turbo Boru Catlagi', 'EGR Valfi'],
  Ford: ['Debriyaj Volani', 'Enjektör Kacagi', 'Turbo Arizasi'],
  Renault: ['Enjektör Kacagi', 'Turbo Arizasi', 'Direksiyon Pompasi'],
  Audi: ['Yag Tuketimi', 'Mekatronik Unite', 'Termostat Arizasi'],
  Fiat: ['Multijet Enjektör', 'Dualogic Sanziman', 'Turbo Arizasi'],
}

const popularOBDCodes = [
  { code: 'P0300', desc: 'Coklu Atesleme Hatasi' },
  { code: 'P0171', desc: 'Yakit Karisimi Zayif' },
  { code: 'P0420', desc: 'Katalizor Verimi Dusuk' },
  { code: 'P0455', desc: 'Buyuk EVAP Kacagi' },
]

export default function ArizaBulPage() {
  const [obdSearch, setObdSearch] = useState('')

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Background glow */}
      <div className="glow-dot w-96 h-96 top-0 left-1/2 -translate-x-1/2 opacity-20" />

      {/* Page Header */}
      <section className="section-container mb-12">
        <AnimatedSection>
          <div className="text-center">
            <nav className="flex items-center justify-center gap-2 text-xs text-th-fg-muted mb-6">
              <Link href="/" className="hover:text-brand-500 transition-colors">Ana Sayfa</Link>
              <span>/</span>
              <span className="text-th-fg">Ariza Bul</span>
            </nav>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 mb-6">
              <AlertTriangle className="w-4 h-4 text-brand-500" />
              <span className="text-sm font-semibold text-brand-500">Ariza Teshis</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-extrabold mb-4">
              Ariza Teshis <span className="text-gold">Rehberi</span>
            </h1>
            <p className="text-th-fg-sub text-lg max-w-2xl mx-auto">
              Aracinizdaki belirtileri secin, olasi arizalari ve cozum onerilerini gorun.
              Servise gitmeden once sorunun ne olabilecegini ogrenin.
            </p>
          </div>
        </AnimatedSection>
      </section>

      {/* Symptoms Grid */}
      <section className="section-container mb-16">
        <AnimatedSection delay={0.1}>
          <h2 className="text-xl font-display font-bold text-th-fg mb-8 text-center">
            Aracinizda Hangi Belirtiyi <span className="text-gold">Goruyorsunuz?</span>
          </h2>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {symptoms.map((symptom, index) => (
            <AnimatedSection key={symptom.id} delay={0.12 + index * 0.04}>
              <motion.div
                className="glass-card p-6 h-full group cursor-pointer"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <div className={cn('w-12 h-12 rounded-xl bg-th-overlay/[0.05] flex items-center justify-center mb-4', symptom.color)}>
                  <symptom.icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-display font-bold text-th-fg mb-2 group-hover:text-brand-500 transition-colors">
                  {symptom.title}
                </h3>
                <p className="text-xs text-th-fg-sub mb-4">{symptom.description}</p>

                {/* OBD Codes */}
                <div className="mb-3">
                  <span className="text-[10px] font-medium text-th-fg-muted uppercase tracking-wider">
                    Ilgili OBD Kodlari
                  </span>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {symptom.relatedCodes.map((code) => (
                      <Link
                        key={code}
                        href={`/obd?q=${code}`}
                        className="text-[10px] bg-brand-500/10 text-brand-500 px-2 py-0.5 rounded-md hover:bg-brand-500/20 transition-colors font-mono font-semibold"
                      >
                        {code}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Causes */}
                <div>
                  <span className="text-[10px] font-medium text-th-fg-muted uppercase tracking-wider">
                    Olasi Nedenler
                  </span>
                  <ul className="mt-1.5 space-y-1">
                    {symptom.possibleCauses.slice(0, 2).map((cause, idx) => (
                      <li key={idx} className="text-[11px] text-th-fg-sub flex items-center gap-1.5">
                        <span className="w-1 h-1 bg-th-fg-muted rounded-full shrink-0" />
                        {cause}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Brand-based Problems */}
      <section className="section-container mb-16">
        <AnimatedSection delay={0.1}>
          <h2 className="text-xl font-display font-bold text-th-fg mb-8 text-center">
            Marka Bazinda <span className="text-gold">Sik Karsilasilan Sorunlar</span>
          </h2>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(brandProblems).map(([brand, problems], index) => (
            <AnimatedSection key={brand} delay={0.12 + index * 0.05}>
              <div className="glass-card p-5">
                <h3 className="text-lg font-display font-bold text-th-fg mb-3">{brand}</h3>
                <ul className="space-y-2 mb-4">
                  {problems.map((problem) => (
                    <li key={problem} className="text-xs text-th-fg-sub flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-brand-500 rounded-full shrink-0" />
                      {problem}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/arac?brand=${brand}`}
                  className="text-xs text-brand-500 font-semibold hover:text-brand-400 transition-colors inline-flex items-center gap-1"
                >
                  Tumunu gor
                  <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* OBD Search */}
      <section className="section-container mb-16">
        <AnimatedSection delay={0.15}>
          <div className="glass-card p-8 md:p-10 text-center">
            <h2 className="text-xl font-display font-bold text-th-fg mb-3">
              OBD Ariza Kodunuzu <span className="text-gold">Biliyor musunuz?</span>
            </h2>
            <p className="text-th-fg-sub text-sm mb-6">
              Ariza kodunuzu girerek detayli bilgi alin
            </p>

            <div className="max-w-md mx-auto flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-th-fg-sub" />
                <input
                  type="text"
                  value={obdSearch}
                  onChange={(e) => setObdSearch(e.target.value.toUpperCase())}
                  placeholder="Orn: P0300"
                  className="input-dark pl-11 text-sm py-3 font-mono uppercase"
                />
              </div>
              <Link
                href={`/obd?q=${obdSearch}`}
                className="btn-gold px-6 py-3 text-sm shrink-0"
              >
                Ara
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <span className="text-th-fg-muted text-xs">Populer kodlar:</span>
              {popularOBDCodes.map((obd) => (
                <Link
                  key={obd.code}
                  href={`/obd?q=${obd.code}`}
                  className="text-xs text-brand-500 hover:text-brand-400 transition-colors font-mono font-semibold"
                >
                  {obd.code}
                </Link>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* CTA */}
      <section className="section-container">
        <AnimatedSection delay={0.2}>
          <div className="glass-card p-8 md:p-12 text-center border-brand-500/20">
            <h2 className="text-2xl font-display font-extrabold text-th-fg mb-4">
              Sorununuzu <span className="text-gold">Tespit Ettiniz mi?</span>
            </h2>
            <p className="text-th-fg-sub mb-8">
              Simdi guvenilir servislerden fiyat teklifi alin
            </p>
            <Link
              href="/servis-ara"
              className="btn-gold px-8 py-3 text-sm inline-flex items-center gap-2"
            >
              Servis Bul
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </AnimatedSection>
      </section>
    </div>
  )
}
