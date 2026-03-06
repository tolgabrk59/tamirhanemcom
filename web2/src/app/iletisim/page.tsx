'use client'

import { useState } from 'react'
import Link from 'next/link'
import AnimatedSection from '@/components/shared/AnimatedSection'
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  AlertTriangle,
  Megaphone,
  ChevronRight,
  MessageSquare,
  HelpCircle,
  FileText,
  Shield,
} from 'lucide-react'

const contactInfo = [
  {
    icon: Phone,
    title: 'Telefon',
    value: '0 544 620 7275',
    href: 'tel:+905446207275',
  },
  {
    icon: Mail,
    title: 'E-posta',
    value: 'info@tamirhanem.com',
    href: 'mailto:info@tamirhanem.com',
  },
  {
    icon: MapPin,
    title: 'Satış Ofisi',
    value: 'Esentepe Mh. Sancak Cad. Real Tower Plaza K:2 D:14 Çorlu/T.Dağ',
    href: undefined,
  },
  {
    icon: MapPin,
    title: 'Yazılım Ofisi',
    value: 'Zafer Mh. Çorlu Ticaret ve Sanayi Odası TEKMER (Trakya Teknoloji Geliştirme Merkezi) Çorlu/T.Dağ',
    href: undefined,
  },
  {
    icon: Clock,
    title: 'Çalışma Saatleri',
    value: 'Pazartesi - Cuma: 09:00 - 18:00',
    href: undefined,
  },
]

const quickLinks = [
  { label: 'Sık Sorulan Sorular', href: '/sss', icon: HelpCircle },
  { label: 'Hakkımızda', href: '/kurumsal', icon: FileText },
  { label: 'Gizlilik Politikası', href: '/gizlilik', icon: Shield },
  { label: 'Kullanım Şartları', href: '/kullanim-sartlari', icon: FileText },
]

const subjectOptions = [
  { value: '', label: 'Konu Seçin' },
  { value: 'reklam', label: 'Reklam ve İşbirlikleri' },
  { value: 'servis', label: 'Servis Başvurusu' },
  { value: 'destek', label: 'Teknik Destek' },
  { value: 'oneri', label: 'Öneri ve Şikâyet' },
  { value: 'diger', label: 'Diğer' },
]

