'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Heart, Star, MapPin, X, CheckCircle, XCircle } from 'lucide-react'

interface ThUser {
  id: number
  username: string
  jwt: string
  name?: string
  email?: string
  phone?: string
  firstName?: string
  lastName?: string
  adress?: string
}

interface FavoriteService {
  id: number
  name: string
  rating?: number
  reviewCount?: number
  address?: string
  district?: string
  city?: string
  photo?: string
  category?: string
}

type ToastType = 'success' | 'error' | 'info'

export default function FavorilerPage() {
  const router = useRouter()
  const [user, setUser] = useState<ThUser | null>(null)
  const [favorites, setFavorites] = useState<FavoriteService[]>([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('th_user')
      if (!stored) { router.push('/'); return }
      const u: ThUser = JSON.parse(stored)
      setUser(u)
      loadFavorites(u)
    } catch {
      router.push('/')
    }
  }, [router])

  const showToast = (message: string, type: ToastType) => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const loadFavorites = async (u: ThUser) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/user/favorites?jwt=${encodeURIComponent(u.jwt)}`)
      const data = await res.json()
      if (data.success) {
        const raw = data.data || []
        setFavorites(raw.map((f: {
          id: number
          serviceName: string
          rating: number
          reviewCount: number
          address: string
          district: string
          city: string
          photo: string
          category: string
        }) => ({
          id: f.id,
          name: f.serviceName || 'Servis',
          rating: f.rating || 0,
          reviewCount: f.reviewCount || 0,
          address: f.address || '',
          district: f.district || '',
          city: f.city || '',
          photo: f.photo || '',
          category: f.category || '',
        })))
      }
    } catch {
      // API hazir degil
    } finally {
      setLoading(false)
    }
  }

  const removeFavorite = async (id: number) => {
    if (!user) return
    if (!window.confirm('Bu servisi favorilerden kaldırmak istediğinize emin misiniz?')) return

    try {
      await fetch(`/api/user/favorites?id=${id}&jwt=${encodeURIComponent(user.jwt)}`, { method: 'DELETE' })
      showToast('Favorilerden kaldırıldı', 'success')
    } catch {
      showToast('Kaldırıldı', 'info')
    }

    setFavorites(prev => prev.filter(f => f.id !== id))
  }

  if (!user) return null

  return (
    <main className="min-h-screen bg-th-bg pt-20 pb-24 lg:pb-8 lg:pl-16 animate-fade-in">
      <div className="max-w-3xl mx-auto px-4 py-6">

        {/* Toast */}
        {toast && (
          <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-card text-sm font-semibold transition-all duration-300 ${
            toast.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' :
            toast.type === 'error' ? 'bg-red-500/10 border border-red-500/20 text-red-400' :
            'bg-brand-500/10 border border-brand-500/20 text-brand-500'
          }`}>
            {toast.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
            {toast.message}
          </div>
        )}

        {/* Geri */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-th-fg-muted hover:text-th-fg text-sm font-semibold mb-6 transition-colors duration-200 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
          Geri
        </button>

        {/* Baslik */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-red-400/10 flex items-center justify-center">
            <Heart className="w-5 h-5 text-red-400" />
          </div>
          <h1 className="text-xl font-black text-th-fg">Favori Servislerim</h1>
        </div>

        {/* Liste */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-28 rounded-2xl bg-th-overlay/5 animate-pulse" />
            ))}
          </div>
        ) : favorites.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center border border-dashed border-th-border/20">
            <div className="w-16 h-16 rounded-full bg-red-400/10 flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-red-400/50" />
            </div>
            <h3 className="text-base font-bold text-th-fg mb-2">Henüz favori servis eklenmemiş</h3>
            <p className="text-sm text-th-fg-muted">Beğendiğiniz servisleri favorilere ekleyerek hızlı erişim sağlayın.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {favorites.map(f => (
              <div
                key={f.id}
                className="glass-card rounded-2xl overflow-hidden border border-th-border/[0.06] hover:border-red-400/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card group"
              >
                <div className="flex items-stretch">
                  {/* Foto */}
                  <div className="w-24 flex-shrink-0 bg-th-overlay/5 flex items-center justify-center">
                    {f.photo ? (
                      <img
                        src={f.photo}
                        alt={f.name}
                        className="w-full h-full object-cover"
                        onError={e => {
                          const el = e.currentTarget as HTMLImageElement
                          el.style.display = 'none'
                          if (el.parentElement) {
                            const placeholder = document.createElement('div')
                            placeholder.className = 'flex items-center justify-center w-full h-full'
                            placeholder.innerHTML = `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-th-fg-muted"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`
                            el.parentElement.appendChild(placeholder)
                          }
                        }}
                      />
                    ) : (
                      <Heart className="w-7 h-7 text-th-fg-muted" />
                    )}
                  </div>

                  {/* Bilgi */}
                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-bold text-th-fg truncate">{f.name}</h3>
                        {f.category && (
                          <span className="inline-block text-xs font-semibold text-brand-500 bg-brand-500/10 px-2 py-0.5 rounded-full mt-1">
                            {f.category}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => removeFavorite(f.id)}
                        className="w-8 h-8 rounded-full border border-th-border/10 flex items-center justify-center text-th-fg-muted hover:text-red-400 hover:border-red-400/30 hover:bg-red-400/5 transition-all duration-200 flex-shrink-0"
                        title="Favorilerden kaldir"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-4 mt-2">
                      {(f.rating ?? 0) > 0 && (
                        <div className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 text-brand-500 fill-brand-500" />
                          <span className="text-sm font-bold text-th-fg">{(f.rating ?? 0).toFixed(1)}</span>
                          {f.reviewCount ? (
                            <span className="text-xs text-th-fg-muted">({f.reviewCount})</span>
                          ) : null}
                        </div>
                      )}
                      {(f.address || f.district || f.city) && (
                        <div className="flex items-center gap-1 min-w-0">
                          <MapPin className="w-3.5 h-3.5 text-th-fg-muted flex-shrink-0" />
                          <span className="text-xs text-th-fg-muted truncate">
                            {[f.district, f.city].filter(Boolean).join(', ') || f.address}
                          </span>
                        </div>
                      )}
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
