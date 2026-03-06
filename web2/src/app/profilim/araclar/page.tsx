'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Car, Plus, Pencil, Trash2, X, CheckCircle, XCircle } from 'lucide-react'

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

interface Vehicle {
  id: number
  make: string
  model: string
  year: number
  plate: string
  color?: string
  mileage?: number
  fuelType?: string
  transmission?: string
  vin?: string
  package?: string
}

interface VehicleForm {
  make: string
  model: string
  year: string
  plate: string
  color: string
  mileage: string
  fuelType: string
  transmission: string
  vin: string
  package: string
}

type ToastType = 'success' | 'error' | 'info'

const emptyForm: VehicleForm = {
  make: '',
  model: '',
  year: '',
  plate: '',
  color: '',
  mileage: '',
  fuelType: '',
  transmission: '',
  vin: '',
  package: '',
}

const CURRENT_YEAR = new Date().getFullYear()
const YEARS = Array.from({ length: CURRENT_YEAR - 1989 }, (_, i) => CURRENT_YEAR - i)

const selectCls = 'w-full px-3 py-2.5 rounded-xl bg-th-bg/60 border border-th-border/[0.1] text-th-fg text-sm focus:outline-none focus:border-brand-500/50 focus:ring-2 focus:ring-brand-500/10 transition-all duration-200 disabled:opacity-50'
const inputCls = 'w-full px-3 py-2.5 rounded-xl bg-th-bg/60 border border-th-border/[0.1] text-th-fg placeholder-th-fg-muted text-sm focus:outline-none focus:border-brand-500/50 focus:ring-2 focus:ring-brand-500/10 transition-all duration-200'

