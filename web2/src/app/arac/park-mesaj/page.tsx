'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Shield, Send, Info, UserPlus, MessageSquare, Car, Search, CheckCircle, AlertTriangle, ArrowLeft } from 'lucide-react'
import AnimatedSection from '@/components/shared/AnimatedSection'
import { cn } from '@/lib/utils'
import Link from 'next/link'

type Step = 'plaka' | 'form' | 'sent'

export default function ParkMesajPage() {
  const [step, setStep] = useState<Step>('plaka')
  const [plaka, setPlaka] = useState('')
  const [mesaj, setMesaj] = useState('')
  const [checking, setChecking] = useState(false)
  const [sending, setSending] = useState(false)
  const [registered, setRegistered] = useState(false)
  const [smsSent, setSmsSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCheckPlaka = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!plaka.trim()) return

    setChecking(true)
    setError(null)
    setRegistered(false)

    try {
      const normalized = plaka.replace(/\s+/g, '').toUpperCase()
      const res = await fetch(`/api/park-mesaj/check-plaka?plaka=${encodeURIComponent(normalized)}`)
      const data = await res.json()

      if (!res.ok || !data.success) {
        setError(data.error || 'Sorgulama başarısız')
        return
      }

      if (data.registered) {
        setRegistered(true)
        setStep('form')
      } else {
        setError('Bu plaka sistemde kayıtlı değil. Araç sahibinin plakasını kaydetmesi gerekmektedir.')
      }
    } catch {
      setError('Bağlantı hatası. Lütfen tekrar deneyin.')
    } finally {
      setChecking(false)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!plaka.trim() || !mesaj.trim()) return

    setSending(true)
    setError(null)

    try {
      const res = await fetch('/api/park-mesaj/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plaka: plaka.replace(/\s+/g, '').toUpperCase(),
          message: mesaj.trim(),
        }),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        setError(data.error || 'Mesaj gönderilemedi')
        return
      }

      setSmsSent(data.smsSent ?? false)
      setStep('sent')
    } catch {
      setError('Bağlantı hatası. Lütfen tekrar deneyin.')
    } finally {
      setSending(false)
    }
  }

  const resetForm = () => {
    setStep('plaka')
    setPlaka('')
    setMesaj('')
    setRegistered(false)
    setSmsSent(false)
    setError(null)
  }

  const presetMessages = [
    'Aracınız yolumu kapatıyor, lütfen aracınızı çeker misiniz?',
    'Garaj girişimi kapatıyorsunuz, lütfen aracınızı alır mısınız?',
    'Park yerime park etmişsiniz, lütfen aracınızı çeker misiniz?',
    'Aracınızın farları açık kalmış, lütfen kontrol eder misiniz?',
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
              <Bell className="w-4 h-4 text-brand-500" />
              <span className="text-sm font-semibold text-brand-500">Park Bildirimi</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-extrabold mb-4">
              Hatalı Park <span className="text-gold">Bildirimi</span>
            </h1>
            <p className="text-th-fg-sub text-lg max-w-2xl mx-auto">
              Kayıtlı üyelere SMS bildirim gönderin.
              Plaka numarasını girerek araç sahibine mesaj iletin.
            </p>
          </div>
        </AnimatedSection>
      </section>

      {/* Info Banner */}
      <section className="section-container mb-8">
        <AnimatedSection delay={0.1}>
          <div className="glass-card p-5 border-brand-500/20">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center shrink-0">
                <Info className="w-5 h-5 text-brand-500" />
              </div>
              <div>
                <p className="text-th-fg font-semibold text-sm mb-1">Nasıl Çalışır?</p>
                <p className="text-th-fg-sub text-sm">
                  Plaka numarasını girin, sistem kayıtlıysa araç sahibine SMS ile bildirim gönderilir.
                  Kişisel bilgileriniz paylaşılmaz. Plaka kaydı için{' '}
                  <Link href="/arac/plaka-kayit" className="text-brand-500 hover:underline font-medium">
                    buraya tıklayın
                  </Link>.
                </p>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Main Form Section */}
      <section className="section-container mb-12">
        <AnimatedSection delay={0.15}>
          <div className="glass-card p-6 md:p-8 max-w-2xl mx-auto">
            <AnimatePresence mode="wait">
              {/* STEP 1: Plaka Sorgulama */}
              {step === 'plaka' && (
                <motion.div
                  key="plaka"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <form onSubmit={handleCheckPlaka} className="space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center">
                        <Search className="w-5 h-5 text-brand-500" />
                      </div>
                      <div>
                        <h2 className="text-xl font-display font-bold text-th-fg">
                          Plaka Sorgula
                        </h2>
                        <p className="text-xs text-th-fg-muted">Adım 1/2</p>
                      </div>
                    </div>

                    <div className="section-divider" />

                    {/* Error */}
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-start gap-3 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20"
                      >
                        <AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-yellow-400">{error}</p>
                          {error.includes('kayıtlı değil') && (
                            <Link
                              href="/arac/plaka-kayit"
                              className="text-xs text-brand-500 hover:underline mt-1 inline-block"
                            >
                              Plaka kayıt sayfasına git →
                            </Link>
                          )}
                        </div>
                      </motion.div>
                    )}

                    {/* Plaka Input */}
                    <div>
                      <label className="block text-xs text-th-fg-sub mb-2 font-medium">
                        Plaka Numarası <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <Car className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-th-fg-muted" />
                        <input
                          type="text"
                          value={plaka}
                          onChange={(e) => { setPlaka(e.target.value.toUpperCase()); setError(null) }}
                          placeholder="Örneğin: 34 ABC 123"
                          required
                          className="input-dark pl-12 text-base py-4 uppercase tracking-wider"
                        />
                      </div>
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={!plaka.trim() || checking}
                      className="btn-gold w-full py-4 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {checking ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Sorgulanıyor...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          <Search className="w-4 h-4" />
                          Plakayı Sorgula
                        </span>
                      )}
                    </button>
                  </form>
                </motion.div>
              )}

              {/* STEP 2: Mesaj Gönder */}
              {step === 'form' && (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <form onSubmit={handleSendMessage} className="space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-brand-500" />
                      </div>
                      <div>
                        <h2 className="text-xl font-display font-bold text-th-fg">
                          Mesaj Gönder
                        </h2>
                        <p className="text-xs text-th-fg-muted">Adım 2/2</p>
                      </div>
                    </div>

                    <div className="section-divider" />

                    {/* Kayıtlı plaka badge */}
                    <div className="flex items-center justify-between p-3 rounded-xl bg-green-500/10 border border-green-500/20">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-sm text-green-400 font-medium">
                          Plaka kayıtlı: <span className="font-bold tracking-wider">{plaka}</span>
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => { setStep('plaka'); setError(null); setRegistered(false) }}
                        className="flex items-center gap-1 text-xs text-th-fg-muted hover:text-th-fg transition-colors"
                      >
                        <ArrowLeft className="w-3 h-3" />
                        Değiştir
                      </button>
                    </div>

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

                    {/* Preset Messages */}
                    <div>
                      <label className="block text-xs text-th-fg-sub mb-3 font-medium">
                        Hazır Mesajlar
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {presetMessages.map((msg, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setMesaj(msg)}
                            className={cn(
                              'text-left text-xs p-3 rounded-xl border transition-all duration-200',
                              mesaj === msg
                                ? 'border-brand-500/40 bg-brand-500/10 text-brand-500'
                                : 'border-th-border/10 bg-th-overlay/[0.03] text-th-fg-sub hover:border-brand-500/20 hover:text-th-fg'
                            )}
                          >
                            {msg}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Custom Message */}
                    <div>
                      <label className="block text-xs text-th-fg-sub mb-2 font-medium">
                        Mesajınız
                      </label>
                      <textarea
                        value={mesaj}
                        onChange={(e) => setMesaj(e.target.value)}
                        placeholder="Mesajınızı yazın veya yukarıdaki hazır mesajlardan birini seçin..."
                        rows={4}
                        maxLength={500}
                        className="input-dark text-sm py-3 resize-none"
                      />
                      <p className="text-xs text-th-fg-muted mt-1 text-right">{mesaj.length}/500</p>
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={!mesaj.trim() || sending}
                      className="btn-gold w-full py-4 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {sending ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Gönderiliyor...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          <Send className="w-4 h-4" />
                          Bildirim Gönder
                        </span>
                      )}
                    </button>
                  </form>
                </motion.div>
              )}

              {/* STEP 3: Başarılı */}
              {step === 'sent' && (
                <motion.div
                  key="sent"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-4">
                    <Send className="w-7 h-7 text-green-400" />
                  </div>
                  <h3 className="text-xl font-display font-bold text-th-fg mb-2">
                    Bildirim Gönderildi!
                  </h3>
                  <p className="text-th-fg-sub text-sm mb-2">
                    <span className="text-brand-500 font-semibold">{plaka}</span> plakalı araç sahibine
                    {smsSent ? ' SMS bildirimi' : ' bildirim'} iletildi.
                  </p>
                  {smsSent && (
                    <p className="text-xs text-green-400 mb-6">SMS başarıyla gönderildi</p>
                  )}
                  <button onClick={resetForm} className="btn-gold px-6 py-3 text-sm">
                    Yeni Bildirim Gönder
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </AnimatedSection>
      </section>

      {/* Feature Cards */}
      <section className="section-container mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {[
            {
              icon: Bell,
              title: 'SMS Bildirim',
              description: 'Bildirimler doğrudan araç sahibinin telefonuna SMS olarak iletilir. Anında ulaşır.',
              color: 'text-blue-400',
            },
            {
              icon: Shield,
              title: 'Güvenli İletişim',
              description: 'Kişisel bilgiler paylaşılmaz. Sadece kayıtlı üyeler arasında güvenli iletişim.',
              color: 'text-green-400',
            },
          ].map((card, index) => (
            <AnimatedSection key={card.title} delay={0.2 + index * 0.1}>
              <motion.div
                className="glass-card p-6 h-full"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center bg-th-overlay/[0.05] mb-4', card.color)}>
                  <card.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-display font-bold text-th-fg mb-2">{card.title}</h3>
                <p className="text-sm text-th-fg-sub">{card.description}</p>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="section-container">
        <AnimatedSection delay={0.3}>
          <div className="text-center">
            <p className="text-th-fg-sub mb-4">Plaka kaydınız yok mu?</p>
            <Link href="/arac/plaka-kayit" className="btn-gold px-8 py-3 text-sm inline-flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              Plakamı Kaydet
            </Link>
          </div>
        </AnimatedSection>
      </section>
    </div>
  )
}
