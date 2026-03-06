'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { ArrowLeft, Car, MapPin, Tag, Wrench, CheckCircle, Loader2, AlertCircle, ChevronDown, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

// ─── Türkiye İlleri ──────────────────────────────
const ILLER = [
  'Adana','Adıyaman','Afyonkarahisar','Ağrı','Amasya','Ankara','Antalya','Artvin',
  'Aydın','Balıkesir','Bilecik','Bingöl','Bitlis','Bolu','Burdur','Bursa','Çanakkale',
  'Çankırı','Çorum','Denizli','Diyarbakır','Edirne','Elazığ','Erzincan','Erzurum',
  'Eskişehir','Gaziantep','Giresun','Gümüşhane','Hakkari','Hatay','Isparta','Mersin',
  'İstanbul','İzmir','Kars','Kastamonu','Kayseri','Kırklareli','Kırşehir','Kocaeli',
  'Konya','Kütahya','Malatya','Manisa','Kahramanmaraş','Mardin','Muğla','Muş',
  'Nevşehir','Niğde','Ordu','Rize','Sakarya','Samsun','Siirt','Sinop','Sivas',
  'Tekirdağ','Tokat','Trabzon','Tunceli','Şanlıurfa','Uşak','Van','Yozgat','Zonguldak',
  'Aksaray','Bayburt','Karaman','Kırıkkale','Batman','Şırnak','Bartın','Ardahan',
  'Iğdır','Yalova','Karabük','Kilis','Osmaniye','Düzce',
]

interface Vehicle { id: number; brand: string; model: string; year: number | string; plate: string; fuelType: string }
interface Category { id: number; name: string }