export default function AraçlarımPage() {
  const router = useRouter()
  const [user, setUser] = useState<ThUser | null>(null)
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<VehicleForm>(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null)

  // Katalog state
  const [brands, setBrands] = useState<string[]>([])
  const [models, setModels] = useState<string[]>([])
  const [packages, setPackages] = useState<{ id: number; paket: string; full_model: string }[]>([])
  const [loadingModels, setLoadingModels] = useState(false)
  const [loadingPackages, setLoadingPackages] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('th_user')
      if (!stored) { router.push('/'); return }
      const u: ThUser = JSON.parse(stored)
      setUser(u)
      loadVehicles(u)
    } catch {
      router.push('/')
    }
  }, [router])

  // Markaları yükle
  useEffect(() => {
    fetch('/api/brands')
      .then(r => r.json())
      .then(d => {
        if (d.success) setBrands((d.data as { brand: string }[]).map((b) => b.brand))
      })
      .catch(() => {})
  }, [])

  // Marka değişince modelleri yükle
  const loadModels = useCallback(async (brand: string) => {
    if (!brand) { setModels([]); setPackages([]); return }
    setLoadingModels(true)
    try {
      const r = await fetch(`/api/models?brand=${encodeURIComponent(brand)}`)
      const d = await r.json()
      if (d.success) setModels((d.data as { model: string }[]).map((m) => m.model))
      else setModels([])
    } catch {
      setModels([])
    } finally {
      setLoadingModels(false)
    }
    setPackages([])
  }, [])

  // Model değişince paketleri yükle
  const loadPackages = useCallback(async (brand: string, model: string) => {
    if (!brand || !model) { setPackages([]); return }
    setLoadingPackages(true)
    try {
      const r = await fetch(`/api/packages?brand=${encodeURIComponent(brand)}&model=${encodeURIComponent(model)}`)
      const d = await r.json()
      if (d.success) setPackages(d.data as { id: number; paket: string; full_model: string }[])
      else setPackages([])
    } catch {
      setPackages([])
    } finally {
      setLoadingPackages(false)
    }
  }, [])

  const showToast = (message: string, type: ToastType) => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const loadVehicles = async (u: ThUser) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/user/vehicles?jwt=${encodeURIComponent(u.jwt)}`)
      const data = await res.json()
      if (data.success) {
        const raw = data.data || []
        setVehicles(raw.map((v: { id: number; brand?: string; model?: string; year?: number; plate?: string; color?: string; mileage?: number; fuelType?: string; transmission?: string; vin?: string; package?: string }) => ({
          id: v.id,
          make: v.brand || '',
          model: v.model || '',
          year: v.year || 0,
          plate: v.plate || '',
          color: v.color || '',
          mileage: v.mileage || 0,
          fuelType: v.fuelType || '',
          transmission: v.transmission || '',
          vin: v.vin || '',
          package: v.package || '',
        })))
      }
    } catch {
      // API hazir degil
    } finally {
      setLoading(false)
    }
  }

  const openAddModal = () => {
    setEditingId(null)
    setForm(emptyForm)
    setModels([])
    setPackages([])
    setModalOpen(true)
  }

  const openEditModal = (v: Vehicle) => {
    setEditingId(v.id)
    const f: VehicleForm = {
      make: v.make,
      model: v.model,
      year: v.year ? String(v.year) : '',
      plate: v.plate,
      color: v.color || '',
      mileage: v.mileage ? String(v.mileage) : '',
      fuelType: v.fuelType || '',
      transmission: v.transmission || '',
      vin: v.vin || '',
      package: v.package || '',
    }
    setForm(f)
    setModalOpen(true)
    // Markaya ait modelleri yükle
    if (v.make) {
      loadModels(v.make).then(() => {
        if (v.model) loadPackages(v.make, v.model)
      })
    }
  }

  const closeModal = () => {
    setModalOpen(false)
    setForm(emptyForm)
    setEditingId(null)
    setModels([])
    setPackages([])
  }

  const handleMakeChange = (brand: string) => {
    setForm(prev => ({ ...prev, make: brand, model: '', package: '' }))
    loadModels(brand)
  }

  const handleModelChange = (model: string) => {
    setForm(prev => ({ ...prev, model, package: '' }))
    if (form.make && model) loadPackages(form.make, model)
    else setPackages([])
  }

  const handleSubmit = async () => {
    if (!user) return
    if (!form.make || !form.model || !form.year || !form.plate) {
      showToast('Marka, model, yıl ve plaka zorunludur', 'error')
      return
    }

    setSubmitting(true)
    const payload = {
      make: form.make,
      brand: form.make,
      model: form.model,
      year: parseInt(form.year),
      plate: form.plate.toUpperCase(),
      licensePlate: form.plate.toUpperCase(),
      color: form.color || undefined,
      mileage: form.mileage ? parseInt(form.mileage) : undefined,
      fuelType: form.fuelType || undefined,
      transmission: form.transmission || undefined,
      vin: form.vin || undefined,
      package: form.package || undefined,
    }

    try {
      if (editingId !== null) {
        await fetch(`/api/user/vehicles/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ jwt: user.jwt, ...payload }),
        })
        showToast('Araç güncellendi', 'success')
      } else {
        await fetch(`/api/user/vehicles`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ jwt: user.jwt, ...payload }),
        })
        showToast('Araç eklendi', 'success')
      }
    } catch {
      showToast(editingId !== null ? 'Araç güncellendi (çevrimdışı)' : 'Araç eklendi (çevrimdışı)', 'info')
    } finally {
      setSubmitting(false)
    }

    closeModal()
    if (user) loadVehicles(user)
  }

  const handleDelete = async (id: number) => {
    if (!user) return
    if (!window.confirm('Bu aracı silmek istediğinize emin misiniz?')) return

    try {
      await fetch(`/api/user/vehicles/${id}?jwt=${encodeURIComponent(user.jwt)}`, { method: 'DELETE' })
      showToast('Araç silindi', 'success')
    } catch {
      showToast('Araç silindi', 'info')
    }

    setVehicles(prev => prev.filter(v => v.id !== id))
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

        {/* Baslik + Ekle butonu */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-500/15 flex items-center justify-center">
              <Car className="w-5 h-5 text-brand-500" />
            </div>
            <h1 className="text-xl font-black text-th-fg">Araçlarım</h1>
          </div>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-brand-500 hover:bg-brand-600 text-surface-900 font-bold text-sm transition-all duration-200 shadow-glow-sm hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4" />
            Yeni Ekle
          </button>
        </div>

        {/* Liste */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 rounded-2xl bg-th-overlay/5 animate-pulse" />
            ))}
          </div>
        ) : vehicles.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center border border-dashed border-th-border/20">
            <div className="w-16 h-16 rounded-full bg-brand-500/10 flex items-center justify-center mx-auto mb-4">
              <Car className="w-8 h-8 text-brand-500/60" />
            </div>
            <h3 className="text-base font-bold text-th-fg mb-2">Henüz araç eklenmemiş</h3>
            <p className="text-sm text-th-fg-muted mb-5">İlk aracınızı ekleyerek servis kayıtlarını takip edin.</p>
            <button
              onClick={openAddModal}
              className="px-6 py-2.5 rounded-full bg-brand-500 hover:bg-brand-600 text-surface-900 font-bold text-sm transition-all duration-200"
            >
              Araç Ekle
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {vehicles.map(v => (
              <div
                key={v.id}
                className="glass-card rounded-2xl p-5 flex items-center gap-4 border border-th-border/[0.06] hover:border-brand-500/20 transition-all duration-300 group hover:-translate-y-0.5 hover:shadow-card"
              >
                {/* Ikon */}
                <div className="w-14 h-14 rounded-xl bg-brand-500 flex items-center justify-center flex-shrink-0 shadow-glow-sm">
                  <Car className="w-7 h-7 text-surface-900" />
                </div>

                {/* Bilgi */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-th-fg">{v.make} {v.model}</h3>
                  <span className="inline-block bg-th-overlay/10 border border-th-border/20 px-2 py-0.5 rounded font-mono font-bold text-xs tracking-widest text-th-fg-sub mt-1 mb-1">
                    {v.plate}
                  </span>
                  <p className="text-xs text-th-fg-muted">
                    {v.year ? `${v.year} Model` : ''}
                    {v.color ? ` • ${v.color}` : ''}
                    {v.mileage ? ` • ${v.mileage.toLocaleString('tr-TR')} km` : ''}
                    {v.fuelType ? ` • ${v.fuelType}` : ''}
                    {v.package ? ` • ${v.package}` : ''}
                  </p>
                </div>

                {/* Aksiyonlar */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => openEditModal(v)}
                    className="w-9 h-9 rounded-full border border-th-border/10 bg-th-overlay/5 flex items-center justify-center text-th-fg-muted hover:text-brand-500 hover:border-brand-500/30 hover:bg-brand-500/5 transition-all duration-200"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(v.id)}
                    className="w-9 h-9 rounded-full border border-th-border/10 bg-th-overlay/5 flex items-center justify-center text-th-fg-muted hover:text-red-400 hover:border-red-400/30 hover:bg-red-400/5 transition-all duration-200"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={e => { if (e.target === e.currentTarget) closeModal() }}
        >
          <div className="glass-card rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-card">
            {/* Modal Baslik */}
            <div className="flex items-center justify-between p-5 border-b border-th-border/[0.08]">
              <h3 className="text-lg font-bold text-th-fg">
                {editingId !== null ? 'Aracı Düzenle' : 'Yeni Araç Ekle'}
              </h3>
              <button
                onClick={closeModal}
                className="w-8 h-8 rounded-full bg-th-overlay/5 flex items-center justify-center text-th-fg-muted hover:text-th-fg hover:bg-th-overlay/10 transition-all duration-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Govde */}
            <div className="p-5 space-y-4">

              {/* Marka */}
              <div>
                <label className="block text-xs font-semibold text-th-fg-sub uppercase tracking-wide mb-2">Marka *</label>
                <select
                  value={form.make}
                  onChange={e => handleMakeChange(e.target.value)}
                  className={selectCls}
                >
                  <option value="">Marka seçiniz</option>
                  {brands.map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              {/* Model */}
              <div>
                <label className="block text-xs font-semibold text-th-fg-sub uppercase tracking-wide mb-2">Model *</label>
                <select
                  value={form.model}
                  onChange={e => handleModelChange(e.target.value)}
                  disabled={!form.make || loadingModels}
                  className={selectCls}
                >
                  <option value="">
                    {loadingModels ? 'Yükleniyor...' : form.make ? 'Model seçiniz' : 'Önce marka seçiniz'}
                  </option>
                  {models.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              {/* Yil + Plaka */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-th-fg-sub uppercase tracking-wide mb-2">Yıl *</label>
                  <select
                    value={form.year}
                    onChange={e => setForm(prev => ({ ...prev, year: e.target.value }))}
                    className={selectCls}
                  >
                    <option value="">Yıl seçiniz</option>
                    {YEARS.map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-th-fg-sub uppercase tracking-wide mb-2">Plaka *</label>
                  <input
                    type="text"
                    value={form.plate}
                    onChange={e => setForm(prev => ({ ...prev, plate: e.target.value.toUpperCase() }))}
                    placeholder="34ABC123"
                    maxLength={10}
                    className={`${inputCls} font-mono tracking-widest`}
                  />
                </div>
              </div>

              {/* Paket */}
              <div>
                <label className="block text-xs font-semibold text-th-fg-sub uppercase tracking-wide mb-2">Paket / Donanim</label>
                <select
                  value={form.package}
                  onChange={e => setForm(prev => ({ ...prev, package: e.target.value }))}
                  disabled={!form.model || loadingPackages}
                  className={selectCls}
                >
                  <option value="">
                    {loadingPackages ? 'Yükleniyor...' : form.model ? 'Paket seçiniz (opsiyonel)' : 'Önce model seçiniz'}
                  </option>
                  {packages.map(p => (
                    <option key={p.id} value={p.paket}>{p.full_model}</option>
                  ))}
                </select>
              </div>

              {/* Kilometre + Renk */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-th-fg-sub uppercase tracking-wide mb-2">Kilometre</label>
                  <input
                    type="number"
                    value={form.mileage}
                    onChange={e => setForm(prev => ({ ...prev, mileage: e.target.value }))}
                    placeholder="50000"
                    min={0}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-th-fg-sub uppercase tracking-wide mb-2">Renk</label>
                  <input
                    type="text"
                    value={form.color}
                    onChange={e => setForm(prev => ({ ...prev, color: e.target.value }))}
                    placeholder="Beyaz"
                    className={inputCls}
                  />
                </div>
              </div>

              {/* Yakit + Sanziman */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-th-fg-sub uppercase tracking-wide mb-2">Yakıt Tipi</label>
                  <select
                    value={form.fuelType}
                    onChange={e => setForm(prev => ({ ...prev, fuelType: e.target.value }))}
                    className={selectCls}
                  >
                    <option value="">Seçiniz</option>
                    <option>Benzin</option>
                    <option>Dizel</option>
                    <option>LPG</option>
                    <option>Elektrik</option>
                    <option>Hibrit</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-th-fg-sub uppercase tracking-wide mb-2">Şanzıman</label>
                  <select
                    value={form.transmission}
                    onChange={e => setForm(prev => ({ ...prev, transmission: e.target.value }))}
                    className={selectCls}
                  >
                    <option value="">Seçiniz</option>
                    <option>Manuel</option>
                    <option>Otomatik</option>
                    <option>Yarı Otomatik</option>
                  </select>
                </div>
              </div>

              {/* VIN */}
              <div>
                <label className="block text-xs font-semibold text-th-fg-sub uppercase tracking-wide mb-2">VIN / Şasi No</label>
                <input
                  type="text"
                  value={form.vin}
                  onChange={e => setForm(prev => ({ ...prev, vin: e.target.value }))}
                  placeholder="17 karakter"
                  maxLength={17}
                  className={inputCls}
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-5 bg-th-overlay/[0.02] border-t border-th-border/[0.06] rounded-b-2xl">
              <button
                onClick={closeModal}
                className="px-5 py-2.5 rounded-full border border-th-border/10 text-th-fg-muted hover:text-th-fg hover:border-th-border/20 font-semibold text-sm transition-all duration-200"
              >
                İptal
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-6 py-2.5 rounded-full bg-brand-500 hover:bg-brand-600 text-surface-900 font-bold text-sm transition-all duration-200 disabled:opacity-50 shadow-glow-sm"
              >
                {submitting ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
