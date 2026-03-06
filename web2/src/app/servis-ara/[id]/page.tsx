'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { ArrowLeft, Star, MapPin, Phone, Calendar, Clock, Shield, Truck, CheckCircle, ExternalLink, Share2, Mail, Tag, Wrench, ChevronLeft, ChevronRight, Heart, X, Eye, EyeOff, User, Lock } from 'lucide-react'
import AnimatedSection from '@/components/shared/AnimatedSection'
import { cn } from '@/lib/utils'

export default function ServiceDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [service, setService] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'services' | 'reviews' | 'amenities' | 'about'>('services')
  const [aiSummary, setAiSummary] = useState<string | null>(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [reviews, setReviews] = useState<any[]>([])
  const [reviewsLoading, setReviewsLoading] = useState(false)
  const [busySlots, setBusySlots] = useState<Record<string, string[]>>({})
  const [calendarDate, setCalendarDate] = useState(new Date())
  const [selectedCalDay, setSelectedCalDay] = useState<string | null>(null)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [loginForm, setLoginForm] = useState({ username: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loginLoading, setLoginLoading] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)
  const [isFavorited, setIsFavorited] = useState(false)
  const [favoriteId, setFavoriteId] = useState<number | null>(null)
  const [favoriteLoading, setFavoriteLoading] = useState(false)
  const [currentUser, setCurrentUser] = useState<{ id: number; username: string; jwt: string } | null>(null)

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await fetch(`/api/services/${params.id}`)
        const data = await response.json()
        if (data.success) {
          setService(data.data)
          fetchAiSummary(data.data)
          fetchReviews()
          fetchAppointments()
        }
      } catch (error) {
        console.error('Servis yüklenemedi:', error)
      } finally {
        setLoading(false)
      }
    }

    const fetchAiSummary = async (serviceData: any) => {
      const attrs = serviceData.attributes || serviceData
      setAiLoading(true)
      try {
        const res = await fetch('/api/services/summary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            serviceId: serviceData.id,
            name: attrs.name,
            rating: attrs.rating,
            reviewCount: attrs.reviewCount,
            categories: attrs.categories || [],
            location: attrs.location || '',
            features: {
              has_waiting_room: attrs.has_waiting_room,
              has_tea_coffee: attrs.has_tea_coffee,
              has_wifi: attrs.has_wifi,
              has_tv: attrs.has_tv,
              has_ac: attrs.has_ac,
              has_toilet: attrs.has_toilet,
              has_parking: attrs.has_parking,
              accepts_online_payment: attrs.accepts_online_payment,
              accepts_credit_card: attrs.accepts_credit_card,
              has_valet_service: attrs.has_valet_service,
              accepts_walk_in: attrs.accepts_walk_in,
            },
            discounts: attrs.discounts || [],
            workingHours: attrs.working_hours,
            is24_7: attrs.is_open_24_7,
            car_wash_pricing: attrs.car_wash_pricing || null,
          }),
        })
        const data = await res.json()
        if (data.success) setAiSummary(data.summary)
      } catch {
        // sessizce geç
      } finally {
        setAiLoading(false)
      }
    }

    const fetchReviews = async () => {
      setReviewsLoading(true)
      try {
        const res = await fetch(`/api/services/${params.id}/reviews`)
        const data = await res.json()
        if (data.success) setReviews(data.data)
      } catch {
        // sessizce geç
      } finally {
        setReviewsLoading(false)
      }
    }

    const fetchAppointments = async () => {
      try {
        const res = await fetch(`/api/services/${params.id}/appointments`)
        const data = await res.json()
        if (data.success) setBusySlots(data.data)
      } catch {
        // sessizce geç
      }
    }

    if (params.id) fetchService()
  }, [params.id])

  // localStorage'dan oturum yükle + favori durumu kontrol et
  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('th_user') : null
    if (stored) {
      try {
        const user = JSON.parse(stored)
        setCurrentUser(user)
        // Favori durumu kontrol et
        if (params.id) {
          fetch(`/api/favorites?serviceId=${params.id}&userId=${user.id}`)
            .then(r => r.json())
            .then(data => {
              if (data.success) {
                setIsFavorited(data.isFavorited)
                setFavoriteId(data.favoriteId)
              }
            })
            .catch(() => {})
        }
      } catch {}
    }
  }, [params.id])

  async function handleFavoriteClick() {
    // Giriş yapılmamışsa modal aç
    if (!currentUser) {
      setShowLoginModal(true)
      return
    }
    // Zaten favorideyse çıkar
    if (isFavorited && favoriteId) {
      setFavoriteLoading(true)
      try {
        const res = await fetch(`/api/favorites?id=${favoriteId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${currentUser.jwt}` },
        })
        const data = await res.json()
        if (data.success) {
          setIsFavorited(false)
          setFavoriteId(null)
        }
      } catch {}
      setFavoriteLoading(false)
      return
    }
    // Favoriye ekle
    setFavoriteLoading(true)
    try {
      const res = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ serviceId: params.id, jwt: currentUser.jwt }),
      })
      const data = await res.json()
      if (data.success) {
        setIsFavorited(true)
        setFavoriteId(data.favoriteId)
      }
    } catch {}
    setFavoriteLoading(false)
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoginLoading(true)
    setLoginError(null)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: loginForm.username, password: loginForm.password }),
      })
      const data = await res.json()
      if (!data.success) {
        setLoginError(data.error || 'Giriş başarısız')
        setLoginLoading(false)
        return
      }
      // Oturumu kaydet
      const user = { id: data.user.id, username: data.user.username, jwt: data.jwt }
      localStorage.setItem('th_user', JSON.stringify(user))
      setCurrentUser(user)
      setShowLoginModal(false)
      setLoginForm({ username: '', password: '' })
      // Favoriye ekle
      setFavoriteLoading(true)
      const favRes = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ serviceId: params.id, jwt: data.jwt }),
      })
      const favData = await favRes.json()
      if (favData.success) {
        setIsFavorited(true)
        setFavoriteId(favData.favoriteId)
      }
      setFavoriteLoading(false)
    } catch {
      setLoginError('Bağlantı hatası')
    }
    setLoginLoading(false)
  }

  // Çalışma saatine göre saat dilimleri üret (her saat başı)
  function generateTimeSlots(open: string, close: string): string[] {
    const [oh, om] = open.split(':').map(Number)
    const [ch, cm] = close.split(':').map(Number)
    const startMin = oh * 60 + om
    const endMin = ch * 60 + cm
    const slots: string[] = []
    for (let m = startMin; m < endMin; m += 30) {
      slots.push(`${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`)
    }
    return slots
  }

  // Slot, dolu aralıklardan herhangi biriyle çakışıyor mu?
  function isSlotBusy(slotTime: string, busyRanges: string[]): boolean {
    const [sh, sm] = slotTime.split(':').map(Number)
    const slotMin = sh * 60 + sm
    return busyRanges.some(range => {
      const parts = range.split('-')
      if (parts.length < 2) return false
      const [startH, startM] = parts[0].split(':').map(Number)
      const [endH, endM] = parts[1].split(':').map(Number)
      return slotMin >= startH * 60 + startM && slotMin < endH * 60 + endM
    })
  }

  const getImageUrl = (field: any) => {
    if (!field) return null
    if (typeof field === 'string') return field
    if (field.url) return field.url
    if (field.data?.url) return field.data.url
    if (field.data?.attributes?.url) return field.data.attributes.url
    if (field.attributes?.url) return field.attributes.url
    return null
  }

  if (loading) return <div className="min-h-screen pt-24 flex items-center justify-center"><div className="w-10 h-10 text-brand-500 animate-spin" /></div>
  if (!service) return <div className="min-h-screen pt-24 pb-16"><section className="section-container"><div className="glass-card p-12 text-center"><h1 className="text-2xl font-display font-bold text-th-fg mb-4">Servis Bulunamadı</h1><button onClick={() => router.back()} className="btn-gold px-6 py-3"><ArrowLeft className="w-4 h-4 mr-2" />Geri Dön</button></div></section></div>

  const attrs = service.attributes || service
  const imageUrl = getImageUrl(attrs.ProfilePicture) || getImageUrl(attrs.pic) || getImageUrl(attrs.image)
  const fullImageUrl = imageUrl?.startsWith('http') ? imageUrl : `https://api.tamirhanem.com${imageUrl || ''}`

  // working_hours yapısı: { monday: {isOpen, open, close}, tuesday: ... }
  // Türkçe gün adlarından İngilizce anahtarlara eşleme
  const DAY_MAP: Record<string, string> = {
    pazartesi: 'monday', salı: 'tuesday', çarşamba: 'wednesday',
    perşembe: 'thursday', cuma: 'friday', cumartesi: 'saturday', pazar: 'sunday',
  }
  const DAY_TR: Record<string, string> = {
    monday: 'Pazartesi', tuesday: 'Salı', wednesday: 'Çarşamba',
    thursday: 'Perşembe', friday: 'Cuma', saturday: 'Cumartesi', sunday: 'Pazar',
  }

  const openStatus = (() => {
    if (attrs.is_open_24_7) return { isOpen: true, nextTime: null, closingTime: null }
    const wh = attrs.working_hours
    if (!wh || typeof wh !== 'object') return { isOpen: null, nextTime: null, closingTime: null }
    const now = new Date()
    const trDay = now.toLocaleDateString('tr-TR', { weekday: 'long' }).toLowerCase()
    const dayKey = DAY_MAP[trDay]
    const daySchedule = dayKey ? wh[dayKey] : null
    if (!daySchedule || daySchedule.closed || !daySchedule.isOpen) return { isOpen: false, nextTime: 'Yarın', closingTime: null }
    const currentTime = now.getHours() * 60 + now.getMinutes()
    const [oh, om] = (daySchedule.open || '00:00').split(':').map(Number)
    const [ch, cm] = (daySchedule.close || '23:59').split(':').map(Number)
    const openMin = oh * 60 + om
    const closeMin = ch * 60 + cm
    const isOpen = currentTime >= openMin && currentTime <= closeMin
    return { isOpen, nextTime: isOpen ? null : 'Yarın', closingTime: isOpen ? daySchedule.close : null }
  })()

  return (
    <>
    <div className="min-h-screen pt-24 pb-16">
      <section className="section-container mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-th-overlay/5 border border-th-border/10 text-sm text-th-fg-sub">
          <a href="/dashboard" className="hover:text-brand-500">Anasayfa</a>
          <span>/</span>
          <a href="/servis-ara" className="hover:text-brand-500">Servisler</a>
          <span>/</span>
          <span className="text-th-fg font-medium">{attrs.name}</span>
        </div>
      </section>

      <div className="section-container grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <AnimatedSection>
            <div className="glass-card overflow-hidden">
              <div className="relative h-64 md:h-80 bg-th-bg-alt">
                {fullImageUrl ? <Image src={fullImageUrl} alt={attrs.name} fill className="object-cover" priority /> : <div className="h-full flex items-center justify-center"><Truck className="w-24 h-24 text-th-fg-muted" /></div>}
                {openStatus.isOpen !== null && (
                  <div className="absolute top-4 right-4">
                    <span className={cn('inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md', openStatus.isOpen ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30')}>
                      <div className={cn('w-2 h-2 rounded-full', openStatus.isOpen ? 'bg-green-400 animate-pulse' : 'bg-red-400')} />
                      {openStatus.isOpen ? 'Açık' : 'Kapalı'}
                    </span>
                  </div>
                )}
              </div>
              <div className="p-6 md:p-8">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-display font-bold text-th-fg mb-2">{attrs.name}</h1>
                    <div className="flex items-center gap-3 flex-wrap">
                      {attrs.rating && <div className="flex items-center gap-1"><Star className="w-4 h-4 text-brand-500 fill-brand-500" /><span className="font-bold text-th-fg">{attrs.rating.toFixed(1)}</span><span className="text-th-fg-sub text-sm">({attrs.reviewCount || 0})</span></div>}
                      {attrs.verified && <div className="flex items-center gap-1 text-green-400 text-sm"><CheckCircle className="w-4 h-4 fill-green-400/20" />Doğrulanmış</div>}
                    </div>
                  </div>
                  <button className="p-2 rounded-lg hover:bg-th-overlay/10"><Share2 className="w-5 h-5 text-th-fg-sub" /></button>
                </div>
                <div className="mb-6">
                  {aiLoading ? (
                    <div className="space-y-2">
                      <div className="h-4 bg-th-overlay/10 rounded animate-pulse w-full" />
                      <div className="h-4 bg-th-overlay/10 rounded animate-pulse w-5/6" />
                      <div className="h-4 bg-th-overlay/10 rounded animate-pulse w-4/6" />
                    </div>
                  ) : aiSummary ? (
                    <div>
                      <div className="flex items-center gap-1.5 mb-2">
                        <span className="text-[10px] font-bold text-brand-400/70 uppercase tracking-wider px-2 py-0.5 bg-brand-500/10 rounded-full">AI Analizi</span>
                      </div>
                      <p className="text-th-fg-sub text-sm leading-relaxed">{aiSummary}</p>
                    </div>
                  ) : (
                    <p className="text-th-fg-sub">{attrs.description || 'Açıklama yok.'}</p>
                  )}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <a href={`/randevu?servis=${encodeURIComponent(attrs.name)}&servis_id=${service.id}`} className="flex items-center justify-center gap-2 btn-gold py-3 rounded-xl font-bold text-sm"><Calendar className="w-4 h-4" />Randevu Al</a>
                  <a href={`/teklif-al?servis_id=${service.id}&servis_adi=${encodeURIComponent(attrs.name || '')}`} className="flex items-center justify-center gap-2 border border-th-border/20 py-3 rounded-xl font-medium text-sm hover:border-brand-500/30 hover:text-brand-500"><Tag className="w-4 h-4" />Teklif Al</a>
                  <button
                    onClick={handleFavoriteClick}
                    disabled={favoriteLoading}
                    className={cn(
                      'flex items-center justify-center gap-2 border py-3 rounded-xl font-medium text-sm transition-colors',
                      isFavorited
                        ? 'border-red-500/40 bg-red-500/10 text-red-400 hover:border-red-500/60 hover:bg-red-500/20'
                        : 'border-th-border/20 hover:border-red-500/30 hover:text-red-400',
                      favoriteLoading && 'opacity-60 cursor-wait'
                    )}
                  >
                    <Heart className={cn('w-4 h-4', isFavorited && 'fill-red-400')} />
                    {isFavorited ? 'Favorilerde' : 'Favorilere Ekle'}
                  </button>
                  <button className="flex items-center justify-center gap-2 border border-th-border/20 py-3 rounded-xl font-medium text-sm hover:border-brand-500/30 hover:text-brand-500"><Share2 className="w-4 h-4" />Paylaş</button>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {attrs.discounts?.filter((d: any) => !d.end_date || new Date(d.end_date) >= new Date()).length > 0 && (
            <AnimatedSection delay={0.1}>
              <div className="glass-card overflow-hidden">
                <div className="px-5 pt-4 pb-2">
                  <div className="flex items-center gap-2 mb-0.5">
                    <div className="flex items-center gap-1.5 bg-brand-500/10 border border-brand-500/20 rounded-full px-2.5 py-0.5">
                      <Tag className="w-3 h-3 text-brand-400" />
                      <span className="text-[11px] font-bold text-brand-400 uppercase tracking-wider">Aktif Kampanyalar</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-th-fg-muted mt-1">tamirhanem.com üyelerine özel geçerli kampanya fiyatlarıdır.</p>
                </div>
                <div className="flex gap-3 px-5 pb-5 pt-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory">
                  {attrs.discounts.filter((d: any) => !d.end_date || new Date(d.end_date) >= new Date()).map((d: any) => {
                    const discountedPrice = d.original_price && d.discount_type === 'percentage'
                      ? Math.round(d.original_price * (1 - d.discount_value / 100))
                      : null
                    const endDate = d.end_date ? new Date(d.end_date) : null
                    return (
                      <div key={d.id} className="relative flex-shrink-0 snap-start w-56 rounded-xl overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-brand-500/15 via-brand-600/10 to-transparent" />
                        <div className="absolute inset-0 border border-brand-500/25 rounded-xl" />
                        <div className="absolute -right-4 -top-4 w-16 h-16 rounded-full bg-brand-500/10" />
                        <div className="relative p-4">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="min-w-0">
                              <p className="font-bold text-th-fg text-xs leading-tight truncate">{d.title}</p>
                              {d.description && <p className="text-[11px] text-th-fg-sub mt-0.5 line-clamp-1">{d.description}</p>}
                            </div>
                            <div className="flex-shrink-0 flex flex-col items-center justify-center w-11 h-11 rounded-xl bg-brand-500/20 border border-brand-500/30">
                              <span className="text-sm font-black text-brand-400 leading-none">
                                {d.discount_type === 'percentage' ? `%${d.discount_value}` : `${d.discount_value}₺`}
                              </span>
                              <span className="text-[8px] text-brand-400/70 font-medium uppercase">off</span>
                            </div>
                          </div>
                          <div className="border-t border-dashed border-brand-500/20 my-2" />
                          <div className="flex items-center justify-between">
                            {d.original_price ? (
                              <div className="flex items-baseline gap-1.5">
                                <span className="text-[11px] text-th-fg-muted line-through">{d.original_price}₺</span>
                                {discountedPrice && <span className="text-sm font-black text-brand-400">{discountedPrice}₺</span>}
                              </div>
                            ) : <span />}
                            {endDate && (
                              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-th-overlay/10 text-th-fg-muted">
                                {endDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}'e kadar
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </AnimatedSection>
          )}

          {attrs.car_wash_pricing && (() => {
            const SERVICE_LABELS: Record<string, string> = {
              dis_yikama: 'Dış Yıkama', ic_temizlik: 'İç Temizlik',
              ic_dis_yikama: 'İç+Dış Yıkama', motor_yikama: 'Motor Yıkama',
              pasta_cila: 'Pasta & Cila', detayli_temizlik: 'Detaylı Temizlik',
              seramik_kaplama: 'Seramik Kaplama', koltuk_yikama: 'Koltuk Yıkama',
              tavan_doseme: 'Tavan Döşeme', jant_temizligi: 'Jant Temizliği',
              far_parlatma: 'Far Parlatma',
            }
            const VEHICLE_LABELS: Record<string, string> = {
              otomobil: 'Otomobil', suv: 'SUV', minibus: 'Minibüs', pickup: 'Pickup',
            }
            const pricing = attrs.car_wash_pricing
            const serviceKeys = Object.keys(pricing)
            const vehicleKeys = ['otomobil', 'suv', 'minibus', 'pickup'].filter(v =>
              serviceKeys.some(s => pricing[s]?.[v]?.active)
            )
            return (
              <AnimatedSection delay={0.12}>
                <div className="glass-card overflow-hidden">
                  <div className="px-6 pt-5 pb-3 flex items-center gap-2">
                    <span className="text-base font-display font-bold text-th-fg">Fiyat Listesi</span>
                    <span className="text-xs text-th-fg-muted">(KDV dahil)</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-th-border/10">
                          <th className="text-left px-6 py-2.5 text-xs font-semibold text-th-fg-muted">Hizmet</th>
                          {vehicleKeys.map(v => (
                            <th key={v} className="text-center px-4 py-2.5 text-xs font-semibold text-th-fg-muted whitespace-nowrap">
                              {VEHICLE_LABELS[v] || v}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-th-border/5">
                        {serviceKeys.filter(sk => vehicleKeys.some(v => pricing[sk]?.[v]?.active)).map((sk, idx) => (
                          <tr key={sk} className={idx % 2 === 0 ? '' : 'bg-th-overlay/[0.02]'}>
                            <td className="px-6 py-3 text-th-fg font-medium whitespace-nowrap">
                              {SERVICE_LABELS[sk] || sk}
                            </td>
                            {vehicleKeys.map(v => {
                              const slot = pricing[sk]?.[v]
                              return (
                                <td key={v} className="px-4 py-3 text-center">
                                  {slot?.active ? (
                                    <span className="font-semibold text-brand-400">{slot.price}₺</span>
                                  ) : (
                                    <span className="text-th-fg-muted/30">—</span>
                                  )}
                                </td>
                              )
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="px-6 py-3 text-[11px] text-th-fg-muted border-t border-th-border/5">
                    Fiyatlar bilgi amaçlıdır, servis tarafından değiştirilebilir.
                  </p>
                </div>
              </AnimatedSection>
            )
          })()}

          <AnimatedSection delay={0.15}>
            <div className="glass-card">
              <div className="flex border-b border-th-border/10">
                {(['services', 'amenities', 'reviews', 'about'] as const).map((tab) => (
                  <button key={tab} onClick={() => setActiveTab(tab)} className={cn('flex-1 py-4 text-xs font-medium transition-colors border-b-2', activeTab === tab ? 'border-brand-500 text-brand-500' : 'border-transparent text-th-fg-sub hover:text-th-fg')}>
                    {tab === 'services' ? 'Hizmetler' : tab === 'amenities' ? 'İmkanlar' : tab === 'reviews' ? 'Yorumlar' : 'Hakkında'}
                  </button>
                ))}
              </div>
              <div className="p-6">
                {activeTab === 'services' && (
                  <div>
                    {attrs.categories?.length > 0 ? (
                      <div className="divide-y divide-th-border/10">
                        {attrs.categories.map((cat: any, idx: number) => {
                          const name = cat.name || cat.attributes?.name || 'Hizmet'
                          return (
                            <div key={idx} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                              <Wrench className="w-3.5 h-3.5 text-brand-500/60 flex-shrink-0" />
                              <span className="text-sm text-th-fg">{name}</span>
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <p className="text-th-fg-sub text-sm">Hizmet bilgisi yok.</p>
                    )}
                  </div>
                )}
                {activeTab === 'reviews' && (
                  <div>
                    {reviewsLoading ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="space-y-2">
                            <div className="h-3 bg-th-overlay/10 rounded animate-pulse w-1/4" />
                            <div className="h-4 bg-th-overlay/10 rounded animate-pulse w-full" />
                            <div className="h-4 bg-th-overlay/10 rounded animate-pulse w-3/4" />
                          </div>
                        ))}
                      </div>
                    ) : reviews.length > 0 ? (
                      <div className="divide-y divide-th-border/10">
                        {reviews.map((review) => (
                          <div key={review.id} className="py-4 first:pt-0 last:pb-0">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-xs font-bold text-brand-400">
                                  {(review.user?.username || 'K')[0].toUpperCase()}
                                </div>
                                <span className="text-sm font-medium text-th-fg">{review.user?.username || 'Kullanıcı'}</span>
                              </div>
                              {review.value && (
                                <div className="flex items-center gap-1">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <Star key={i} className={cn('w-3.5 h-3.5', i < review.value ? 'text-brand-500 fill-brand-500' : 'text-th-fg-muted')} />
                                  ))}
                                </div>
                              )}
                            </div>
                            <p className="text-sm text-th-fg-sub leading-relaxed ml-10">{review.comment}</p>
                            {review.createdAt && (
                              <p className="text-[11px] text-th-fg-muted mt-1.5 ml-10">
                                {new Date(review.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-th-fg-sub text-sm">Henüz yorum yok.</p>
                    )}
                  </div>
                )}
                {activeTab === 'amenities' && (() => {
                  const AMENITIES = [
                    { key: 'has_waiting_room', label: 'Bekleme Salonu', icon: '🪑' },
                    { key: 'has_tea_coffee',   label: 'Çay / Kahve',   icon: '☕' },
                    { key: 'has_wifi',         label: 'Ücretsiz WiFi', icon: '📶' },
                    { key: 'has_tv',           label: 'TV',            icon: '📺' },
                    { key: 'has_ac',           label: 'Klima',         icon: '❄️' },
                    { key: 'has_toilet',       label: 'Tuvalet',       icon: '🚻' },
                    { key: 'has_parking',      label: 'Otopark',       icon: '🅿️' },
                    { key: 'accepts_online_payment', label: 'Online Ödeme', icon: '💳' },
                    { key: 'accepts_credit_card',    label: 'Kredi Kartı',  icon: '💰' },
                    { key: 'has_valet_service',      label: 'Vale Hizmeti', icon: '🚗' },
                    { key: 'accepts_walk_in',        label: 'Randevusuz Kabul', icon: '🚶' },
                  ]
                  const active   = AMENITIES.filter(a => attrs[a.key])
                  const inactive = AMENITIES.filter(a => !attrs[a.key])
                  return (
                    <div>
                      {active.length === 0 && inactive.length === 0 ? (
                        <p className="text-th-fg-sub text-sm">İmkan bilgisi henüz eklenmemiş.</p>
                      ) : (
                        <div className="space-y-4">
                          {active.length > 0 && (
                            <div>
                              <p className="text-xs font-semibold text-th-fg-muted uppercase tracking-wider mb-2">Mevcut</p>
                              <div className="divide-y divide-th-border/10">
                                {active.map(a => (
                                  <div key={a.key} className="flex items-center gap-3 py-2.5 first:pt-0">
                                    <span className="text-base w-6 text-center">{a.icon}</span>
                                    <span className="text-sm text-th-fg">{a.label}</span>
                                    <CheckCircle className="w-4 h-4 text-green-400 ml-auto flex-shrink-0" />
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          {inactive.length > 0 && (
                            <div>
                              <p className="text-xs font-semibold text-th-fg-muted uppercase tracking-wider mb-2">Mevcut Değil</p>
                              <div className="divide-y divide-th-border/5">
                                {inactive.map(a => (
                                  <div key={a.key} className="flex items-center gap-3 py-2.5 first:pt-0 opacity-40">
                                    <span className="text-base w-6 text-center">{a.icon}</span>
                                    <span className="text-sm text-th-fg-sub">{a.label}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })()}
                {activeTab === 'about' && <div><h3 className="text-lg font-display font-bold text-th-fg mb-4">Hakkında</h3><p className="text-th-fg-sub text-sm leading-relaxed">{attrs.description || 'Bilgi yok.'}</p></div>}
              </div>
            </div>
          </AnimatedSection>
        </div>

        <div className="space-y-6">
          <AnimatedSection delay={0.2}>
            <div className="glass-card p-6">
              <h3 className="text-lg font-display font-bold text-th-fg mb-4">İletişim</h3>
              <div className="space-y-4">
                {attrs.phone && <div className="flex items-start gap-3"><div className="bg-green-500/10 p-2 rounded-lg"><Phone className="w-5 h-5 text-green-400" /></div><div><span className="text-xs text-th-fg-sub block">Telefon</span><a href={`tel:${attrs.phone}`} className="text-th-fg font-medium hover:text-brand-500">{attrs.phone}</a></div></div>}
                <div className="flex items-start gap-3"><div className="bg-brand-500/10 p-2 rounded-lg"><MapPin className="w-5 h-5 text-brand-500" /></div><div><span className="text-xs text-th-fg-sub block">Konum</span><p className="text-th-fg text-sm">{attrs.address || attrs.location || 'Bilinmiyor'}</p>{attrs.latitude && attrs.longitude && <a href={`https://www.google.com/maps?q=${attrs.latitude},${attrs.longitude}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-brand-400 text-xs hover:text-brand-300 mt-1">Haritada Göster<ExternalLink className="w-3 h-3" /></a>}</div></div>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.3}>
            <div className="glass-card p-6">
              <h3 className="text-lg font-display font-bold text-th-fg mb-4">Çalışma Saatleri</h3>
              {attrs.is_open_24_7 ? (
                <div className="flex items-center gap-2 text-green-400 text-sm font-medium">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  7/24 Açık
                </div>
              ) : attrs.working_hours ? (
                <div className="space-y-2 text-sm">
                  {(['monday','tuesday','wednesday','thursday','friday','saturday','sunday'] as const).map((dayKey) => {
                    const schedule = attrs.working_hours[dayKey]
                    const isClosed = !schedule || schedule.closed || !schedule.isOpen
                    const today = new Date().toLocaleDateString('tr-TR', { weekday: 'long' }).toLowerCase()
                    const isToday = DAY_MAP[today] === dayKey
                    return (
                      <div key={dayKey} className={cn('flex justify-between py-1.5 border-b border-th-border/5 last:border-0', isToday && 'bg-brand-500/5 rounded px-2 -mx-2')}>
                        <span className={cn('text-th-fg', isToday && 'font-semibold text-brand-400')}>{DAY_TR[dayKey]}</span>
                        <span className={cn('font-medium', isClosed ? 'text-red-400' : 'text-th-fg')}>
                          {isClosed ? 'Kapalı' : (schedule.open && schedule.close ? `${schedule.open} - ${schedule.close}` : 'Açık')}
                        </span>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text-th-fg-sub text-sm">Çalışma saatleri bilgisi mevcut değil.</p>
              )}
              {openStatus.closingTime && (
                <div className="mt-4 pt-4 border-t border-th-border/10">
                  <div className="flex items-center gap-2 text-th-fg-sub text-sm">
                    <Clock className="w-4 h-4" />Kapanış: <span className="text-th-fg font-medium">{openStatus.closingTime}</span>
                  </div>
                </div>
              )}
            </div>
          </AnimatedSection>

          {(attrs.is_official_service || attrs.provides_roadside_assistance) && (
            <AnimatedSection delay={0.5}>
              <div className="glass-card p-6">
                <div className="grid grid-cols-2 gap-3">
                  {attrs.is_official_service && <div className="bg-green-500/[0.08] border border-green-500/20 rounded-xl p-4 text-center"><Shield className="w-6 h-6 text-green-400 mx-auto mb-2" /><span className="text-xs font-medium text-green-300">Yetkili Servis</span></div>}
                  {attrs.provides_roadside_assistance && <div className="bg-blue-500/[0.08] border border-blue-500/20 rounded-xl p-4 text-center"><Truck className="w-6 h-6 text-blue-400 mx-auto mb-2" /><span className="text-xs font-medium text-blue-300">Yol Yardımı</span></div>}
                </div>
              </div>
            </AnimatedSection>
          )}

          <AnimatedSection delay={0.6}>
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-display font-bold text-th-fg">Randevu Takvimi</h3>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCalendarDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1))}
                    className="p-1.5 rounded-lg hover:bg-th-overlay/10 text-th-fg-sub hover:text-th-fg"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-sm font-medium text-th-fg min-w-[110px] text-center">
                    {calendarDate.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}
                  </span>
                  <button
                    onClick={() => setCalendarDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1))}
                    className="p-1.5 rounded-lg hover:bg-th-overlay/10 text-th-fg-sub hover:text-th-fg"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {(() => {
                const year = calendarDate.getFullYear()
                const month = calendarDate.getMonth()
                const firstDay = new Date(year, month, 1).getDay()
                const startOffset = firstDay === 0 ? 6 : firstDay - 1
                const daysInMonth = new Date(year, month + 1, 0).getDate()
                const today = new Date()
                const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
                const days = ['Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct', 'Pz']

                return (
                  <div>
                    <div className="grid grid-cols-7 mb-1">
                      {days.map(d => (
                        <div key={d} className="text-center text-[10px] font-semibold text-th-fg-muted py-1">{d}</div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-0.5">
                      {Array.from({ length: startOffset }).map((_, i) => (
                        <div key={`e-${i}`} />
                      ))}
                      {Array.from({ length: daysInMonth }).map((_, i) => {
                        const day = i + 1
                        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                        const isBusy = !!busySlots[dateStr]
                        const isToday = dateStr === todayStr
                        const isPast = new Date(dateStr) < today && !isToday
                        const isSelected = selectedCalDay === dateStr

                        return (
                          <button
                            key={day}
                            onClick={() => !isPast && setSelectedCalDay(isSelected ? null : dateStr)}
                            disabled={isPast}
                            className={cn(
                              'relative aspect-square flex items-center justify-center text-xs rounded-lg transition-all',
                              isPast && 'text-th-fg-muted/40 cursor-default',
                              !isPast && !isBusy && !isSelected && 'hover:bg-th-overlay/10 text-th-fg',
                              isBusy && !isPast && 'bg-red-500/10 text-red-400 hover:bg-red-500/20',
                              isToday && !isSelected && 'ring-1 ring-brand-500/50 font-bold text-brand-400',
                              isSelected && 'bg-brand-500/20 text-brand-400 ring-1 ring-brand-500/40 font-bold',
                            )}
                          >
                            {day}
                            {isBusy && !isPast && (
                              <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-red-400" />
                            )}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )
              })()}

              {selectedCalDay && (() => {
                const dateLabel = new Date(selectedCalDay + 'T00:00:00').toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', weekday: 'long' })
                const busyRanges = busySlots[selectedCalDay] || []

                // Seçili günün çalışma saatlerini bul
                const selDate = new Date(selectedCalDay + 'T00:00:00')
                const selDayKey = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'][selDate.getDay()]
                const daySchedule = attrs.is_open_24_7
                  ? { isOpen: true, open: '00:00', close: '24:00' }
                  : attrs.working_hours?.[selDayKey]

                const isClosed = !attrs.is_open_24_7 && (!daySchedule || daySchedule.closed || !daySchedule.isOpen)
                const slots = !isClosed ? generateTimeSlots(
                  daySchedule?.open || '09:00',
                  daySchedule?.close === '24:00' ? '23:00' : (daySchedule?.close || '18:00')
                ) : []

                // Bugünün geçmiş saatlerini grile
                const now = new Date()
                const todayStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`
                const isToday = selectedCalDay === todayStr
                const currentMin = now.getHours() * 60 + now.getMinutes()

                return (
                  <div className="mt-4 pt-4 border-t border-th-border/10">
                    <p className="text-xs font-semibold text-th-fg-sub mb-3 capitalize">{dateLabel}</p>
                    {isClosed ? (
                      <p className="text-xs text-red-400">Bu gün servis kapalı.</p>
                    ) : slots.length === 0 ? (
                      <p className="text-xs text-th-fg-muted">Saat bilgisi alınamadı.</p>
                    ) : (
                      <div className="grid grid-cols-4 gap-1.5">
                        {slots.map((slot, i) => {
                          const busy = isSlotBusy(slot, busyRanges)
                          const [sh, sm] = slot.split(':').map(Number)
                          const past = isToday && (sh * 60 + sm) < currentMin
                          const clickable = !busy && !past
                          return (
                            <button
                              key={i}
                              disabled={!clickable}
                              onClick={() => {
                                if (!clickable) return
                                router.push(`/randevu?date=${selectedCalDay}&time=${slot}&serviceId=${params.id}`)
                              }}
                              className={cn(
                                'text-center text-[11px] px-1.5 py-1 rounded-lg font-medium border transition-all',
                                past
                                  ? 'text-th-fg-muted/40 border-th-border/5 bg-transparent cursor-default'
                                  : busy
                                    ? 'bg-red-500/10 border-red-500/20 text-red-400 cursor-not-allowed'
                                    : 'bg-green-500/10 border-green-500/20 text-green-400 hover:bg-green-500/20 hover:border-green-500/40 cursor-pointer'
                              )}
                            >
                              {slot}
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })()}

              <div className="mt-4 flex items-center gap-4 text-[11px] text-th-fg-muted">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-green-400/60" />Müsait
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-red-400/60" />Dolu
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm ring-1 ring-brand-500/50" />Bugün
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </div>

    {/* Favorilere Ekle Login Modalı */}
    {showLoginModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => { setShowLoginModal(false); setLoginError(null) }} />
        <div className="relative w-full max-w-sm glass-card p-6 shadow-2xl">
          <button onClick={() => { setShowLoginModal(false); setLoginError(null) }} className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-th-overlay/10 text-th-fg-sub hover:text-th-fg transition-colors">
            <X className="w-4 h-4" />
          </button>

          <div className="flex flex-col items-center mb-6">
            <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-3">
              <Heart className="w-6 h-6 text-red-400" />
            </div>
            <h2 className="text-lg font-display font-bold text-th-fg">Favorilere Ekle</h2>
            <p className="text-sm text-th-fg-sub mt-1 text-center">Devam etmek için hesabınıza giriş yapın</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-3">
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-th-fg-muted" />
              <input
                type="text"
                placeholder="Kullanıcı adı veya e-posta"
                value={loginForm.username}
                onChange={e => setLoginForm(f => ({ ...f, username: e.target.value }))}
                required
                disabled={loginLoading}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-th-bg-alt border border-th-border/20 text-th-fg placeholder:text-th-fg-muted text-sm focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/30 disabled:opacity-60"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-th-fg-muted" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Şifre"
                value={loginForm.password}
                onChange={e => setLoginForm(f => ({ ...f, password: e.target.value }))}
                required
                disabled={loginLoading}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-th-bg-alt border border-th-border/20 text-th-fg placeholder:text-th-fg-muted text-sm focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/30 disabled:opacity-60"
              />
              <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-th-fg-muted hover:text-th-fg">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {loginError && (
              <p className="text-red-400 text-xs text-center px-2">{loginError}</p>
            )}

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full btn-gold py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-wait"
            >
              {loginLoading ? (
                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <Heart className="w-4 h-4" />
              )}
              {loginLoading ? 'Giriş yapılıyor...' : 'Giriş Yap & Favorilere Ekle'}
            </button>
          </form>

          <div className="mt-4 text-center text-xs text-th-fg-muted">
            Hesabınız yok mu?{' '}
            <a href="/kayit" className="text-brand-400 hover:text-brand-300 font-medium">Kayıt Ol</a>
          </div>
        </div>
      </div>
    )}
    </>
  )
}