export default function TeklifAlPage() {
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
  const [scope, setScope] = useState<'single' | 'all'>(servisId ? 'single' : 'all')
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([])
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [notes, setNotes] = useState('')

  // Data
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loadingVehicles, setLoadingVehicles] = useState(false)
  const [loadingCategories, setLoadingCategories] = useState(false)

  // Submit state
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load user from localStorage
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
        setVehicles(data.vehicles)
        if (data.vehicles.length === 1) setSelectedVehicleId(data.vehicles[0].id)
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

  const toggleCategory = (id: number) => {
    setSelectedCategoryIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!user) { setError('Teklif göndermek için giriş yapmanız gerekiyor.'); return }
    if (!selectedVehicleId) { setError('Lütfen araç seçin.'); return }
    if (!city) { setError('Lütfen il seçin.'); return }

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
          categoryIds: selectedCategoryIds,
          minPrice: minPrice ? parseInt(minPrice) : null,
          maxPrice: maxPrice ? parseInt(maxPrice) : null,
          notes,
          serviceId: servisId,
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
            {servisAdi
              ? `${servisAdi} servisine teklif talebiniz iletildi.`
              : 'Uygun servislere teklif talebiniz iletildi.'}
            {' '}Servisler en kısa sürede sizinle iletişime geçecek.
          </p>
          <div className="flex flex-col gap-2 pt-2">
            <button
              onClick={() => router.back()}
              className="btn-gold py-2.5 text-sm"
            >
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

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Geri butonu */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-th-fg-sub hover:text-th-fg transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Geri
        </button>

        {/* Başlık */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-th-fg font-display mb-1">
            {servisAdi ? `${servisAdi} — Teklif Al` : 'Teklif Al'}
          </h1>
          <p className="text-sm text-th-fg-sub">
            Aracınız için servislerden fiyat teklifi alın.
          </p>
        </div>

        {/* Giriş yapılmamış uyarı */}
        {!user && (
          <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-amber-300 font-medium">Giriş yapmanız gerekiyor</p>
              <p className="text-xs text-amber-400/70 mt-0.5">
                Teklif almak için servis ara sayfasından giriş yapın.
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* ─── Araç Seçimi ───────────────────── */}
          <div className="glass-card p-5 rounded-2xl space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <Car className="w-4 h-4 text-brand-400" />
              <h3 className="text-sm font-semibold text-th-fg">Araç Seçimi</h3>
            </div>

            {loadingVehicles ? (
              <div className="flex items-center gap-2 text-sm text-th-fg-sub py-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Araçlar yükleniyor...
              </div>
            ) : !user ? (
              <p className="text-sm text-th-fg-muted">Giriş yaptıktan sonra kayıtlı araçlarınız görünecek.</p>
            ) : vehicles.length === 0 ? (
              <p className="text-sm text-th-fg-muted">Kayıtlı araç bulunamadı. Lütfen önce araç ekleyin.</p>
            ) : (
              <div className="space-y-2">
                {vehicles.map(v => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setSelectedVehicleId(v.id)}
                    className={cn(
                      'w-full flex items-center justify-between p-3.5 rounded-xl border transition-all text-left',
                      selectedVehicleId === v.id
                        ? 'border-brand-500/50 bg-brand-500/10 text-th-fg'
                        : 'border-th-border/15 hover:border-th-border/30 text-th-fg-sub hover:text-th-fg'
                    )}
                  >
                    <div>
                      <span className="text-sm font-medium">{v.brand} {v.model}</span>
                      {v.year && <span className="text-xs text-th-fg-muted ml-2">{v.year}</span>}
                      {v.plate && <span className="text-xs text-th-fg-muted ml-2">• {v.plate}</span>}
                    </div>
                    {selectedVehicleId === v.id && (
                      <div className="w-4 h-4 rounded-full bg-brand-500 flex items-center justify-center shrink-0">
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ─── Konum ─────────────────────────── */}
          <div className="glass-card p-5 rounded-2xl space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="w-4 h-4 text-brand-400" />
              <h3 className="text-sm font-semibold text-th-fg">Konum</h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* İl seçimi */}
              <div className="relative">
                <label className="text-xs text-th-fg-sub block mb-1.5">İl *</label>
                <div className="relative">
                  <select
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    className="w-full appearance-none bg-th-overlay/5 border border-th-border/15 rounded-xl px-3 py-2.5 text-sm text-th-fg focus:outline-none focus:border-brand-500/40 pr-8"
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

              {/* İlçe */}
              <div>
                <label className="text-xs text-th-fg-sub block mb-1.5">İlçe</label>
                <input
                  type="text"
                  value={district}
                  onChange={e => setDistrict(e.target.value)}
                  placeholder="İlçe (opsiyonel)"
                  className="w-full bg-th-overlay/5 border border-th-border/15 rounded-xl px-3 py-2.5 text-sm text-th-fg placeholder:text-th-fg-muted focus:outline-none focus:border-brand-500/40"
                />
              </div>
            </div>
          </div>

          {/* ─── Kapsam ────────────────────────── */}
          <div className="glass-card p-5 rounded-2xl space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <Tag className="w-4 h-4 text-brand-400" />
              <h3 className="text-sm font-semibold text-th-fg">Teklif Kapsamı</h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setScope('single')}
                className={cn(
                  'flex flex-col items-center p-4 rounded-xl border text-center transition-all',
                  scope === 'single'
                    ? 'border-brand-500/50 bg-brand-500/10 text-th-fg'
                    : 'border-th-border/15 text-th-fg-sub hover:border-th-border/30 hover:text-th-fg'
                )}
              >
                <span className="text-sm font-medium mb-1">Sadece Bu Servis</span>
                <span className="text-[11px] text-th-fg-muted">
                  {servisAdi ? servisAdi : 'Seçili servisten teklif al'}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setScope('all')}
                className={cn(
                  'flex flex-col items-center p-4 rounded-xl border text-center transition-all',
                  scope === 'all'
                    ? 'border-brand-500/50 bg-brand-500/10 text-th-fg'
                    : 'border-th-border/15 text-th-fg-sub hover:border-th-border/30 hover:text-th-fg'
                )}
              >
                <span className="text-sm font-medium mb-1">Tüm Servislerden</span>
                <span className="text-[11px] text-th-fg-muted">Bölgedeki servislerden teklif al</span>
              </button>
            </div>
          </div>

          {/* ─── Hizmet Kategorileri ────────────── */}
          <div className="glass-card p-5 rounded-2xl space-y-4">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <Wrench className="w-4 h-4 text-brand-400" />
                <h3 className="text-sm font-semibold text-th-fg">Hizmet Kategorileri</h3>
              </div>
              <span className="text-xs text-th-fg-muted">(Opsiyonel)</span>
            </div>

            {loadingCategories ? (
              <div className="flex items-center gap-2 text-sm text-th-fg-sub">
                <Loader2 className="w-4 h-4 animate-spin" />
                Yükleniyor...
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => {
                  const selected = selectedCategoryIds.includes(cat.id)
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => toggleCategory(cat.id)}
                      className={cn(
                        'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all',
                        selected
                          ? 'border-brand-500/50 bg-brand-500/15 text-brand-300'
                          : 'border-th-border/15 text-th-fg-sub hover:border-th-border/30 hover:text-th-fg'
                      )}
                    >
                      {selected && <X className="w-3 h-3" />}
                      {cat.name}
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* ─── Fiyat Aralığı ──────────────────── */}
          <div className="glass-card p-5 rounded-2xl space-y-4">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="text-brand-400 text-sm font-bold">₺</span>
                <h3 className="text-sm font-semibold text-th-fg">Bütçe Aralığı</h3>
              </div>
              <span className="text-xs text-th-fg-muted">(Opsiyonel)</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-th-fg-sub block mb-1.5">Min (₺)</label>
                <input
                  type="number"
                  value={minPrice}
                  onChange={e => setMinPrice(e.target.value)}
                  placeholder="0"
                  min={0}
                  className="w-full bg-th-overlay/5 border border-th-border/15 rounded-xl px-3 py-2.5 text-sm text-th-fg placeholder:text-th-fg-muted focus:outline-none focus:border-brand-500/40"
                />
              </div>
              <div>
                <label className="text-xs text-th-fg-sub block mb-1.5">Max (₺)</label>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={e => setMaxPrice(e.target.value)}
                  placeholder="Sınır yok"
                  min={0}
                  className="w-full bg-th-overlay/5 border border-th-border/15 rounded-xl px-3 py-2.5 text-sm text-th-fg placeholder:text-th-fg-muted focus:outline-none focus:border-brand-500/40"
                />
              </div>
            </div>
          </div>

          {/* ─── Notlar ─────────────────────────── */}
          <div className="glass-card p-5 rounded-2xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-th-fg">Ek Bilgiler</h3>
              <span className="text-xs text-th-fg-muted">(Opsiyonel)</span>
            </div>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Araçla ilgili sorun, talep veya özel notlarınızı buraya yazın..."
              rows={3}
              className="w-full bg-th-overlay/5 border border-th-border/15 rounded-xl px-3 py-2.5 text-sm text-th-fg placeholder:text-th-fg-muted focus:outline-none focus:border-brand-500/40 resize-none"
            />
          </div>

          {/* ─── Hata ───────────────────────────── */}
          {error && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span className="text-sm text-red-400">{error}</span>
            </div>
          )}

          {/* ─── Gönder ─────────────────────────── */}
          <button
            type="submit"
            disabled={submitting || !user}
            className={cn(
              'w-full btn-gold py-3.5 text-base font-semibold rounded-2xl',
              (submitting || !user) && 'opacity-60 cursor-not-allowed'
            )}
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Gönderiliyor...
              </span>
            ) : (
              'Teklif Talebini Gönder'
            )}
          </button>

        </form>
      </div>
    </div>
  )
}
