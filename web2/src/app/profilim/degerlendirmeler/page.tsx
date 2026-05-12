'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Star, ThumbsUp } from 'lucide-react'

interface Review {
  id: number
  serviceName: string
  serviceCategory: string
  rating: number
  comment: string
  date: string
  helpfulCount: number
}

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
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const jwt = localStorage.getItem('tamirhanem_jwt')
    if (!jwt) { router.push('/giris'); return }

    const stored = localStorage.getItem('tamirhanem_user')
    const userId = stored ? (JSON.parse(stored)?.id || null) : null

    const url = userId
      ? `/api/ratings?filters[user][id][$eq]=${userId}&populate[service][fields][0]=name&sort=createdAt:desc`
      : `/api/ratings?populate[service][fields][0]=name&sort=createdAt:desc`

    fetch(url, { headers: { Authorization: `Bearer ${jwt}` } })
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        const items = d?.data || []
        setReviews(items.map((r: any) => ({
          id: r.id,
          serviceName: r.service?.name || 'Servis',
          serviceCategory: r.service?.category || '',
          rating: r.score ?? r.rating ?? 0,
          comment: r.comment || '',
          date: r.createdAt ? new Date(r.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }) : '',
          helpfulCount: 0,
        })))
      })
      .catch(() => setReviews([]))
      .finally(() => setLoading(false))
  }, [router])

  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : '0'

  return (
    <main className="min-h-screen bg-th-bg pt-20 pb-24 lg:pb-8 lg:pl-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

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
            {reviews.map(r => (
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
                    <div className="flex items-center mt-3 pt-3 border-t border-th-border/[0.06]">
                      <div className="flex items-center gap-1.5 text-xs text-th-fg-muted">
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>{r.helpfulCount} kişi faydalı buldu</span>
                      </div>
                    </div>
                  </div>
                </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
