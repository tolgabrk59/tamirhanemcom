'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  MapPin,
  Car,
  Wallet,
  StickyNote,
  FileText,
  XCircle,
  Star,
  CheckCircle2,
  Timer,
  Ban,
  CheckCheck,
  Loader2,
  CalendarX2,
  CalendarClock,
  Wrench,
  Hourglass,
  UserX,
  CreditCard,
  ShieldX,
  CircleDot,
  RefreshCcw,
} from 'lucide-react'
import { cn } from '@/lib/utils'

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

// Mobil referans: 10 durum
type AppointmentStatus =
  | 'pending'
  | 'date_proposed'
  | 'confirmed'
  | 'in_progress'
  | 'waiting_process'
  | 'completed'
  | 'cancelled'
  | 'rejected'
  | 'no_show'
  | 'awaiting_payment'

interface Appointment {
  id: number
  serviceName: string
  serviceAddress: string
  servicePhone: string
  category: string
  date: string
  timeSlot: string
  status: AppointmentStatus
  rawStatus: string
  note: string
  cancelReason: string
  vehicleBrand: string
  vehicleModel: string
  vehiclePlate: string
  offerPrice: number
  isOfferRequest: boolean
  hasUserRated: boolean
  createdAt: string
  serviceId: number | null
}

type FilterTab = 'all' | 'active' | 'completed' | 'cancelled'

// ─── İptal Ceza Şartları (apphakan referans — 4 kademeli) ───
// >24h=%100 iade | 6-24h=%70 iade | 3-6h=%50 iade | <3h=%0 + ücretsiz randevu
function getCancelPenalty(appointmentDate: string, timeSlot: string): {
  hoursLeft: number
  refundPercent: number
  penaltyLevel: 'free' | 'partial_high' | 'partial' | 'full'
  canChoose: boolean
  hasRebookingRight: boolean
  title: string
  description: string
  color: string
} {
  try {
    const dateStr = appointmentDate
    const time = timeSlot?.split('-')[0]?.trim() || '00:00'
    const aptDate = new Date(`${dateStr}T${time}:00`)
    const now = new Date()
    const hoursLeft = (aptDate.getTime() - now.getTime()) / (1000 * 60 * 60)

    if (hoursLeft <= 0) {
      return { hoursLeft, refundPercent: 0, penaltyLevel: 'full', canChoose: false, hasRebookingRight: true, title: 'Randevu Saati Geçmiş', description: 'Randevu saati geçmiş veya başlamış. İade yapılmayacaktır, ancak 24 saat içinde aynı servisten ücretsiz yeniden randevu alabilirsiniz.', color: 'red' }
    } else if (hoursLeft < 3) {
      return { hoursLeft, refundPercent: 0, penaltyLevel: 'full', canChoose: false, hasRebookingRight: true, title: 'İade Yapılamaz', description: `Randevuya ${Math.max(0, Math.floor(hoursLeft))} saat kaldı. Cüzdan iadesi yapılmayacaktır, ancak 24 saat içinde aynı servisten ücretsiz yeniden randevu alabilirsiniz.`, color: 'red' }
    } else if (hoursLeft <= 6) {
      return { hoursLeft, refundPercent: 50, penaltyLevel: 'partial', canChoose: true, hasRebookingRight: true, title: 'Kısmi İade veya Ücretsiz Randevu', description: `Randevuya ${Math.floor(hoursLeft)} saat kaldı. Aşağıdan tercih seçeneğinizi belirleyin.`, color: 'amber' }
    } else if (hoursLeft <= 24) {
      return { hoursLeft, refundPercent: 70, penaltyLevel: 'partial_high', canChoose: true, hasRebookingRight: true, title: 'Kısmi İade veya Ücretsiz Randevu', description: `Randevuya ${Math.floor(hoursLeft)} saat kaldı. Aşağıdan tercih seçeneğinizi belirleyin.`, color: 'amber' }
    } else {
      return { hoursLeft, refundPercent: 100, penaltyLevel: 'free', canChoose: false, hasRebookingRight: false, title: 'Ücretsiz İptal', description: 'Randevuya 24 saatten fazla süre var. İptal durumunda tam iade yapılır.', color: 'emerald' }
    }
  } catch {
    return { hoursLeft: 999, refundPercent: 100, penaltyLevel: 'free', canChoose: false, hasRebookingRight: false, title: 'Ücretsiz İptal', description: 'İptal durumunda tam iade yapılır.', color: 'emerald' }
  }
}

// ─── İptal Sebepleri (apphakan referans) ───
const CANCEL_REASONS = [
  { key: 'plans_changed', label: 'Planlarım değişti' },
  { key: 'vehicle_issue', label: 'Aracımla ilgili sorun çıktı' },
  { key: 'wrong_datetime', label: 'Yanlış tarih/saat seçtim' },
  { key: 'found_alternative', label: 'Alternatif servis buldum' },
  { key: 'financial', label: 'Maddi sebepler' },
  { key: 'other', label: 'Diğer' },
]

