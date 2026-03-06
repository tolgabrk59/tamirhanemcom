'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Tag, MapPin, Car, Building2, Clock, CheckCircle, XCircle, Eye, X, MessageSquare } from 'lucide-react'

interface ThUser { id: number; username: string; jwt: string }

interface TeklifTalebi {
  id: number
  city: string
  district: string
  scope: string
  status: string
  notes: string
  createdAt: string
  serviceName: string
  serviceLocation: string
  serviceId: number | null
  categoryName: string
  vehicleInfo: string
  vehiclePlate: string
}

const STATUS_CONFIG: Record<string, { label: string; icon: React.ElementType; cls: string }> = {
  bekliyor:    { label: 'Bekliyor',    icon: Clock,         cls: 'bg-amber-400/10 border-amber-400/20 text-amber-400' },
  gorusuldu:   { label: 'Görüşüldü',  icon: Eye,           cls: 'bg-sky-400/10 border-sky-400/20 text-sky-400' },
  tamamlandi:  { label: 'Tamamlandı', icon: CheckCircle,   cls: 'bg-emerald-400/10 border-emerald-400/20 text-emerald-400' },
  iptal:       { label: 'İptal',      icon: XCircle,       cls: 'bg-red-400/10 border-red-400/20 text-red-400' },
}

function formatDate(dateStr: string) {
  if (!dateStr) return ''
  try {
    return new Date(dateStr).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
  } catch { return dateStr }
}

