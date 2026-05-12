'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import AnimatedSection from '@/components/shared/AnimatedSection'
import { cn } from '@/lib/utils'
import {
  Cpu,
  Zap,
  CheckCircle,
  DollarSign,
  Phone,
  ShieldCheck,
  Loader2,
  ArrowLeft,
  RefreshCw,
  Send,
  Search,
  Calendar,
  LogOut,
} from 'lucide-react'

export default function ArizaTespitPage() {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [step, setStep] = useState<'phone' | 'otp' | 'verified'>('phone')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [countdown, setCountdown] = useState(0)

  useEffect(() => {
    const verifiedPhone = sessionStorage.getItem('verifiedPhone')
    if (verifiedPhone) {
      setPhoneNumber(verifiedPhone)
      setStep('verified')
    }
  }, [])

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()

    const cleanPhone = phoneNumber.replace(/\D/g, '')
    if (cleanPhone.length !== 10) {
      setError('Lutfen gecerli bir telefon numarasi giriniz (10 haneli)')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phoneNumber }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'SMS gonderilemedi')
      }

      setStep('otp')
      setCountdown(60)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'SMS gonderilirken hata olustu'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()

    if (otpCode.length !== 6) {
      setError('Lutfen 6 haneli kodu giriniz')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: phoneNumber,
          otp: otpCode,
        }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Dogrulama basarisiz')
      }

      const cleanPhone = phoneNumber.replace(/\D/g, '')
      sessionStorage.setItem('verifiedPhone', cleanPhone)
      localStorage.setItem('userPhone', cleanPhone)
      setStep('verified')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Dogrulama basarisiz'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const handleResendOtp = async () => {
    if (countdown > 0) return
    setOtpCode('')
    await handleSendOtp({ preventDefault: () => {} } as React.FormEvent)
  }

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '')
    const limited = cleaned.slice(0, 10)
    if (limited.length <= 3) return limited
    if (limited.length <= 6) return `${limited.slice(0, 3)} ${limited.slice(3)}`
    return `${limited.slice(0, 3)} ${limited.slice(3, 6)} ${limited.slice(6)}`
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    setPhoneNumber(formatted)
    setError('')
  }

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6)
    setOtpCode(value)
    setError('')
  }

  const infoCards = [
    {
      icon: Zap,
      title: 'Hizli Tespit',
      description: 'Belirtilerinizi anlatin, aninda olasi arizalari ogrenin',
    },
    {
      icon: CheckCircle,
      title: 'Uzman Onerileri',
      description: 'AI destekli cozum onerileri ve tamir tavsiyeleri',
    },
    {
      icon: DollarSign,
      title: 'Maliyet Tahmini',
      description: 'Tamir maliyetleri hakkinda on bilgi edinin',
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
            <div className="w-16 h-16 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mx-auto mb-6">
              <Cpu className="w-8 h-8 text-brand-500" />
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-extrabold mb-4">
              AI Ariza <span className="text-gold">Tespiti</span>
            </h1>
            <p className="text-th-fg-sub text-lg max-w-3xl mx-auto">
              Yapay zeka destekli asistanimiz ile aracinizin belirtilerini anlatin,
              olasi arizalari tespit edin ve cozum onerileri alin.
            </p>
          </div>
        </AnimatedSection>
      </section>

      {/* Info Cards */}
      <section className="section-container mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {infoCards.map((card, index) => (
            <AnimatedSection key={card.title} delay={0.1 + index * 0.08}>
              <div className="glass-card p-6 h-full hover:-translate-y-1 hover:shadow-glow-sm transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mb-4">
                  <card.icon className="w-6 h-6 text-brand-500" />
                </div>
                <h3 className="text-lg font-display font-bold text-th-fg mb-2">
                  {card.title}
                </h3>
                <p className="text-sm text-th-fg-sub">{card.description}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Phone Verification / Chat */}
      <section className="section-container mb-12">
        <AnimatedSection delay={0.2}>
          <div className="glass-card overflow-hidden">
            {/* Step: Phone */}
            {step === 'phone' && (
              <div className="p-8 md:p-12">
                <div className="max-w-md mx-auto text-center">
                  <div className="w-20 h-20 rounded-full bg-brand-500/10 border-2 border-brand-500 flex items-center justify-center mx-auto mb-6">
                    <Phone className="w-10 h-10 text-brand-500" />
                  </div>

                  <h2 className="text-2xl md:text-3xl font-display font-extrabold text-th-fg mb-4">
                    AI Asistanimiza Hos Geldiniz
                  </h2>
                  <p className="text-th-fg-sub mb-8">
                    Size daha iyi hizmet verebilmek icin telefon numaranizi dogrulamamiz gerekmektedir.
                  </p>

                  <form onSubmit={handleSendOtp} className="space-y-6">
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-left text-sm font-medium text-th-fg mb-2"
                      >
                        Telefon Numaraniz
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <span className="text-th-fg-sub font-medium">+90</span>
                        </div>
                        <input
                          type="tel"
                          id="phone"
                          value={phoneNumber}
                          onChange={handlePhoneChange}
                          placeholder="5XX XXX XX XX"
                          className={cn(
                            'input-dark pl-16 text-lg',
                            error && 'border-red-500/50'
                          )}
                          required
                          disabled={loading}
                        />
                      </div>
                      {error && (
                        <p className="text-red-400 text-sm mt-2 text-left">
                          {error}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-gold w-full py-4 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          SMS Gonderiliyor...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Dogrulama Kodu Gonder
                        </>
                      )}
                    </button>
                  </form>

                  <div className="mt-8 pt-8 border-t border-th-border/10">
                    <div className="flex items-start gap-3 text-sm text-th-fg-sub text-left">
                      <ShieldCheck className="w-5 h-5 text-brand-500 flex-shrink-0 mt-0.5" />
                      <p>
                        <strong className="text-th-fg">SMS ile Dogrulama:</strong>{' '}
                        Telefonunuza 6 haneli bir dogrulama kodu gonderecegiz.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step: OTP */}
            {step === 'otp' && (
              <div className="p-8 md:p-12">
                <div className="max-w-md mx-auto text-center">
                  <div className="w-20 h-20 rounded-full bg-green-500/10 border-2 border-green-500 flex items-center justify-center mx-auto mb-6">
                    <ShieldCheck className="w-10 h-10 text-green-500" />
                  </div>

                  <h2 className="text-2xl md:text-3xl font-display font-extrabold text-th-fg mb-4">
                    Dogrulama Kodunu Girin
                  </h2>
                  <p className="text-th-fg-sub mb-2">
                    <strong className="text-brand-500">+90 {phoneNumber}</strong> numarasina
                    SMS gonderdik
                  </p>
                  <p className="text-th-fg-muted text-sm mb-8">
                    6 haneli dogrulama kodunu asagiya girin
                  </p>

                  <form onSubmit={handleVerifyOtp} className="space-y-6">
                    <div>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={otpCode}
                        onChange={handleOtpChange}
                        placeholder="000000"
                        className={cn(
                          'input-dark text-center text-3xl font-mono tracking-[0.5em]',
                          error && 'border-red-500/50'
                        )}
                        maxLength={6}
                        required
                        disabled={loading}
                        autoFocus
                      />
                      {error && (
                        <p className="text-red-400 text-sm mt-2">{error}</p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={loading || otpCode.length !== 6}
                      className="btn-gold w-full py-4 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Dogrulaniyor...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-5 h-5" />
                          Dogrula ve Devam Et
                        </>
                      )}
                    </button>

                    <div className="flex items-center justify-between text-sm">
                      <button
                        type="button"
                        onClick={() => {
                          setStep('phone')
                          setOtpCode('')
                          setError('')
                        }}
                        className="text-th-fg-sub hover:text-th-fg transition-colors flex items-center gap-1"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Numarayi Degistir
                      </button>

                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={countdown > 0 || loading}
                        className={cn(
                          'transition-colors',
                          countdown > 0
                            ? 'text-th-fg-muted'
                            : 'text-brand-500 hover:text-brand-400'
                        )}
                      >
                        {countdown > 0 ? (
                          `Tekrar gonder (${countdown}s)`
                        ) : (
                          <span className="flex items-center gap-1">
                            <RefreshCw className="w-4 h-4" />
                            Tekrar Gonder
                          </span>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Step: Verified - Chat iframe */}
            {step === 'verified' && (
              <div className="relative" style={{ height: '800px' }}>
                <div className="absolute top-4 right-4 z-10 flex flex-col items-end gap-2">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/15 border border-green-500/25 text-green-400 text-sm font-medium">
                    <CheckCircle className="w-4 h-4" />
                    Dogrulanmis
                  </div>
                  <button
                    onClick={() => {
                      sessionStorage.removeItem('verifiedPhone')
                      localStorage.removeItem('userPhone')
                      setPhoneNumber('')
                      setOtpCode('')
                      setStep('phone')
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-th-overlay/10 border border-th-border/20 text-th-fg-sub text-sm hover:text-th-fg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Cikis Yap
                  </button>
                </div>
                <iframe
                  src={`https://mcp.tamirhanem.net/chat?phone=${phoneNumber.replace(/\s/g, '')}&embed=true&verified=true`}
                  className="w-full h-full border-0"
                  title="AI Ariza Tespiti Chat"
                  allow="clipboard-write"
                  sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
                />
              </div>
            )}
          </div>
        </AnimatedSection>
      </section>

      {/* CTA Section */}
      <section className="section-container">
        <AnimatedSection delay={0.3}>
          <div className="glass-card p-8 md:p-12 text-center">
            <h2 className="text-2xl font-display font-extrabold text-th-fg mb-4">
              Profesyonel Yardima mi Ihtiyaciniz Var?
            </h2>
            <p className="text-th-fg-sub mb-8 max-w-2xl mx-auto">
              AI asistanimiz size on bilgi verdi mi? Simdi guvenilir servislerimizden
              randevu alin ve aracinizi uzman ellere teslim edin.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/servis-ara"
                className="btn-gold px-8 py-3 text-sm inline-flex items-center justify-center gap-2"
              >
                <Search className="w-5 h-5" />
                Servis Bul
              </Link>
              <Link
                href="/randevu"
                className="px-8 py-3 rounded-xl border border-brand-500/20 text-brand-500 font-semibold text-sm hover:bg-brand-500/10 transition-all inline-flex items-center justify-center gap-2"
              >
                <Calendar className="w-5 h-5" />
                Randevu Al
              </Link>
            </div>
          </div>
        </AnimatedSection>
      </section>
    </div>
  )
}
