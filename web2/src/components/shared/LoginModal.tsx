'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X, Eye, EyeOff, LogIn, UserPlus,
  Loader2, AlertCircle, User, Lock, Mail,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface ThUser { id: number; username: string; jwt: string; name?: string; email?: string; phone?: string; firstName?: string; lastName?: string }

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onLogin: (user: ThUser) => void
  defaultTab?: 'login' | 'register'
}

export default function LoginModal({
  isOpen,
  onClose,
  onLogin,
  defaultTab = 'login',
}: LoginModalProps) {
  const [tab, setTab] = useState<'login' | 'register'>(defaultTab)

  // Login
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [remember, setRemember] = useState(false)

  // Register
  const [regName, setRegName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [showRegPass, setShowRegPass] = useState(false)

  // Common
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Tab change → reset error
  const switchTab = (t: 'login' | 'register') => {
    setTab(t)
    setError(null)
    setLoading(false)
  }

  // Load remembered user on open
  useEffect(() => {
    if (!isOpen) return
    setError(null)
    setLoading(false)
    const saved = localStorage.getItem('th_remember_user')
    if (saved) { setIdentifier(saved); setRemember(true) }
  }, [isOpen])

  // Escape to close
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  // Scroll lock
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // ── Giriş ──────────────────────────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      })
      const data = await res.json()
      if (data.success) {
        if (remember) localStorage.setItem('th_remember_user', identifier)
        else localStorage.removeItem('th_remember_user')
        const userObj: ThUser = {
          id: data.user.id,
          username: data.user.username,
          jwt: data.jwt,
          name: data.user.name,
          email: data.user.email,
          phone: data.user.phone,
          firstName: data.user.firstName,
          lastName: data.user.lastName,
        }
        localStorage.setItem('th_user', JSON.stringify(userObj))
        onLogin(userObj)
        onClose()
      } else {
        setError(data.error || 'Giriş başarısız')
      }
    } catch {
      setError('Sunucu hatası. Lütfen tekrar deneyin.')
    }
    setLoading(false)
  }

  // ── Kayıt ──────────────────────────────────────
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: regName, email: regEmail, password: regPassword }),
      })
      const data = await res.json()
      if (data.success) {
        const userObj: ThUser = { id: data.user.id, username: data.user.username, jwt: data.jwt }
        localStorage.setItem('th_user', JSON.stringify(userObj))
        onLogin(userObj)
        onClose()
      } else {
        setError(data.error || 'Kayıt başarısız')
      }
    } catch {
      setError('Sunucu hatası. Lütfen tekrar deneyin.')
    }
    setLoading(false)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Kart */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-sm bg-th-bg border border-th-border/10 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Kapat */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-lg flex items-center justify-center text-th-fg-muted hover:text-th-fg hover:bg-th-overlay/8 transition-colors"
              aria-label="Kapat"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Üst - Logo + Sekmeler */}
            <div className="px-6 pt-6 pb-4">
              {/* Logo */}
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center shadow-md shadow-brand-500/30">
                  <span className="text-brand-950 font-display font-black text-sm leading-none">t</span>
                </div>
                <span className="font-display font-bold text-th-fg">TamirHanem</span>
              </div>

              {/* Sekmeler */}
              <div className="flex bg-th-overlay/[0.04] border border-th-border/10 rounded-xl p-1 gap-1">
                <button
                  type="button"
                  onClick={() => switchTab('login')}
                  className={cn(
                    'flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200',
                    tab === 'login'
                      ? 'bg-brand-500 text-brand-950 shadow-sm'
                      : 'text-th-fg-sub hover:text-th-fg'
                  )}
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Giriş Yap
                </button>
                <button
                  type="button"
                  onClick={() => switchTab('register')}
                  className={cn(
                    'flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200',
                    tab === 'register'
                      ? 'bg-brand-500 text-brand-950 shadow-sm'
                      : 'text-th-fg-sub hover:text-th-fg'
                  )}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  Kayıt Ol
                </button>
              </div>
            </div>

            {/* Form alanı */}
            <div className="px-6 pb-6">
              <AnimatePresence mode="wait">
                {/* ── Giriş Formu ── */}
                {tab === 'login' && (
                  <motion.form
                    key="login"
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    transition={{ duration: 0.2 }}
                    onSubmit={handleLogin}
                    className="space-y-4"
                  >
                    {/* Identifier */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-th-fg-sub">Email veya Telefon</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-th-fg-muted pointer-events-none" />
                        <input
                          type="text"
                          value={identifier}
                          onChange={e => setIdentifier(e.target.value)}
                          placeholder="ornek@email.com"
                          required
                          autoComplete="username"
                          className="w-full pl-10 pr-4 py-2.5 bg-th-overlay/5 border border-th-border/15 rounded-xl text-sm text-th-fg placeholder:text-th-fg-muted focus:outline-none focus:border-brand-500/40 transition-all"
                        />
                      </div>
                    </div>

                    {/* Şifre */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-th-fg-sub">Şifre</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-th-fg-muted pointer-events-none" />
                        <input
                          type={showPass ? 'text' : 'password'}
                          value={password}
                          onChange={e => setPassword(e.target.value)}
                          placeholder="••••••••"
                          required
                          autoComplete="current-password"
                          className="w-full pl-10 pr-10 py-2.5 bg-th-overlay/5 border border-th-border/15 rounded-xl text-sm text-th-fg placeholder:text-th-fg-muted focus:outline-none focus:border-brand-500/40 transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPass(p => !p)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-th-fg-muted hover:text-th-fg transition-colors"
                          tabIndex={-1}
                        >
                          {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Seçenekler */}
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 cursor-pointer text-xs text-th-fg-sub hover:text-th-fg transition-colors select-none">
                        <input
                          type="checkbox"
                          checked={remember}
                          onChange={e => setRemember(e.target.checked)}
                          className="accent-brand-500 rounded"
                        />
                        Beni Hatırla
                      </label>
                      <button
                        type="button"
                        className="text-xs text-brand-500 hover:text-brand-400 font-medium transition-colors"
                      >
                        Şifremi Unuttum
                      </button>
                    </div>

                    {/* Hata */}
                    {error && (
                      <div className="flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                        <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                        <span className="text-xs text-red-400">{error}</span>
                      </div>
                    )}

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full btn-gold py-2.5 text-sm rounded-xl disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Giriş yapılıyor...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          <LogIn className="w-4 h-4" />
                          Giriş Yap
                        </span>
                      )}
                    </button>

                    <p className="text-center text-xs text-th-fg-muted">
                      Hesabın yok mu?{' '}
                      <button
                        type="button"
                        onClick={() => switchTab('register')}
                        className="text-brand-500 hover:text-brand-400 font-medium transition-colors"
                      >
                        Kayıt Ol
                      </button>
                    </p>
                  </motion.form>
                )}

                {/* ── Kayıt Formu ── */}
                {tab === 'register' && (
                  <motion.form
                    key="register"
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 16 }}
                    transition={{ duration: 0.2 }}
                    onSubmit={handleRegister}
                    className="space-y-4"
                  >
                    {/* Ad Soyad */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-th-fg-sub">Ad Soyad</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-th-fg-muted pointer-events-none" />
                        <input
                          type="text"
                          value={regName}
                          onChange={e => setRegName(e.target.value)}
                          placeholder="Ad Soyad"
                          required
                          autoComplete="name"
                          className="w-full pl-10 pr-4 py-2.5 bg-th-overlay/5 border border-th-border/15 rounded-xl text-sm text-th-fg placeholder:text-th-fg-muted focus:outline-none focus:border-brand-500/40 transition-all"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-th-fg-sub">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-th-fg-muted pointer-events-none" />
                        <input
                          type="email"
                          value={regEmail}
                          onChange={e => setRegEmail(e.target.value)}
                          placeholder="ornek@email.com"
                          required
                          autoComplete="email"
                          className="w-full pl-10 pr-4 py-2.5 bg-th-overlay/5 border border-th-border/15 rounded-xl text-sm text-th-fg placeholder:text-th-fg-muted focus:outline-none focus:border-brand-500/40 transition-all"
                        />
                      </div>
                    </div>

                    {/* Şifre */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-th-fg-sub">Şifre</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-th-fg-muted pointer-events-none" />
                        <input
                          type={showRegPass ? 'text' : 'password'}
                          value={regPassword}
                          onChange={e => setRegPassword(e.target.value)}
                          placeholder="En az 6 karakter"
                          required
                          minLength={6}
                          autoComplete="new-password"
                          className="w-full pl-10 pr-10 py-2.5 bg-th-overlay/5 border border-th-border/15 rounded-xl text-sm text-th-fg placeholder:text-th-fg-muted focus:outline-none focus:border-brand-500/40 transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowRegPass(p => !p)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-th-fg-muted hover:text-th-fg transition-colors"
                          tabIndex={-1}
                        >
                          {showRegPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Hata */}
                    {error && (
                      <div className="flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                        <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                        <span className="text-xs text-red-400">{error}</span>
                      </div>
                    )}

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full btn-gold py-2.5 text-sm rounded-xl disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Kaydediliyor...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          <UserPlus className="w-4 h-4" />
                          Kayıt Ol
                        </span>
                      )}
                    </button>

                    <p className="text-center text-xs text-th-fg-muted">
                      Zaten hesabın var mı?{' '}
                      <button
                        type="button"
                        onClick={() => switchTab('login')}
                        className="text-brand-500 hover:text-brand-400 font-medium transition-colors"
                      >
                        Giriş Yap
                      </button>
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
