'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Star, MessageSquare, Wrench } from 'lucide-react'

interface Rating {
  id: number
  rating: number
  comment: string
  createdAt: string
  serviceId: number | null
  serviceName: string
  serviceCategory: string
  helpfulCount: number
  replyFrom: string
  reply: string
}

function formatDate(dateStr: string) {
  if (!dateStr) return ''
  try {
    return new Date(dateStr).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
  } catch { return dateStr }
}

function StarRating({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} className={i <= value ? 'text-amber-400' : 'text-gray-700'}>★</span>
      ))}
      <span className="ml-1.5 text-sm font-bold text-amber-400">{value.toFixed(1)}</span>
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800 animate-pulse">
      <div className="flex items-center justify-between mb-3">
        <div className="h-4 w-28 bg-gray-800 rounded" />
        <div className="h-4 w-20 bg-gray-800 rounded" />
      </div>
      <div className="h-3 w-40 bg-gray-800 rounded mb-3" />
      <div className="h-3 w-full bg-gray-800 rounded mb-2" />
      <div className="h-3 w-3/4 bg-gray-800 rounded" />
    </div>
  )
}

export default function YorumlarPage() {
  const router = useRouter()
  const [ratings, setRatings] = useState<Rating[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const jwt = localStorage.getItem('tamirhanem_jwt')
      if (!jwt) { router.push('/giris'); return }

      fetch('/api/ratings?populate[service]=*', {
        headers: { Authorization: `Bearer ${jwt}` },
      })
        .then(r => r.json())
        .then(d => { if (d.success) setRatings(d.data || []) })
        .catch(() => {})
        .finally(() => setLoading(false))
    } catch {
      router.push('/giris')
    }
  }, [router])

  return (
    <main className="min-h-screen bg-gray-950 pt-20 pb-24 lg:pb-8 lg:pl-16 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center">
            <Star className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white">Değerlendirmelerim</h1>
            <p className="text-xs text-gray-400 mt-0.5">Hizmetlere verdiğiniz puanlar ve yorumlar</p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
          </div>
        ) : ratings.length === 0 ? (
          <div className="bg-gray-900 rounded-2xl p-12 text-center border border-dashed border-gray-700">
            <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8 text-amber-500/50" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Henüz değerlendirme yok</h3>
            <p className="text-sm text-gray-400">Hizmetlere puan vererek deneyimlerinizi paylaşın.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {ratings.map(r => (
              <div
                key={r.id}
                className="bg-gray-900 rounded-2xl p-5 border border-gray-800 hover:border-amber-500/20 transition-colors duration-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <StarRating value={r.rating} />
                  <span className="text-xs text-gray-500">{formatDate(r.createdAt)}</span>
                </div>

                {r.serviceName && (
                  <div className="flex items-center gap-2 mb-3">
                    <Wrench className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                    <span className="text-sm font-semibold text-gray-300">{r.serviceName}</span>
                    {r.serviceCategory && (
                      <span className="text-xs bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-full">{r.serviceCategory}</span>
                    )}
                  </div>
                )}

                {r.comment && (
                  <p className="text-sm text-gray-400 leading-relaxed">{r.comment}</p>
                )}

                {r.reply && (
                  <div className="mt-3 pt-3 border-t border-gray-800">
                    <p className="text-xs text-gray-500 font-semibold mb-1">{r.replyFrom || 'Servis yanıtı'}</p>
                    <p className="text-sm text-gray-400 italic">{r.reply}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
