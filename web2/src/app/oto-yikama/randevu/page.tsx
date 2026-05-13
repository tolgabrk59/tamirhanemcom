'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Droplets, ChevronRight, ChevronLeft, Car, Calendar, Clock, CheckCircle } from 'lucide-react'

interface Vehicle {
  id: number
  brand: string
  model: string
  plate: string
  year?: number
}

const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00',
]

const TOTAL_STEPS = 4

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
        <div
          key={i}
          className={`rounded-full transition-all duration-300 ${
            i < current
              ? 'w-6 h-2.5 bg-amber-500'
              : i === current
              ? 'w-6 h-2.5 bg-amber-400'
              : 'w-2.5 h-2.5 bg-gray-700'
          }`}
        />
      ))}
    </div>
  )
}

function StepHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold text-white">{title}</h2>
      {subtitle && <p className="text-gray-400 text-sm mt-1">{subtitle}</p>}
    </div>
  )
}

export default function OtoYikamaRandevuPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [step, setStep] = useState(0)
  const [jwt, setJwt] = useState<string | null>(null)
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loadingVehicles, setLoadingVehicles] = useState(false)

  // Form state
  const [serviceId, setServiceId] = useState<number | null>(null)
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(null)
  const [appointmentDate, setAppointmentDate] = useState('')
  const [appointmentTime, setAppointmentTime] = useState('')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  // Read query params on mount
  useEffect(() => {
    const sid = searchParams.get('serviceId')
    if (sid) {
      const parsed = parseInt(sid, 10)
      if (!isNaN(parsed)) setServiceId(parsed)
    }
  }, [searchParams])

  // Auth check
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('tamirhanem_jwt') : null
    if (!token) {
      router.replace('/giris')
      return
    }
    setJwt(token)
  }, [router])

  // Fetch vehicles when entering step 1
  useEffect(() => {
    if (step !== 1 || !jwt) return
    setLoadingVehicles(true)
    fetch('/api/vehicles?populate=*', { headers: { Authorization: `Bearer ${jwt}` } })
      .then(r => r.ok ? r.json() : null)
      .then(json => {
        if (json?.data) {
          const list: Vehicle[] = Array.isArray(json.data) ? json.data : []
          setVehicles(list)
          // Pre-select if plate query param matches
          const plateParam = searchParams.get('plate')
          if (plateParam) {
            const match = list.find(v => v.plate.toLowerCase() === plateParam.toLowerCase())
            if (match) setSelectedVehicleId(match.id)
          }
        }
      })
      .catch(() => {})
      .finally(() => setLoadingVehicles(false))
  }, [step, jwt, searchParams])

  const canProceed = () => {
    if (step === 0) return serviceId !== null
    if (step === 1) return true // vehicle optional
    if (step === 2) return appointmentDate !== '' && appointmentTime !== ''
    return true
  }

  const handleNext = () => {
    if (step < TOTAL_STEPS - 1 && canProceed()) setStep(s => s + 1)
  }

  const handleBack = () => {
    if (step > 0) setStep(s => s - 1)
  }

  const handleConfirm = async () => {
    if (!jwt || !serviceId || !appointmentDate || !appointmentTime) return
    setSubmitting(true)
    setSubmitError(null)
    try {
      const res = await fetch('/api/appointments/car-wash', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          serviceId,
          vehicleId: selectedVehicleId,
          appointmentDate,
          appointmentTime,
          notes: notes.trim() || undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        setSubmitError(data.error || 'Randevu oluşturulamadı')
        return
      }
      router.push('/oto-yikama/randevularim')
    } catch {
      setSubmitError('Bağlantı hatası, lütfen tekrar deneyin')
    } finally {
      setSubmitting(false)
    }
  }

  const selectedVehicle = vehicles.find(v => v.id === selectedVehicleId)

  // Today's date as min for date picker
  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="min-h-screen bg-gray-950 text-white pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-amber-950/20 border-b border-gray-800 px-4 py-6">
        <div className="max-w-lg mx-auto">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-400 text-xs font-medium px-3 py-1.5 rounded-full mb-3 border border-amber-500/20">
            <Droplets className="w-3.5 h-3.5" />
            Oto Yıkama
          </div>
          <h1 className="text-2xl font-bold text-white">Randevu Al</h1>
          <p className="text-gray-400 text-sm mt-1">Hızlı ve kolay randevu oluşturun</p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 pt-8">
        <StepIndicator current={step} />

        {/* Step 0: Servis */}
        {step === 0 && (
          <div>
            <StepHeader title="Servis Seç" subtitle="Randevu almak istediğiniz servisi belirleyin" />
            {serviceId ? (
              <div className="bg-gray-900 border border-amber-500/40 rounded-2xl p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                  <Droplets className="w-6 h-6 text-amber-400" />
                </div>
                <div className="flex-1">
                  <p className="text-white font-semibold">Servis #{serviceId}</p>
                  <p className="text-gray-400 text-sm">Seçili servis</p>
                </div>
                <CheckCircle className="w-5 h-5 text-amber-400 shrink-0" />
              </div>
            ) : (
              <div className="bg-gray-900 border border-gray-700 rounded-2xl p-5 text-center">
                <Droplets className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                <p className="text-white font-medium mb-1">Servis seçilmedi</p>
                <p className="text-gray-400 text-sm mb-4">
                  Oto yıkama sayfasından bir servis üzerinden randevu alabilirsiniz.
                </p>
                <button
                  onClick={() => router.push('/oto-yikama')}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-amber-400 hover:text-amber-300 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Servislere Dön
                </button>
              </div>
            )}
          </div>
        )}

        {/* Step 1: Araç */}
        {step === 1 && (
          <div>
            <StepHeader title="Araç Seç" subtitle="Aracınızı seçin (isteğe bağlı)" />
            {loadingVehicles ? (
              <div className="space-y-3">
                {[1, 2].map(i => (
                  <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-4 animate-pulse h-20" />
                ))}
              </div>
            ) : vehicles.length === 0 ? (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 text-center">
                <Car className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                <p className="text-white font-medium mb-1">Kayıtlı araç yok</p>
                <p className="text-gray-400 text-sm">Araç eklemeden de devam edebilirsiniz.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {vehicles.map(vehicle => (
                  <button
                    key={vehicle.id}
                    onClick={() => setSelectedVehicleId(v => v === vehicle.id ? null : vehicle.id)}
                    className={`w-full text-left bg-gray-900 border rounded-2xl p-4 flex items-center gap-4 transition-all duration-200 ${
                      selectedVehicleId === vehicle.id
                        ? 'border-amber-500/60 shadow-md shadow-amber-900/20'
                        : 'border-gray-800 hover:border-gray-700'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      selectedVehicleId === vehicle.id ? 'bg-amber-500/10' : 'bg-gray-800'
                    }`}>
                      <Car className={`w-5 h-5 ${selectedVehicleId === vehicle.id ? 'text-amber-400' : 'text-gray-500'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold text-sm">
                        {vehicle.brand} {vehicle.model}
                        {vehicle.year ? ` (${vehicle.year})` : ''}
                      </p>
                      <p className="text-gray-400 text-xs mt-0.5">{vehicle.plate}</p>
                    </div>
                    {selectedVehicleId === vehicle.id && (
                      <CheckCircle className="w-5 h-5 text-amber-400 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 2: Tarih & Saat */}
        {step === 2 && (
          <div>
            <StepHeader title="Tarih & Saat" subtitle="Randevu için uygun gün ve saati seçin" />

            {/* Date */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-amber-400" />
                Tarih
              </label>
              <input
                type="date"
                min={today}
                value={appointmentDate}
                onChange={e => setAppointmentDate(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition-colors [color-scheme:dark]"
              />
            </div>

            {/* Time slots */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-400" />
                Saat
              </label>
              <div className="grid grid-cols-4 gap-2">
                {TIME_SLOTS.map(slot => (
                  <button
                    key={slot}
                    onClick={() => setAppointmentTime(slot)}
                    className={`py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      appointmentTime === slot
                        ? 'bg-amber-500 text-white shadow-md shadow-amber-900/30'
                        : 'bg-gray-900 border border-gray-800 text-gray-300 hover:border-gray-600 hover:text-white'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Onay */}
        {step === 3 && (
          <div>
            <StepHeader title="Randevu Özeti" subtitle="Bilgileri kontrol edin ve onaylayın" />

            <div className="bg-gray-900 border border-gray-800 rounded-2xl divide-y divide-gray-800 mb-6">
              {/* Service */}
              <div className="flex items-center gap-3 px-5 py-4">
                <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                  <Droplets className="w-4.5 h-4.5 text-amber-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-0.5">Servis</p>
                  <p className="text-white text-sm font-medium">Servis #{serviceId}</p>
                </div>
              </div>

              {/* Vehicle */}
              <div className="flex items-center gap-3 px-5 py-4">
                <div className="w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center shrink-0">
                  <Car className="w-4.5 h-4.5 text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-0.5">Araç</p>
                  <p className="text-white text-sm font-medium">
                    {selectedVehicle
                      ? `${selectedVehicle.brand} ${selectedVehicle.model} — ${selectedVehicle.plate}`
                      : 'Araç seçilmedi'}
                  </p>
                </div>
              </div>

              {/* Date & Time */}
              <div className="flex items-center gap-3 px-5 py-4">
                <div className="w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center shrink-0">
                  <Calendar className="w-4.5 h-4.5 text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-0.5">Tarih & Saat</p>
                  <p className="text-white text-sm font-medium">
                    {appointmentDate} — {appointmentTime}
                  </p>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Notlar (isteğe bağlı)
              </label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Servise iletmek istediğiniz özel notlar..."
                rows={3}
                className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition-colors placeholder-gray-600 resize-none"
              />
            </div>

            {submitError && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-sm mb-4">
                {submitError}
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center gap-3 mt-8">
          {step > 0 && (
            <button
              onClick={handleBack}
              disabled={submitting}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-gray-700 text-gray-300 text-sm font-medium hover:border-gray-600 hover:text-white transition-colors disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4" />
              Geri
            </button>
          )}

          {step < TOTAL_STEPS - 1 ? (
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex-1 flex items-center justify-center gap-1.5 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-500/40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl py-2.5 transition-colors"
            >
              İleri
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleConfirm}
              disabled={submitting || !serviceId || !appointmentDate || !appointmentTime}
              className="flex-1 flex items-center justify-center gap-1.5 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-500/40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl py-2.5 transition-colors"
            >
              {submitting ? 'Gönderiliyor...' : 'Randevuyu Onayla'}
              {!submitting && <CheckCircle className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