export default function IletisimPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.name.trim()) {
      setError('Lütfen adınızı girin.')
      return
    }
    if (!formData.email.trim()) {
      setError('Lütfen e-posta adresinizi girin.')
      return
    }
    if (!formData.subject) {
      setError('Lütfen bir konu seçin.')
      return
    }
    if (!formData.message.trim()) {
      setError('Lütfen mesajınızı yazın.')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('https://api.tamirhanem.net/api/contact-messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: {
            name: formData.name,
            email: formData.email,
            subject: formData.subject,
            message: formData.message,
            createdAt: new Date().toISOString(),
          },
        }),
      })

      if (!response.ok) throw new Error('Gönderim başarısız')

      setIsSubmitted(true)
    } catch {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <AnimatedSection>
          <div className="glass-card p-8 md:p-12 max-w-md w-full text-center">
            <div className="w-20 h-20 bg-brand-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-brand-500" />
            </div>
            <h1 className="text-2xl font-display font-extrabold text-th-fg mb-3">
              Mesajınız Alındı!
            </h1>
            <p className="text-th-fg-sub mb-6">
              En kısa sürede size geri dönüş yapacağız. Teşekkür ederiz.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-brand-500 text-th-bg px-6 py-3 rounded-xl font-bold hover:bg-brand-600 transition-colors"
            >
              Ana Sayfaya Dön
            </Link>
          </div>
        </AnimatedSection>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="glow-dot w-96 h-96 top-0 left-1/2 -translate-x-1/2 opacity-20" />

      {/* Hero */}
      <section className="section-container mb-12">
        <AnimatedSection>
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/20 px-4 py-2 rounded-full mb-6">
              <MessageSquare className="w-4 h-4 text-brand-500" />
              <span className="text-sm font-semibold text-brand-500">
                Bize Ulaşın
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-extrabold mb-3">
              İletişim
            </h1>
            <p className="text-th-fg-sub text-lg max-w-2xl mx-auto">
              Sorularınız, önerileriniz veya iş birliği teklifleriniz için
              bizimle iletişime geçin
            </p>
          </div>
        </AnimatedSection>
      </section>

      {/* Main Content */}
      <section className="section-container">
        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Contact Form */}
          <AnimatedSection direction="left">
            <div className="glass-card p-6 md:p-8">
              <h2 className="text-xl font-display font-bold text-th-fg mb-6">
                Bize Ulaşın
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    {error}
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-th-fg-sub mb-2">
                      Adınız Soyadınız *
                    </label>
                    <input
                      type="text"
                      required
                      autoComplete="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-th-overlay/[0.05] border border-th-border/[0.12] text-th-fg placeholder:text-th-fg-muted focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500/40 transition-all"
                      placeholder="Adınız Soyadınız"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-th-fg-sub mb-2">
                      E-posta *
                    </label>
                    <input
                      type="email"
                      required
                      inputMode="email"
                      autoComplete="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-th-overlay/[0.05] border border-th-border/[0.12] text-th-fg placeholder:text-th-fg-muted focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500/40 transition-all"
                      placeholder="örnek@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-th-fg-sub mb-2">
                    Konu *
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-th-overlay/[0.05] border border-th-border/[0.12] text-th-fg focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500/40 transition-all"
                  >
                    {subjectOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-th-fg-sub mb-2">
                    Mesajınız *
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-th-overlay/[0.05] border border-th-border/[0.12] text-th-fg placeholder:text-th-fg-muted focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500/40 transition-all resize-none"
                    placeholder="Mesajınızı buraya yazın..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-brand-500 text-th-bg py-3 rounded-xl font-bold hover:bg-brand-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Gönderiliyor...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Gönder
                    </>
                  )}
                </button>
              </form>
            </div>
          </AnimatedSection>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Ad Partnership Card */}
            <AnimatedSection direction="right" delay={0.1}>
              <div className="glass-card p-6 md:p-8 border-brand-500/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-brand-500/10 rounded-xl flex items-center justify-center">
                    <Megaphone className="w-6 h-6 text-brand-500" />
                  </div>
                  <h3 className="text-xl font-display font-bold text-th-fg">
                    Reklam ve İşbirlikleri
                  </h3>
                </div>
                <p className="text-th-fg-sub text-sm mb-4 leading-relaxed">
                  Markanızı Türkiye&apos;nin en büyük araç bakım platformunda
                  tanıtın. Aylık 100.000+ araç sahibine ulaşın.
                </p>
                <div className="space-y-2 mb-5">
                  {['Banner Reklamları', 'Sponsorlu İçerikler', 'Marka Ortaklıkları'].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-sm text-th-fg-sub">
                      <CheckCircle className="w-4 h-4 text-brand-500 shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
                <a
                  href="mailto:reklam@tamirhanem.com"
                  className="inline-flex items-center gap-2 bg-brand-500 text-th-bg px-5 py-2.5 rounded-xl font-bold hover:bg-brand-600 transition-colors text-sm"
                >
                  <Mail className="w-4 h-4" />
                  reklam@tamirhanem.com
                </a>
              </div>
            </AnimatedSection>

            {/* Contact Info */}
            <AnimatedSection direction="right" delay={0.2}>
              <div className="glass-card p-6 md:p-8">
                <h3 className="text-lg font-display font-bold text-th-fg mb-5">
                  İletişim Bilgileri
                </h3>
                <div className="space-y-5">
                  {contactInfo.map((info) => {
                    const Icon = info.icon
                    return (
                      <div key={info.title} className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-brand-500/10 rounded-xl flex items-center justify-center shrink-0">
                          <Icon className="w-5 h-5 text-brand-500" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-th-fg text-sm">
                            {info.title}
                          </h4>
                          {info.href ? (
                            <a
                              href={info.href}
                              className="text-brand-500 hover:text-brand-400 text-sm transition-colors"
                            >
                              {info.value}
                            </a>
                          ) : (
                            <p className="text-th-fg-sub text-sm">
                              {info.value}
                            </p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </AnimatedSection>

            {/* Quick Links */}
            <AnimatedSection direction="right" delay={0.3}>
              <div className="glass-card p-6">
                <h4 className="font-display font-bold text-th-fg mb-4 text-sm">
                  Hızlı Bağlantılar
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {quickLinks.map((link) => {
                    const Icon = link.icon
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="flex items-center gap-2 text-th-fg-sub hover:text-brand-500 transition-colors text-xs p-2 rounded-lg hover:bg-brand-500/5"
                      >
                        <Icon className="w-3.5 h-3.5 shrink-0" />
                        {link.label}
                      </Link>
                    )
                  })}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </div>
  )
}
