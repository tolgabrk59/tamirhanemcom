'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, MessageCircle, Plus, ChevronDown, ChevronUp, CheckCircle, Clock, X, Send, CheckCircle2 } from 'lucide-react'

interface ThUser {
  id: number
  username: string
  jwt: string
  name?: string
}

interface Question {
  id: number
  serviceName: string
  question: string
  date: string
  status: 'yanitsiz' | 'yanitlandi'
  answer?: string
  answeredBy?: string
  answeredAt?: string
}

export default function SorularPage() {
  const router = useRouter()
  const [user, setUser] = useState<ThUser | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<number | null>(null)
  const [showModal, setShowModal] = useState(false)

  // Form state
  const [formServiceName, setFormServiceName] = useState('')
  const [formQuestion, setFormQuestion] = useState('')
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('th_user')
      if (!stored) { router.push('/'); return }
      const u: ThUser = JSON.parse(stored)
      setUser(u)
      loadQuestions(u)
    } catch { router.push('/') }
  }, [router])

  const loadQuestions = (u: ThUser) => {
    fetch(`/api/questions?jwt=${encodeURIComponent(u.jwt)}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d?.success && d.data?.length) setQuestions(d.data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  const openModal = () => {
    setFormServiceName('')
    setFormQuestion('')
    setFormError('')
    setSubmitted(false)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSubmitted(false)
  }

  const handleSubmit = async () => {
    if (!user) return
    setFormError('')

    if (!formServiceName.trim()) { setFormError('Servis adı giriniz.'); return }
    if (formQuestion.trim().length < 10) { setFormError('Soru en az 10 karakter olmalıdır.'); return }

    setSubmitting(true)
    try {
      const res = await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jwt: user.jwt,
          serviceName: formServiceName.trim(),
          question: formQuestion.trim(),
        }),
      })
      const data = await res.json()
      if (data.success) {
        setSubmitted(true)
        // Yeni soruyu listeye ekle
        const newQ: Question = {
          id: Date.now(),
          serviceName: formServiceName.trim(),
          question: formQuestion.trim(),
          date: new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }),
          status: 'yanitsiz',
        }
        setQuestions(prev => [newQ, ...prev])
        setTimeout(() => closeModal(), 2000)
      } else {
        setFormError(data.error || 'Gönderilemedi, lütfen tekrar deneyin.')
      }
    } catch {
      setFormError('Bağlantı hatası. Lütfen tekrar deneyin.')
    } finally {
      setSubmitting(false)
    }
  }

  if (!user) return null

  const answered = questions.filter(q => q.status === 'yanitlandi').length
  const unanswered = questions.filter(q => q.status === 'yanitsiz').length

  return (
    <main className="min-h-screen bg-th-bg pt-20 pb-24 lg:pb-8 lg:pl-16">
      <div className="max-w-3xl mx-auto px-4 py-6">

        {/* Geri */}
        <button onClick={() => router.back()} className="flex items-center gap-2 text-th-fg-muted hover:text-th-fg text-sm font-semibold mb-6 transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Geri
        </button>

        {/* Başlık */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-500/15 flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-brand-500" />
            </div>
            <div>
              <h1 className="text-xl font-black text-th-fg">Soru & Cevaplarım</h1>
              <p className="text-xs text-th-fg-muted">{questions.length} soru</p>
            </div>
          </div>
          <button
            onClick={openModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-brand-500 hover:bg-brand-600 text-surface-900 font-bold text-sm transition-all shadow-glow-sm hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4" />
            Soru Sor
          </button>
        </div>

        {/* Özet */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: 'Toplam', value: questions.length, color: 'text-brand-500' },
            { label: 'Yanıtlanan', value: answered, color: 'text-emerald-400' },
            { label: 'Bekleyen', value: unanswered, color: 'text-amber-400' },
          ].map(s => (
            <div key={s.label} className="glass-card rounded-xl p-3 border border-th-border/[0.06] text-center">
              <div className={`text-xl font-black ${s.color}`}>{s.value}</div>
              <div className="text-[10px] text-th-fg-muted font-semibold tracking-wide mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Liste */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map(i => <div key={i} className="h-32 rounded-2xl bg-th-overlay/5 animate-pulse" />)}
          </div>
        ) : questions.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center border border-dashed border-th-border/20">
            <div className="w-16 h-16 rounded-full bg-brand-500/10 flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-brand-500/50" />
            </div>
            <h3 className="text-base font-bold text-th-fg mb-2">Henüz soru yok</h3>
            <p className="text-sm text-th-fg-muted mb-5">Servisler hakkında merak ettiğinizi sorun.</p>
            <button onClick={openModal} className="px-6 py-2.5 rounded-full bg-brand-500 hover:bg-brand-600 text-surface-900 font-bold text-sm transition-all">
              Soru Sor
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {questions.map(q => {
              const isExp = expanded === q.id
              return (
                <div key={q.id} className="glass-card rounded-2xl border border-th-border/[0.06] hover:border-brand-500/20 transition-all overflow-hidden">
                  <div className="p-5">
                    {/* Servis + Durum */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <span className="text-xs font-bold text-brand-500">{q.serviceName}</span>
                      <span className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${
                        q.status === 'yanitlandi'
                          ? 'bg-emerald-400/10 border border-emerald-400/20 text-emerald-400'
                          : 'bg-amber-400/10 border border-amber-400/20 text-amber-400'
                      }`}>
                        {q.status === 'yanitlandi' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        {q.status === 'yanitlandi' ? 'Yanıtlandı' : 'Bekliyor'}
                      </span>
                    </div>

                    <p className="text-sm text-th-fg font-medium leading-relaxed">{q.question}</p>
                    <span className="text-[10px] text-th-fg-muted mt-1 block">{q.date}</span>

                    {q.answer && (
                      <button
                        onClick={() => setExpanded(isExp ? null : q.id)}
                        className="flex items-center gap-1.5 mt-3 pt-3 border-t border-th-border/[0.06] w-full text-xs font-semibold text-brand-500 hover:text-brand-400 transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        Yanıtı Görüntüle
                        {isExp ? <ChevronUp className="w-3.5 h-3.5 ml-auto" /> : <ChevronDown className="w-3.5 h-3.5 ml-auto" />}
                      </button>
                    )}
                  </div>

                  {isExp && q.answer && (
                    <div className="mx-5 mb-4 p-4 rounded-xl bg-brand-500/[0.04] border border-brand-500/10">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-brand-500">{q.answeredBy}</span>
                        <span className="text-[10px] text-th-fg-muted">{q.answeredAt}</span>
                      </div>
                      <p className="text-xs text-th-fg-muted leading-relaxed">{q.answer}</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Soru Sor Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={e => { if (e.target === e.currentTarget) closeModal() }}
        >
          <div className="glass-card rounded-2xl w-full max-w-md shadow-card">
            <div className="flex items-center justify-between p-5 border-b border-th-border/[0.08]">
              <h3 className="text-lg font-bold text-th-fg">Soru Sor</h3>
              <button
                onClick={closeModal}
                className="w-8 h-8 rounded-full bg-th-overlay/5 flex items-center justify-center text-th-fg-muted hover:text-th-fg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {submitted ? (
              /* Başarı ekranı */
              <div className="p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-400/10 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                </div>
                <h4 className="text-base font-bold text-th-fg mb-2">Sorunuz İletildi!</h4>
                <p className="text-sm text-th-fg-muted">
                  Servis ekibi en kısa sürede yanıt verecektir. E-posta adresinize bildirim gönderildi.
                </p>
              </div>
            ) : (
              <>
                <div className="p-5 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-th-fg-sub uppercase tracking-wide mb-2">
                      Servis Adı
                    </label>
                    <input
                      type="text"
                      value={formServiceName}
                      onChange={e => setFormServiceName(e.target.value)}
                      placeholder="Örn: Yıldız Oto Servis"
                      className="w-full px-4 py-3 rounded-xl bg-th-bg/60 border border-th-border/[0.1] text-th-fg placeholder-th-fg-muted text-sm focus:outline-none focus:border-brand-500/50 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-th-fg-sub uppercase tracking-wide mb-2">
                      Sorunuz
                    </label>
                    <textarea
                      rows={4}
                      value={formQuestion}
                      onChange={e => setFormQuestion(e.target.value)}
                      placeholder="Sorunuzu detaylı yazın... (en az 10 karakter)"
                      className="w-full px-4 py-3 rounded-xl bg-th-bg/60 border border-th-border/[0.1] text-th-fg placeholder-th-fg-muted text-sm focus:outline-none focus:border-brand-500/50 transition-all resize-none"
                    />
                    <div className="flex justify-between mt-1">
                      {formError ? (
                        <span className="text-xs text-red-400">{formError}</span>
                      ) : (
                        <span />
                      )}
                      <span className="text-[10px] text-th-fg-muted ml-auto">{formQuestion.length} karakter</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 p-5 bg-th-overlay/[0.02] border-t border-th-border/[0.06] rounded-b-2xl">
                  <button
                    onClick={closeModal}
                    className="px-5 py-2.5 rounded-full border border-th-border/10 text-th-fg-muted hover:text-th-fg font-semibold text-sm transition-all"
                  >
                    İptal
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-brand-500 hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed text-surface-900 font-bold text-sm transition-all shadow-glow-sm"
                  >
                    {submitting ? (
                      <span className="w-4 h-4 border-2 border-surface-900/30 border-t-surface-900 rounded-full animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    {submitting ? 'Gönderiliyor...' : 'Gönder'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  )
}
