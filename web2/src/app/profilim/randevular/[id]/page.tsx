'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft, CalendarDays, Clock, MapPin, Car, Wallet, StickyNote,
  Phone, Building2, Tag, Timer, CheckCheck, CheckCircle2, Ban,
  XCircle, Star, Loader2, CalendarClock, Wrench, Hourglass, UserX,
  CreditCard, ShieldX, CircleDot,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface ThUser { id: number; username: string; jwt: string; name?: string }

type AppointmentStatus =
  | 'pending' | 'date_proposed' | 'confirmed' | 'in_progress'
  | 'waiting_process' | 'completed' | 'cancelled' | 'rejected'
  | 'no_show' | 'awaiting_payment'

interface AppointmentDetail {
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
  vehicleYear: string
  vehicleColor: string
  offerPrice: number
  isOfferRequest: boolean
  hasUserRated: boolean
  createdAt: string
  serviceId: number | null
}

function getCancelPenalty(appointmentDate: string, timeSlot: string): {
  hoursLeft: number; refundPercent: number; penaltyLevel: 'free' | 'partial' | 'full'; title: string; description: string
} {
  try {
    const time = timeSlot?.split('-')[0]?.trim() || '00:00'
    const aptDate = new Date(`${appointmentDate}T${time}:00`)
    const hoursLeft = (aptDate.getTime() - Date.now()) / (1000 * 60 * 60)
    if (hoursLeft > 24) return { hoursLeft, refundPercent: 100, penaltyLevel: 'free', title: 'Ücretsiz İptal', description: 'Randevuya 24 saatten fazla süre var. Tam iade yapılır.' }
    if (hoursLeft >= 3) return { hoursLeft, refundPercent: 50, penaltyLevel: 'partial', title: 'Kısmi İade', description: `Randevuya ${Math.floor(hoursLeft)} saat kaldı. %50 iade, %40 servise, %10 platform komisyonu.` }
    return { hoursLeft, refundPercent: 0, penaltyLevel: 'full', title: 'İade Yapılamaz', description: `3 saatten az kaldı. İade yapılamaz. 24 saat içinde aynı servisten ücretsiz yeni randevu alabilirsiniz.` }
  } catch { return { hoursLeft: 999, refundPercent: 100, penaltyLevel: 'free', title: 'Ücretsiz İptal', description: 'Tam iade yapılır.' } }
}

function formatCurrency(amount: number): string {
  return amount.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY', minimumFractionDigits: 0, maximumFractionDigits: 0 })
}

const CANCEL_REASONS = [
  'Başka bir servise gitmek istiyorum',
  'Tarih/saat uygun değil',
  'Fiyat beklentimi karşılamıyor',
  'Aracımı tamir ettirdim',
  'Randevuya gidemeyeceğim',
  'Sadece iptal etmek istiyorum',
  'Diğer',
]