export default function TekliflerPage() {
  const router = useRouter()
  const [user, setUser] = useState<ThUser | null>(null)
  const [teklifler, setTeklifler] = useState<TeklifTalebi[]>([])
  const [loading, setLoading] = useState(true)
  const [detail, setDetail] = useState<TeklifTalebi | null>(null)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('th_user')
      if (!stored) { router.push('/'); return }
      const u: ThUser = JSON.parse(stored)
      setUser(u)
      fetch(`/api/user/offers?jwt=${encodeURIComponent(u.jwt)}`)
        .then(r => r.json())
        .then(d => { if (d.success) setTeklifler(d.data || []) })
        .catch(() => {})
        .finally(() => setLoading(false))
    } catch {
      router.push('/')
    }
  }, [router])

  if (!user) return null

  return (
    <main className="min-h-screen bg-th-bg pt-20 pb-24 lg:pb-8 lg:pl-16 animate-fade-in">
      <div className="max-w-3xl mx-auto px-4 py-6">

        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-th-fg-muted hover:text-th-fg text-sm font-semibold mb-6 transition-colors duration-200 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
          Geri
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-brand-500/15 flex items-center justify-center">
            <Tag className="w-5 h-5 text-brand-500" />
          </div>
          <div>
            <h1 className="text-xl font-black text-th-fg">Teklif Taleplerim</h1>
            <p className="text-xs text-th-fg-muted mt-0.5">Servislere gönderdiğiniz teklif talepleri</p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => <div key={i} className="h-28 rounded-2xl bg-th-overlay/5 animate-pulse" />)}
          </div>
        ) : teklifler.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center border border-dashed border-th-border/20">
            <div className="w-16 h-16 rounded-full bg-brand-500/10 flex items-center justify-center mx-auto mb-4">
              <Tag className="w-8 h-8 text-brand-500/50" />
            </div>
            <h3 className="text-base font-bold text-th-fg mb-2">Henüz teklif talebi yok</h3>
            <p className="text-sm text-th-fg-muted mb-4">Servislerden fiyat teklifi almak için talepte bulunun.</p>
            <button
              onClick={() => router.push('/teklif-al')}
              className="btn-gold text-sm px-5 py-2.5"
            >
              Teklif Al
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {teklifler.map(t => {
              const sc = STATUS_CONFIG[t.status] || STATUS_CONFIG.bekliyor
              const Icon = sc.icon
              return (
                <div
                  key={t.id}
                  onClick={() => setDetail(t)}
                  className="glass-card rounded-2xl p-5 cursor-pointer border border-th-border/[0.06] hover:border-brand-500/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-card group relative overflow-hidden"
                >
                  {/* Durum */}
                  <div className="flex items-center justify-between mb-3">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${sc.cls}`}>
                      <Icon className="w-3 h-3" />
                      {sc.label}
                    </span>
                    <span className="text-xs text-th-fg-muted">{formatDate(t.createdAt)}</span>
                  </div>

                  {/* Konum */}
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                    <span className="text-sm font-semibold text-th-fg truncate">
                      {t.city}{t.district ? ` / ${t.district}` : ''}
                    </span>
                  </div>

                  {/* Araç */}
                  {t.vehicleInfo && (
                    <div className="flex items-center gap-2 mb-2">
                      <Car className="w-3.5 h-3.5 text-th-fg-muted shrink-0" />
                      <span className="text-xs text-th-fg-sub truncate">
                        {t.vehicleInfo}{t.vehiclePlate ? ` • ${t.vehiclePlate}` : ''}
                      </span>
                    </div>
                  )}

                  {/* Servis / Kapsam */}
                  <div className="flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-th-fg-muted shrink-0" />
                    <span className="text-xs text-th-fg-muted truncate">
                      {t.scope === 'single' && t.serviceName
                        ? t.serviceName
                        : 'Tüm servislerden teklif'}
                    </span>
                  </div>

                  {t.categoryName && (
                    <div className="mt-2.5 pt-2.5 border-t border-th-border/[0.06]">
                      <span className="text-xs bg-brand-500/10 text-brand-400 px-2 py-0.5 rounded-full">{t.categoryName}</span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Detay Modal */}
      {detail && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={e => { if (e.target === e.currentTarget) setDetail(null) }}
        >
          <div className="glass-card rounded-2xl w-full max-w-md shadow-card">
            <div className="flex items-center justify-between p-5 border-b border-th-border/[0.08]">
              <h3 className="text-lg font-bold text-th-fg">Teklif Talebi Detayı</h3>
              <button
                onClick={() => setDetail(null)}
                className="w-8 h-8 rounded-full bg-th-overlay/5 flex items-center justify-center text-th-fg-muted hover:text-th-fg transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-1">
              {[
                { label: 'Durum', value: (() => { const sc = STATUS_CONFIG[detail.status] || STATUS_CONFIG.bekliyor; const Icon = sc.icon; return <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${sc.cls}`}><Icon className="w-3 h-3" />{sc.label}</span> })() },
                { label: 'Konum', value: `${detail.city}${detail.district ? ` / ${detail.district}` : ''}` },
                { label: 'Kapsam', value: detail.scope === 'single' ? 'Tek servis' : 'Tüm servisler' },
                ...(detail.serviceName ? [{ label: 'Servis', value: detail.serviceName }] : []),
                ...(detail.categoryName ? [{ label: 'Kategori', value: detail.categoryName }] : []),
                ...(detail.vehicleInfo ? [{ label: 'Araç', value: `${detail.vehicleInfo}${detail.vehiclePlate ? ` (${detail.vehiclePlate})` : ''}` }] : []),
                { label: 'Tarih', value: formatDate(detail.createdAt) },
              ].map(row => (
                <div key={row.label} className="flex items-center justify-between py-3 border-b border-th-border/[0.06] last:border-0">
                  <span className="text-sm text-th-fg-muted">{row.label}</span>
                  <span className="text-sm font-semibold text-th-fg text-right">{row.value}</span>
                </div>
              ))}

              {detail.notes && (
                <div className="pt-3">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="w-3.5 h-3.5 text-brand-400" />
                    <span className="text-sm font-bold text-th-fg">Notlar</span>
                  </div>
                  <p className="text-sm text-th-fg-muted leading-relaxed bg-th-overlay/5 rounded-xl p-3">{detail.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
