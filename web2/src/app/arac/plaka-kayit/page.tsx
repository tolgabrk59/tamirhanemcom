'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { KeyRound, Car, Phone, Bell, Lock, Users, ChevronLeft, CheckCircle, AlertTriangle } from 'lucide-react'
import AnimatedSection from '@/components/shared/AnimatedSection'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export default function PlakaKayitPage() {
  const [plaka, setPlaka] = useState('')
  const [telefon, setTelefon] = useState('')
  const [isim, setIsim] = useState('')
  const [onay, setOnay] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!plaka.trim() || !telefon.trim() || !onay) return

    setSubmitting(true)
    setError(null)

    try {
      const res = await fetch('/api/plaka-kayit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plaka: plaka.trim(),
          telefon: telefon.trim(),
          isim: isim.trim() || undefined,
          kvkkConsent: onay,
        }),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        setError(data.error || 'Kayıt oluşturulamadı')
        return
      }

      setSubmitted(true)
    } catch {
      setError('Bağlantı hatası. Lütfen tekrar deneyin.')
    } finally {
      setSubmitting(false)
    }
  }

  const benefits = [
    {
      icon: Bell,
      title: 'Anında Bildirim',
      description: 'Aracınız birine engel olduğunda SMS ile anında haberdar olun ve sorunu hızlıca çözün.',
      color: 'text-blue-400',
    },
    {
      icon: Lock,
      title: 'Gizlilik Koruması',
      description: 'Telefon numaranız ve kişisel bilgileriniz kimseyle paylaşılmaz. Sadece mesaj iletilir.',
      color: 'text-green-400',
    },
    {
      icon: Users,
      title: 'Toplumsal Fayda',
      description: 'Ceza yerine nazik iletişim. Kavga yerine çözüm. Daha yaşanabilir şehirler için.',
      color: 'text-purple-400',
    },
  ]

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Background glow */}
      <div className="glow-dot w-96 h-96 top-0 left-1/2 -translate-x-1/2 opacity-20" />

      {/* Page Header */}
      <section className="section-container mb-12">
        <AnimatedSection>
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 mb-6">
              <KeyRound className="w-4 h-4 text-brand-500" />
              <span className="text-sm font-semibold text-brand-500">Plaka Kayıt</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-extrabold mb-4">
              Plakamı <span className="text-gold">Kaydet</span>
            </h1>
            <p className="text-th-fg-sub text-lg max-w-2xl mx-auto">
              Hatalı park durumlarında size ulaşılabilsin.
              Kayıt olun, bildirim alın.
            </p>
          </div>
        </AnimatedSection>
      </section>

      {/* Form */}
      <section className="section-container mb-12">
        <AnimatedSection delay={0.1}>
          <div className="glass-card p-6 md:p-8 max-w-2xl mx-auto">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-7 h-7 text-green-400" />
                </div>
                <h3 className="text-xl font-display font-bold text-th-fg mb-2">
                  Kayıt Başarılı!
                </h3>
                <p className="text-th-fg-sub text-sm mb-6">
                  <span className="text-brand-500 font-semibold">{plaka}</span> plakalı aracınız başarıyla kaydedildi.
                  Artık hatalı park durumlarında SMS bildirim alabilirsiniz.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false)
                    setPlaka('')
                    setTelefon('')
                    setIsim('')
                    setOnay(false)
                    setError(null)
                  }}
                  className="btn-gold px-6 py-3 text-sm"
                >
                  Yeni Kayıt
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center">
                    <KeyRound className="w-5 h-5 text-brand-500" />
                  </div>
                  <h2 className="text-xl font-display font-bold text-th-fg">
                    Plaka Bilgileri
                  </h2>
                </div>

                <div className="section-divider" />

                {/* Error */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20"
                  >
                    <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    <p className="text-sm text-red-400">{error}</p>
                  </motion.div>
                )}

                {/* Plaka */}
                <div>
                  <label className="block text-xs text-th-fg-sub mb-2 font-medium">
                    Plaka Numarası <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Car className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-th-fg-muted" />
                    <input
                      type="text"
                      value={plaka}
                      onChange={(e) => setPlaka(e.target.value.toUpperCase())}
                      placeholder="Örneğin: 34 ABC 123"
                      required
                      className="input-dark pl-12 text-base py-4 uppercase tracking-wider"
                    />
                  </div>
                </div>

                {/* İsim */}
                <div>
                  <label className="block text-xs text-th-fg-sub mb-2 font-medium">
                    Ad Soyad
                  </label>
                  <input
                    type="text"
                    value={isim}
                    onChange={(e) => setIsim(e.target.value)}
                    placeholder="Adınız ve soyadınız"
                    className="input-dark text-base py-4"
                  />
                </div>

                {/* Telefon */}
                <div>
                  <label className="block text-xs text-th-fg-sub mb-2 font-medium">
                    Telefon Numarası <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-th-fg-muted" />
                    <input
                      type="tel"
                      value={telefon}
                      onChange={(e) => setTelefon(e.target.value)}
                      placeholder="05XX XXX XX XX"
                      required
                      className="input-dark pl-12 text-base py-4"
                    />
                  </div>
                  <p className="text-xs text-th-fg-muted mt-1.5">
                    Telefon numaranız kimseyle paylaşılmaz. Sadece bildirim gönderilir.
                  </p>
                </div>

                {/* Onay */}
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={onay}
                    onChange={(e) => setOnay(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-th-border/20 bg-th-overlay/[0.05] text-brand-500 focus:ring-brand-500/20"
                  />
                  <span className="text-xs text-th-fg-sub leading-relaxed">
                    KVKK ve gizlilik politikasını okudum ve kabul ediyorum.
                    Plaka bilgimin hatalı park bildirimlerinde kullanılmasını onaylıyorum.
                  </span>
                </label>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={!plaka.trim() || !telefon.trim() || !onay || submitting}
                  className="btn-gold w-full py-4 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Kaydediliyor...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <KeyRound className="w-4 h-4" />
                      Plakamı Kaydet
                    </span>
                  )}
                </button>
              </form>
            )}
          </div>
        </AnimatedSection>
      </section>

      {/* Benefits */}
      <section className="section-container mb-12">
        <AnimatedSection delay={0.15}>
          <h2 className="text-xl font-display font-bold text-th-fg mb-8 text-center">
            Neden Kayıt <span className="text-gold">Olmalıyım?</span>
          </h2>
        </AnimatedSection>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {benefits.map((item, index) => (
            <AnimatedSection key={item.title} delay={0.2 + index * 0.1}>
              <motion.div
                className="glass-card p-6 h-full"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center bg-th-overlay/[0.05] mb-4', item.color)}>
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-display font-bold text-th-fg mb-2">{item.title}</h3>
                <p className="text-sm text-th-fg-sub">{item.description}</p>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Back Link */}
      <section className="section-container">
        <AnimatedSection delay={0.3}>
          <div className="text-center">
            <Link
              href="/arac/park-mesaj"
              className="inline-flex items-center gap-2 text-th-fg-sub hover:text-brand-500 transition-colors text-sm"
            >
              <ChevronLeft className="w-4 h-4" />
              Hatalı Park Bildirimine Dön
            </Link>
          </div>
        </AnimatedSection>
      </section>
    </div>
  )
}
