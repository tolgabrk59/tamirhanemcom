'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Tag, Eye, X, CalendarDays, FileText } from 'lucide-react'

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

interface Offer {
  id: number
  serviceName?: string
  price: number
  status: string
  date: string
  note?: string
  isExpired: boolean
  category?: string
}

interface DetailModalData {
  offer: Offer
}

const statusConfig: Record<string, { label: string; badgeClass: string }> = {
  'Teklif Verildi': { label: 'Gonderildi', badgeClass: 'bg-sky-400/10 border border-sky-400/20 text-sky-400' },
  'On Onaylandı': { label: 'Ön Onaylandı', badgeClass: 'bg-brand-500/10 border border-brand-500/20 text-brand-500' },
  'Onaylandı': { label: 'Kabul Edildi', badgeClass: 'bg-emerald-400/10 border border-emerald-400/20 text-emerald-400' },
  'Reddedildi': { label: 'Reddedildi', badgeClass: 'bg-red-400/10 border border-red-400/20 text-red-400' },
  expired: { label: 'Süresi Doldu', badgeClass: 'bg-th-overlay/10 border border-th-border/10 text-th-fg-muted' },
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  } catch {
    return dateStr
  }
}

export default function TekliflerPage() {
  const router = useRouter()
  const [user, setUser] = useState<ThUser | null>(null)
  const [offers, setOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(true)
  const [detail, setDetail] = useState<DetailModalData | null>(null)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('th_user')
      if (!stored) { router.push('/'); return }
      const u: ThUser = JSON.parse(stored)
      setUser(u)
      loadOffers(u)
    } catch {
      router.push('/')
    }
  }, [router])

  const loadOffers = async (u: ThUser) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/user/offers?jwt=${encodeURIComponent(u.jwt)}`)
      const data = await res.json()
      if (data.success) {
        const raw = data.data || []
        setOffers(raw.map((o: {
          id: number
          status: string
          offerPrice: number
          note: string
          createdAt: string
          appointmentDate: string
          serviceName: string
          categoryName: string
        }) => {
          const dateStr = o.appointmentDate || o.createdAt || ''
          const isExpired = (() => {
            if (!dateStr) return false
            const d = new Date(dateStr)
            const exp = new Date(d)
            exp.setDate(exp.getDate() + 7)
            return new Date() > exp
          })()

          return {
            id: o.id,
            serviceName: o.serviceName || '',
            price: o.offerPrice || 0,
            status: o.status || 'Teklif Verildi',
            date: dateStr,
            note: o.note || '',
            isExpired,
            category: o.categoryName || '',
          }
        }))
      }
    } catch {
      // API hazir degil
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  return (
    <main className="min-h-screen bg-th-bg pt-20 pb-24 lg:pb-8 lg:pl-16 animate-fade-in">
      <div className="max-w-3xl mx-auto px-4 py-6">

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
          <div className="w-10 h-10 rounded-xl bg-brand-500/15 flex items-center justify-center">
            <Tag className="w-5 h-5 text-brand-500" />
          </div>
          <h1 className="text-xl font-black text-th-fg">Tekliflerim</h1>
        </div>

        {/* Liste */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-28 rounded-2xl bg-th-overlay/5 animate-pulse" />
            ))}
          </div>
        ) : offers.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center border border-dashed border-th-border/20">
            <div className="w-16 h-16 rounded-full bg-brand-500/10 flex items-center justify-center mx-auto mb-4">
              <Tag className="w-8 h-8 text-brand-500/50" />
            </div>
            <h3 className="text-base font-bold text-th-fg mb-2">Henüz teklif bulunamadı</h3>
            <p className="text-sm text-th-fg-muted">Servislerden aldığınız teklifler burada gorünecektir.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {offers.map(offer => {
              const sc = offer.isExpired
                ? statusConfig.expired
                : (statusConfig[offer.status] || statusConfig['Teklif Verildi'])

              return (
                <div
                  key={offer.id}
                  onClick={() => setDetail({ offer })}
                  className={`glass-card rounded-2xl p-5 cursor-pointer border transition-all duration-300 hover:-translate-y-1 hover:shadow-card group relative overflow-hidden ${
                    offer.isExpired
                      ? 'border-th-border/[0.04] opacity-70'
                      : 'border-th-border/[0.06] hover:border-brand-500/20'
                  }`}
                >
                  {/* Ust satir */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      {offer.serviceName && (
                        <h3 className={`text-base font-bold text-th-fg truncate mb-1 ${offer.isExpired ? 'line-through opacity-60' : ''}`}>
                          {offer.serviceName}
                        </h3>
                      )}
                      <div className={`text-xl font-black text-brand-500 ${offer.isExpired ? 'line-through opacity-60' : ''}`}>
                        {offer.price.toLocaleString('tr-TR')} ₺
                      </div>
                    </div>
                    <span className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-bold ${sc.badgeClass}`}>
                      {sc.label}
                    </span>
                  </div>

                  {/* Alt bilgi */}
                  <div className="space-y-1.5 mt-3 pt-3 border-t border-th-border/[0.06]">
                    <div className={`flex items-center gap-2 ${offer.isExpired ? 'opacity-60' : ''}`}>
                      <CalendarDays className="w-3.5 h-3.5 text-brand-500" />
                      <span className="text-xs text-th-fg-sub">{formatDate(offer.date)}</span>
                    </div>
                    {offer.note && (
                      <div className={`flex items-center gap-2 ${offer.isExpired ? 'opacity-60' : ''}`}>
                        <FileText className="w-3.5 h-3.5 text-th-fg-muted" />
                        <span className="text-xs text-th-fg-muted truncate">{offer.note.slice(0, 50)}{offer.note.length > 50 ? '...' : ''}</span>
                      </div>
                    )}
                    {offer.isExpired && (
                      <div className="flex items-center gap-1.5 mt-2">
                        <span className="text-xs font-semibold text-red-400 bg-red-400/10 px-2 py-0.5 rounded-full">Süresi Doldu</span>
                      </div>
                    )}
                  </div>

                  {/* Detay ikonu */}
                  <div className="absolute bottom-4 right-4 w-7 h-7 rounded-full bg-th-overlay/5 flex items-center justify-center text-th-fg-muted group-hover:bg-brand-500 group-hover:text-surface-900 transition-all duration-200">
                    <Eye className="w-3.5 h-3.5" />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Detay Modali */}
      {detail && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={e => { if (e.target === e.currentTarget) setDetail(null) }}
        >
          <div className="glass-card rounded-2xl w-full max-w-md shadow-card">
            {/* Baslik */}
            <div className="flex items-center justify-between p-5 border-b border-th-border/[0.08]">
              <h3 className="text-lg font-bold text-th-fg">Teklif Detayi</h3>
              <button
                onClick={() => setDetail(null)}
                className="w-8 h-8 rounded-full bg-th-overlay/5 flex items-center justify-center text-th-fg-muted hover:text-th-fg hover:bg-th-overlay/10 transition-all duration-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Icerik */}
            <div className="p-5 space-y-4">
              {detail.offer.serviceName && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1 h-4 bg-brand-500 rounded-full" />
                    <span className="text-sm font-bold text-th-fg">Servis Bilgileri</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-th-border/[0.06]">
                    <span className="text-sm text-th-fg-muted">Servis</span>
                    <span className="text-sm font-semibold text-th-fg">{detail.offer.serviceName}</span>
                  </div>
                </div>
              )}

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1 h-4 bg-brand-500 rounded-full" />
                  <span className="text-sm font-bold text-th-fg">Teklif Detaylari</span>
                </div>
                <div className="space-y-0">
                  <div className="flex justify-between py-3 border-b border-th-border/[0.06]">
                    <span className="text-sm text-th-fg-muted">Durum</span>
                    {(() => {
                      const sc = detail.offer.isExpired
                        ? statusConfig.expired
                        : (statusConfig[detail.offer.status] || statusConfig['Teklif Verildi'])
                      return (
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${sc.badgeClass}`}>
                          {sc.label}
                        </span>
                      )
                    })()}
                  </div>
                  <div className="flex justify-between py-3 border-b border-th-border/[0.06]">
                    <span className="text-sm text-th-fg-muted">Teklif Tutari</span>
                    <span className="text-lg font-black text-brand-500">
                      {detail.offer.price.toLocaleString('tr-TR')} ₺
                    </span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-th-border/[0.06]">
                    <span className="text-sm text-th-fg-muted">Teklif Tarihi</span>
                    <span className="text-sm font-semibold text-th-fg">{formatDate(detail.offer.date)}</span>
                  </div>
                  {detail.offer.isExpired && (
                    <div className="flex justify-between py-3 border-b border-th-border/[0.06]">
                      <span className="text-sm text-th-fg-muted">Gecerlilik</span>
                      <span className="text-xs font-semibold text-red-400 bg-red-400/10 px-2 py-0.5 rounded-full">Süresi Doldu</span>
                    </div>
                  )}
                </div>
              </div>

              {detail.offer.note && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1 h-4 bg-brand-500 rounded-full" />
                    <span className="text-sm font-bold text-th-fg">Notlar</span>
                  </div>
                  <p className="text-sm text-th-fg-muted leading-relaxed">{detail.offer.note}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