// ─── Status Config — 10 Durum (Mobil referans) ───
const statusConfig: Record<AppointmentStatus, {
  label: string
  icon: React.ReactNode
  badgeClass: string
  dotClass: string
  barClass: string
  step: number // Visual stepper: 1-5
}> = {
  pending: {
    label: 'Beklemede',
    icon: <Timer className="w-3.5 h-3.5" />,
    badgeClass: 'bg-amber-400/10 border border-amber-400/20 text-amber-400',
    dotClass: 'bg-amber-400',
    barClass: 'bg-amber-400',
    step: 1,
  },
  date_proposed: {
    label: 'Tarih Belirlendi',
    icon: <CalendarClock className="w-3.5 h-3.5" />,
    badgeClass: 'bg-violet-400/10 border border-violet-400/20 text-violet-400',
    dotClass: 'bg-violet-400',
    barClass: 'bg-violet-400',
    step: 2,
  },
  confirmed: {
    label: 'Onaylandı',
    icon: <CheckCheck className="w-3.5 h-3.5" />,
    badgeClass: 'bg-sky-400/10 border border-sky-400/20 text-sky-400',
    dotClass: 'bg-sky-400',
    barClass: 'bg-sky-400',
    step: 3,
  },
  waiting_process: {
    label: 'İşlem Bekliyor',
    icon: <Hourglass className="w-3.5 h-3.5" />,
    badgeClass: 'bg-orange-400/10 border border-orange-400/20 text-orange-400',
    dotClass: 'bg-orange-400',
    barClass: 'bg-orange-400',
    step: 3,
  },
  in_progress: {
    label: 'İşlem Başladı',
    icon: <Wrench className="w-3.5 h-3.5" />,
    badgeClass: 'bg-blue-400/10 border border-blue-400/20 text-blue-400',
    dotClass: 'bg-blue-400',
    barClass: 'bg-blue-400',
    step: 4,
  },
  completed: {
    label: 'Tamamlandı',
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    badgeClass: 'bg-emerald-400/10 border border-emerald-400/20 text-emerald-400',
    dotClass: 'bg-emerald-400',
    barClass: 'bg-emerald-400',
    step: 5,
  },
  cancelled: {
    label: 'İptal Edildi',
    icon: <Ban className="w-3.5 h-3.5" />,
    badgeClass: 'bg-red-400/10 border border-red-400/20 text-red-400',
    dotClass: 'bg-red-400',
    barClass: 'bg-red-400',
    step: -1,
  },
  rejected: {
    label: 'Reddedildi',
    icon: <ShieldX className="w-3.5 h-3.5" />,
    badgeClass: 'bg-rose-400/10 border border-rose-400/20 text-rose-400',
    dotClass: 'bg-rose-400',
    barClass: 'bg-rose-400',
    step: -1,
  },
  no_show: {
    label: 'Gelmedi',
    icon: <UserX className="w-3.5 h-3.5" />,
    badgeClass: 'bg-slate-400/10 border border-slate-400/20 text-slate-400',
    dotClass: 'bg-slate-400',
    barClass: 'bg-slate-400',
    step: -1,
  },
  awaiting_payment: {
    label: 'Ödeme Bekliyor',
    icon: <CreditCard className="w-3.5 h-3.5" />,
    badgeClass: 'bg-yellow-400/10 border border-yellow-400/20 text-yellow-400',
    dotClass: 'bg-yellow-400',
    barClass: 'bg-yellow-400',
    step: 4,
  },
}

// Filtre tab'ları — kullanıcı dostu gruplar
const tabOptions: { key: FilterTab; label: string }[] = [
  { key: 'all', label: 'Tümü' },
  { key: 'active', label: 'Aktif' },
  { key: 'completed', label: 'Tamamlanan' },
  { key: 'cancelled', label: 'İptal / Red' },
]

// Aktif statüler
const ACTIVE_STATUSES: AppointmentStatus[] = ['pending', 'date_proposed', 'confirmed', 'in_progress', 'waiting_process', 'awaiting_payment']
const CANCELLED_STATUSES: AppointmentStatus[] = ['cancelled', 'rejected', 'no_show']

// ─── Visual Stepper (Mobil referans: TALEP→PLAN→ONAY→İŞLEM→TESLİM) ───
const STEP_LABELS = ['Talep', 'Plan', 'Onay', 'İşlem', 'Teslim']

