'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Car,
  Wrench,
  Calendar,
  ChevronRight,
  ChevronLeft,
  Check,
  Phone,
  User,
  MapPin,
  Clock,
  Bike,
  Loader2,
  ShieldCheck,
  MessageSquare,
  Star,
  Send,
  CircleCheckBig,
} from 'lucide-react'
import AnimatedSection from '@/components/shared/AnimatedSection'
import { cn } from '@/lib/utils'
import { turkeyLocations, cityList } from '@/data/turkey-locations'

// ─── Constants ─────────────────────────────────────────────
const fuelTypes = ['Benzin', 'Dizel', 'LPG', 'Hibrit', 'Elektrik', 'Benzin + LPG']
const vehicleYears = Array.from({ length: 30 }, (_, i) => 2025 - i)
const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00',
]

const CATEGORY_TYPE_KEY = (type: string | null): string => type || 'industrial'

const CATEGORY_TYPES = [
  { key: 'industrial', label: 'Oto Servis' },
  { key: 'car_wash', label: 'Oto Yıkama' },
  { key: 'roadside', label: 'Oto Yol Yardım' },
  { key: 'car_rental', label: 'Oto Kiralama' },
  { key: 'insurance', label: 'Oto Sigorta' },
] as const

// ─── Types ─────────────────────────────────────────────────
interface CategoryItem {
  id: number
  name: string
  slug: string
  category_type: string | null
}
interface BrandItem { brand: string }
interface ModelItem { model: string }

type VehicleBodyType = 'otomobil' | 'suv' | 'minibus' | 'pickup'
interface PricingEntry { price: number; duration: number; active: boolean }
type CarWashPricing = Record<string, Record<string, PricingEntry>>

interface CampaignItem {
  id: number
  title: string
  description: string
  discount_percentage: number | null
  end_date: string | null
  campaign_code: string | null
}

interface ServiceItem {
  id: number
  name: string
  location: string
  rating: number | null
  car_wash_pricing: CarWashPricing | null
  discount: number | null
  has_discount: boolean
  discount_description: string | null
  campaigns: CampaignItem[]
}

// ─── Pricing Helpers ────────────────────────────────────────
function slugToPricingKey(slug: string): string {
  return slug.replace(/-/g, '_')
}

function calculateServicePrice(
  pricing: CarWashPricing | null,
  slugs: string[],
  bodyType: VehicleBodyType
): { total: number; duration: number; breakdown: { slug: string; price: number; duration: number }[] } | null {
  if (!pricing || slugs.length === 0) return null
  const breakdown: { slug: string; price: number; duration: number }[] = []
  let total = 0
  let duration = 0
  for (const slug of slugs) {
    const key = slugToPricingKey(slug)
    const cat = pricing[key]
    if (!cat) continue
    const entry = cat[bodyType]
    if (!entry || !entry.active) continue
    breakdown.push({ slug, price: entry.price, duration: entry.duration })
    total += entry.price
    duration += entry.duration
  }
  return breakdown.length > 0 ? { total, duration, breakdown } : null
}

function applyDiscount(price: number, percent: number | null): { original: number; discounted: number; savings: number } {
  if (!percent || percent <= 0) return { original: price, discounted: price, savings: 0 }
  const savings = Math.round(price * percent / 100)
  return { original: price, discounted: price - savings, savings }
}

/** Kampanya açıklama/başlığından "%XX" formatında indirim yüzdesi çıkarır. */
function parseDiscountFromText(text: string): number {
  if (!text) return 0
  // "%30", "% 20", "yüzde 15" gibi kalıpları yakala
  const pctMatch = text.match(/%\s*(\d{1,2})/) || text.match(/(\d{1,2})\s*%/) || text.match(/yüzde\s*(\d{1,2})/i)
  if (pctMatch) {
    const val = parseInt(pctMatch[1], 10)
    if (val > 0 && val <= 90) return val
  }
  return 0
}

/** Kampanya açıklama/başlığından "XXX TL" formatında sabit fiyat çıkarır. */
function parseFixedPriceFromText(text: string): number {
  if (!text) return 0
  // "500 TL", "500TL", "500 tl" gibi kalıpları yakala
  const match = text.match(/(\d{2,6})\s*(?:TL|tl|₺)/i)
  if (match) {
    const val = parseInt(match[1], 10)
    if (val > 0 && val < 100000) return val
  }
  return 0
}

// Servisin efektif indirim yüzdesini hesapla (servis discount veya kampanya discount — en yüksek)
// Öncelik: discount_percentage (Strapi) > açıklamadan parse (%) > sabit fiyat parse (TL vs base price)
function getEffectiveDiscount(
  srv: ServiceItem,
  basePrice?: number
): { percent: number; source: 'service' | 'campaign'; campaignTitle?: string } {
  let bestPercent = srv.discount && srv.discount > 0 ? srv.discount : 0
  let source: 'service' | 'campaign' = 'service'
  let campaignTitle: string | undefined

  for (const camp of srv.campaigns || []) {
    // 1) Strapi'deki discount_percentage
    let campPercent = camp.discount_percentage && camp.discount_percentage > 0
      ? camp.discount_percentage
      : 0

    // 2) Fallback: açıklama/başlıktan yüzde parse
    if (campPercent === 0) {
      campPercent = parseDiscountFromText(camp.description) || parseDiscountFromText(camp.title)
    }

    // 3) Fallback: sabit fiyat parse — base price ile karşılaştırıp yüzde hesapla
    if (campPercent === 0 && basePrice && basePrice > 0) {
      const fixedPrice = parseFixedPriceFromText(camp.description) || parseFixedPriceFromText(camp.title)
      if (fixedPrice > 0 && fixedPrice < basePrice) {
        campPercent = Math.round(((basePrice - fixedPrice) / basePrice) * 100)
      }
    }

    if (campPercent > bestPercent) {
      bestPercent = campPercent
      source = 'campaign'
      campaignTitle = camp.title
    }
  }

  return { percent: bestPercent, source, campaignTitle }
}

function formatPrice(amount: number): string {
  return amount.toLocaleString('tr-TR') + ' ₺'
}
interface UserVehicle {
  id: number
  brand: string
  model: string
  year: number | null
  fuelType: string | null
  plate: string | null
}

type FlowStep = 'phone' | 'otp' | 'membership' | 'form-vehicle' | 'form-service' | 'form-confirm'

// ─── Animation ─────────────────────────────────────────────
const stepVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
  }),
}

const stepsConfig = [
  { key: 'phone' as const, number: 1, label: 'Telefon', icon: Phone },
  { key: 'form-vehicle' as const, number: 2, label: 'Araç Bilgileri', icon: Car },
  { key: 'form-service' as const, number: 3, label: 'Hizmet & Konum', icon: Wrench },
  { key: 'form-confirm' as const, number: 4, label: 'Onay', icon: Calendar },
]

