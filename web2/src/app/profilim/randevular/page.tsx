'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, CalendarDays, Clock, MapPin, Wrench, ChevronRight } from 'lucide-react'

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

interface Appointment {
  id: number
  serviceName: string
  serviceAddress?: string
  category?: string
  date: string
  timeSlot?: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | string
  note?: string
  vehicle?: string
}

type FilterTab = 'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled'

const statusConfig: Record<string, { label: string; badgeClass: string; dotClass: string }> = {
  pending: {
    label: 'Bekliyor',
    badgeClass: 'bg-amber-400/10 border border-amber-400/20 text-amber-400',
    dotClass: 'bg-amber-400',
  },
  confirmed: {
    label: 'Onaylandı',
    badgeClass: 'bg-sky-400/10 border border-sky-400/20 text-sky-400',
    dotClass: 'bg-sky-400',
  },
  completed: {
    label: 'Tamamlandı',
    badgeClass: 'bg-emerald-400/10 border border-emerald-400/20 text-emerald-400',
    dotClass: 'bg-emerald-400',
  },
  cancelled: {
    label: 'İptal',
    badgeClass: 'bg-red-400/10 border border-red-400/20 text-red-400',
    dotClass: 'bg-red-400',
  },
}

const tabOptions: { key: FilterTab; label: string }[] = [
  { key: 'all', label: 'Tümü' },
  { key: 'pending', label: 'Bekleyen' },
  { key: 'confirmed', label: 'Onaylandı' },
  { key: 'completed', label: 'Tamamlandı' },
  { key: 'cancelled', label: 'İptal' },
]

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

