'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { ArrowLeft, Car, MapPin, Tag, Wrench, CheckCircle, Loader2, AlertCircle, ChevronDown, Search, Building2, FileText, Send } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { ILCELER } from '@/lib/ilceler'
import { ILLER } from '@/lib/iller'
import { useLocationStore } from '@/lib/useLocationStore'

interface Vehicle { id: number; brand: string; model: string; year: number | string; plate: string; fuelType: string }
interface Category { id: number; name: string }
interface ServiceResult { id: number; name: string; location: string; rating: number | null; categories: string[] }

function TeklifAlContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const servisId = searchParams.get('servis_id')
  const servisAdi = searchParams.get('servis_adi')

  // Auth
  const [user, setUser] = useState<{ id: number; username: string; jwt: string } | null>(null)

  // Form state
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(null)
  const [city, setCity] = useState('')
  const [district, setDistrict] = useState('')
  const { location: storedLocation } = useLocationStore()
  useEffect(() => {
    if (storedLocation.city && !city) {
      setCity(storedLocation.city)
      if (storedLocation.district) setDistrict(storedLocation.district)
    }
  }, [storedLocation.city, storedLocation.district]) // eslint-disable-line react-hooks/exhaustive-deps
  const [scope, setScope] = useState<'single' | 'all'>(servisId ? 'single' : 'all')
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | string>('')
  const [notes, setNotes] = useState('')

  // Service picker (scope='single', no pre-selected servisId)
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(servisId ? parseInt(servisId) : null)
  const [selectedServiceName, setSelectedServiceName] = useState<string>(servisAdi || '')
  const [services, setServices] = useState<ServiceResult[]>([])
  const [loadingServices, setLoadingServices] = useState(false)
  const [serviceSearch, setServiceSearch] = useState('')

  // Data
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loadingVehicles, setLoadingVehicles] = useState(false)
  const [loadingCategories, setLoadingCategories] = useState(false)

  // Submit state
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const ilceler = city ? (ILCELER[city] || []) : []

  // Load user
  useEffect(() => {
    try {
      const stored = localStorage.getItem('th_user')
      if (stored) setUser(JSON.parse(stored))
    } catch {}
  }, [])

  // Load vehicles
  const loadVehicles = useCallback(async (jwt: string) => {
    setLoadingVehicles(true)
    try {
      const res = await fetch(`/api/user/vehicles?jwt=${encodeURIComponent(jwt)}`)
      const data = await res.json()
      if (data.success) {
        const list = data.data || data.vehicles || []
        setVehicles(list)
        if (list.length === 1) setSelectedVehicleId(list[0].id)
      }
    } catch {}
    setLoadingVehicles(false)
  }, [])

  // Load categories
  const loadCategories = useCallback(async () => {
    setLoadingCategories(true)
    try {
      const res = await fetch('/api/categories?limit=50')
      const data = await res.json()
      const cats = data?.data || data?.categories || []
      setCategories(cats.map((c: { id: number; name?: string; attributes?: { name?: string } }) => ({
        id: c.id,
        name: c.name || c.attributes?.name || '',
      })))
    } catch {}
    setLoadingCategories(false)
  }, [])

  useEffect(() => {
    if (user) loadVehicles(user.jwt)
    loadCategories()
  }, [user, loadVehicles, loadCategories])

  // Load services when city changes and scope is 'single' without pre-selected service
  const loadServices = useCallback(async () => {
    if (!city || servisId) return
    setLoadingServices(true)
    try {
      const params = new URLSearchParams({ city, limit: '50' })
      if (district) params.set('district', district)
      if (selectedCategoryId) {
        const cat = categories.find(c => c.id === Number(selectedCategoryId))
        if (cat) params.set('category', cat.name)
      }
      const res = await fetch(`/api/services/search?${params.toString()}`)
      const data = await res.json()
      if (data.success) setServices(data.data || [])
    } catch {}
    setLoadingServices(false)
  }, [city, district, selectedCategoryId, categories, servisId])

  useEffect(() => {
    if (scope === 'single' && !servisId) {
      loadServices()
    }
  }, [scope, city, district, selectedCategoryId, loadServices, servisId])

  // City change → reset district and service
  const handleCityChange = (v: string) => {
    setCity(v)
    setDistrict('')
    setSelectedServiceId(null)
    setSelectedServiceName('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!user) { setError('Teklif göndermek için giriş yapmanız gerekiyor.'); return }
    if (!selectedVehicleId) { setError('Lütfen araç seçin.'); return }
    if (!city) { setError('Lütfen il seçin.'); return }
    if (scope === 'single' && !selectedServiceId) { setError('Lütfen bir servis seçin.'); return }

    setSubmitting(true)
    try {
      const res = await fetch('/api/teklif-gonder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jwt: user.jwt,
          vehicleId: selectedVehicleId,
          city,
          district,
          scope,
          categoryIds: selectedCategoryId ? [Number(selectedCategoryId)] : [],
          notes,
          serviceId: selectedServiceId,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setSubmitted(true)
      } else {
        setError(data.error || 'Bir hata oluştu.')
      }
    } catch {
      setError('Sunucu hatası. Lütfen tekrar deneyin.')
    }
    setSubmitting(false)
  }

  // ─── Başarı ekranı ────────────────────────────
  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-20">
        <div className="glass-card p-10 rounded-2xl max-w-md w-full text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-green-500/15 flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
          <h2 className="text-xl font-bold text-th-fg font-display">Teklif Talebiniz Alındı!</h2>
          <p className="text-th-fg-sub text-sm leading-relaxed">
            {selectedServiceName
              ? `${selectedServiceName} servisine teklif talebiniz iletildi.`
              : `${city} bölgesindeki uygun servislere teklif talebiniz iletildi.`}
            {' '}Servisler en kısa sürede sizinle iletişime geçecek.
          </p>
          <div className="flex flex-col gap-2 pt-2">
            <button onClick={() => router.back()} className="btn-gold py-2.5 text-sm">
              Geri Dön
            </button>
            <Link href="/" className="text-sm text-th-fg-sub hover:text-brand-500 transition-colors">
              Ana Sayfaya Dön
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const filteredServices = services.filter(s =>
    !serviceSearch || s.name.toLowerCase().includes(serviceSearch.toLowerCase()) || s.location.toLowerCase().includes(serviceSearch.toLowerCase())
  )

  const selectedVehicle = vehicles.find(v => v.id === selectedVehicleId)

  return (
    <div className="min-h-screen pt-20 lg:pt-24 pb-20 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-1.5 text-sm text-th-fg-sub hover:text-th-fg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Geri
            </button>
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-th-fg font-display">
                {selectedServiceName ? `${selectedServiceName} — Teklif Al` : 'Teklif Al'}
              </h1>
              <p className="text-xs text-th-fg-sub mt-0.5">Aracınız için servislerden fiyat teklifi alın.</p>
            </div>
          </div>
        </div>

        {!user && (
          <div className="mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-3">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <p className="text-sm text-amber-300 font-medium">Teklif almak için önce giriş yapın.</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

            {/* ═══ SOL KOLON — Araç + Konum + Kategori ═══ */}
            <div className="lg:col-span-4 space-y-4">

              {/* Araç Seçimi */}
              <div className="glass-card p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-3">
                  <Car className="w-4 h-4 text-brand-400" />
                  <h3 className="text-sm font-semibold text-th-fg">Araç Seçimi</h3>
                </div>
                {loadingVehicles ? (
                  <div className="flex items-center gap-2 text-xs text-th-fg-sub py-2">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Yükleniyor...
                  </div>
                ) : !user ? (
                  <p className="text-xs text-th-fg-muted">Giriş yaptıktan sonra araçlarınız görünecek.</p>
                ) : vehicles.length === 0 ? (
                  <p className="text-xs text-th-fg-muted">Kayıtlı araç bulunamadı.</p>
                ) : (
                  <div className="space-y-1.5">
                    {vehicles.map(v => (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setSelectedVehicleId(v.id)}
                        className={cn(
                          'w-full flex items-center justify-between p-2.5 rounded-lg border transition-all text-left',
                          selectedVehicleId === v.id
                            ? 'border-brand-500/50 bg-brand-500/10 text-th-fg'
                            : 'border-th-border/15 hover:border-th-border/30 text-th-fg-sub hover:text-th-fg'
                        )}
                      >
                        <div className="min-w-0">
                          <span className="text-sm font-medium">{v.brand} {v.model}</span>
                          {v.year && <span className="text-[11px] text-th-fg-muted ml-1.5">{v.year}</span>}
                          {v.plate && <span className="text-[11px] text-th-fg-muted ml-1.5">• {v.plate}</span>}
                        </div>
                        {selectedVehicleId === v.id && (
                          <div className="w-3.5 h-3.5 rounded-full bg-brand-500 flex items-center justify-center shrink-0">
                            <div className="w-1.5 h-1.5 rounded-full bg-white" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Konum */}
              <div className="glass-card p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-4 h-4 text-brand-400" />
                  <h3 className="text-sm font-semibold text-th-fg">Konum</h3>
                </div>
                <div className="space-y-2.5">
                  <div>
                    <label className="text-[11px] text-th-fg-sub block mb-1">İl *</label>
                    <div className="relative">
                      <select
                        value={city}
                        onChange={e => handleCityChange(e.target.value)}
                        className="w-full appearance-none bg-th-overlay/5 border border-th-border/15 rounded-lg px-3 py-2 text-sm text-th-fg focus:outline-none focus:border-brand-500/40 pr-8"
                        required
                      >
                        <option value="">İl seçin</option>
                        {ILLER.map(il => (
                          <option key={il} value={il}>{il}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-th-fg-muted pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] text-th-fg-sub block mb-1">İlçe</label>
                    <div className="relative">
                      {ilceler.length > 0 ? (
                        <>
                          <select
                            value={district}
                            onChange={e => { setDistrict(e.target.value); setSelectedServiceId(null); setSelectedServiceName('') }}
                            className="w-full appearance-none bg-th-overlay/5 border border-th-border/15 rounded-lg px-3 py-2 text-sm text-th-fg focus:outline-none focus:border-brand-500/40 pr-8"
                          >
                            <option value="">Tüm ilçeler</option>
                            {ilceler.map(ilce => (
                              <option key={ilce} value={ilce}>{ilce}</option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-th-fg-muted pointer-events-none" />
                        </>
                      ) : (
                        <input
                          type="text"
                          value={district}
                          onChange={e => setDistrict(e.target.value)}
                          placeholder="İlçe (opsiyonel)"
                          className="w-full bg-th-overlay/5 border border-th-border/15 rounded-lg px-3 py-2 text-sm text-th-fg placeholder:text-th-fg-muted focus:outline-none focus:border-brand-500/40"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Hizmet Kategorisi */}
              <div className="glass-card p-4 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-brand-400" />
                    <h3 className="text-sm font-semibold text-th-fg">Hizmet Kategorisi</h3>
                  </div>
                  <span className="text-[10px] text-th-fg-muted">Opsiyonel</span>
                </div>
                {loadingCategories ? (
                  <div className="flex items-center gap-2 text-xs text-th-fg-sub">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Yükleniyor...
                  </div>
                ) : (
                  <div className="relative">
                    <select
                      value={selectedCategoryId}
                      onChange={e => { setSelectedCategoryId(e.target.value); setSelectedServiceId(null); setSelectedServiceName('') }}
                      className="w-full appearance-none bg-th-overlay/5 border border-th-border/15 rounded-lg px-3 py-2 text-sm text-th-fg focus:outline-none focus:border-brand-500/40 pr-8"
                    >
                      <option value="">Tüm kategoriler</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-th-fg-muted pointer-events-none" />
                  </div>
                )}
              </div>
            </div>

            {/* ═══ ORTA KOLON — Teklif Kapsamı + Servis Seçimi ═══ */}
            <div className="lg:col-span-5 space-y-4">

              {/* Teklif Kapsamı */}
              <div className="glass-card p-4 rounded-xl space-y-3">
                <div className="flex items-center gap-2 mb-1">
                  <Tag className="w-4 h-4 text-brand-400" />
                  <h3 className="text-sm font-semibold text-th-fg">Teklif Kapsamı</h3>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setScope('single')}
                    className={cn(
                      'flex flex-col items-center p-3 rounded-lg border text-center transition-all',
                      scope === 'single'
                        ? 'border-brand-500/50 bg-brand-500/10 text-th-fg'
                        : 'border-th-border/15 text-th-fg-sub hover:border-th-border/30 hover:text-th-fg'
                    )}
                  >
                    <Building2 className="w-4 h-4 mb-1.5 text-brand-400" />
                    <span className="text-xs font-medium">Tek Servis</span>
                    <span className="text-[10px] text-th-fg-muted mt-0.5 leading-tight">
                      {selectedServiceName || 'Servis seç'}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setScope('all')}
                    className={cn(
                      'flex flex-col items-center p-3 rounded-lg border text-center transition-all',
                      scope === 'all'
                        ? 'border-brand-500/50 bg-brand-500/10 text-th-fg'
                        : 'border-th-border/15 text-th-fg-sub hover:border-th-border/30 hover:text-th-fg'
                    )}
                  >
                    <MapPin className="w-4 h-4 mb-1.5 text-brand-400" />
                    <span className="text-xs font-medium">Tüm Servisler</span>
                    <span className="text-[10px] text-th-fg-muted mt-0.5 leading-tight">Bölgedeki tümünden</span>
                  </button>
                </div>
              </div>

              {/* Servis Listesi */}
              {scope === 'single' && !servisId && (
                <div className="glass-card p-4 rounded-xl space-y-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Search className="w-4 h-4 text-brand-400" />
                    <h3 className="text-sm font-semibold text-th-fg">Servis Seçin</h3>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-th-fg-muted pointer-events-none" />
                    <input
                      type="text"
                      value={serviceSearch}
                      onChange={e => setServiceSearch(e.target.value)}
                      placeholder="Servis adı veya konum ara..."
                      className="w-full bg-th-overlay/5 border border-th-border/15 rounded-lg pl-9 pr-3 py-2 text-sm text-th-fg placeholder:text-th-fg-muted focus:outline-none focus:border-brand-500/40"
                    />
                  </div>

                  {!city ? (
                    <div className="text-center py-4 text-xs text-th-fg-muted">
                      Servisleri görmek için önce il seçin
                    </div>
                  ) : loadingServices ? (
                    <div className="flex items-center justify-center gap-2 py-4 text-xs text-th-fg-sub">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Servisler aranıyor...
                    </div>
                  ) : filteredServices.length === 0 ? (
                    <div className="text-center py-4 text-xs text-th-fg-muted">
                      Bu kriterlere uygun servis bulunamadı
                    </div>
                  ) : (
                    <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                      {filteredServices.map(s => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => { setSelectedServiceId(s.id); setSelectedServiceName(s.name) }}
                          className={cn(
                            'w-full flex items-center gap-2.5 p-2.5 rounded-lg border transition-all text-left',
                            selectedServiceId === s.id
                              ? 'border-brand-500/50 bg-brand-500/10'
                              : 'border-th-border/15 hover:border-th-border/30'
                          )}
                        >
                          <div className="w-7 h-7 rounded-lg bg-th-overlay/10 border border-th-border/10 flex items-center justify-center shrink-0">
                            <Building2 className="w-3.5 h-3.5 text-th-fg-muted" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-th-fg truncate">{s.name}</div>
                            <div className="text-[11px] text-th-fg-muted truncate">{s.location}</div>
                          </div>
                          {selectedServiceId === s.id && (
                            <div className="w-3.5 h-3.5 rounded-full bg-brand-500 flex items-center justify-center shrink-0">
                              <div className="w-1.5 h-1.5 rounded-full bg-white" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Ek Bilgiler */}
              <div className="glass-card p-4 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-brand-400" />
                    <h3 className="text-sm font-semibold text-th-fg">Ek Bilgiler</h3>
                  </div>
                  <span className="text-[10px] text-th-fg-muted">Opsiyonel</span>
                </div>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Araçla ilgili sorun, talep veya notlarınız..."
                  rows={3}
                  className="w-full bg-th-overlay/5 border border-th-border/15 rounded-lg px-3 py-2 text-sm text-th-fg placeholder:text-th-fg-muted focus:outline-none focus:border-brand-500/40 resize-none"
                />
              </div>
            </div>

            {/* ═══ SAĞ KOLON — Özet + Gönder ═══ */}
            <div className="lg:col-span-3">
              <div className="lg:sticky lg:top-24 space-y-4">
                <div className="glass-card p-4 rounded-xl space-y-3">
                  <h3 className="text-sm font-semibold text-th-fg flex items-center gap-2">
                    <Send className="w-4 h-4 text-brand-400" />
                    Teklif Özeti
                  </h3>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-th-fg-muted">Araç</span>
                      <span className="text-th-fg font-medium text-right max-w-[140px] truncate">
                        {selectedVehicle ? `${selectedVehicle.brand} ${selectedVehicle.model}` : '—'}
                      </span>
                    </div>
                    <div className="border-t border-th-border/10" />
                    <div className="flex justify-between">
                      <span className="text-th-fg-muted">Konum</span>
                      <span className="text-th-fg font-medium text-right max-w-[140px] truncate">
                        {city ? `${city}${district ? `, ${district}` : ''}` : '—'}
                      </span>
                    </div>
                    <div className="border-t border-th-border/10" />
                    <div className="flex justify-between">
                      <span className="text-th-fg-muted">Kategori</span>
                      <span className="text-th-fg font-medium text-right max-w-[140px] truncate">
                        {selectedCategoryId ? categories.find(c => c.id === Number(selectedCategoryId))?.name || '—' : 'Tümü'}
                      </span>
                    </div>
                    <div className="border-t border-th-border/10" />
                    <div className="flex justify-between">
                      <span className="text-th-fg-muted">Kapsam</span>
                      <span className="text-th-fg font-medium">
                        {scope === 'single' ? (selectedServiceName || 'Servis seçilmedi') : 'Tüm servisler'}
                      </span>
                    </div>
                    {notes && (
                      <>
                        <div className="border-t border-th-border/10" />
                        <div>
                          <span className="text-th-fg-muted">Not</span>
                          <p className="text-th-fg mt-0.5 line-clamp-2">{notes}</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {error && (
                  <div className="flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                    <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                    <span className="text-xs text-red-400">{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting || !user}
                  className={cn(
                    'w-full btn-gold py-3 text-sm font-semibold rounded-xl flex items-center justify-center gap-2',
                    (submitting || !user) && 'opacity-60 cursor-not-allowed'
                  )}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Gönderiliyor...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Teklif Talebini Gönder
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>
        </form>
      </div>
    </div>
  )
}

export default function TeklifAlPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    }>
      <TeklifAlContent />
    </Suspense>
  )
}