// ─── Component ─────────────────────────────────────────────
export default function RandevuPage() {
  const searchParams = useSearchParams()
  const [currentStep, setCurrentStep] = useState<FlowStep>('phone')
  const [direction, setDirection] = useState(1)

  // Auth (from OTP)
  const [jwt, setJwt] = useState<string | null>(null)
  const [userId, setUserId] = useState<number | null>(null)
  const [username, setUsername] = useState<string | null>(null)

  // Phone & OTP
  const [phone, setPhone] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [storedOtpCode, setStoredOtpCode] = useState('')
  const [otpCountdown, setOtpCountdown] = useState(0)
  const [kvkkAccepted, setKvkkAccepted] = useState(false)
  const [phoneVerified, setPhoneVerified] = useState(false)

  // Vehicle fields
  const [vehicleType, setVehicleType] = useState<'otomobil' | 'motorsiklet'>('otomobil')
  const [brand, setBrand] = useState('')
  const [model, setModel] = useState('')
  const [year, setYear] = useState('')
  const [fuelType, setFuelType] = useState('')

  // User's existing vehicles
  const [userVehicles, setUserVehicles] = useState<UserVehicle[]>([])
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('')

  // Service & location fields
  const [selectedCategoryType, setSelectedCategoryType] = useState('car_wash')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [vehicleBodyType, setVehicleBodyType] = useState<VehicleBodyType>('otomobil')
  const [city, setCity] = useState('')
  const [district, setDistrict] = useState('')
  const [selectedService, setSelectedService] = useState('')
  const [appointmentDate, setAppointmentDate] = useState('')
  const [appointmentTime, setAppointmentTime] = useState('')

  // Contact fields
  const [name, setName] = useState('')
  const [notes, setNotes] = useState('')

  // API data
  const [categories, setCategories] = useState<CategoryItem[]>([])
  const [brands, setBrands] = useState<BrandItem[]>([])
  const [models, setModels] = useState<ModelItem[]>([])
  const [services, setServices] = useState<ServiceItem[]>([])

  // Loading states
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [brandsLoading, setBrandsLoading] = useState(true)
  const [modelsLoading, setModelsLoading] = useState(false)
  const [servicesLoading, setServicesLoading] = useState(false)
  const [loading, setLoading] = useState(false)

  // Guest mode (üye olmadan devam)
  const [isGuestMode, setIsGuestMode] = useState(false)

  // Status
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [submitMessage, setSubmitMessage] = useState('')

  // ─── Computed ──────────────────────────────────────────────
  const districts = useMemo(() => (city ? turkeyLocations[city] || [] : []), [city])
  const filteredCategories = useMemo(() => {
    if (!selectedCategoryType) return []
    return categories.filter((cat) => CATEGORY_TYPE_KEY(cat.category_type) === selectedCategoryType)
  }, [categories, selectedCategoryType])

  const isNewUser = jwt !== null && userVehicles.length === 0

  const stepNumber = (() => {
    if (currentStep === 'phone' || currentStep === 'otp' || currentStep === 'membership') return 1
    if (currentStep === 'form-vehicle') return 2
    if (currentStep === 'form-service') return 3
    return 4
  })()

  const activeCategories = selectedCategories.length > 0
    ? selectedCategories.join(', ')
    : (selectedCategoryType ? CATEGORY_TYPES.find((t) => t.key === selectedCategoryType)?.label || '' : '')

  const selectedCategorySlugs = useMemo(() => {
    return selectedCategories
      .map((catName) => categories.find((c) => c.name === catName)?.slug || '')
      .filter(Boolean)
  }, [selectedCategories, categories])

  const selectedServiceData = useMemo(() => {
    if (!selectedService) return null
    return services.find((s) => String(s.id) === selectedService) || null
  }, [selectedService, services])

  const selectedServicePricing = useMemo(() => {
    if (!selectedServiceData?.car_wash_pricing) return null
    return calculateServicePrice(selectedServiceData.car_wash_pricing, selectedCategorySlugs, vehicleBodyType)
  }, [selectedServiceData, selectedCategorySlugs, vehicleBodyType])

  const selectedServiceDiscount = useMemo(() => {
    if (!selectedServiceData) return { percent: 0, source: 'service' as const, campaignTitle: undefined }
    return getEffectiveDiscount(selectedServiceData, selectedServicePricing?.total)
  }, [selectedServiceData, selectedServicePricing])

  const selectedServiceHasDiscount = selectedServiceDiscount.percent > 0

  const finalPricing = useMemo(() => {
    if (!selectedServicePricing) return null
    const { total, duration, breakdown } = selectedServicePricing
    const disc = applyDiscount(total, selectedServiceDiscount.percent)
    return { ...disc, duration, breakdown, discountPercent: selectedServiceDiscount.percent, campaignTitle: selectedServiceDiscount.campaignTitle }
  }, [selectedServicePricing, selectedServiceDiscount])

  const today = new Date().toISOString().split('T')[0]
  const maxDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  // ─── Effects ───────────────────────────────────────────────

  // URL parametrelerinden tarih, saat ve servis ID'si al
  useEffect(() => {
    const date = searchParams.get('date')
    const time = searchParams.get('time')
    const serviceId = searchParams.get('serviceId')
    if (date) setAppointmentDate(date)
    if (time) setAppointmentTime(time)
    if (serviceId) setSelectedService(serviceId)
  }, [searchParams])

  // OTP countdown
  useEffect(() => {
    if (otpCountdown > 0) {
      const timer = setTimeout(() => setOtpCountdown(otpCountdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [otpCountdown])

  // Fetch categories
  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => { if (data.success) setCategories(data.data) })
      .catch(() => {})
      .finally(() => setCategoriesLoading(false))
  }, [])

  // Fetch brands
  const prevVehicleTypeRef = useRef(vehicleType)
  useEffect(() => {
    const vehicleTypeChanged = prevVehicleTypeRef.current !== vehicleType
    prevVehicleTypeRef.current = vehicleType
    setBrandsLoading(true)
    // Sadece vehicleType değiştiğinde brand/model sıfırla (kayıtlı araç seçiliyse sıfırlama)
    if (vehicleTypeChanged) {
      setBrand('')
      setModel('')
      setModels([])
    }
    fetch(`/api/brands?vehicleType=${vehicleType}`)
      .then((res) => res.json())
      .then((data) => { if (data.success) setBrands(data.data) })
      .catch(() => {})
      .finally(() => setBrandsLoading(false))
  }, [vehicleType])

  // Fetch models
  const prevBrandRef = useRef(brand)
  useEffect(() => {
    const brandChanged = prevBrandRef.current !== brand
    prevBrandRef.current = brand
    if (brand) {
      setModelsLoading(true)
      // Sadece brand kullanıcı tarafından değiştirildiğinde model sıfırla
      if (brandChanged) {
        setModel((prev) => {
          // Kayıtlı araç seçiliyken brand ilk kez set edildiğinde model'i korur
          if (selectedVehicleId && selectedVehicleId !== 'new') return prev
          return ''
        })
      }
      fetch(`/api/models?brand=${encodeURIComponent(brand)}&vehicleType=${vehicleType}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) setModels(data.data)
          else setModels([])
        })
        .catch(() => setModels([]))
        .finally(() => setModelsLoading(false))
    } else {
      setModels([])
      setModel('')
    }
  }, [brand, vehicleType, selectedVehicleId])

  // Fetch services
  useEffect(() => {
    if (!city) {
      setServices([])
      setSelectedService('')
      return
    }

    setServicesLoading(true)
    setSelectedService('')
    const params = new URLSearchParams()
    params.set('city', city)
    if (district) params.set('district', district)

    if (selectedCategories.length > 0) {
      params.set('categories', selectedCategories.join(','))
    } else if (selectedCategoryType) {
      const typeCategories = categories
        .filter((c) => CATEGORY_TYPE_KEY(c.category_type) === selectedCategoryType)
        .map((c) => c.name)
        .filter((n) => n !== 'Tüm Kategoriler' && n !== 'Diğer')
      if (typeCategories.length > 0) {
        params.set('categories', typeCategories.join(','))
      }
    }

    fetch(`/api/services/search?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setServices(data.data)
        else setServices([])
      })
      .catch(() => setServices([]))
      .finally(() => setServicesLoading(false))
  }, [selectedCategories, selectedCategoryType, categories, city, district])

  // ─── Navigation ────────────────────────────────────────────
  const goToStep = (step: FlowStep) => {
    const order: FlowStep[] = ['phone', 'otp', 'membership', 'form-vehicle', 'form-service', 'form-confirm']
    const currentIdx = order.indexOf(currentStep)
    const nextIdx = order.indexOf(step)
    setDirection(nextIdx > currentIdx ? 1 : -1)
    setCurrentStep(step)
  }

  // ─── OTP Handlers ─────────────────────────────────────────
  const handleSendOTP = async () => {
    setLoading(true)
    setSubmitStatus('idle')
    try {
      const cleanPhone = phone.replace(/[\s\-\(\)]/g, '')
      const response = await fetch('/api/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: cleanPhone }),
      })
      const result = await response.json()
      if (result.success) {
        setOtpCountdown(60)
        goToStep('otp')
        setSubmitStatus('idle')
      } else {
        setSubmitStatus('error')
        setSubmitMessage(result.error)
      }
    } catch {
      setSubmitStatus('error')
      setSubmitMessage('SMS gönderilemedi. Lütfen tekrar deneyin.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async () => {
    setLoading(true)
    setSubmitStatus('idle')
    try {
      if (otpCode.length !== 6) {
        setSubmitStatus('error')
        setSubmitMessage('6 haneli doğrulama kodunu girin.')
        return
      }

      const cleanPhone = phone.replace(/[\s\-\(\)]/g, '')

      // OTP doğrula + kullanıcı oluştur/bul (Strapi web-guest-booking plugin)
      const verifyRes = await fetch('/api/otp/verify-and-register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: cleanPhone,
          code: otpCode,
          name: name || undefined,
          brand: 'BELIRLENECEK',
          model: 'BELIRLENECEK',
          plate: `WEB-${cleanPhone.slice(-4)}`,
          year: new Date().getFullYear(),
        }),
      })
      const verifyData = await verifyRes.json()

      if (!verifyData.success) {
        setSubmitStatus('error')
        setSubmitMessage(
          verifyData.error || 'Doğrulama kodu hatalı veya süresi dolmuş.'
        )
        return
      }

      // OTP doğrulandı
      setStoredOtpCode(otpCode)
      setPhoneVerified(true)

      if (verifyData.jwt) setJwt(verifyData.jwt)
      if (verifyData.user?.id) setUserId(verifyData.user.id)
      if (verifyData.user?.name) setName(verifyData.user.name)
      if (verifyData.user?.username) setUsername(verifyData.user.username)

      // Kullanıcının araçlarını çek
      let hasVehicles = false
      if (verifyData.jwt && verifyData.user?.id) {
        try {
          const vehiclesRes = await fetch(
            `/api/user/vehicles?userId=${verifyData.user.id}`,
            { headers: { Authorization: `Bearer ${verifyData.jwt}` } }
          )
          const vehiclesData = await vehiclesRes.json()
          if (vehiclesData.success && vehiclesData.data?.length > 0) {
            // "BELIRLENECEK" markasındaki placeholder araçları filtrele
            const realVehicles = vehiclesData.data.filter(
              (v: { brand: string }) => v.brand !== 'BELIRLENECEK'
            )
            if (realVehicles.length > 0) {
              hasVehicles = true
              setUserVehicles(realVehicles)
              const firstVehicle = realVehicles[0]
              setSelectedVehicleId(String(firstVehicle.id))
              setBrand(firstVehicle.brand || '')
              setModel(firstVehicle.model || '')
              setYear(firstVehicle.year ? String(firstVehicle.year) : '')
              setFuelType(firstVehicle.fuelType || '')
            }
          }
        } catch {
          // Araç çekilemezse yeni araç olarak devam
        }
      }

      goToStep(hasVehicles ? 'form-vehicle' : 'membership')
    } catch {
      setSubmitStatus('error')
      setSubmitMessage('Bir hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setLoading(false)
    }
  }

  // Kullanıcının mevcut aracını seçtiğinde formu doldur
  const handleSelectUserVehicle = (vehicleId: string) => {
    setSelectedVehicleId(vehicleId)
    if (vehicleId === 'new') {
      setBrand('')
      setModel('')
      setYear('')
      setFuelType('')
      return
    }
    const vehicle = userVehicles.find((v) => String(v.id) === vehicleId)
    if (vehicle) {
      setBrand(vehicle.brand || '')
      setModel(vehicle.model || '')
      setYear(vehicle.year ? String(vehicle.year) : '')
      setFuelType(vehicle.fuelType || '')
    }
  }

  // ─── Submit ────────────────────────────────────────────────
  const handleSubmit = async () => {
    setLoading(true)
    setSubmitStatus('idle')
    try {
      // JWT ve userId zaten handleVerifyOTP'de set edildi
      const currentJwt = jwt
      const currentUserId = userId

      // Randevu oluştur
      const response = await fetch('/api/randevu-talebi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone, name: name || undefined, city, district: district || undefined,
          brand, model, year: year || undefined, fuelType: fuelType || undefined,
          category: activeCategories, categories: selectedCategories,
          vehicle_body_type: vehicleBodyType,
          total_price: finalPricing?.discounted || undefined,
          original_price: finalPricing?.original || undefined,
          discount_percent: selectedServiceDiscount.percent || undefined,
          notes: notes || undefined,
          service_id: selectedService || undefined,
          appointment_date: appointmentDate || undefined,
          appointment_time: appointmentTime || undefined,
          jwt: currentJwt || undefined,
          userId: currentUserId || undefined,
        }),
      })
      const result = await response.json()

      if (result.success) {
        const selectedSrv = services.find((s) => String(s.id) === selectedService)
        const serviceName = selectedSrv?.name || activeCategories

        // Telegram bildirimi
        fetch('/api/notifications/whatsapp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name, phone, city, district, brand, model, year,
            category: activeCategories, notes,
            service: serviceName,
            isRegistered: !isGuestMode, username: username || undefined,
            appointmentDate, appointmentTime,
          }),
        }).catch(() => {})

        // Yeni üye ise → profil oluştur + kimlik SMS'i gönder
        if (!isGuestMode && isNewUser) {
          try {
            const profileRes = await fetch('/api/auth/create-profile', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                phone,
                name: name || undefined,
                city: city || undefined,
                district: district || undefined,
                brand, model,
                year: year || undefined,
                fuelType: fuelType || undefined,
              }),
            })
            const profileData = await profileRes.json()
            if (profileData.success && profileData.username) {
              setUsername(profileData.username)
            }
          } catch {
            // Profil oluşturulamazsa randevuyu etkilemesin
          }
        }

        // Randevu onay SMS'i
        fetch('/api/notifications/sms', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phone,
            type: 'appointment',
            name: name || username || undefined,
            serviceName: selectedSrv?.name || undefined,
            categoryName: activeCategories || undefined,
            appointmentDate: appointmentDate || undefined,
            appointmentTime: appointmentTime || undefined,
            isGuest: isGuestMode,
          }),
        }).catch(() => {})

        setSubmitStatus('success')
        setSubmitMessage('Randevu talebiniz alındı! En kısa sürede sizinle iletişime geçeceğiz.')
      } else {
        setSubmitStatus('error')
        setSubmitMessage(result.error || 'Bir hata oluştu.')
      }
    } catch {
      setSubmitStatus('error')
      setSubmitMessage('Bağlantı hatası. Lütfen tekrar deneyin.')
    } finally {
      setLoading(false)
    }
  }

  // ─── Success View ──────────────────────────────────────────
  if (submitStatus === 'success' && currentStep === 'form-confirm') {
    return (
      <div className="min-h-screen pt-24 pb-16">
        <div className="glow-dot w-96 h-96 top-0 left-1/2 -translate-x-1/2 opacity-20" />
        <section className="section-container max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-8 md:p-12 text-center"
          >
            <div className="w-20 h-20 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="text-2xl font-display font-bold text-th-fg mb-3">Randevunuz Alındı!</h2>
            <p className="text-th-fg-sub mb-6">{submitMessage}</p>

            {/* Yeni üye profil bilgisi */}
            {!isGuestMode && isNewUser && username && (
              <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 mb-6 text-left">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck className="w-4 h-4 text-green-400" />
                  <span className="text-sm font-medium text-green-400">Kullanıcı Profiliniz Oluşturuldu</span>
                </div>
                <p className="text-xs text-th-fg-sub">
                  Kullanıcı adınız: <span className="text-th-fg font-medium">{username}</span>
                </p>
                <p className="text-xs text-th-fg-sub mt-1">
                  Giriş bilgileriniz SMS ile telefonunuza gönderildi.
                </p>
              </div>
            )}

            <div className="p-5 rounded-xl bg-th-overlay/[0.03] border border-th-border/[0.08] text-left space-y-2 text-sm mb-8">
              <div className="flex justify-between">
                <span className="text-th-fg-sub">Araç</span>
                <span className="text-th-fg font-medium">{brand} {model}{year ? ` (${year})` : ''}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-th-fg-sub">Hizmet</span>
                <span className="text-th-fg font-medium">{activeCategories || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-th-fg-sub">Konum</span>
                <span className="text-th-fg font-medium">{city}{district ? ` / ${district}` : ''}</span>
              </div>
              {appointmentDate && (
                <div className="flex justify-between">
                  <span className="text-th-fg-sub">Tarih</span>
                  <span className="text-th-fg font-medium">{appointmentDate}{appointmentTime ? ` ${appointmentTime}` : ''}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-th-fg-sub">Telefon</span>
                <span className="text-th-fg font-medium">{phone}</span>
              </div>
              {finalPricing && (
                <div className="flex justify-between border-t border-th-border/[0.06] pt-2 mt-2">
                  <span className="text-th-fg-sub font-medium">Toplam Tutar</span>
                  <span className="text-brand-500 font-bold">
                    {formatPrice(finalPricing.discounted)}
                    {finalPricing.savings > 0 && (
                      <span className="text-green-400 text-xs ml-1">(%{finalPricing.discountPercent} indirim{finalPricing.campaignTitle ? ` - ${finalPricing.campaignTitle}` : ''})</span>
                    )}
                  </span>
                </div>
              )}
            </div>
            <div className="flex flex-col items-center gap-3">
              <button
                onClick={() => window.location.reload()}
                className="btn-gold px-8 py-3 text-sm"
              >
                Yeni Randevu Al
              </button>

              {isGuestMode && (
                <div className="mt-4 p-4 rounded-xl bg-brand-500/[0.05] border border-brand-500/15 text-center">
                  <p className="text-sm text-th-fg-sub mb-2">
                    Araç geçmişinizi takip edin, kampanyalardan yararlanın!
                  </p>
                  <a
                    href="https://tamirhanem.com/kayit"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-500 hover:text-brand-400 transition-colors underline underline-offset-4"
                  >
                    <User className="w-4 h-4" />
                    Hemen Üye Ol
                  </a>
                </div>
              )}
            </div>
          </motion.div>
        </section>
      </div>
    )
  }

  // ─── Render ────────────────────────────────────────────────
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="glow-dot w-96 h-96 top-0 left-1/2 -translate-x-1/2 opacity-20" />

      {/* Page Header */}
      <section className="section-container mb-12">
        <AnimatedSection>
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Randevu <span className="text-gold">Al</span>
            </h1>
            <p className="text-th-fg-sub text-lg max-w-2xl mx-auto">
              Aracın için en uygun servise hızlıca randevu oluştur.
            </p>
          </div>
        </AnimatedSection>
      </section>

      {/* Step Indicator */}
      <section className="section-container mb-12">
        <AnimatedSection delay={0.1}>
          <div className="flex items-center justify-center">
            {stepsConfig.map((s, index) => (
              <div key={s.number} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      'w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 border-2',
                      stepNumber > s.number
                        ? 'bg-green-500 border-green-500 text-th-fg'
                        : stepNumber === s.number
                          ? 'bg-brand-500 border-brand-500 text-th-fg-invert'
                          : 'border-th-fg-muted text-th-fg-muted bg-transparent'
                    )}
                  >
                    {stepNumber > s.number ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <s.icon className="w-5 h-5" />
                    )}
                  </div>
                  <span
                    className={cn(
                      'text-xs mt-2 font-medium hidden sm:block',
                      stepNumber >= s.number ? 'text-th-fg' : 'text-th-fg-muted'
                    )}
                  >
                    {s.label}
                  </span>
                </div>
                {index < stepsConfig.length - 1 && (
                  <div
                    className={cn(
                      'w-12 sm:w-20 h-0.5 mx-2 transition-all duration-500',
                      stepNumber > s.number ? 'bg-green-500' : 'bg-th-bg-alt'
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </AnimatedSection>
      </section>

      {/* Form Steps */}
      <section className="section-container max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait" custom={direction}>

          {/* ───── Step 1a: Phone Input ───── */}
          {currentStep === 'phone' && (
            <motion.div
              key="step-phone"
              custom={direction}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="glass-card p-6 md:p-8">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 rounded-full bg-brand-500/10 border-2 border-brand-500 flex items-center justify-center mx-auto mb-4">
                    <Phone className="w-8 h-8 text-brand-500" />
                  </div>
                  <h2 className="text-xl font-display font-bold text-th-fg mb-2">Telefon Numaranız</h2>
                  <p className="text-th-fg-sub text-sm">
                    Randevu oluşturmak için önce telefonunuzu doğrulayalım.
                    {' '}Daha önce kayıtlıysanız araç bilgileriniz otomatik gelecek.
                  </p>
                </div>

                <div className="max-w-sm mx-auto space-y-5">
                  <div>
                    <label className="block text-sm text-th-fg mb-2 font-medium">
                      Telefon Numarası *
                    </label>
                    <input
                      type="tel"
                      inputMode="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="5XX XXX XX XX"
                      className="input-dark text-center text-lg tracking-wide"
                      autoFocus
                    />
                  </div>

                  {/* KVKK Onayı */}
                  <label className="flex items-start gap-2.5 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={kvkkAccepted}
                      onChange={(e) => setKvkkAccepted(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded border-th-border/30 bg-th-overlay/[0.05] text-brand-500 focus:ring-brand-500/30 focus:ring-offset-0 cursor-pointer accent-[#FBC91D]"
                    />
                    <span className="text-xs text-th-fg-sub leading-relaxed">
                      <a
                        href="/kvkk"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand-500 hover:text-brand-400 underline underline-offset-2"
                      >
                        Kişisel Verilerin Korunması Aydınlatma Metni
                      </a>
                      {`'ni okudum ve kabul ediyorum. Randevu sürecinde tarafıma SMS gönderilmesine onay veriyorum.`}
                    </span>
                  </label>

                  {submitStatus === 'error' && (
                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                      {submitMessage}
                    </div>
                  )}

                  <button
                    onClick={handleSendOTP}
                    disabled={!phone.replace(/[\s\-]/g, '') || !kvkkAccepted || loading}
                    className="btn-gold w-full py-3 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        SMS Gönderiliyor...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Doğrulama Kodu Gönder
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ───── Step 1b: OTP Verify ───── */}
          {currentStep === 'otp' && (
            <motion.div
              key="step-otp"
              custom={direction}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="glass-card p-6 md:p-8">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 rounded-full bg-brand-500/10 border-2 border-brand-500 flex items-center justify-center mx-auto mb-4">
                    <ShieldCheck className="w-8 h-8 text-brand-500" />
                  </div>
                  <h2 className="text-xl font-display font-bold text-th-fg mb-2">SMS Doğrulama</h2>
                  <p className="text-th-fg-sub text-sm">
                    <span className="text-brand-500 font-medium">{phone}</span> numarasına gönderilen 6 haneli kodu giriniz
                  </p>
                </div>

                <div className="max-w-xs mx-auto space-y-6">
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="000000"
                    className="input-dark text-center text-2xl tracking-[0.3em] font-mono"
                    autoFocus
                  />

                  {otpCountdown > 0 && (
                    <p className="text-th-fg-sub text-center text-xs">
                      Yeni kod göndermek için <span className="text-brand-500 font-medium">{otpCountdown}</span> saniye bekleyin
                    </p>
                  )}

                  {submitStatus === 'error' && (
                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                      {submitMessage}
                    </div>
                  )}

                  <button
                    onClick={handleVerifyOTP}
                    disabled={otpCode.length !== 6 || loading}
                    className="btn-gold w-full py-3 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Doğrulanıyor...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        Doğrula ve Devam Et
                      </>
                    )}
                  </button>

                  <div className="flex gap-3">
                    <button
                      onClick={() => { goToStep('phone'); setSubmitStatus('idle') }}
                      className="btn-ghost flex-1 py-2.5 text-sm"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Geri Dön
                    </button>
                    <button
                      onClick={handleSendOTP}
                      disabled={otpCountdown > 0 || loading}
                      className="btn-ghost flex-1 py-2.5 text-sm disabled:opacity-50"
                    >
                      Tekrar Gönder
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ───── Membership Invitation (yeni kullanıcılar için) ───── */}
          {currentStep === 'membership' && (
            <motion.div
              key="step-membership"
              custom={direction}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="glass-card p-6 md:p-10">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 rounded-full bg-brand-500/10 border-2 border-brand-500/30 flex items-center justify-center mx-auto mb-5">
                    <User className="w-10 h-10 text-brand-500" />
                  </div>
                  <h2 className="text-xl font-display font-bold text-th-fg mb-3">
                    Üyelik Bulunamadı
                  </h2>
                  <p className="text-th-fg-sub text-sm leading-relaxed max-w-md mx-auto">
                    Sistemimizde <span className="text-brand-500 font-medium">{phone}</span> numarasına ait bir üyelik bulunamadı.
                  </p>
                </div>

                {/* Benefits */}
                <div className="p-5 rounded-xl bg-brand-500/[0.04] border border-brand-500/10 mb-8">
                  <p className="text-sm text-th-fg mb-4 font-medium">
                    Üyelik oluşturarak aşağıdaki avantajlardan yararlanabilirsiniz:
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-brand-500/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Car className="w-3.5 h-3.5 text-brand-500" />
                      </div>
                      <div>
                        <p className="text-sm text-th-fg font-medium">Araç Geçmişi Takibi</p>
                        <p className="text-xs text-th-fg-sub">Tüm bakım ve onarım geçmişinizi tek yerden takip edin</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-brand-500/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Star className="w-3.5 h-3.5 text-brand-500" />
                      </div>
                      <div>
                        <p className="text-sm text-th-fg font-medium">Kampanya & İndirimler</p>
                        <p className="text-xs text-th-fg-sub">Size özel kampanya ve indirimlerden ilk siz haberdar olun</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-brand-500/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Clock className="w-3.5 h-3.5 text-brand-500" />
                      </div>
                      <div>
                        <p className="text-sm text-th-fg font-medium">Hızlı İşlem</p>
                        <p className="text-xs text-th-fg-sub">Sonraki randevularınızda bilgileriniz hazır olsun, saniyeler içinde işleminizi tamamlayın</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-4">
                  <button
                    onClick={() => {
                      setIsGuestMode(false)
                      goToStep('form-vehicle')
                    }}
                    className="btn-gold w-full py-3.5 text-sm"
                  >
                    <User className="w-4 h-4" />
                    Üyelik Oluştur ve Devam Et
                  </button>
                  <button
                    onClick={() => {
                      setIsGuestMode(true)
                      goToStep('form-vehicle')
                    }}
                    className="w-full text-center text-sm text-th-fg-muted hover:text-brand-500 transition-colors underline underline-offset-4"
                  >
                    Üye olmadan devam et
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ───── Step 2: Araç Bilgileri ───── */}
          {currentStep === 'form-vehicle' && (
            <motion.div
              key="step-vehicle"
              custom={direction}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="glass-card p-6 md:p-8">
                {/* Verified badge */}
                <div className="flex items-center gap-2 mb-6 text-sm text-green-400">
                  <CircleCheckBig className="w-4 h-4" />
                  <span><span className="font-medium">{phone}</span> doğrulandı</span>
                </div>

                <h2 className="text-xl font-display font-bold text-th-fg mb-6 flex items-center gap-3">
                  <Car className="w-5 h-5 text-brand-500" />
                  Araç Bilgileri
                </h2>

                <div className="space-y-5">
                  {/* Mevcut Araçlar (kullanıcının kayıtlı araçları varsa) */}
                  {userVehicles.length > 0 && (
                    <div>
                      <label className="block text-sm text-th-fg mb-2 font-medium">
                        Kayıtlı Araçlarınız
                      </label>
                      <div className="space-y-2">
                        {userVehicles.map((v) => (
                          <button
                            key={v.id}
                            type="button"
                            onClick={() => handleSelectUserVehicle(String(v.id))}
                            className={cn(
                              'w-full flex items-center gap-3 p-3 rounded-xl border text-left text-sm transition-all duration-200',
                              selectedVehicleId === String(v.id)
                                ? 'border-brand-500 bg-brand-500/10 shadow-glow-sm'
                                : 'border-th-border/[0.08] bg-th-overlay/[0.03] hover:border-brand-500/30'
                            )}
                          >
                            <Car className={cn('w-5 h-5 shrink-0', selectedVehicleId === String(v.id) ? 'text-brand-500' : 'text-th-fg-sub')} />
                            <div className="flex-1 min-w-0">
                              <span className={cn('font-medium', selectedVehicleId === String(v.id) ? 'text-brand-500' : 'text-th-fg')}>
                                {v.brand} {v.model}
                              </span>
                              {(v.year || v.fuelType) && (
                                <span className="text-th-fg-sub ml-2">
                                  {v.year ? `${v.year}` : ''}{v.year && v.fuelType ? ' · ' : ''}{v.fuelType || ''}
                                </span>
                              )}
                            </div>
                            {selectedVehicleId === String(v.id) && (
                              <Check className="w-4 h-4 text-brand-500 shrink-0" />
                            )}
                          </button>
                        ))}
                        <button
                          type="button"
                          onClick={() => handleSelectUserVehicle(selectedVehicleId === 'new' ? '' : 'new')}
                          className={cn(
                            'w-full flex items-center gap-3 p-3 rounded-xl border text-left text-sm transition-all duration-200',
                            selectedVehicleId === 'new'
                              ? 'border-brand-500 bg-brand-500/10 shadow-glow-sm'
                              : 'border-th-border/[0.08] bg-th-overlay/[0.03] hover:border-brand-500/30 border-dashed'
                          )}
                        >
                          <span className={cn('text-lg leading-none', selectedVehicleId === 'new' ? 'text-brand-500' : 'text-th-fg-sub')}>+</span>
                          <span className={cn('font-medium', selectedVehicleId === 'new' ? 'text-brand-500' : 'text-th-fg-sub')}>
                            Yeni araç ekle
                          </span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Yeni araç formu - kayıtlı araç yoksa her zaman göster, varsa sadece "new" seçiliyken */}
                  <AnimatePresence initial={false}>
                    {(userVehicles.length === 0 || selectedVehicleId === 'new') && (
                      <motion.div
                        key="new-vehicle-form"
                        initial={userVehicles.length > 0 ? { height: 0, opacity: 0 } : false}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-5 pt-2">
                          {/* Araç Tipi */}
                          <div>
                            <label className="block text-sm text-th-fg mb-2 font-medium">Araç Tipi</label>
                            <div className="grid grid-cols-2 gap-3">
                              <button
                                type="button"
                                onClick={() => setVehicleType('otomobil')}
                                className={cn(
                                  'flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-medium transition-all duration-200',
                                  vehicleType === 'otomobil'
                                    ? 'bg-brand-500/10 border-brand-500 text-brand-500 shadow-glow-sm'
                                    : 'border-th-border/[0.08] text-th-fg hover:border-brand-500/30'
                                )}
                              >
                                <Car className="w-4 h-4" />
                                Otomobil
                              </button>
                              <button
                                type="button"
                                onClick={() => setVehicleType('motorsiklet')}
                                className={cn(
                                  'flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-medium transition-all duration-200',
                                  vehicleType === 'motorsiklet'
                                    ? 'bg-brand-500/10 border-brand-500 text-brand-500 shadow-glow-sm'
                                    : 'border-th-border/[0.08] text-th-fg hover:border-brand-500/30'
                                )}
                              >
                                <Bike className="w-4 h-4" />
                                Motorsiklet
                              </button>
                            </div>
                          </div>

                          {/* Kasa Tipi (fiyatlandırma için) */}
                          {vehicleType === 'otomobil' && (
                            <div>
                              <label className="block text-sm text-th-fg mb-2 font-medium">Kasa Tipi</label>
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                {([
                                  { key: 'otomobil' as const, label: 'Otomobil' },
                                  { key: 'suv' as const, label: 'SUV' },
                                  { key: 'minibus' as const, label: 'Minibüs' },
                                  { key: 'pickup' as const, label: 'Pickup' },
                                ]).map((bt) => (
                                  <button
                                    key={bt.key}
                                    type="button"
                                    onClick={() => setVehicleBodyType(bt.key)}
                                    className={cn(
                                      'py-2.5 rounded-xl border text-sm font-medium transition-all duration-200',
                                      vehicleBodyType === bt.key
                                        ? 'bg-brand-500/10 border-brand-500 text-brand-500 shadow-glow-sm'
                                        : 'border-th-border/[0.08] text-th-fg hover:border-brand-500/30'
                                    )}
                                  >
                                    {bt.label}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Marka */}
                          <div>
                            <label className="block text-sm text-th-fg mb-2 font-medium">Marka *</label>
                            <select
                              value={brand}
                              onChange={(e) => setBrand(e.target.value)}
                              className="input-dark appearance-none cursor-pointer"
                            >
                              <option value="" className="bg-th-bg-alt">
                                {brandsLoading ? 'Yükleniyor...' : 'Marka seçin'}
                              </option>
                              {brands.map((b) => (
                                <option key={b.brand} value={b.brand} className="bg-th-bg-alt">{b.brand}</option>
                              ))}
                            </select>
                          </div>

                          {/* Model */}
                          <div>
                            <label className="block text-sm text-th-fg mb-2 font-medium">Model *</label>
                            <select
                              value={model}
                              onChange={(e) => setModel(e.target.value)}
                              disabled={!brand}
                              className="input-dark appearance-none cursor-pointer disabled:opacity-50"
                            >
                              <option value="" className="bg-th-bg-alt">
                                {!brand ? 'Önce marka seçin' : modelsLoading ? 'Yükleniyor...' : 'Model seçin'}
                              </option>
                              {models.map((m) => (
                                <option key={m.model} value={m.model} className="bg-th-bg-alt">{m.model}</option>
                              ))}
                            </select>
                          </div>

                          {/* Yıl & Yakıt */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm text-th-fg mb-2 font-medium">Model Yılı</label>
                              <select
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                                className="input-dark appearance-none cursor-pointer"
                              >
                                <option value="" className="bg-th-bg-alt">Yıl seçin</option>
                                {vehicleYears.map((y) => (
                                  <option key={y} value={y} className="bg-th-bg-alt">{y}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm text-th-fg mb-2 font-medium">Yakıt Tipi</label>
                              <select
                                value={fuelType}
                                onChange={(e) => setFuelType(e.target.value)}
                                className="input-dark appearance-none cursor-pointer"
                              >
                                <option value="" className="bg-th-bg-alt">Yakıt tipi seçin</option>
                                {fuelTypes.map((f) => (
                                  <option key={f} value={f} className="bg-th-bg-alt">{f}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex justify-end mt-8">
                  <button
                    onClick={() => goToStep('form-service')}
                    disabled={!brand || !model}
                    className="btn-gold px-8 py-3 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Devam Et
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ───── Step 3: Hizmet & Konum ───── */}
          {currentStep === 'form-service' && (
            <motion.div
              key="step-service"
              custom={direction}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="glass-card p-6 md:p-8">
                <h2 className="text-xl font-display font-bold text-th-fg mb-6 flex items-center gap-3">
                  <Wrench className="w-5 h-5 text-brand-500" />
                  Hizmet & Konum
                </h2>

                <div className="space-y-5">
                  {/* Ana Kategori */}
                  <div>
                    <label className="block text-sm text-th-fg mb-2 font-medium">Hizmet Türü *</label>
                    <select
                      value={selectedCategoryType}
                      onChange={(e) => {
                        setSelectedCategoryType(e.target.value)
                        setSelectedCategories([])
                      }}
                      className="input-dark appearance-none cursor-pointer"
                    >
                      <option value="" className="bg-th-bg-alt">Hizmet türü seçin</option>
                      {CATEGORY_TYPES.map((t) => (
                        <option key={t.key} value={t.key} className="bg-th-bg-alt">{t.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Alt Kategoriler - Dropdown Çoklu Seçim */}
                  <div>
                    <label className="block text-sm text-th-fg mb-2 font-medium">
                      Hizmet Seçin *
                    </label>
                    {categoriesLoading ? (
                      <div className="flex items-center gap-2 py-3 text-sm text-th-fg-sub">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Kategoriler yükleniyor...
                      </div>
                    ) : !selectedCategoryType ? (
                      <p className="text-sm text-th-fg-muted">Önce hizmet türü seçin</p>
                    ) : filteredCategories.length === 0 ? (
                      <p className="text-sm text-th-fg-sub">Bu türde kategori bulunamadı.</p>
                    ) : (
                      <div className="relative">
                        <select
                          value=""
                          onChange={(e) => {
                            const val = e.target.value
                            if (val && !selectedCategories.includes(val)) {
                              setSelectedCategories((prev) => [...prev, val])
                            }
                          }}
                          className="input-dark appearance-none cursor-pointer"
                        >
                          <option value="" className="bg-th-bg-alt">
                            {selectedCategories.length > 0
                              ? `${selectedCategories.length} hizmet seçildi — ekle...`
                              : 'Hizmet seçin (birden fazla seçilebilir)'}
                          </option>
                          {filteredCategories
                            .filter((cat) => !selectedCategories.includes(cat.name))
                            .map((cat) => (
                              <option key={cat.id} value={cat.name} className="bg-th-bg-alt">
                                {cat.name}
                              </option>
                            ))}
                        </select>
                        {/* Seçilen hizmetler — chip'ler */}
                        {selectedCategories.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {selectedCategories.map((catName) => (
                              <span
                                key={catName}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-brand-500/10 border border-brand-500/30 text-brand-500 text-xs font-medium"
                              >
                                {catName}
                                <button
                                  type="button"
                                  onClick={() => setSelectedCategories((prev) => prev.filter((c) => c !== catName))}
                                  className="hover:text-red-400 transition-colors ml-0.5"
                                >
                                  ×
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Şehir & İlçe */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-th-fg mb-2 font-medium">
                        <MapPin className="w-3.5 h-3.5 inline mr-1" />
                        Şehir *
                      </label>
                      <select
                        value={city}
                        onChange={(e) => { setCity(e.target.value); setDistrict('') }}
                        className="input-dark appearance-none cursor-pointer"
                      >
                        <option value="" className="bg-th-bg-alt">Şehir seçin</option>
                        {cityList.map((c) => (
                          <option key={c} value={c} className="bg-th-bg-alt">{c}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-th-fg mb-2 font-medium">İlçe</label>
                      <select
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        disabled={!city}
                        className="input-dark appearance-none cursor-pointer disabled:opacity-50"
                      >
                        <option value="" className="bg-th-bg-alt">
                          {city ? 'İlçe seçin' : 'Önce şehir seçin'}
                        </option>
                        {districts.map((d) => (
                          <option key={d} value={d} className="bg-th-bg-alt">{d}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Servis Seçimi - Kompakt Fiyatlı Liste */}
                  <div>
                    <label className="block text-sm text-th-fg mb-2 font-medium">
                      <ShieldCheck className="w-3.5 h-3.5 inline mr-1" />
                      Servis Seçimi
                    </label>
                    {servicesLoading ? (
                      <div className="flex items-center gap-2 py-3 text-sm text-th-fg-sub">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Servisler yükleniyor...
                      </div>
                    ) : !city ? (
                      <div className="p-3 rounded-xl bg-th-overlay/[0.03] border border-th-border/[0.08] text-sm text-th-fg-muted">
                        Önce şehir seçin
                      </div>
                    ) : services.length === 0 ? (
                      <div className="p-3 rounded-xl bg-th-overlay/[0.03] border border-th-border/[0.08] text-sm text-th-fg-sub">
                        Bu bölgede uygun servis bulunamadı. Randevunuz alındığında size en yakın servisle eşleştirme yapılacaktır.
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                        {services.map((srv) => {
                          const isSelected = selectedService === String(srv.id)
                          const pricing = calculateServicePrice(srv.car_wash_pricing, selectedCategorySlugs, vehicleBodyType)
                          const effDiscount = getEffectiveDiscount(srv, pricing?.total)
                          const disc = pricing ? applyDiscount(pricing.total, effDiscount.percent) : null
                          const hasDiscount = effDiscount.percent > 0

                          return (
                            <button
                              key={srv.id}
                              type="button"
                              onClick={() => setSelectedService(isSelected ? '' : String(srv.id))}
                              className={cn(
                                'w-full flex flex-col gap-1.5 p-3 rounded-xl border text-left text-sm transition-all duration-200',
                                isSelected
                                  ? 'border-brand-500 bg-brand-500/10 shadow-glow-sm'
                                  : hasDiscount
                                    ? 'border-green-500/30 bg-green-500/[0.03] hover:border-green-500/50'
                                    : 'border-th-border/[0.08] bg-th-overlay/[0.03] hover:border-brand-500/30'
                              )}
                            >
                              {/* Kampanya banner */}
                              {hasDiscount && (
                                <div className="flex items-center gap-1.5 -mt-0.5">
                                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/15 border border-green-500/25 text-green-400 font-bold">
                                    %{effDiscount.percent} İNDİRİM
                                  </span>
                                  {effDiscount.campaignTitle && (
                                    <span className="text-[10px] text-green-400/80 truncate">{effDiscount.campaignTitle}</span>
                                  )}
                                </div>
                              )}
                              <div className="flex items-center gap-3">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span className={cn('font-medium truncate', isSelected ? 'text-brand-500' : 'text-th-fg')}>
                                      {srv.name}
                                    </span>
                                    {srv.rating && (
                                      <span className="text-xs text-brand-500 flex items-center gap-0.5 shrink-0">
                                        <Star className="w-3 h-3 fill-current" />
                                        {srv.rating.toFixed(1)}
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-xs text-th-fg-sub">{srv.location}</span>
                                </div>
                                <div className="text-right shrink-0">
                                  {disc && disc.original > 0 ? (
                                    <div>
                                      {hasDiscount && (
                                        <div className="text-xs text-th-fg-muted line-through">
                                          {formatPrice(disc.original)}
                                        </div>
                                      )}
                                      <span className={cn('font-bold text-sm', hasDiscount ? 'text-green-400' : 'text-th-fg')}>
                                        {formatPrice(disc.discounted)}
                                      </span>
                                      {hasDiscount && disc.savings > 0 && (
                                        <div className="text-[10px] text-green-400/70">
                                          {formatPrice(disc.savings)} kazanç
                                        </div>
                                      )}
                                    </div>
                                  ) : selectedCategories.length > 0 ? (
                                    <span className="text-xs text-th-fg-muted">Fiyat bilgisi yok</span>
                                  ) : null}
                                </div>
                                {isSelected && <Check className="w-4 h-4 text-brand-500 shrink-0" />}
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>

                  {/* İndirim Uyarısı - Misafir + İndirimli Servis */}
                  {isGuestMode && selectedServiceHasDiscount && (
                    <div className="p-4 rounded-xl bg-brand-500/[0.06] border border-brand-500/20">
                      <p className="text-sm text-th-fg mb-3">
                        Seçtiğiniz servis veya hizmetlerde <span className="text-brand-500 font-semibold">tamirhanem.com</span> üyelerine özel indirim bulunmaktadır. Lütfen üye olunuz.
                      </p>
                      <button
                        onClick={() => {
                          setIsGuestMode(false)
                          goToStep('membership')
                        }}
                        className="btn-gold w-full py-2.5 text-sm"
                      >
                        <User className="w-4 h-4" />
                        Üyelik Oluştur
                      </button>
                    </div>
                  )}

                  {/* Tarih & Saat */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-th-fg mb-2 font-medium">
                        <Calendar className="w-3.5 h-3.5 inline mr-1" />
                        Tarih
                      </label>
                      <input
                        type="date"
                        value={appointmentDate}
                        onChange={(e) => setAppointmentDate(e.target.value)}
                        min={today}
                        max={maxDate}
                        className="input-dark cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-th-fg mb-2 font-medium">
                        <Clock className="w-3.5 h-3.5 inline mr-1" />
                        Saat
                      </label>
                      <select
                        value={appointmentTime}
                        onChange={(e) => setAppointmentTime(e.target.value)}
                        className="input-dark appearance-none cursor-pointer"
                      >
                        <option value="" className="bg-th-bg-alt">Saat seçin</option>
                        {timeSlots.map((t) => (
                          <option key={t} value={t} className="bg-th-bg-alt">{t}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between mt-8">
                  <button onClick={() => goToStep('form-vehicle')} className="btn-ghost px-6 py-3 text-sm">
                    <ChevronLeft className="w-4 h-4" />
                    Geri
                  </button>
                  <button
                    onClick={() => goToStep('form-confirm')}
                    disabled={!city || !selectedCategoryType || selectedCategories.length === 0 || (isGuestMode && selectedServiceHasDiscount)}
                    className="btn-gold px-8 py-3 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Devam Et
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ───── Step 4: Onay & Gönder ───── */}
          {currentStep === 'form-confirm' && (
            <motion.div
              key="step-confirm"
              custom={direction}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="glass-card p-6 md:p-8">
                <h2 className="text-xl font-display font-bold text-th-fg mb-6 flex items-center gap-3">
                  <CircleCheckBig className="w-5 h-5 text-brand-500" />
                  Randevu Onayı
                </h2>

                {/* Ad Soyad — kayıtlı kullanıcıdan gelmemişse sor */}
                <div className="mb-6">
                  <label className="block text-sm text-th-fg mb-2 font-medium">
                    <User className="w-3.5 h-3.5 inline mr-1" />
                    Ad Soyad
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Adınız ve soyadınız"
                    className="input-dark"
                  />
                </div>

                {/* Ek Notlar */}
                <div className="mb-6">
                  <label className="block text-sm text-th-fg mb-2 font-medium">
                    <MessageSquare className="w-3.5 h-3.5 inline mr-1" />
                    Ek Notlar
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Aracınızdaki sorunu detaylı açıklayabilirsiniz..."
                    rows={3}
                    className="input-dark resize-none"
                  />
                </div>

                {/* Summary Card */}
                <div className="p-5 rounded-xl bg-th-overlay/[0.03] border border-th-border/[0.08]">
                  <h3 className="text-sm font-display font-semibold text-brand-500 mb-4">Randevu Özeti</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-th-fg-sub flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5" /> Telefon
                      </span>
                      <span className="text-th-fg font-medium flex items-center gap-1.5">
                        {phone}
                        <span className="text-green-400 text-xs flex items-center gap-0.5">
                          <Check className="w-3 h-3" /> Doğrulandı
                        </span>
                      </span>
                    </div>
                    {name && (
                      <div className="flex justify-between">
                        <span className="text-th-fg-sub flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5" /> Ad Soyad
                        </span>
                        <span className="text-th-fg font-medium">{name}</span>
                      </div>
                    )}
                    <div className="border-t border-th-border/[0.06] my-2" />
                    <div className="flex justify-between">
                      <span className="text-th-fg-sub flex items-center gap-1.5">
                        <Car className="w-3.5 h-3.5" /> Araç
                      </span>
                      <span className="text-th-fg font-medium">
                        {brand} {model}{year ? ` (${year})` : ''}
                      </span>
                    </div>
                    {fuelType && (
                      <div className="flex justify-between">
                        <span className="text-th-fg-sub">Yakıt</span>
                        <span className="text-th-fg font-medium">{fuelType}</span>
                      </div>
                    )}
                    <div className="border-t border-th-border/[0.06] my-2" />
                    <div className="flex justify-between">
                      <span className="text-th-fg-sub flex items-center gap-1.5">
                        <Wrench className="w-3.5 h-3.5" /> Hizmetler
                      </span>
                      <span className="text-th-fg font-medium text-right max-w-[60%]">
                        {selectedCategories.length > 0 ? selectedCategories.join(', ') : CATEGORY_TYPES.find((t) => t.key === selectedCategoryType)?.label || '-'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-th-fg-sub flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" /> Konum
                      </span>
                      <span className="text-th-fg font-medium">
                        {city}{district ? ` / ${district}` : ''}
                      </span>
                    </div>
                    {selectedService && (
                      <div className="flex justify-between">
                        <span className="text-th-fg-sub">Servis</span>
                        <span className="text-th-fg font-medium flex items-center gap-1">
                          {selectedServiceData?.name || '-'}
                          {selectedServiceData?.rating && (
                            <span className="text-brand-500 text-xs flex items-center gap-0.5">
                              <Star className="w-3 h-3 fill-current" />
                              {selectedServiceData.rating.toFixed(1)}
                            </span>
                          )}
                        </span>
                      </div>
                    )}
                    {appointmentDate && (
                      <div className="flex justify-between">
                        <span className="text-th-fg-sub flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" /> Tarih
                        </span>
                        <span className="text-th-fg font-medium">
                          {appointmentDate}{appointmentTime ? ` ${appointmentTime}` : ''}
                        </span>
                      </div>
                    )}

                    {/* Fiyat Dökümü */}
                    {finalPricing && (
                      <>
                        <div className="border-t border-th-border/[0.06] my-2" />
                        <div className="space-y-1.5">
                          <span className="text-xs text-th-fg-muted font-medium uppercase tracking-wide">Fiyat Detayı</span>
                          {finalPricing.breakdown.map((item) => {
                            const catName = categories.find((c) => c.slug === item.slug)?.name || item.slug
                            return (
                              <div key={item.slug} className="flex justify-between text-xs">
                                <span className="text-th-fg-sub">{catName}</span>
                                <span className="text-th-fg">{formatPrice(item.price)}</span>
                              </div>
                            )
                          })}
                          {finalPricing.savings > 0 && (
                            <div className="flex justify-between text-xs">
                              <span className="text-green-400">İndirim (%{finalPricing.discountPercent}{finalPricing.campaignTitle ? ` - ${finalPricing.campaignTitle}` : ''})</span>
                              <span className="text-green-400">-{formatPrice(finalPricing.savings)}</span>
                            </div>
                          )}
                          <div className="border-t border-th-border/[0.06] pt-1.5 flex justify-between">
                            <span className="text-sm font-semibold text-th-fg">Toplam</span>
                            <span className="text-sm font-bold text-brand-500">{formatPrice(finalPricing.discounted)}</span>
                          </div>
                          <p className="text-[11px] text-th-fg-muted">Tahmini süre: {finalPricing.duration} dakika</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {submitStatus === 'error' && (
                  <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    {submitMessage}
                  </div>
                )}

                <div className="flex justify-between mt-8">
                  <button onClick={() => goToStep('form-service')} className="btn-ghost px-6 py-3 text-sm">
                    <ChevronLeft className="w-4 h-4" />
                    Geri
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="btn-gold px-8 py-3 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Gönderiliyor...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Randevu Oluştur
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </section>
    </div>
  )
}
