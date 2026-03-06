'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, User, Lock, Eye, EyeOff, Save, CheckCircle, XCircle, ShieldCheck, Mail, Phone } from 'lucide-react'

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
  birthDate?: string
  gender?: string
}

type ToastType = 'success' | 'error' | 'info'

const inputCls = 'w-full px-4 py-3 rounded-xl bg-th-bg/60 border border-th-border/[0.1] text-th-fg placeholder-th-fg-muted text-sm focus:outline-none focus:border-brand-500/50 focus:ring-2 focus:ring-brand-500/10 transition-all duration-200 disabled:opacity-50'
const labelCls = 'block text-xs font-semibold text-th-fg-sub uppercase tracking-wide mb-2'

type VerifyTarget = { type: 'phone' | 'email'; value: string } | null

export default function ProfilDuzenlePage() {
  const router = useRouter()
  const [user, setUser] = useState<ThUser | null>(null)
  const [saving, setSaving] = useState(false)
  const [loadingProfile, setLoadingProfile] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null)

  // Orijinal değerler (Strapi'den gelen)
  const originalEmail = useRef('')
  const originalPhone = useRef('')

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    adress: '',
    birthDate: '',
    gender: '',
  })

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false })

  // OTP Modal state
  const [verifyTarget, setVerifyTarget] = useState<VerifyTarget>(null)
  const [otpCode, setOtpCode] = useState('')
  const [sendingOtp, setSendingOtp] = useState(false)
  const [verifyingOtp, setVerifyingOtp] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [otpCountdown, setOtpCountdown] = useState(0)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('th_user')
      if (!stored) { router.push('/'); return }
      const u: ThUser = JSON.parse(stored)
      setUser(u)
      fetchFromStrapi(u.jwt)
    } catch {
      router.push('/')
    }
  }, [router])

  // Countdown timer for OTP resend
  useEffect(() => {
    if (otpCountdown <= 0) return
    const t = setTimeout(() => setOtpCountdown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [otpCountdown])

  const fetchFromStrapi = async (jwt: string) => {
    setLoadingProfile(true)
    try {
      const res = await fetch(`/api/auth/profile?jwt=${encodeURIComponent(jwt)}`)
      const data = await res.json()
      if (data.success && data.user) {
        const u = data.user
        setForm({
          firstName: u.firstName || '',
          lastName: u.lastName || '',
          email: u.email || '',
          phone: u.phone || '',
          adress: u.adress || '',
          birthDate: u.birthDate || '',
          gender: u.gender || '',
        })
        originalEmail.current = u.email || ''
        originalPhone.current = u.phone || ''
        const stored = localStorage.getItem('th_user')
        if (stored) {
          localStorage.setItem('th_user', JSON.stringify({ ...JSON.parse(stored), ...u }))
        }
      }
    } catch {
      // localStorage verisiyle devam
    } finally {
      setLoadingProfile(false)
    }
  }

  const showToast = (message: string, type: ToastType) => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3500)
  }

  // OTP Gönder
  const handleSendOtp = async (type: 'phone' | 'email', value: string) => {
    if (!user) return
    setSendingOtp(true)
    try {
      const res = await fetch('/api/profile/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jwt: user.jwt, userId: user.id, type, value }),
      })
      const data = await res.json()
      if (data.success) {
        setOtpSent(true)
        setOtpCountdown(60)
        showToast(type === 'phone' ? 'SMS gönderildi' : 'E-posta gönderildi', 'success')
      } else {
        showToast(data.error || 'Kod gönderilemedi', 'error')
      }
    } catch {
      showToast('Kod gönderilemedi', 'error')
    } finally {
      setSendingOtp(false)
    }
  }

  // OTP Doğrula
  const handleVerifyOtp = async () => {
    if (!user || !verifyTarget || !otpCode) return
    setVerifyingOtp(true)
    try {
      const res = await fetch('/api/profile/verify', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jwt: user.jwt,
          userId: user.id,
          type: verifyTarget.type,
          value: verifyTarget.value,
          otp: otpCode,
        }),
      })
      const data = await res.json()
      if (data.success) {
        showToast(verifyTarget.type === 'phone' ? 'Telefon doğrulandı ve güncellendi!' : 'E-posta doğrulandı ve güncellendi!', 'success')
        // localStorage güncelle
        const field = verifyTarget.type === 'phone' ? 'phone' : 'email'
        if (verifyTarget.type === 'phone') originalPhone.current = verifyTarget.value
        else originalEmail.current = verifyTarget.value
        const stored = localStorage.getItem('th_user')
        if (stored) {
          localStorage.setItem('th_user', JSON.stringify({ ...JSON.parse(stored), [field]: verifyTarget.value }))
        }
        closeVerifyModal()
      } else {
        showToast(data.error || 'Doğrulama başarısız', 'error')
      }
    } catch {
      showToast('Doğrulama başarısız', 'error')
    } finally {
      setVerifyingOtp(false)
    }
  }

  const openVerifyModal = (type: 'phone' | 'email', value: string) => {
    setVerifyTarget({ type, value })
    setOtpCode('')
    setOtpSent(false)
    setOtpCountdown(0)
    // Otomatik gönder
    handleSendOtp(type, value)
  }

  const closeVerifyModal = () => {
    setVerifyTarget(null)
    setOtpCode('')
    setOtpSent(false)
    setOtpCountdown(0)
  }

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    // Email veya telefon değişmişse doğrulama gerekli
    const emailChanged = form.email !== originalEmail.current
    const phoneChanged = form.phone !== originalPhone.current

    if (emailChanged) {
      openVerifyModal('email', form.email)
      return
    }
    if (phoneChanged) {
      openVerifyModal('phone', form.phone)
      return
    }

    // Sadece diğer alanlar değiştiyse direkt kaydet
    setSaving(true)
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jwt: user.jwt,
          id: user.id,
          name: form.firstName,
          surname: form.lastName,
          phone: form.phone,
          adress: form.adress,
          birthDate: form.birthDate || null,
          gender: form.gender || null,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (data.success === false) {
        showToast('Profil güncellenemedi', 'error')
      } else {
        const updated: ThUser = {
          ...user,
          firstName: form.firstName,
          lastName: form.lastName,
          name: [form.firstName, form.lastName].filter(Boolean).join(' ') || user.name,
          phone: form.phone,
          adress: form.adress,
          birthDate: form.birthDate,
          gender: form.gender,
        }
        localStorage.setItem('th_user', JSON.stringify(updated))
        setUser(updated)
        showToast('Profil başarıyla güncellendi!', 'success')
      }
    } catch {
      showToast('Profil güncellenemedi', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast('Yeni şifreler eşleşmiyor', 'error')
      return
    }
    if (passwordForm.newPassword.length < 6) {
      showToast('Şifre en az 6 karakter olmalı', 'error')
      return
    }
    setSaving(true)
    try {
      await fetch('/api/auth/change-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.jwt}` },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      })
      showToast('Şifre değiştirildi!', 'success')
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch {
      showToast('Şifre değiştirilemedi', 'error')
    } finally {
      setSaving(false)
    }
  }

  if (!user) return null

  const displayName = [form.firstName, form.lastName].filter(Boolean).join(' ') || user.username
  const initial = displayName.charAt(0).toUpperCase()
  const emailChanged = form.email !== originalEmail.current && form.email !== ''
  const phoneChanged = form.phone !== originalPhone.current && form.phone !== ''

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

        {/* Profil Kart */}
        <div className="glass-card rounded-2xl p-6 mb-6 flex items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-brand-500/15 border-2 border-brand-500/40 flex items-center justify-center text-brand-500 font-black text-3xl flex-shrink-0">
            {loadingProfile ? '…' : initial}
          </div>
          <div>
            <h1 className="text-xl font-black text-th-fg">{displayName}</h1>
            {form.email && <p className="text-sm text-th-fg-muted mt-1">{form.email}</p>}
            {form.phone && <p className="text-sm text-th-fg-muted">{form.phone}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Kişisel Bilgiler */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-5 pb-4 border-b border-th-border/[0.08]">
              <div className="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center">
                <User className="w-4 h-4 text-brand-500" />
              </div>
              <h2 className="text-base font-bold text-th-fg">Kişisel Bilgiler</h2>
            </div>

            <form onSubmit={handleProfileSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Ad</label>
                  <input type="text" value={form.firstName} onChange={e => setForm(p => ({ ...p, firstName: e.target.value }))} placeholder="Adınız" disabled={loadingProfile} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Soyad</label>
                  <input type="text" value={form.lastName} onChange={e => setForm(p => ({ ...p, lastName: e.target.value }))} placeholder="Soyadınız" disabled={loadingProfile} className={inputCls} />
                </div>
              </div>

              {/* E-posta — doğrulama gerekli */}
              <div>
                <label className={labelCls}>E-Posta</label>
                <div className="relative">
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                    placeholder="email@example.com"
                    disabled={loadingProfile}
                    className={`${inputCls} ${emailChanged ? 'border-amber-500/40 pr-24' : ''}`}
                  />
                  {emailChanged && (
                    <button
                      type="button"
                      onClick={() => openVerifyModal('email', form.email)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-500/15 text-amber-400 text-xs font-bold hover:bg-amber-500/25 transition-colors"
                    >
                      <Mail className="w-3 h-3" /> Doğrula
                    </button>
                  )}
                </div>
                {emailChanged && <p className="text-xs text-amber-400 mt-1">E-posta doğrulandıktan sonra kaydedilir</p>}
              </div>

              {/* Telefon — doğrulama gerekli */}
              <div>
                <label className={labelCls}>Telefon</label>
                <div className="relative">
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                    placeholder="5XXXXXXXXX"
                    maxLength={10}
                    disabled={loadingProfile}
                    className={`${inputCls} ${phoneChanged ? 'border-amber-500/40 pr-24' : ''}`}
                  />
                  {phoneChanged && (
                    <button
                      type="button"
                      onClick={() => openVerifyModal('phone', form.phone)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-500/15 text-amber-400 text-xs font-bold hover:bg-amber-500/25 transition-colors"
                    >
                      <Phone className="w-3 h-3" /> Doğrula
                    </button>
                  )}
                </div>
                {phoneChanged && <p className="text-xs text-amber-400 mt-1">Telefon SMS ile doğrulandıktan sonra kaydedilir</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Doğum Tarihi</label>
                  <input type="date" value={form.birthDate} onChange={e => setForm(p => ({ ...p, birthDate: e.target.value }))} disabled={loadingProfile} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Cinsiyet</label>
                  <select value={form.gender} onChange={e => setForm(p => ({ ...p, gender: e.target.value }))} disabled={loadingProfile} className={inputCls}>
                    <option value="">Seçiniz</option>
                    <option value="Erkek">Erkek</option>
                    <option value="Kadın">Kadın</option>
                    <option value="Belirtmek istemiyorum">Belirtmek istemiyorum</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={labelCls}>Adres</label>
                <textarea value={form.adress} onChange={e => setForm(p => ({ ...p, adress: e.target.value }))} placeholder="Adresinizi girin" rows={3} disabled={loadingProfile} className={`${inputCls} resize-none`} />
              </div>

              <button
                type="submit"
                disabled={saving || loadingProfile || emailChanged || phoneChanged}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-brand-500 hover:bg-brand-600 text-surface-900 font-bold text-sm transition-all duration-200 disabled:opacity-50 shadow-glow-sm hover:-translate-y-0.5"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Kaydediliyor...' : (emailChanged || phoneChanged) ? 'Önce e-posta / telefonu doğrulayın' : 'Değişiklikleri Kaydet'}
              </button>
            </form>
          </div>

          {/* Şifre Değiştir */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-5 pb-4 border-b border-th-border/[0.08]">
              <div className="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center">
                <Lock className="w-4 h-4 text-brand-500" />
              </div>
              <h2 className="text-base font-bold text-th-fg">Şifre Değiştir</h2>
            </div>

            <form onSubmit={handlePasswordSave} className="space-y-4">
              {([
                { key: 'current', label: 'Mevcut Şifre', field: 'currentPassword', placeholder: '••••••••' },
                { key: 'new', label: 'Yeni Şifre', field: 'newPassword', placeholder: '••••••••', hint: 'En az 6 karakter olmalıdır' },
                { key: 'confirm', label: 'Yeni Şifre (Tekrar)', field: 'confirmPassword', placeholder: '••••••••' },
              ] as Array<{ key: 'current' | 'new' | 'confirm'; label: string; field: 'currentPassword' | 'newPassword' | 'confirmPassword'; placeholder: string; hint?: string }>).map(({ key, label, field, placeholder, hint }) => (
                <div key={key}>
                  <label className={labelCls}>{label}</label>
                  <div className="relative">
                    <input
                      type={showPasswords[key] ? 'text' : 'password'}
                      value={passwordForm[field]}
                      onChange={e => setPasswordForm(p => ({ ...p, [field]: e.target.value }))}
                      placeholder={placeholder}
                      className={`${inputCls} pr-11`}
                    />
                    <button type="button" onClick={() => setShowPasswords(p => ({ ...p, [key]: !p[key] }))} className="absolute right-3 top-1/2 -translate-y-1/2 text-th-fg-muted hover:text-th-fg">
                      {showPasswords[key] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {hint && <p className="text-xs text-th-fg-muted mt-1">{hint}</p>}
                </div>
              ))}

              <button type="submit" disabled={saving} className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-brand-500 hover:bg-brand-600 text-surface-900 font-bold text-sm transition-all duration-200 disabled:opacity-50 shadow-glow-sm hover:-translate-y-0.5">
                <Lock className="w-4 h-4" />
                {saving ? 'Güncelleniyor...' : 'Şifreyi Güncelle'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* OTP Doğrulama Modalı */}
      {verifyTarget && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card rounded-2xl w-full max-w-sm p-6 shadow-card">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-full bg-brand-500/15 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-brand-500" />
              </div>
              <div>
                <h3 className="text-base font-bold text-th-fg">
                  {verifyTarget.type === 'phone' ? 'Telefon Doğrulama' : 'E-Posta Doğrulama'}
                </h3>
                <p className="text-xs text-th-fg-muted">
                  {verifyTarget.type === 'phone'
                    ? `${verifyTarget.value} numarasına SMS gönderildi`
                    : `${verifyTarget.value} adresine e-posta gönderildi`}
                </p>
              </div>
            </div>

            <div className="mb-4">
              <label className={labelCls}>Doğrulama Kodu</label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={otpCode}
                onChange={e => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="• • • • • •"
                maxLength={6}
                className={`${inputCls} text-center text-xl font-bold tracking-[0.5em]`}
                autoFocus
              />
            </div>

            <button
              onClick={handleVerifyOtp}
              disabled={verifyingOtp || otpCode.length < 6}
              className="w-full py-3 rounded-full bg-brand-500 hover:bg-brand-600 text-surface-900 font-bold text-sm mb-3 disabled:opacity-50 transition-all duration-200"
            >
              {verifyingOtp ? 'Doğrulanıyor...' : 'Doğrula'}
            </button>

            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  if (otpCountdown === 0) {
                    handleSendOtp(verifyTarget.type, verifyTarget.value)
                  }
                }}
                disabled={sendingOtp || otpCountdown > 0}
                className="text-xs text-brand-500 hover:text-brand-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {sendingOtp ? 'Gönderiliyor...' : otpCountdown > 0 ? `Tekrar gönder (${otpCountdown}s)` : 'Tekrar gönder'}
              </button>
              <button onClick={closeVerifyModal} className="text-xs text-th-fg-muted hover:text-th-fg transition-colors">
                İptal
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