export default function RandevularPage() {
  const router = useRouter()
  const [user, setUser] = useState<ThUser | null>(null)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<FilterTab>('all')

  useEffect(() => {
    try {
      const stored = localStorage.getItem('th_user')
      if (!stored) { router.push('/'); return }
      const u: ThUser = JSON.parse(stored)
      setUser(u)
      loadAppointments(u)
    } catch {
      router.push('/')
    }
  }, [router])

  const loadAppointments = async (u: ThUser) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/user/appointments?jwt=${encodeURIComponent(u.jwt)}`)
      const data = await res.json()
      if (data.success) {
        const raw = data.data || []
        setAppointments(raw.map((a: {
          id: number
          status: string
          note: string
          appointmentDate: string
          timeSlot: string
          serviceName: string
          serviceAddress: string
          categoryName: string
          vehicleBrand: string
          vehicleModel: string
        }) => {
          const rawStatus = (a.status || 'pending').toLowerCase()
          const status = rawStatus === 'bekliyor' || rawStatus === 'pending' ? 'pending'
            : rawStatus === 'onaylandi' || rawStatus === 'confirmed' ? 'confirmed'
            : rawStatus === 'tamamlandi' || rawStatus === 'completed' ? 'completed'
            : rawStatus === 'iptal' || rawStatus === 'cancelled' ? 'cancelled'
            : 'pending'

          const vehicleInfo = a.vehicleBrand && a.vehicleModel
            ? `${a.vehicleBrand} ${a.vehicleModel}`
            : undefined

          return {
            id: a.id,
            serviceName: a.serviceName || 'Servis',
            serviceAddress: a.serviceAddress || '',
            category: a.categoryName || '',
            date: a.appointmentDate || '',
            timeSlot: a.timeSlot || '',
            status,
            note: a.note || '',
            vehicle: vehicleInfo,
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

  const filtered = activeTab === 'all'
    ? appointments
    : appointments.filter(a => a.status === activeTab)

  const counts: Record<FilterTab, number> = {
    all: appointments.length,
    pending: appointments.filter(a => a.status === 'pending').length,
    confirmed: appointments.filter(a => a.status === 'confirmed').length,
    completed: appointments.filter(a => a.status === 'completed').length,
    cancelled: appointments.filter(a => a.status === 'cancelled').length,
  }

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
            <CalendarDays className="w-5 h-5 text-brand-500" />
          </div>
          <h1 className="text-xl font-black text-th-fg">Randevularım</h1>
        </div>

        {/* Ozet Kartlari */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { key: 'pending', label: 'Bekleyen', color: 'text-amber-400', bg: 'bg-amber-400/10' },
            { key: 'confirmed', label: 'Onaylandı', color: 'text-sky-400', bg: 'bg-sky-400/10' },
            { key: 'completed', label: 'Tamamlandı', color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
            { key: 'cancelled', label: 'İptal', color: 'text-red-400', bg: 'bg-red-400/10' },
          ].map(s => (
            <div key={s.key} className="glass-card rounded-xl p-4 border border-th-border/[0.06] hover:-translate-y-0.5 transition-transform duration-200">
              <div className={`w-10 h-10 rounded-lg ${s.bg} flex items-center justify-center mb-3`}>
                <CalendarDays className={`w-5 h-5 ${s.color}`} />
              </div>
              <div className={`text-2xl font-black ${s.color}`}>{counts[s.key as FilterTab]}</div>
              <div className="text-xs text-th-fg-muted mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filtre Tablari */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          {tabOptions.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm whitespace-nowrap transition-all duration-200 border flex-shrink-0 ${
                activeTab === tab.key
                  ? 'bg-th-fg text-th-bg border-th-fg'
                  : 'bg-th-overlay/5 border-th-border/[0.08] text-th-fg-muted hover:bg-th-overlay/10 hover:text-th-fg'
              }`}
            >
              {tab.label}
              <span className={`px-1.5 py-0.5 rounded-full text-xs font-bold ${
                activeTab === tab.key
                  ? 'bg-brand-500 text-surface-900'
                  : 'bg-th-overlay/10 text-th-fg-muted'
              }`}>
                {counts[tab.key]}
              </span>
            </button>
          ))}
        </div>

        {/* Randevu Listesi */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 rounded-2xl bg-th-overlay/5 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center border border-dashed border-th-border/20">
            <div className="w-16 h-16 rounded-full bg-brand-500/10 flex items-center justify-center mx-auto mb-4">
              <CalendarDays className="w-8 h-8 text-brand-500/50" />
            </div>
            <h3 className="text-base font-bold text-th-fg mb-2">Randevu bulunamadı</h3>
            <p className="text-sm text-th-fg-muted">
              {activeTab === 'all' ? 'Henüz randevunuz bulunmuyor.' : `${tabOptions.find(t => t.key === activeTab)?.label} randevunuz bulunmuyor.`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(apt => {
              const sc = statusConfig[apt.status] || statusConfig.pending
              return (
                <div
                  key={apt.id}
                  className="glass-card rounded-2xl overflow-hidden border border-th-border/[0.06] hover:border-brand-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card group"
                >
                  {/* Durum Cubugu */}
                  <div className={`h-1 w-full ${sc.dotClass}`} />

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-base font-bold text-th-fg truncate">{apt.serviceName}</h3>
                        </div>
                        {apt.category && (
                          <span className="inline-block text-xs font-semibold text-brand-500 bg-brand-500/10 px-2 py-0.5 rounded-full mb-2">
                            {apt.category}
                          </span>
                        )}
                      </div>

                      <span className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${sc.badgeClass}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${sc.dotClass}`} />
                        {sc.label}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                      {apt.date && (
                        <div className="flex items-center gap-2">
                          <CalendarDays className="w-3.5 h-3.5 text-brand-500 flex-shrink-0" />
                          <span className="text-xs text-th-fg-sub">{formatDate(apt.date)}</span>
                        </div>
                      )}
                      {apt.timeSlot && (
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-th-fg-muted flex-shrink-0" />
                          <span className="text-xs text-th-fg-sub">{apt.timeSlot}</span>
                        </div>
                      )}
                      {apt.serviceAddress && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-th-fg-muted flex-shrink-0" />
                          <span className="text-xs text-th-fg-muted truncate">{apt.serviceAddress}</span>
                        </div>
                      )}
                      {apt.vehicle && (
                        <div className="flex items-center gap-2">
                          <Wrench className="w-3.5 h-3.5 text-th-fg-muted flex-shrink-0" />
                          <span className="text-xs text-th-fg-muted">{apt.vehicle}</span>
                        </div>
                      )}
                    </div>

                    {apt.note && (
                      <div className="mt-3 pt-3 border-t border-th-border/[0.06]">
                        <p className="text-xs text-th-fg-muted italic line-clamp-2">{apt.note}</p>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
