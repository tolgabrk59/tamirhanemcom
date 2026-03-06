'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Star, ThumbsUp, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react'

interface ThUser {
  id: number
  username: string
  jwt: string
  name?: string
}

interface Review {
  id: number
  serviceName: string
  serviceCategory: string
  rating: number
  comment: string
  date: string
  helpfulCount: number
  replyFrom?: string
  reply?: string
}

const MOCK: Review[] = [
  {
    id: 1,
    serviceName: 'Yıldız Oto Servis',
    serviceCategory: 'Yağ Değişimi',
    rating: 5,
    comment: 'Harika bir servis deneyimi yaşadım. Ustalar çok ilgili ve işini biliyor, fiyatlar da oldukça uygun.',
    date: '28 Şubat 2026',
    helpfulCount: 4,
    replyFrom: 'Yıldız Oto Servis',
    reply: 'Teşekkür ederiz! Sizi tekrar görmekten mutluluk duyarız.',
  },
  {
    id: 2,
    serviceName: 'Güven Lastik',
    serviceCategory: 'Lastik Değişimi',
    rating: 4,
    comment: 'Hızlı ve kaliteli hizmet. Biraz bekleme süresi oldu ama genel olarak memnunum.',
    date: '10 Şubat 2026',
    helpfulCount: 1,
  },
]

function StarRating({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          className={`w-4 h-4 ${i <= value ? 'text-gold fill-gold' : 'text-th-border/30'}`}
        />
      ))}
    </div>
  )
}

export default function DegerlendirmelerPage() {
  const router = useRouter()
  const [user, setUser] = useState<ThUser | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<number | null>(null)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('th_user')
      if (!stored) { router.push('/'); return }
      const u: ThUser = JSON.parse(stored)
      setUser(u)
      fetch(`/api/user/ratings?jwt=${encodeURIComponent(u.jwt)}`)
        .then(r => r.ok ? r.json() : null)
        .then(d => {
          if (d?.success && Array.isArray(d.data) && d.data.length > 0) {
            setReviews(d.data.map((r: {
              id: number
              rating: number
              comment: string
              createdAt: string
              serviceName: string
              serviceCategory: string
              helpfulCount: number
              replyFrom: string
              reply: string
            }) => ({
              id: r.id,
              serviceName: r.serviceName || 'Servis',
              serviceCategory: r.serviceCategory || '',
              rating: r.rating || 0,
              comment: r.comment || '',
              date: r.createdAt ? new Date(r.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }) : '',
              helpfulCount: r.helpfulCount || 0,
              replyFrom: r.replyFrom || '',
              reply: r.reply || '',
            })))
          } else {
            setReviews(MOCK)
          }
        })
        .catch(() => setReviews(MOCK))
        .finally(() => setLoading(false))
    } catch { router.push('/') }
  }, [router])

  if (!user) return null

  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : '0'

  return (
    <main className="min-h-screen bg-th-bg pt-20 pb-24 lg:pb-8 lg:pl-16">
      <div className="max-w-3xl mx-auto px-4 py-6">

        {/* Geri */}
        <button onClick={() => router.back()} className="flex items-center gap-2 text-th-fg-muted hover:text-th-fg text-sm font-semibold mb-6 transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Geri
        </button>

        {/* Başlık */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center">
            <Star className="w-5 h-5 text-gold" />
          </div>
          <h1 className="text-xl font-black text-th-fg">Değerlendirmelerim</h1>
        </div>

        {/* Özet */}
        {reviews.length > 0 && (
          <div className="glass-card rounded-2xl p-5 border border-th-border/[0.06] mb-6">
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-4xl font-black text-gold">{avgRating}</div>
                <StarRating value={Math.round(parseFloat(avgRating))} />
                <div className="text-xs text-th-fg-muted mt-1">{reviews.length} değerlendirme</div>
              </div>
              <div className="flex-1 space-y-1.5">
                {[5, 4, 3, 2, 1].map(star => {
                  const count = reviews.filter(r => r.rating === star).length
                  const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0
                  return (
                    <div key={star} className="flex items-center gap-2">
                      <span className="text-xs text-th-fg-muted w-3">{star}</span>
                      <Star className="w-3 h-3 text-gold/60 fill-gold/60 flex-shrink-0" />
                      <div className="flex-1 h-1.5 bg-th-overlay/10 rounded-full overflow-hidden">
                        <div className="h-full bg-gold rounded-full transition-all" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs text-th-fg-muted w-4 text-right">{count}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Liste */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map(i => <div key={i} className="h-36 rounded-2xl bg-th-overlay/5 animate-pulse" />)}
          </div>
        ) : reviews.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center border border-dashed border-th-border/20">
            <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-gold/40" />
            </div>
            <h3 className="text-base font-bold text-th-fg mb-2">Henüz değerlendirme yok</h3>
            <p className="text-sm text-th-fg-muted">Tamamlanan randevularınızı değerlendirerek diğer kullanıcılara yardımcı olun.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map(r => {
              const isExp = expanded === r.id
              return (
                <div key={r.id} className="glass-card rounded-2xl border border-th-border/[0.06] hover:border-gold/20 transition-all overflow-hidden">
                  <div className="p-5">
                    {/* Servis & Puan */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <h3 className="text-sm font-bold text-th-fg">{r.serviceName}</h3>
                        <span className="text-xs text-brand-500 font-semibold">{r.serviceCategory}</span>
                      </div>
                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        <StarRating value={r.rating} />
                        <span className="text-[10px] text-th-fg-muted">{r.date}</span>
                      </div>
                    </div>

                    {/* Yorum */}
                    <p className="text-sm text-th-fg-muted leading-relaxed">{r.comment}</p>

                    {/* Alt */}
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-th-border/[0.06]">
                      <div className="flex items-center gap-1.5 text-xs text-th-fg-muted">
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>{r.helpfulCount} kişi faydalı buldu</span>
                      </div>
                      {r.reply && (
                        <button
                          onClick={() => setExpanded(isExp ? null : r.id)}
                          className="flex items-center gap-1 text-xs text-brand-500 font-semibold hover:text-brand-400 transition-colors"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          Yanıt var
                          {isExp ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Servis Yanıtı */}
                  {isExp && r.reply && (
                    <div className="mx-5 mb-4 p-4 rounded-xl bg-brand-500/[0.04] border border-brand-500/10">
                      <div className="text-xs font-bold text-brand-500 mb-1">{r.replyFrom}</div>
                      <p className="text-xs text-th-fg-muted leading-relaxed">{r.reply}</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
