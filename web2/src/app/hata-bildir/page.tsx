'use client'

import { useState } from 'react'
import Link from 'next/link'
import AnimatedSection from '@/components/shared/AnimatedSection'
import {
  Bug,
  Send,
  CheckCircle,
  AlertTriangle,
  ArrowLeft,
  User,
  FileText,
  Mail,
  Phone,
} from 'lucide-react'

type FeedbackPreference = 'none' | 'email' | 'phone'

export default function HataBildirPage() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    feedbackPreference: 'none' as FeedbackPreference,
    email: '',
    phone: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.name.trim()) {
      setError('Lutfen adinizi ve soyadinizi girin.')
      return
    }
    if (!formData.description.trim()) {
      setError('Lutfen hata aciklamasini girin.')
      return
    }
    if (formData.feedbackPreference === 'email' && !formData.email.trim()) {
      setError('Lutfen e-posta adresinizi girin.')
      return
    }
    if (formData.feedbackPreference === 'phone' && !formData.phone.trim()) {
      setError('Lutfen telefon numaranizi girin.')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('https://api.tamirhanem.net/api/bug-reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: {
            name: formData.name,
            description: formData.description,
            feedbackPreference: formData.feedbackPreference,
            email: formData.email || null,
            phone: formData.phone || null,
            createdAt: new Date().toISOString(),
          },
        }),
      })

      if (!response.ok) throw new Error('Gonderim basarisiz')

      setIsSubmitted(true)
    } catch {
      setError('Bir hata olustu. Lutfen tekrar deneyin.')
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
              Bildiriminiz Alindi!
            </h1>
            <p className="text-th-fg-sub mb-6">
              Hata bildiriminiz icin tesekkur ederiz. Ekibimiz en kisa surede
              inceleyecektir.
              {formData.feedbackPreference !== 'none' && (
                <span className="block mt-2">
                  Size{' '}
                  {formData.feedbackPreference === 'email'
                    ? 'e-posta'
                    : 'telefon'}{' '}
                  ile geri donus yapacagiz.
                </span>
              )}
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-brand-500 text-th-bg px-6 py-3 rounded-xl font-bold hover:bg-brand-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Ana Sayfaya Don
            </Link>
          </div>
        </AnimatedSection>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="glow-dot w-96 h-96 top-0 left-1/2 -translate-x-1/2 opacity-20" />

      <div className="section-container max-w-2xl mx-auto">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-th-fg-sub hover:text-th-fg mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Ana Sayfaya Don</span>
        </Link>

        <AnimatedSection>
          <div className="glass-card overflow-hidden">
            {/* Header */}
            <div className="bg-brand-500/10 border-b border-brand-500/20 px-6 py-8 sm:px-8">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-brand-500 rounded-xl flex items-center justify-center">
                  <Bug className="w-7 h-7 text-th-bg" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-th-fg">
                    Hata Bildir
                  </h1>
                  <p className="text-th-fg-sub text-sm mt-1">
                    Karsilastiginiz sorunu bize iletin
                  </p>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
              {error && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}

              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="flex items-center gap-2 text-sm font-semibold text-th-fg-sub mb-2"
                >
                  <User className="w-4 h-4 text-th-fg-muted" />
                  Adiniz Soyadiniz
                  <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Orn: Ahmet Yilmaz"
                  className="w-full px-4 py-3 rounded-xl bg-th-overlay/[0.05] border border-th-border/[0.12] text-th-fg placeholder:text-th-fg-muted focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500/40 transition-all"
                />
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="flex items-center gap-2 text-sm font-semibold text-th-fg-sub mb-2"
                >
                  <FileText className="w-4 h-4 text-th-fg-muted" />
                  Hata Aciklamasi
                  <span className="text-red-400">*</span>
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Lutfen karsilastiginiz hatayi detayli bir sekilde aciklayin. Hangi sayfada, ne yaparken, nasil bir hata ile karsilastiniz?"
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl bg-th-overlay/[0.05] border border-th-border/[0.12] text-th-fg placeholder:text-th-fg-muted focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500/40 transition-all resize-none"
                />
                <p className="text-xs text-th-fg-muted mt-1.5">
                  Ne kadar detayli aciklarsaniz, sorunu o kadar hizli
                  cozebiliriz.
                </p>
              </div>

              {/* Feedback Preference */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-th-fg-sub mb-3">
                  Geri Bildirim Ister misiniz?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        feedbackPreference: 'none',
                        email: '',
                        phone: '',
                      })
                    }
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      formData.feedbackPreference === 'none'
                        ? 'border-brand-500 bg-brand-500/10'
                        : 'border-th-border/[0.12] hover:border-th-border/[0.25]'
                    }`}
                  >
                    <span
                      className={`text-sm font-semibold ${
                        formData.feedbackPreference === 'none'
                          ? 'text-brand-500'
                          : 'text-th-fg-sub'
                      }`}
                    >
                      Hayir
                    </span>
                    <p className="text-xs text-th-fg-muted mt-1">
                      Geri donus beklemiyorum
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        feedbackPreference: 'email',
                        phone: '',
                      })
                    }
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      formData.feedbackPreference === 'email'
                        ? 'border-brand-500 bg-brand-500/10'
                        : 'border-th-border/[0.12] hover:border-th-border/[0.25]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Mail
                        className={`w-4 h-4 ${
                          formData.feedbackPreference === 'email'
                            ? 'text-brand-500'
                            : 'text-th-fg-muted'
                        }`}
                      />
                      <span
                        className={`text-sm font-semibold ${
                          formData.feedbackPreference === 'email'
                            ? 'text-brand-500'
                            : 'text-th-fg-sub'
                        }`}
                      >
                        E-posta
                      </span>
                    </div>
                    <p className="text-xs text-th-fg-muted mt-1">
                      E-posta ile bilgilendir
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        feedbackPreference: 'phone',
                        email: '',
                      })
                    }
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      formData.feedbackPreference === 'phone'
                        ? 'border-brand-500 bg-brand-500/10'
                        : 'border-th-border/[0.12] hover:border-th-border/[0.25]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Phone
                        className={`w-4 h-4 ${
                          formData.feedbackPreference === 'phone'
                            ? 'text-brand-500'
                            : 'text-th-fg-muted'
                        }`}
                      />
                      <span
                        className={`text-sm font-semibold ${
                          formData.feedbackPreference === 'phone'
                            ? 'text-brand-500'
                            : 'text-th-fg-sub'
                        }`}
                      >
                        Telefon
                      </span>
                    </div>
                    <p className="text-xs text-th-fg-muted mt-1">
                      Telefonla ara
                    </p>
                  </button>
                </div>
              </div>

              {/* Conditional Email Field */}
              {formData.feedbackPreference === 'email' && (
                <div>
                  <label
                    htmlFor="email"
                    className="flex items-center gap-2 text-sm font-semibold text-th-fg-sub mb-2"
                  >
                    <Mail className="w-4 h-4 text-th-fg-muted" />
                    E-posta Adresiniz
                    <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="ornek@email.com"
                    className="w-full px-4 py-3 rounded-xl bg-th-overlay/[0.05] border border-th-border/[0.12] text-th-fg placeholder:text-th-fg-muted focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500/40 transition-all"
                  />
                </div>
              )}

              {/* Conditional Phone Field */}
              {formData.feedbackPreference === 'phone' && (
                <div>
                  <label
                    htmlFor="phone"
                    className="flex items-center gap-2 text-sm font-semibold text-th-fg-sub mb-2"
                  >
                    <Phone className="w-4 h-4 text-th-fg-muted" />
                    Telefon Numaraniz
                    <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="0532 123 45 67"
                    className="w-full px-4 py-3 rounded-xl bg-th-overlay/[0.05] border border-th-border/[0.12] text-th-fg placeholder:text-th-fg-muted focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500/40 transition-all"
                  />
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-brand-500 text-th-bg font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-600"
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
                    Gonderiliyor...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Hata Bildir
                  </>
                )}
              </button>

              {/* Privacy Note */}
              <p className="text-xs text-th-fg-muted text-center">
                Bilgileriniz gizlilik politikamiz kapsaminda korunmaktadir ve
                yalnizca hata cozumu icin kullanilacaktir.
              </p>
            </form>
          </div>
        </AnimatedSection>
      </div>
    </div>
  )
}