const statusConfig: Record<AppointmentStatus, { label: string; icon: React.ReactNode; badgeClass: string; barClass: string; step: number }> = {
  pending: { label: 'Beklemede', icon: <Timer className="w-4 h-4" />, badgeClass: 'bg-amber-400/10 border border-amber-400/20 text-amber-400', barClass: 'bg-amber-400', step: 1 },
  date_proposed: { label: 'Tarih Belirlendi', icon: <CalendarClock className="w-4 h-4" />, badgeClass: 'bg-violet-400/10 border border-violet-400/20 text-violet-400', barClass: 'bg-violet-400', step: 2 },
  confirmed: { label: 'Onaylandı', icon: <CheckCheck className="w-4 h-4" />, badgeClass: 'bg-sky-400/10 border border-sky-400/20 text-sky-400', barClass: 'bg-sky-400', step: 3 },
  waiting_process: { label: 'İşlem Bekliyor', icon: <Hourglass className="w-4 h-4" />, badgeClass: 'bg-orange-400/10 border border-orange-400/20 text-orange-400', barClass: 'bg-orange-400', step: 3 },
  in_progress: { label: 'İşlem Başladı', icon: <Wrench className="w-4 h-4" />, badgeClass: 'bg-blue-400/10 border border-blue-400/20 text-blue-400', barClass: 'bg-blue-400', step: 4 },
  completed: { label: 'Tamamlandı', icon: <CheckCircle2 className="w-4 h-4" />, badgeClass: 'bg-emerald-400/10 border border-emerald-400/20 text-emerald-400', barClass: 'bg-emerald-400', step: 5 },
  cancelled: { label: 'İptal Edildi', icon: <Ban className="w-4 h-4" />, badgeClass: 'bg-red-400/10 border border-red-400/20 text-red-400', barClass: 'bg-red-400', step: -1 },
  rejected: { label: 'Reddedildi', icon: <ShieldX className="w-4 h-4" />, badgeClass: 'bg-rose-400/10 border border-rose-400/20 text-rose-400', barClass: 'bg-rose-400', step: -1 },
  no_show: { label: 'Gelmedi', icon: <UserX className="w-4 h-4" />, badgeClass: 'bg-slate-400/10 border border-slate-400/20 text-slate-400', barClass: 'bg-slate-400', step: -1 },
  awaiting_payment: { label: 'Ödeme Bekliyor', icon: <CreditCard className="w-4 h-4" />, badgeClass: 'bg-yellow-400/10 border border-yellow-400/20 text-yellow-400', barClass: 'bg-yellow-400', step: 4 },
}