function VisualStepper({ currentStep, isCancelled }: { currentStep: number; isCancelled: boolean }) {
  return (
    <div className="flex items-center gap-1 w-full">
      {STEP_LABELS.map((label, i) => {
        const stepNum = i + 1
        const isActive = !isCancelled && currentStep >= stepNum
        const isCurrent = !isCancelled && currentStep === stepNum

        return (
          <div key={label} className="flex items-center gap-1 flex-1">
            <div className="flex flex-col items-center gap-1 flex-1">
              <div
                className={cn(
                  'w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all',
                  isCancelled
                    ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                    : isActive
                      ? 'bg-brand-500 text-brand-950'
                      : 'bg-th-overlay/10 text-th-fg-muted border border-th-border/10'
                )}
              >
                {isCancelled && stepNum === 1 ? <XCircle className="w-3 h-3" /> : stepNum}
              </div>
              <span className={cn(
                'text-[9px] font-semibold whitespace-nowrap',
                isCurrent ? 'text-brand-500' : isActive ? 'text-th-fg-sub' : 'text-th-fg-muted/50'
              )}>
                {label}
              </span>
            </div>
            {i < STEP_LABELS.length - 1 && (
              <div className={cn(
                'h-0.5 flex-1 rounded-full -mt-4',
                !isCancelled && currentStep > stepNum ? 'bg-brand-500' : 'bg-th-border/10'
              )} />
            )}
          </div>
        )
      })}
    </div>
  )
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  } catch {
    return dateStr || 'Belirtilmemiş'
  }
}

function formatCurrency(amount: number): string {
  return amount.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY', minimumFractionDigits: 0, maximumFractionDigits: 0 })
}