const STEP_LABELS = ['Talep', 'Plan', 'Onay', 'İşlem', 'Teslim']
const CANCELLED_STATUSES: AppointmentStatus[] = ['cancelled', 'rejected', 'no_show']

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
              <div className={cn(
                'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all',
                isCancelled ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                  : isActive ? 'bg-brand-500 text-brand-950'
                  : 'bg-th-overlay/10 text-th-fg-muted border border-th-border/10'
              )}>
                {isCancelled && stepNum === 1 ? <XCircle className="w-3.5 h-3.5" /> : stepNum}
              </div>
              <span className={cn('text-[10px] font-semibold whitespace-nowrap',
                isCurrent ? 'text-brand-500' : isActive ? 'text-th-fg-sub' : 'text-th-fg-muted/50'
              )}>{label}</span>
            </div>
            {i < STEP_LABELS.length - 1 && (
              <div className={cn('h-0.5 flex-1 rounded-full -mt-5',
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
  try { return new Date(dateStr).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', weekday: 'long' }) } catch { return dateStr || 'Belirtilmemiş' }
}

export default function RandevuDetayPage({ params }: { params: { id: string } }) {
  const { id } = params
  const router = useRouter()
  const [user, setUser] = useState<ThUser | null>(null)
  const [apt, setApt] = useState<AppointmentDetail | null>(null)
  const [loading, setLoading] = useState(true)

  // İptal Modalı
  const [cancelModal, setCancelModal] = useState(false)
  const [cancelReason, setCancelReason] = useState('')
  const [selectedCancelReason, setSelectedCancelReason] = useState('')
  const [cancelling, setCancelling] = useState(false)

  // Değerlendirme Modalı
  const [ratingModal, setRatingModal] = useState(false)
  const [rating, setRating] = useState(0)
  const [ratingHover, setRatingHover] = useState(0)
  const [ratingComment, setRatingComment] = useState('')
  const [submittingRating, setSubmittingRating] = useState(false)

  // Teklif Kabul/Red
  const [offerProcessing, setOfferProcessing] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('tamirhanem_user')
      if (!stored) { router.push('/'); return }
      const u: ThUser = JSON.parse(stored)
      setUser(u)
      loadAppointment(u)
    } catch { router.push('/') }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadAppointment = async (u: ThUser) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/user/appointments?jwt=${encodeURIComponent(u.jwt)}`)
      const data = await res.json()
      if (data.success) {
        const raw = (data.data || []) as Record<string, unknown>[]
        const found = raw.find(a => String(a.id) === id)
        if (found) {
          setApt({
            id: found.id as number,
            serviceName: String(found.serviceName || 'Servis'),
            serviceAddress: String(found.serviceAddress || ''),
            servicePhone: String(found.servicePhone || ''),
            category: String(found.categoryName || ''),
            date: String(found.appointmentDate || ''),
            timeSlot: String(found.timeSlot || ''),
            status: String(found.status || 'pending') as AppointmentStatus,
            rawStatus: String(found.rawStatus || ''),
            note: String(found.note || ''),
            cancelReason: String(found.cancelReason || ''),
            vehicleBrand: String(found.vehicleBrand || ''),
            vehicleModel: String(found.vehicleModel || ''),
            vehiclePlate: String(found.vehiclePlate || ''),
            vehicleYear: String(found.vehicleYear || ''),
            vehicleColor: String(found.vehicleColor || ''),
            offerPrice: Number(found.offerPrice || 0),
            isOfferRequest: Boolean(found.isOfferRequest),
            hasUserRated: Boolean(found.hasUserRated),
            createdAt: String(found.createdAt || ''),
            serviceId: (found.serviceId as number) || null,
          })
        }
      }
    } catch { /* */ }
    finally { setLoading(false) }
  }

  const handleCancel = async () => {
    if (!user || !apt) return
    setCancelling(true)
    try {
      const reason = selectedCancelReason === 'Diğer'
        ? cancelReason.trim()
        : selectedCancelReason + (cancelReason.trim() ? ` - ${cancelReason.trim()}` : '')

      const action = apt.status === 'date_proposed' && apt.isOfferRequest ? 'reject-offer' : 'cancel'

      const res = await fetch('/api/user/appointments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jwt: user.jwt, id: apt.id, action, cancelReason: reason }),
      })
      const data = await res.json()
      if (data.success) {
        setApt(prev => prev ? { ...prev, status: (action === 'reject-offer' ? 'rejected' : 'cancelled') as AppointmentStatus } : null)
      }
      setCancelModal(false)
      setCancelReason('')
      setSelectedCancelReason('')
    } catch { /* */ }
    finally { setCancelling(false) }
  }

  const handleRating = async () => {
    if (!user || !apt || rating === 0) return
    setSubmittingRating(true)
    try {
      const res = await fetch('/api/user/ratings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jwt: user.jwt, appointmentId: apt.id, rating, comment: ratingComment.trim() }),
      })
      const data = await res.json()
      if (data.success) {
        setApt(prev => prev ? { ...prev, hasUserRated: true } : null)
      }
      setRatingModal(false)
      setRating(0)
      setRatingComment('')
    } catch { /* */ }
    finally { setSubmittingRating(false) }
  }

  const handleOfferAction = async (accept: boolean) => {
    if (!user || !apt) return
    setOfferProcessing(true)
    try {
      const res = await fetch('/api/user/appointments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jwt: user.jwt, id: apt.id, action: accept ? 'accept' : 'reject-offer' }),
      })
      const data = await res.json()
      if (data.success) {
        setApt(prev => prev ? { ...prev, status: (accept ? 'confirmed' : 'rejected') as AppointmentStatus } : null)
      }
    } catch { /* */ }
    finally { setOfferProcessing(false) }
  }

  if (!user) return null

  if (loading) {
    return (
      <main className="min-h-screen bg-th-bg pt-20 pb-24 lg:pl-16 flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-brand-500 animate-spin" />
      </main>
    )
  }

  if (!apt) {
    return (
      <main className="min-h-screen bg-th-bg pt-20 pb-24 lg:pl-16 animate-fade-in">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-th-fg-muted hover:text-th-fg text-sm font-semibold mb-6 group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Geri
          </button>
          <p className="text-th-fg-muted">Randevu bulunamadı.</p>
        </div>
      </main>
    )
  }

  const sc = statusConfig[apt.status] || statusConfig.pending
  const vehicleInfo = apt.vehicleBrand && apt.vehicleModel ? `${apt.vehicleBrand} ${apt.vehicleModel}` : null
  const isCancelledGroup = CANCELLED_STATUSES.includes(apt.status)
  const canCancel = ['pending', 'date_proposed', 'confirmed'].includes(apt.status)
  const canRate = apt.status === 'completed' && !apt.hasUserRated
  const canRespondOffer = apt.status === 'date_proposed'

  return (
    <main className="min-h-screen bg-th-bg pt-20 pb-24 lg:pb-8 lg:pl-16 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* Geri */}
        <button onClick={() => router.back()} className="flex items-center gap-2 text-th-fg-muted hover:text-th-fg text-sm font-semibold mb-6 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Geri
        </button>

        {/* Durum + Header */}
        <div className="glass-card rounded-2xl overflow-hidden border border-th-border/[0.06] mb-4">
          <div className={`h-1.5 w-full ${sc.barClass}`} />
          <div className="p-5">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-brand-500" />
                </div>
                <div>
                  <h1 className="text-lg font-black text-th-fg">{apt.serviceName}</h1>
                  <p className="text-xs text-th-fg-muted">Randevu #{apt.id}</p>
                </div>
              </div>
              <span className={cn('px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5', sc.badgeClass)}>
                {sc.icon} {sc.label}
              </span>
            </div>

            {/* Visual Stepper */}
            <div className="px-2">
              <VisualStepper currentStep={sc.step} isCancelled={isCancelledGroup} />
            </div>
          </div>
        </div>

        {/* Servis Bilgileri */}
        <div className="glass-card rounded-2xl border border-th-border/[0.06] p-5 mb-4">
          <h2 className="text-sm font-bold text-th-fg mb-3 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-brand-500" /> Servis Bilgileri
          </h2>
          <div className="space-y-2.5">
            {apt.serviceAddress && (
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-th-fg-muted flex-shrink-0" />
                <span className="text-sm text-th-fg-sub">{apt.serviceAddress}</span>
              </div>
            )}
            {apt.servicePhone && (
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-th-fg-muted flex-shrink-0" />
                <a href={`tel:${apt.servicePhone}`} className="text-sm text-brand-500 hover:underline">{apt.servicePhone}</a>
              </div>
            )}
          </div>
        </div>

        {/* Randevu Bilgileri */}
        <div className="glass-card rounded-2xl border border-th-border/[0.06] p-5 mb-4">
          <h2 className="text-sm font-bold text-th-fg mb-3 flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-brand-500" /> Randevu Bilgileri
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {apt.category && (
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-semibold text-th-fg-muted uppercase tracking-wider flex items-center gap-1.5"><Tag className="w-3 h-3" /> Kategori</span>
                <span className="text-sm font-bold text-th-fg">{apt.category}</span>
              </div>
            )}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-semibold text-th-fg-muted uppercase tracking-wider flex items-center gap-1.5"><CalendarDays className="w-3 h-3" /> Tarih</span>
              <span className="text-sm font-bold text-th-fg">{apt.date ? formatDate(apt.date) : 'Belirtilmemiş'}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-semibold text-th-fg-muted uppercase tracking-wider flex items-center gap-1.5"><Clock className="w-3 h-3" /> Saat</span>
              <span className="text-sm font-bold text-th-fg">{apt.timeSlot || 'Belirtilmemiş'}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-semibold text-th-fg-muted uppercase tracking-wider flex items-center gap-1.5"><Wallet className="w-3 h-3" /> Ücret</span>
              <span className="text-sm font-bold text-th-fg">{apt.offerPrice > 0 ? formatCurrency(apt.offerPrice) : 'Belirlenmedi'}</span>
            </div>
          </div>
        </div>

        {/* Araç Bilgileri */}
        <div className="glass-card rounded-2xl border border-th-border/[0.06] p-5 mb-4">
          <h2 className="text-sm font-bold text-th-fg mb-3 flex items-center gap-2">
            <Car className="w-4 h-4 text-brand-500" /> Araç Bilgileri
          </h2>
          {vehicleInfo ? (
            <div className="p-4 rounded-xl bg-th-overlay/[0.03] border border-th-border/[0.04]">
              {apt.vehiclePlate && (
                <span className="inline-block px-2.5 py-1 rounded-md bg-th-overlay/10 font-mono font-bold text-sm text-th-fg mb-2">{apt.vehiclePlate}</span>
              )}
              <div className="text-sm font-bold text-th-fg">{vehicleInfo}</div>
              {(apt.vehicleYear || apt.vehicleColor) && (
                <div className="text-xs text-th-fg-muted mt-1">
                  {apt.vehicleYear && `${apt.vehicleYear} Model`}
                  {apt.vehicleYear && apt.vehicleColor && ' • '}
                  {apt.vehicleColor}
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-th-fg-muted">Bu randevu için araç seçilmedi</p>
          )}
        </div>

        {/* Not */}
        {apt.note && (
          <div className="glass-card rounded-2xl border border-th-border/[0.06] p-5 mb-4">
            <h2 className="text-sm font-bold text-th-fg mb-3 flex items-center gap-2">
              <StickyNote className="w-4 h-4 text-brand-500" /> Notlar
            </h2>
            <p className="text-sm text-th-fg-sub bg-th-overlay/[0.03] p-4 rounded-xl border border-th-border/[0.04] leading-relaxed">{apt.note}</p>
          </div>
        )}

        {/* İptal Sebebi (iptal edildiyse göster) */}
        {isCancelledGroup && apt.cancelReason && (
          <div className="glass-card rounded-2xl border border-red-500/10 p-5 mb-4">
            <h2 className="text-sm font-bold text-red-400 mb-3 flex items-center gap-2">
              <Ban className="w-4 h-4" /> İptal Sebebi
            </h2>
            <p className="text-sm text-th-fg-sub bg-red-500/5 p-4 rounded-xl border border-red-500/10 leading-relaxed">{apt.cancelReason}</p>
          </div>
        )}

        {/* Aksiyon Butonları */}
        <div className="flex flex-wrap gap-3 mt-6">
          {/* Tarih Teklifi Kabul/Red */}
          {canRespondOffer && (
            <>
              <button
                onClick={() => handleOfferAction(true)}
                disabled={offerProcessing}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold bg-brand-500 text-brand-950 hover:bg-brand-400 transition-all disabled:opacity-50"
              >
                {offerProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCheck className="w-4 h-4" />}
                Tarihi Onayla
              </button>
              <button
                onClick={() => handleOfferAction(false)}
                disabled={offerProcessing}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/15 transition-all disabled:opacity-50"
              >
                {offerProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                Tarihi Reddet
              </button>
            </>
          )}

          {/* İptal Et */}
          {canCancel && (
            <button
              onClick={() => setCancelModal(true)}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/15 transition-all"
            >
              <XCircle className="w-4 h-4" /> İptal Et
            </button>
          )}

          {/* Değerlendir */}
          {canRate && (
            <button
              onClick={() => setRatingModal(true)}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold bg-brand-500/10 border border-brand-500/20 text-brand-500 hover:bg-brand-500/15 transition-all"
            >
              <Star className="w-4 h-4" /> Değerlendir
            </button>
          )}
        </div>
      </div>

      {/* ─── İptal Modalı (Seçenekli) ─── */}
      {cancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => { setCancelModal(false); setSelectedCancelReason(''); setCancelReason('') }}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative bg-th-bg rounded-2xl border border-th-border/[0.08] shadow-2xl w-full max-w-md p-6 animate-fade-in max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                <XCircle className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-th-fg">Randevuyu İptal Et</h3>
                <p className="text-xs text-th-fg-muted">{apt.serviceName}</p>
              </div>
            </div>
            <p className="text-sm text-th-fg-muted mb-4">Bu randevuyu iptal etmek istediğinize emin misiniz?</p>

            {/* Ceza Uyarısı */}
            {(() => {
              const penalty = getCancelPenalty(apt.date, apt.timeSlot)
              return (
                <div className={cn(
                  'p-4 rounded-xl border mb-4',
                  penalty.penaltyLevel === 'free' ? 'bg-emerald-500/5 border-emerald-500/15' :
                  penalty.penaltyLevel === 'partial' ? 'bg-amber-500/5 border-amber-500/15' :
                  'bg-red-500/5 border-red-500/15'
                )}>
                  <div className="flex items-center gap-2 mb-1.5">
                    {penalty.penaltyLevel === 'free' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> :
                     penalty.penaltyLevel === 'partial' ? <Timer className="w-4 h-4 text-amber-400" /> :
                     <Ban className="w-4 h-4 text-red-400" />}
                    <span className={cn('text-sm font-bold',
                      penalty.penaltyLevel === 'free' ? 'text-emerald-400' :
                      penalty.penaltyLevel === 'partial' ? 'text-amber-400' : 'text-red-400'
                    )}>{penalty.title}</span>
                    {apt.offerPrice > 0 && penalty.refundPercent < 100 && (
                      <span className="text-xs font-bold ml-auto text-th-fg-muted">
                        İade: {formatCurrency(apt.offerPrice * penalty.refundPercent / 100)}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-th-fg-muted leading-relaxed">{penalty.description}</p>
                </div>
              )
            })()}

            <div className="space-y-2 mb-4">
              <p className="text-xs font-semibold text-th-fg-muted uppercase tracking-wider">İptal sebebi</p>
              {CANCEL_REASONS.map(reason => (
                <button
                  key={reason}
                  onClick={() => setSelectedCancelReason(reason)}
                  className={cn(
                    'w-full text-left px-4 py-2.5 rounded-xl text-sm border transition-all',
                    selectedCancelReason === reason
                      ? 'bg-red-500/10 border-red-500/20 text-red-400 font-semibold'
                      : 'bg-th-overlay/5 border-th-border/[0.08] text-th-fg-sub hover:bg-th-overlay/10'
                  )}
                >
                  {reason}
                </button>
              ))}
            </div>

            {selectedCancelReason && (
              <textarea
                value={cancelReason}
                onChange={e => setCancelReason(e.target.value)}
                placeholder={selectedCancelReason === 'Diğer' ? 'Lütfen sebebinizi yazın...' : 'Ek açıklama (opsiyonel)...'}
                rows={3}
                className="w-full resize-none bg-th-overlay/5 border border-th-border/[0.08] rounded-xl px-4 py-3 text-sm text-th-fg placeholder:text-th-fg-muted/50 focus:outline-none focus:border-red-500/30 mb-4"
              />
            )}

            <div className="flex gap-3">
              <button onClick={() => { setCancelModal(false); setSelectedCancelReason(''); setCancelReason('') }} className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold bg-th-overlay/5 border border-th-border/[0.08] text-th-fg-sub hover:bg-th-overlay/10 transition-all">
                Vazgeç
              </button>
              <button
                onClick={handleCancel}
                disabled={cancelling || !selectedCancelReason || (selectedCancelReason === 'Diğer' && !cancelReason.trim())}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-bold bg-red-500 text-white hover:bg-red-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {cancelling ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                İptal Et
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Değerlendirme Modalı ─── */}
      {ratingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setRatingModal(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative bg-th-bg rounded-2xl border border-th-border/[0.08] shadow-2xl w-full max-w-md p-6 animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center">
                <Star className="w-5 h-5 text-brand-500" />
              </div>
              <div>
                <h3 className="text-base font-bold text-th-fg">Servisi Değerlendir</h3>
                <p className="text-xs text-th-fg-muted">{apt.serviceName}</p>
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
              <button onClick={() => setRatingModal(false)} className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold bg-th-overlay/5 border border-th-border/[0.08] text-th-fg-sub hover:bg-th-overlay/10 transition-all">
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