export default function RandevularPage() {
  const router = useRouter()
  const [user, setUser] = useState<ThUser | null>(null)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<FilterTab>('all')

  // İptal Modalı
  const [cancelTarget, setCancelTarget] = useState<Appointment | null>(null)
  const [cancelReason, setCancelReason] = useState('')
  const [selectedCancelReason, setSelectedCancelReason] = useState('')
  const [cancelChoice, setCancelChoice] = useState<'wallet_refund' | 'free_rebooking' | null>(null)
  const [cancelling, setCancelling] = useState(false)

  // Değerlendirme Modalı
  const [ratingTarget, setRatingTarget] = useState<Appointment | null>(null)
  const [rating, setRating] = useState(0)
  const [ratingHover, setRatingHover] = useState(0)
  const [ratingComment, setRatingComment] = useState('')
  const [submittingRating, setSubmittingRating] = useState(false)

  // Tarih Teklifi Kabul/Red Modalı
  const [offerTarget, setOfferTarget] = useState<Appointment | null>(null)
  const [offerProcessing, setOfferProcessing] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('tamirhanem_user')
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
        setAppointments(raw.map((a: Record<string, unknown>) => ({
          id: a.id as number,
          serviceName: String(a.serviceName || 'Servis'),
          serviceAddress: String(a.serviceAddress || ''),
          servicePhone: String(a.servicePhone || ''),
          category: String(a.categoryName || ''),
          date: String(a.appointmentDate || ''),
          timeSlot: String(a.timeSlot || ''),
          status: String(a.status || 'pending') as AppointmentStatus,
          rawStatus: String(a.rawStatus || ''),
          note: String(a.note || ''),
          cancelReason: String(a.cancelReason || ''),
          vehicleBrand: String(a.vehicleBrand || ''),
          vehicleModel: String(a.vehicleModel || ''),
          vehiclePlate: String(a.vehiclePlate || ''),
          offerPrice: Number(a.offerPrice || 0),
          isOfferRequest: Boolean(a.isOfferRequest),
          hasUserRated: Boolean(a.hasUserRated),
          createdAt: String(a.createdAt || ''),
          serviceId: (a.serviceId as number) || null,
        })))
      }
    } catch {
      // API hazır değil
    } finally {
      setLoading(false)
    }
  }

  // ─── İptal (apphakan mantığı: cancelChoice + 4 kademeli ceza) ───
  const handleCancel = async () => {
    if (!user || !cancelTarget) return

    // Seçenek gerektiren aralıkta seçim yapılmadıysa uyar
    const penalty = getCancelPenalty(cancelTarget.date, cancelTarget.timeSlot)
    if (penalty.canChoose && !cancelChoice) return

    setCancelling(true)
    try {
      const reasonObj = CANCEL_REASONS.find(r => r.key === selectedCancelReason)
      const reason = selectedCancelReason === 'other'
        ? cancelReason.trim()
        : (reasonObj?.label || '') + (cancelReason.trim() ? ` - ${cancelReason.trim()}` : '')

      // Teklif reddi ayrı endpoint, iptal apphakan gibi POST /appointments/{id}/cancel
      if (cancelTarget.status === 'date_proposed' && cancelTarget.isOfferRequest) {
        const res = await fetch('/api/user/appointments', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ jwt: user.jwt, id: cancelTarget.id, action: 'reject-offer', cancelReason: reason }),
        })
        const data = await res.json()
        if (data.success) {
          setAppointments(prev => prev.map(a => a.id === cancelTarget.id ? { ...a, status: 'rejected' as AppointmentStatus } : a))
        }
      } else {
        // apphakan ile aynı: POST /api/user/appointments/{id}/cancel
        const res = await fetch(`/api/user/appointments/${cancelTarget.id}/cancel`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jwt: user.jwt,
            cancelReason: reason,
            cancelReasonKey: selectedCancelReason,
            ...(cancelChoice ? { cancelChoice } : {}),
          }),
        })
        const data = await res.json()
        if (data.success) {
          setAppointments(prev => prev.map(a => a.id === cancelTarget.id ? { ...a, status: 'cancelled' as AppointmentStatus } : a))
        }
      }
      setCancelTarget(null)
      setCancelReason('')
      setSelectedCancelReason('')
      setCancelChoice(null)
    } catch { /* */ }
    finally { setCancelling(false) }
  }

  // ─── Değerlendirme ───
  const handleRating = async () => {
    if (!user || !ratingTarget || rating === 0) return
    setSubmittingRating(true)
    try {
      const res = await fetch('/api/user/ratings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jwt: user.jwt,
          appointmentId: ratingTarget.id,
          rating,
          comment: ratingComment.trim(),
        }),
      })
      const data = await res.json()
      if (data.success) {
        setAppointments(prev => prev.map(a =>
          a.id === ratingTarget.id ? { ...a, hasUserRated: true } : a
        ))
      }
      setRatingTarget(null)
      setRating(0)
      setRatingComment('')
    } catch { /* */ }
    finally { setSubmittingRating(false) }
  }

  // ─── Tarih Teklifi Kabul/Red ───
  const handleOfferAction = async (accept: boolean) => {
    if (!user || !offerTarget) return
    setOfferProcessing(true)
    try {
      const res = await fetch('/api/user/appointments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jwt: user.jwt,
          id: offerTarget.id,
          action: accept ? 'accept' : 'reject-offer',
        }),
      })
      const data = await res.json()
      if (data.success) {
        setAppointments(prev => prev.map(a =>
          a.id === offerTarget.id
            ? { ...a, status: (accept ? 'confirmed' : 'rejected') as AppointmentStatus }
            : a
        ))
      }
      setOfferTarget(null)
    } catch { /* */ }
    finally { setOfferProcessing(false) }
  }

  if (!user) return null

  // ─── Filtreleme ───
  const filtered = (() => {
    switch (activeTab) {
      case 'active': return appointments.filter(a => ACTIVE_STATUSES.includes(a.status))
      case 'completed': return appointments.filter(a => a.status === 'completed')
      case 'cancelled': return appointments.filter(a => CANCELLED_STATUSES.includes(a.status))
      default: return appointments
    }
  })()

  const counts: Record<FilterTab, number> = {
    all: appointments.length,
    active: appointments.filter(a => ACTIVE_STATUSES.includes(a.status)).length,
    completed: appointments.filter(a => a.status === 'completed').length,
    cancelled: appointments.filter(a => CANCELLED_STATUSES.includes(a.status)).length,
  }

  // İptal edilebilir durumlar
  const canCancel = (s: AppointmentStatus) => ['pending', 'date_proposed', 'confirmed'].includes(s)
  // Değerlendirilebilir durumlar
  const canRate = (apt: Appointment) => apt.status === 'completed' && !apt.hasUserRated
  // Teklif kabul/red edilebilir
  const canRespondOffer = (apt: Appointment) => apt.status === 'date_proposed'

  return (
    <main className="min-h-screen bg-th-bg pt-20 pb-24 lg:pb-8 lg:pl-16 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

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

        {/* Özet Kartları */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {([
            { key: 'active' as FilterTab, label: 'Aktif', color: 'text-sky-400', bg: 'bg-sky-400/10', icon: <CircleDot className="w-5 h-5 text-sky-400" /> },
            { key: 'completed' as FilterTab, label: 'Tamamlanan', color: 'text-emerald-400', bg: 'bg-emerald-400/10', icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" /> },
            { key: 'cancelled' as FilterTab, label: 'İptal / Red', color: 'text-red-400', bg: 'bg-red-400/10', icon: <Ban className="w-5 h-5 text-red-400" /> },
            { key: 'all' as FilterTab, label: 'Toplam', color: 'text-th-fg', bg: 'bg-th-overlay/10', icon: <CalendarDays className="w-5 h-5 text-th-fg-muted" /> },
          ]).map(s => (
            <button
              key={s.key}
              onClick={() => setActiveTab(s.key)}
              className={cn(
                'glass-card rounded-xl p-4 border transition-all duration-200 hover:-translate-y-0.5 text-left',
                activeTab === s.key ? 'border-brand-500/30 bg-brand-500/[0.03]' : 'border-th-border/[0.06]'
              )}
            >
              <div className={`w-10 h-10 rounded-lg ${s.bg} flex items-center justify-center mb-3`}>
                {s.icon}
              </div>
              <div className={`text-2xl font-black ${s.color}`}>{counts[s.key]}</div>
              <div className="text-xs text-th-fg-muted mt-1">{s.label}</div>
            </button>
          ))}
        </div>

        {/* Filtre Tab'ları */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          {tabOptions.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm whitespace-nowrap transition-all duration-200 border flex-shrink-0',
                activeTab === tab.key
                  ? 'bg-th-fg text-th-bg border-th-fg'
                  : 'bg-th-overlay/5 border-th-border/[0.08] text-th-fg-muted hover:bg-th-overlay/10 hover:text-th-fg'
              )}
            >
              {tab.label}
              <span className={cn(
                'px-1.5 py-0.5 rounded-full text-xs font-bold',
                activeTab === tab.key
                  ? 'bg-brand-500 text-surface-900'
                  : 'bg-th-overlay/10 text-th-fg-muted'
              )}>
                {counts[tab.key]}
              </span>
            </button>
          ))}
        </div>

        {/* Randevu Listesi */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-6 h-6 text-brand-500 animate-spin mb-3" />
            <p className="text-sm text-th-fg-muted">Randevular yükleniyor...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center border border-dashed border-th-border/20">
            <div className="w-16 h-16 rounded-full bg-brand-500/10 flex items-center justify-center mx-auto mb-4">
              <CalendarX2 className="w-8 h-8 text-brand-500/50" />
            </div>
            <h3 className="text-base font-bold text-th-fg mb-2">Randevu bulunamadı</h3>
            <p className="text-sm text-th-fg-muted">
              {activeTab === 'all'
                ? 'Henüz randevunuz bulunmuyor.'
                : `${tabOptions.find(t => t.key === activeTab)?.label} randevunuz bulunmuyor.`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(apt => {
              const sc = statusConfig[apt.status] || statusConfig.pending
              const vehicleInfo = apt.vehicleBrand && apt.vehicleModel
                ? `${apt.vehicleBrand} ${apt.vehicleModel}${apt.vehiclePlate ? ` (${apt.vehiclePlate})` : ''}`
                : null
              const isCancelledGroup = CANCELLED_STATUSES.includes(apt.status)

              return (
                <div
                  key={apt.id}
                  className="glass-card rounded-2xl overflow-hidden border border-th-border/[0.06] hover:border-brand-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card"
                >
                  {/* Durum Çubuğu */}
                  <div className={`h-1 w-full ${sc.barClass}`} />

                  <div className="p-5">
                    {/* Header: Servis + Durum Badge */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center flex-shrink-0">
                          <CalendarDays className="w-5 h-5 text-brand-500" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-base font-bold text-th-fg truncate">{apt.serviceName}</h3>
                          {apt.serviceAddress && (
                            <p className="text-xs text-th-fg-muted flex items-center gap-1 mt-0.5 truncate">
                              <MapPin className="w-3 h-3 flex-shrink-0" />
                              {apt.serviceAddress}
                            </p>
                          )}
                        </div>
                      </div>
                      <span className={cn(
                        'flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5',
                        sc.badgeClass
                      )}>
                        {sc.icon}
                        {sc.label}
                      </span>
                    </div>

                    {/* Visual Stepper */}
                    <div className="mb-4 px-1">
                      <VisualStepper currentStep={sc.step} isCancelled={isCancelledGroup} />
                    </div>

                    {/* Kategori */}
                    {apt.category && (
                      <span className="inline-block text-xs font-semibold text-brand-500 bg-brand-500/10 px-2.5 py-1 rounded-full mb-4">
                        {apt.category}
                      </span>
                    )}

                    {/* Info Grid */}
                    <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-th-overlay/[0.03] border border-th-border/[0.04]">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-semibold text-th-fg-muted uppercase tracking-wider flex items-center gap-1.5">
                          <CalendarDays className="w-3 h-3 text-brand-500" />
                          Tarih
                        </span>
                        <span className="text-sm font-bold text-th-fg">{apt.date ? formatDate(apt.date) : 'Belirtilmemiş'}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-semibold text-th-fg-muted uppercase tracking-wider flex items-center gap-1.5">
                          <Clock className="w-3 h-3 text-th-fg-muted" />
                          Saat
                        </span>
                        <span className="text-sm font-bold text-th-fg">{apt.timeSlot || 'Belirtilmemiş'}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-semibold text-th-fg-muted uppercase tracking-wider flex items-center gap-1.5">
                          <Car className="w-3 h-3 text-th-fg-muted" />
                          Araç
                        </span>
                        <span className="text-sm font-bold text-th-fg truncate">
                          {vehicleInfo || <span className="text-th-fg-muted font-normal">Araç seçilmedi</span>}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-semibold text-th-fg-muted uppercase tracking-wider flex items-center gap-1.5">
                          <Wallet className="w-3 h-3 text-th-fg-muted" />
                          Ücret
                        </span>
                        <span className="text-sm font-bold text-th-fg">
                          {apt.offerPrice > 0 ? formatCurrency(apt.offerPrice) : <span className="text-th-fg-muted font-normal">Belirlenmedi</span>}
                        </span>
                      </div>
                    </div>

                    {/* Not */}
                    {apt.note && (
                      <div className="mt-4 pt-3 border-t border-th-border/[0.06] flex items-start gap-2">
                        <StickyNote className="w-3.5 h-3.5 text-th-fg-muted flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-th-fg-muted italic line-clamp-2">{apt.note}</p>
                      </div>
                    )}

                    {/* Aksiyon Butonları */}
                    <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-th-border/[0.06]">
                      <button
                        onClick={() => router.push(`/profilim/randevular/${apt.id}`)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-th-overlay/5 border border-th-border/[0.08] text-th-fg-sub hover:text-th-fg hover:bg-th-overlay/10 transition-all"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        Detay
                      </button>

                      {/* Tarih Teklifi: Kabul/Red */}
                      {canRespondOffer(apt) && (
                        <button
                          onClick={(e) => { e.stopPropagation(); setOfferTarget(apt) }}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-violet-500/10 border border-violet-500/20 text-violet-400 hover:bg-violet-500/15 transition-all"
                        >
                          <CalendarClock className="w-3.5 h-3.5" />
                          Tarihi Onayla
                        </button>
                      )}

                      {/* İptal Et */}
                      {canCancel(apt.status) && (
                        <button
                          onClick={(e) => { e.stopPropagation(); setCancelTarget(apt) }}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-red-500/5 border border-red-500/10 text-red-400 hover:bg-red-500/10 transition-all"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          İptal Et
                        </button>
                      )}

                      {/* Değerlendir */}
                      {canRate(apt) && (
                        <button
                          onClick={(e) => { e.stopPropagation(); setRatingTarget(apt) }}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-brand-500/10 border border-brand-500/20 text-brand-500 hover:bg-brand-500/15 transition-all"
                        >
                          <Star className="w-3.5 h-3.5" />
                          Değerlendir
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* ─── İptal Modalı (apphakan: 4 kademeli ceza + cancelChoice seçenekleri) ─── */}
      {cancelTarget && (() => {
        const penalty = getCancelPenalty(cancelTarget.date, cancelTarget.timeSlot)
        const needsChoice = penalty.canChoose
        const isDisabled = cancelling || !selectedCancelReason || (selectedCancelReason === 'other' && !cancelReason.trim()) || (needsChoice && !cancelChoice)
        return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => { setCancelTarget(null); setSelectedCancelReason(''); setCancelReason(''); setCancelChoice(null) }}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative bg-th-bg rounded-2xl border border-th-border/[0.08] shadow-2xl w-full max-w-md p-6 animate-fade-in max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                <XCircle className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-th-fg">Randevuyu İptal Et</h3>
                <p className="text-xs text-th-fg-muted">{cancelTarget.serviceName}</p>
              </div>
            </div>
            <p className="text-sm text-th-fg-muted mb-4">Bu randevuyu iptal etmek istediğinize emin misiniz? Bu işlem geri alınamaz.</p>

            {/* Ceza Uyarısı */}
            <div className={cn(
              'p-4 rounded-xl border mb-4',
              penalty.penaltyLevel === 'free' ? 'bg-emerald-500/5 border-emerald-500/15' :
              (penalty.penaltyLevel === 'partial' || penalty.penaltyLevel === 'partial_high') ? 'bg-amber-500/5 border-amber-500/15' :
              'bg-red-500/5 border-red-500/15'
            )}>
              <div className="flex items-center gap-2 mb-1.5">
                {penalty.penaltyLevel === 'free' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> :
                 (penalty.penaltyLevel === 'partial' || penalty.penaltyLevel === 'partial_high') ? <Timer className="w-4 h-4 text-amber-400" /> :
                 <Ban className="w-4 h-4 text-red-400" />}
                <span className={cn('text-sm font-bold',
                  penalty.penaltyLevel === 'free' ? 'text-emerald-400' :
                  (penalty.penaltyLevel === 'partial' || penalty.penaltyLevel === 'partial_high') ? 'text-amber-400' : 'text-red-400'
                )}>{penalty.title}</span>
                {cancelTarget.offerPrice > 0 && penalty.refundPercent > 0 && penalty.refundPercent < 100 && (
                  <span className="text-xs font-bold ml-auto text-th-fg-muted">
                    İade: {formatCurrency(cancelTarget.offerPrice * penalty.refundPercent / 100)}
                  </span>
                )}
              </div>
              <p className="text-xs text-th-fg-muted leading-relaxed">{penalty.description}</p>
            </div>

            {/* ─── İade Tercihi Seçenekleri (3-24 saat arası) ─── */}
            {needsChoice && (
              <div className="space-y-2 mb-4">
                <p className="text-xs font-semibold text-th-fg-muted uppercase tracking-wider">İade tercihiniz</p>
                {/* Cüzdan İadesi */}
                <button
                  onClick={() => setCancelChoice('wallet_refund')}
                  className={cn(
                    'w-full text-left px-4 py-3 rounded-xl border transition-all',
                    cancelChoice === 'wallet_refund'
                      ? 'bg-amber-500/10 border-amber-500/25'
                      : 'bg-th-overlay/5 border-th-border/[0.08] hover:bg-th-overlay/10'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', cancelChoice === 'wallet_refund' ? 'bg-amber-500 text-white' : 'bg-amber-500/15')}>
                      <Wallet className={cn('w-4 h-4', cancelChoice === 'wallet_refund' ? 'text-white' : 'text-amber-400')} />
                    </div>
                    <div className="flex-1">
                      <p className={cn('text-sm font-bold', cancelChoice === 'wallet_refund' ? 'text-amber-400' : 'text-th-fg')}>%{penalty.refundPercent} Cüzdan İadesi</p>
                      <p className="text-xs text-th-fg-muted">Hizmet tutarının %{penalty.refundPercent}&apos;{penalty.refundPercent === 70 ? 'i' : 'si'} cüzdanınıza iade edilir.</p>
                    </div>
                  </div>
                  {cancelChoice === 'wallet_refund' && cancelTarget.offerPrice > 0 && (
                    <div className="mt-2 ml-11 flex items-center gap-2">
                      <span className="text-xs text-th-fg-muted">İade tutarı:</span>
                      <span className="text-xs font-bold text-amber-400">{formatCurrency(cancelTarget.offerPrice * penalty.refundPercent / 100)}</span>
                    </div>
                  )}
                </button>
                {/* Ücretsiz Yeniden Randevu */}
                <button
                  onClick={() => setCancelChoice('free_rebooking')}
                  className={cn(
                    'w-full text-left px-4 py-3 rounded-xl border transition-all',
                    cancelChoice === 'free_rebooking'
                      ? 'bg-sky-500/10 border-sky-500/25'
                      : 'bg-th-overlay/5 border-th-border/[0.08] hover:bg-th-overlay/10'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', cancelChoice === 'free_rebooking' ? 'bg-sky-500 text-white' : 'bg-sky-500/15')}>
                      <RefreshCcw className={cn('w-4 h-4', cancelChoice === 'free_rebooking' ? 'text-white' : 'text-sky-400')} />
                    </div>
                    <div className="flex-1">
                      <p className={cn('text-sm font-bold', cancelChoice === 'free_rebooking' ? 'text-sky-400' : 'text-th-fg')}>Ücretsiz Yeniden Randevu</p>
                      <p className="text-xs text-th-fg-muted">24 saat içinde aynı servisten ücretsiz yeni randevu alabilirsiniz.</p>
                    </div>
                  </div>
                </button>
              </div>
            )}

            {/* Ücretsiz randevu hakkı bilgisi (<3 saat için) */}
            {!needsChoice && penalty.hasRebookingRight && (
              <div className="p-3 rounded-xl bg-sky-500/5 border border-sky-500/15 mb-4 flex items-start gap-2">
                <RefreshCcw className="w-4 h-4 text-sky-400 mt-0.5 shrink-0" />
                <p className="text-xs text-sky-300 leading-relaxed">24 saat içinde aynı servisten ücretsiz yeniden randevu alabilirsiniz.</p>
              </div>
            )}

            {/* İptal Sebepleri */}
            <div className="space-y-2 mb-4">
              <p className="text-xs font-semibold text-th-fg-muted uppercase tracking-wider">İptal sebebi</p>
              {CANCEL_REASONS.map(reason => (
                <button
                  key={reason.key}
                  onClick={() => setSelectedCancelReason(reason.key)}
                  className={cn(
                    'w-full text-left px-4 py-2.5 rounded-xl text-sm border transition-all',
                    selectedCancelReason === reason.key
                      ? 'bg-red-500/10 border-red-500/20 text-red-400 font-semibold'
                      : 'bg-th-overlay/5 border-th-border/[0.08] text-th-fg-sub hover:bg-th-overlay/10'
                  )}
                >
                  {reason.label}
                </button>
              ))}
            </div>

            {/* Ek Açıklama */}
            {selectedCancelReason && (
              <textarea
                value={cancelReason}
                onChange={e => setCancelReason(e.target.value)}
                placeholder={selectedCancelReason === 'other' ? 'Lütfen sebebinizi yazın...' : 'Ek açıklama (opsiyonel)...'}
                rows={3}
                className="w-full resize-none bg-th-overlay/5 border border-th-border/[0.08] rounded-xl px-4 py-3 text-sm text-th-fg placeholder:text-th-fg-muted/50 focus:outline-none focus:border-red-500/30 mb-4"
              />
            )}

            <div className="flex gap-3">
              <button onClick={() => { setCancelTarget(null); setSelectedCancelReason(''); setCancelReason(''); setCancelChoice(null) }} className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold bg-th-overlay/5 border border-th-border/[0.08] text-th-fg-sub hover:bg-th-overlay/10 transition-all">
                Vazgeç
              </button>
              <button
                onClick={handleCancel}
                disabled={isDisabled}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-bold bg-red-500 text-white hover:bg-red-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {cancelling ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                İptal Et
              </button>
            </div>
          </div>
        </div>
        )
      })()}

      {/* ─── Tarih Teklifi Kabul/Red Modalı ─── */}
      {offerTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setOfferTarget(null)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative bg-th-bg rounded-2xl border border-th-border/[0.08] shadow-2xl w-full max-w-md p-6 animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
                <CalendarClock className="w-5 h-5 text-violet-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-th-fg">Tarih Teklifi</h3>
                <p className="text-xs text-th-fg-muted">{offerTarget.serviceName}</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-th-overlay/[0.03] border border-th-border/[0.04] mb-4">
              <div className="flex items-center gap-2 mb-2">
                <CalendarDays className="w-4 h-4 text-brand-500" />
                <span className="text-sm font-bold text-th-fg">{offerTarget.date ? formatDate(offerTarget.date) : 'Belirtilmemiş'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-th-fg-muted" />
                <span className="text-sm font-bold text-th-fg">{offerTarget.timeSlot || 'Belirtilmemiş'}</span>
              </div>
            </div>

            <p className="text-sm text-th-fg-muted mb-4">Servis tarafından önerilen bu tarih ve saati onaylıyor musunuz?</p>

            <div className="flex gap-3">
              <button
                onClick={() => handleOfferAction(false)}
                disabled={offerProcessing}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/15 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {offerProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                Reddet
              </button>
              <button
                onClick={() => handleOfferAction(true)}
                disabled={offerProcessing}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-bold bg-brand-500 text-brand-950 hover:bg-brand-400 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {offerProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCheck className="w-4 h-4" />}
                Onayla
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Değerlendirme Modalı ─── */}
      {ratingTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setRatingTarget(null)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative bg-th-bg rounded-2xl border border-th-border/[0.08] shadow-2xl w-full max-w-md p-6 animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center">
                <Star className="w-5 h-5 text-brand-500" />
              </div>
              <div>
                <h3 className="text-base font-bold text-th-fg">Servisi Değerlendir</h3>
                <p className="text-xs text-th-fg-muted">{ratingTarget.serviceName}</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 my-6">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  onMouseEnter={() => setRatingHover(star)}
                  onMouseLeave={() => setRatingHover(0)}
                  onClick={() => setRating(star)}
                  className="transition-transform hover:scale-110"
                >
                  <Star className={cn('w-10 h-10 transition-all', (ratingHover || rating) >= star ? 'text-amber-400 fill-amber-400' : 'text-th-fg-muted/20')} />
                </button>
              ))}
            </div>
            <p className="text-center text-sm text-th-fg-muted mb-4">
              {rating === 0 ? 'Puanınızı seçin' : rating === 1 ? 'Çok Kötü' : rating === 2 ? 'Kötü' : rating === 3 ? 'Orta' : rating === 4 ? 'İyi' : 'Mükemmel'}
            </p>
            <textarea
              value={ratingComment}
              onChange={e => setRatingComment(e.target.value)}
              placeholder="Yorumunuz (opsiyonel)..."
              rows={3}
              className="w-full resize-none bg-th-overlay/5 border border-th-border/[0.08] rounded-xl px-4 py-3 text-sm text-th-fg placeholder:text-th-fg-muted/50 focus:outline-none focus:border-brand-500/30 mb-4"
            />
            <div className="flex gap-3">
              <button onClick={() => setRatingTarget(null)} className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold bg-th-overlay/5 border border-th-border/[0.08] text-th-fg-sub hover:bg-th-overlay/10 transition-all">
                Vazgeç
              </button>
              <button onClick={handleRating} disabled={rating === 0 || submittingRating} className="flex-1 px-4 py-2.5 rounded-xl text-sm font-bold bg-brand-500 text-brand-950 hover:bg-brand-400 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                {submittingRating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Star className="w-4 h-4" />}
                Gönder
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
