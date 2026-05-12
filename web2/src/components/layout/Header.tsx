'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ChevronRight, ChevronDown, Sun, Moon, Car, BookOpen, Building2, Bell, Phone, LogIn, UserPlus, UserCircle, Heart, Tag, LogOut, Wallet, Home, Search, CalendarDays, Zap, MapPin, MessageSquare } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTheme } from '@/components/providers/ThemeProvider'
import LoginModal from '@/components/shared/LoginModal'
import LocationPickerModal from '@/components/shared/LocationPickerModal'
import { useLocationStore } from '@/lib/useLocationStore'

interface ThUser { id: number; username: string; jwt: string; name?: string; email?: string; phone?: string; firstName?: string; lastName?: string }

// ─── Tipler ──────────────────────────────────────
interface MegaMenuItem {
  href: string
  label: string
  desc?: string
}

interface MegaMenuColumn {
  title: string
  items: MegaMenuItem[]
}

interface MegaMenuDef {
  key: string
  label: string
  icon: LucideIcon
  columns: MegaMenuColumn[]
}

// ─── Sabitler ────────────────────────────────────
const SIMPLE_LINKS: { label: string; href: string; icon: LucideIcon }[] = [
  { label: 'Kurumsal', href: '/kurumsal', icon: Building2 },
  { label: 'İletişim', href: '/iletisim', icon: Phone },
]

const MEGA_MENUS: MegaMenuDef[] = [
  {
    key: 'aracim',
    label: 'Araç Bilgi Bankası',
    icon: Car,
    columns: [
      {
        title: 'Temel Bilgiler',
        items: [
          { href: '/arac/genel-bakis', label: 'Aracınıza Genel Bakış', desc: 'Aracınızın tüm özelliklerini görün' },
          { href: '/arac-degeri', label: 'Araç Değeri Hesapla', desc: 'Güncel piyasa değerini öğrenin' },
          { href: '/arac/bakim-tavsiyeleri', label: 'Bakım Tavsiyeleri', desc: 'Kişiselleştirilmiş bakım önerileri' },
          { href: '/arac/ansiklopedi', label: 'Araç Ansiklopedisi', desc: 'Marka ve model bilgi bankası' },
          { href: '/arac/yedek-parca', label: 'Parça Kütüphanesi', desc: 'Yedek parça rehberi' },
          { href: '/arac/2-el-parca', label: '2.El Parça Pazaryeri', desc: 'Uygun fiyatlı ikinci el parçalar' },
          { href: '/arac/lastik-secimi', label: 'Lastik Seçimi', desc: 'Aracınıza uygun lastik bulun' },
          { href: '/arac/ariza-lambalari', label: 'Arıza Lambaları', desc: 'Gösterge lambalarını anlayın' },
        ],
      },
      {
        title: 'Sorun Giderme',
        items: [
          { href: '/ariza-rehberi', label: 'Arıza Rehberi', desc: 'Adım adım arıza teşhisi' },
          { href: '/kronik-sorunlar', label: 'Kronik Sorunlar', desc: 'Model bazlı bilinen sorunlar' },
          { href: '/geri-cagrima', label: 'Geri Çağırmalar', desc: 'Üretici geri çağırma bildirimleri' },
          { href: '/obd', label: 'OBD-II Kodları', desc: 'Arıza kodlarını anlamlandırın' },
          { href: '/bakim-planlama', label: 'Bakım Planlama', desc: 'Bakım takvimi oluşturun' },
          { href: '/arac/park-mesaj', label: 'Hatalı Park Bildirimi', desc: 'Park ihlali bildir' },
          { href: '/arac/plaka-kayit', label: 'Plakamı Kaydet', desc: 'Plaka bilgilerinizi kaydedin' },
        ],
      },
    ],
  },
  {
    key: 'rehber',
    label: 'Araç Rehberi',
    icon: BookOpen,
    columns: [
      {
        title: 'Araştırma',
        items: [
          { href: '/incelemeler', label: 'Araba İncelemeleri', desc: 'Diğer araç sahiplerinin yorumları' },
          { href: '/karsilastirma', label: 'Önceki Karşılaştırmalar', desc: 'Yapılmış karşılaştırmaları görün' },
          { href: '/karsilastirma/olustur', label: 'Araba Karşılaştır', desc: 'İki aracı yan yana kıyaslayın' },
          { href: '/guvenilirlik', label: 'Güvenilirlik Derecelendirmeleri', desc: 'Marka ve model istatistikleri' },
          { href: '/arac/workshop-kilavuzlari', label: 'Workshop Kılavuzları', desc: 'Kendin yap rehberleri' },
          { href: '/arac/videolar', label: 'Video İçerik Merkezi', desc: 'Eğitici video içerikler' },
        ],
      },
    ],
  },
]

const SCROLL_THRESHOLD = 20

// ─── Component ──────────────────────────────────
export default function Header() {
  const pathname = usePathname()
  const { theme, toggleTheme } = useTheme()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [openMobileSubmenu, setOpenMobileSubmenu] = useState<string | null>(null)
  const menuTimeoutRef = useRef<NodeJS.Timeout>()

  // ─── Oturum / Bildirim ───────────────────────
  const [thUser, setThUser] = useState<ThUser | null>(null)
  const [notifCount, setNotifCount] = useState(0)
  const [msgCount, setMsgCount] = useState(0)
  const [notifications, setNotifications] = useState<Array<{ id: number; title?: string; message?: string; type?: string; read?: boolean; createdAt?: string }>>([])
  const [notifPanelOpen, setNotifPanelOpen] = useState(false)
  const notifRef = useRef<HTMLDivElement>(null)
  const [walletBalance, setWalletBalance] = useState<number | null>(null)
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)

  // ─── Konum ───────────────────────────────────
  const { location: userLocation, hasLocation } = useLocationStore()
  const [locationModalOpen, setLocationModalOpen] = useState(false)

  // ─── Login Modal ──────────────────────────────
  const [loginModalOpen, setLoginModalOpen] = useState(false)
  const [loginModalTab, setLoginModalTab] = useState<'login' | 'register'>('login')

  const openLogin = () => { setLoginModalTab('login'); setLoginModalOpen(true) }
  const openRegister = () => { setLoginModalTab('register'); setLoginModalOpen(true) }

  const handleModalLogin = (user: ThUser) => {
    setThUser(user)
  }

  // Global event listener — Sidebar ve diğer bileşenler tetikleyebilir
  useEffect(() => {
    const onOpen = (e: Event) => {
      const tab = (e as CustomEvent<{ tab?: 'login' | 'register' }>).detail?.tab
      setLoginModalTab(tab === 'register' ? 'register' : 'login')
      setLoginModalOpen(true)
    }
    window.addEventListener('open-login-modal', onOpen)
    return () => window.removeEventListener('open-login-modal', onOpen)
  }, [])

  useEffect(() => {
    try {
      const stored = localStorage.getItem('th_user')
      if (stored) setThUser(JSON.parse(stored))
    } catch {}
  }, [])

  // Bildirimleri çek (her 60 saniyede bir)
  useEffect(() => {
    if (!thUser) return
    const fetchNotifs = async () => {
      try {
        const res = await fetch(`/api/user/notifications-full?jwt=${encodeURIComponent(thUser.jwt)}`)
        const data = await res.json()
        if (data.success && data.data?.data) {
          const items = data.data.data as Array<{ id: number; title?: string; message?: string; type?: string; read?: boolean; createdAt?: string }>
          setNotifications(items.slice(0, 8))
          const unread = items.filter((n) => !n.read).length
          setNotifCount(unread)
        }
      } catch {}
    }
    const fetchMsgs = async () => {
      try {
        const res = await fetch(`/api/user/messages?jwt=${encodeURIComponent(thUser.jwt)}`)
        const data = await res.json()
        if (data.success && Array.isArray(data.conversations)) {
          const total = data.conversations.reduce((sum: number, c: { unreadCount?: number }) => sum + (c.unreadCount || 0), 0)
          setMsgCount(total)
        }
      } catch {}
    }
    fetchNotifs()
    fetchMsgs()
    const timer = setInterval(() => { fetchNotifs(); fetchMsgs() }, 60_000)
    // Bildirim/mesaj sayfalarından gelen güncelleme event'lerini dinle
    const onBadgeUpdate = () => { fetchNotifs(); fetchMsgs() }
    window.addEventListener('badge-update', onBadgeUpdate)
    return () => { clearInterval(timer); window.removeEventListener('badge-update', onBadgeUpdate) }
  }, [thUser])

  // Cüzdan bakiyesini çek
  useEffect(() => {
    if (!thUser) { setWalletBalance(null); return }
    const fetchWallet = async () => {
      try {
        const res = await fetch(`/api/user/wallet?jwt=${encodeURIComponent(thUser.jwt)}`)
        const data = await res.json()
        if (data.success) setWalletBalance(data.data?.balance ?? 0)
      } catch {}
    }
    fetchWallet()
  }, [thUser])

  // Profil dropdown dışına tıklanınca kapat
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('th_user')
    setThUser(null)
    setNotifCount(0)
    setMsgCount(0)
    setProfileOpen(false)
  }

  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > SCROLL_THRESHOLD)
  }, [])

  useEffect(() => {
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  useEffect(() => {
    setIsMobileMenuOpen(false)
    setActiveMenu(null)
    setOpenMobileSubmenu(null)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isMobileMenuOpen])

  const isActiveLink = (href: string): boolean => {
    if (href === '/') return pathname === '/'
    if (href.includes('#') || href.includes('?')) return false
    return pathname.startsWith(href)
  }

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    if (href === '/' && pathname === '/') {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleMenuEnter = (key: string) => {
    clearTimeout(menuTimeoutRef.current)
    setActiveMenu(key)
  }

  const handleMenuLeave = () => {
    menuTimeoutRef.current = setTimeout(() => setActiveMenu(null), 150)
  }

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 lg:left-16 right-0 z-50 transition-all duration-500 safe-top',
          isScrolled
            ? 'bg-th-bg/95 backdrop-blur-xl border-b border-th-border/[0.06] shadow-lg shadow-black/10'
            : 'bg-th-bg/80 backdrop-blur-md border-b border-th-border/[0.04] lg:bg-transparent lg:border-transparent'
        )}
      >
        <nav className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 sm:h-16 items-center">
            {/* Logo */}
            <Link
              href="/"
              onClick={(e) => handleNavClick(e, '/')}
              className="relative z-10 flex items-center gap-2 group"
            >
              <motion.span
                className="text-gold font-display text-xl font-extrabold tracking-tight"
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                TamirHanem
              </motion.span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-0.5 xl:gap-1">
              {/* Kurumsal */}
              {(() => {
                const FirstIcon = SIMPLE_LINKS[0].icon
                return (
                  <Link
                    href={SIMPLE_LINKS[0].href}
                    className={cn(
                      'relative flex items-center gap-1 px-2 xl:px-3 py-2 font-medium transition-colors duration-300 rounded-lg whitespace-nowrap',
                      isActiveLink(SIMPLE_LINKS[0].href) ? 'text-brand-500' : 'text-th-fg-sub hover:text-th-fg'
                    )}
                    style={{ fontSize: 'clamp(11px, 1.1vw, 14px)' }}
                  >
                    <FirstIcon className="w-4 h-4 shrink-0" />
                    {SIMPLE_LINKS[0].label}
                    {isActiveLink(SIMPLE_LINKS[0].href) && (
                      <motion.span layoutId="headerActiveNav" className="absolute bottom-0 left-2 right-2 h-[2px] bg-brand-500 rounded-full" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />
                    )}
                  </Link>
                )
              })()}

              {/* Mega menu triggers */}
              {MEGA_MENUS.map((menu) => {
                const Icon = menu.icon
                const isOpen = activeMenu === menu.key
                return (
                  <div
                    key={menu.key}
                    className="relative"
                    onMouseEnter={() => handleMenuEnter(menu.key)}
                    onMouseLeave={handleMenuLeave}
                  >
                    <button
                      type="button"
                      className={cn(
                        'flex items-center gap-1 px-2 xl:px-3 py-2 font-medium rounded-lg transition-all duration-300 whitespace-nowrap',
                        isOpen
                          ? 'text-brand-500 bg-brand-500/10'
                          : 'text-th-fg-sub hover:text-th-fg'
                      )}
                      style={{ fontSize: 'clamp(11px, 1.1vw, 14px)' }}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      {menu.label}
                      <ChevronDown className={cn('w-3 h-3 transition-transform duration-200 shrink-0', isOpen && 'rotate-180')} />
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-0 pt-2 z-50"
                        >
                          <div
                            className={cn(
                              'bg-th-bg/95 backdrop-blur-xl rounded-xl border border-th-border/[0.08] shadow-2xl shadow-black/20 overflow-hidden',
                              menu.columns.length > 1 ? 'w-[560px]' : 'w-[320px]'
                            )}
                          >
                            <div className="bg-gradient-to-r from-brand-500/20 to-brand-500/5 px-4 py-2.5 border-b border-th-border/[0.06]">
                              <div className="flex items-center gap-2">
                                <Icon className="w-4 h-4 text-brand-500" />
                                <h3 className="text-sm font-semibold text-brand-500 font-display">{menu.label}</h3>
                              </div>
                            </div>

                            <div className={cn('p-3', menu.columns.length > 1 && 'grid grid-cols-2 gap-3')}>
                              {menu.columns.map((column, idx) => (
                                <div key={idx}>
                                  <p className="text-[10px] font-semibold uppercase tracking-wider text-brand-500/60 mb-2 px-2 flex items-center gap-2">
                                    <span className="w-4 h-px bg-brand-500/30 rounded" />
                                    {column.title}
                                  </p>
                                  <div className="space-y-0.5">
                                    {column.items.map((item) => (
                                      <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setActiveMenu(null)}
                                        className="flex flex-col px-3 py-2 rounded-lg hover:bg-brand-500/10 transition-colors group"
                                      >
                                        <span className="text-sm font-medium text-th-fg group-hover:text-brand-500 transition-colors">
                                          {item.label}
                                        </span>
                                        {item.desc && (
                                          <span className="text-[11px] text-th-fg-muted mt-0.5">{item.desc}</span>
                                        )}
                                      </Link>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              })}

              {/* Mega menüler sonrası linkler */}
              {SIMPLE_LINKS.slice(1).map((link) => {
                const LinkIcon = link.icon
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'relative flex items-center gap-1 px-2 xl:px-3 py-2 font-medium transition-colors duration-300 rounded-lg whitespace-nowrap',
                      isActiveLink(link.href) ? 'text-brand-500' : 'text-th-fg-sub hover:text-th-fg'
                    )}
                    style={{ fontSize: 'clamp(11px, 1.1vw, 14px)' }}
                  >
                    <LinkIcon className="w-4 h-4 shrink-0" />
                    {link.label}
                    {isActiveLink(link.href) && (
                      <motion.span layoutId="headerActiveNav" className="absolute bottom-0 left-2 right-2 h-[2px] bg-brand-500 rounded-full" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />
                    )}
                  </Link>
                )
              })}
            </div>

            {/* Desktop CTA + Theme Toggle */}
            <div className="hidden lg:flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={toggleTheme}
                className={cn(
                  'relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300',
                  'border border-th-border/10 hover:border-brand-500/30',
                  'bg-th-overlay/[0.04] hover:bg-th-overlay/[0.08]',
                  'text-th-fg-sub hover:text-brand-500'
                )}
                aria-label={theme === 'dark' ? 'Aydınlık moda geç' : 'Karanlık moda geç'}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {theme === 'dark' ? (
                    <motion.div key="sun" initial={{ rotate: -90, scale: 0, opacity: 0 }} animate={{ rotate: 0, scale: 1, opacity: 1 }} exit={{ rotate: 90, scale: 0, opacity: 0 }} transition={{ duration: 0.2 }}>
                      <Sun className="w-[18px] h-[18px]" />
                    </motion.div>
                  ) : (
                    <motion.div key="moon" initial={{ rotate: 90, scale: 0, opacity: 0 }} animate={{ rotate: 0, scale: 1, opacity: 1 }} exit={{ rotate: -90, scale: 0, opacity: 0 }} transition={{ duration: 0.2 }}>
                      <Moon className="w-[18px] h-[18px]" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>

              {/* Divider */}
              <div className="w-px h-5 bg-th-border/[0.08] mx-1" />

              {/* WhatsApp Destek */}
              <a
                href="https://wa.me/905446207275"
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'flex items-center justify-center gap-1.5 h-9 xl:h-10 rounded-xl transition-all duration-300 whitespace-nowrap',
                  'border border-brand-500 hover:border-brand-400',
                  'bg-th-overlay/[0.04] hover:bg-th-overlay/[0.08]',
                  'text-th-fg-sub hover:text-brand-500',
                  'w-9 xl:w-auto xl:px-3'
                )}
                title="WhatsApp Destek"
              >
                <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                <span className="hidden xl:inline text-sm font-medium">WhatsApp Destek</span>
              </a>

              {/* Hatalı Park Bildirimi */}
              <Link
                href="/arac/park-mesaj"
                className={cn(
                  'flex items-center justify-center gap-1.5 h-9 xl:h-10 rounded-xl transition-all duration-300 whitespace-nowrap',
                  'border border-brand-500 hover:border-brand-400',
                  'bg-th-overlay/[0.04] hover:bg-th-overlay/[0.08]',
                  'text-th-fg-sub hover:text-brand-500',
                  'w-9 xl:w-auto xl:px-3'
                )}
                title="Hatalı Park Bildirimi"
              >
                <Bell className="w-4 h-4 shrink-0" />
                <span className="hidden xl:inline text-sm font-medium">Hatalı Park</span>
              </Link>

              {/* Sorun Bildir */}
              <Link
                href="/hata-bildir"
                className={cn(
                  'flex items-center justify-center gap-1.5 h-9 xl:h-10 rounded-xl transition-all duration-300 whitespace-nowrap',
                  'border border-brand-500 hover:border-brand-400',
                  'bg-th-overlay/[0.04] hover:bg-th-overlay/[0.08]',
                  'text-th-fg-sub hover:text-brand-500',
                  'w-9 xl:w-auto xl:px-3'
                )}
                title="Sorun Bildir"
              >
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span className="hidden xl:inline text-sm font-medium">Sorun Bildir</span>
              </Link>

              <div className="w-px h-5 bg-th-border/[0.08] mx-1" />

              {thUser ? (
                <>
                  <div className="flex items-center gap-0 bg-brand-500 rounded-xl h-9 xl:h-10">
                    {/* Cüzdan Bakiyesi */}
                    {walletBalance !== null && (
                      <>
                        <Link
                          href="/profilim/cuzdanim"
                          className="flex items-center gap-1 xl:gap-1.5 px-2 xl:px-3 py-2 text-brand-950/80 hover:text-brand-950 hover:bg-brand-400 transition-all duration-200"
                          title="Cüzdanım"
                        >
                          <Wallet className="w-4 h-4 shrink-0" />
                          <div className="flex flex-col leading-tight">
                            <span className="hidden xl:block text-[10px] text-brand-950/50">Cüzdan Bakiyeniz</span>
                            <span className="text-xs xl:text-sm font-bold">
                              ₺{walletBalance.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                          </div>
                        </Link>
                        <div className="w-px h-5 bg-brand-950/15" />
                      </>
                    )}

                    {/* Mesajlar */}
                    <Link
                      href="/profilim/mesajlar"
                      className="relative flex items-center justify-center w-9 h-9 text-brand-950/80 hover:text-brand-950 hover:bg-brand-400 rounded-full transition-all duration-200"
                      aria-label="Mesajlar"
                    >
                      <MessageSquare className="w-4 h-4 shrink-0" />
                      {msgCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                          {msgCount > 9 ? '9+' : msgCount}
                        </span>
                      )}
                    </Link>

                    {/* Bildirimler */}
                    <Link
                      href="/profilim/bildirimler"
                      className="relative flex items-center justify-center w-9 h-9 text-brand-950/80 hover:text-brand-950 hover:bg-brand-400 rounded-full transition-all duration-200"
                      aria-label="Bildirimler"
                    >
                      <Bell className="w-4 h-4 shrink-0" />
                      {notifCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                          {notifCount > 9 ? '9+' : notifCount}
                        </span>
                      )}
                    </Link>
                    <div className="w-px h-5 bg-brand-950/15" />

                    {/* Profil Dropdown */}
                    <div ref={profileRef} className="relative">
                      <button
                        type="button"
                        onClick={() => setProfileOpen(prev => !prev)}
                        className={cn(
                          'flex items-center gap-2 pl-1.5 pr-3 py-1 transition-all duration-200',
                          'text-brand-950/80 hover:text-brand-950 hover:bg-brand-400',
                          profileOpen ? 'bg-brand-400' : ''
                        )}
                      >
                        <div className="w-7 h-7 xl:w-8 xl:h-8 rounded-full bg-brand-950/15 flex items-center justify-center text-brand-950 font-bold text-xs xl:text-sm flex-shrink-0">
                          {(thUser.name || thUser.username).charAt(0).toUpperCase()}
                        </div>
                        <div className="hidden xl:flex flex-col items-start leading-tight">
                          <span className="text-sm font-bold text-brand-950/90 max-w-[100px] truncate">{thUser.name || thUser.username}</span>
                          <span className="text-[11px] text-brand-950/60">
                            {hasLocation ? `${userLocation?.district || userLocation?.city || 'Konum'} 📍` : 'Müşteri'}
                          </span>
                        </div>
                        <ChevronDown className={cn('w-3 h-3 text-brand-950/60 transition-transform duration-200', profileOpen && 'rotate-180')} />
                      </button>

                    <AnimatePresence>
                      {profileOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          transition={{ duration: 0.18 }}
                          className="absolute top-full right-0 pt-2 z-50 w-48"
                        >
                          <div className="bg-th-bg/95 backdrop-blur-xl rounded-xl border border-th-border/[0.08] shadow-2xl shadow-black/20 overflow-hidden py-1">
                            <Link
                              href="/profilim"
                              onClick={() => setProfileOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-th-fg-sub hover:text-th-fg hover:bg-th-overlay/5 transition-colors"
                            >
                              <UserCircle className="w-4 h-4" />
                              Profilim
                            </Link>
                            <Link
                              href="/profilim/favoriler"
                              onClick={() => setProfileOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-th-fg-sub hover:text-th-fg hover:bg-th-overlay/5 transition-colors"
                            >
                              <Heart className="w-4 h-4" />
                              Favorilerim
                            </Link>
                            <Link
                              href="/profilim/teklifler"
                              onClick={() => setProfileOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-th-fg-sub hover:text-th-fg hover:bg-th-overlay/5 transition-colors"
                            >
                              <Tag className="w-4 h-4" />
                              Tekliflerim
                              {notifCount > 0 && (
                                <span className="ml-auto w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                                  {notifCount > 9 ? '9+' : notifCount}
                                </span>
                              )}
                            </Link>
                            <Link
                              href="/profilim/randevular"
                              onClick={() => setProfileOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-th-fg-sub hover:text-th-fg hover:bg-th-overlay/5 transition-colors"
                            >
                              <CalendarDays className="w-4 h-4" />
                              Randevularım
                            </Link>
                            <div className="mx-3 my-1 border-t border-th-border/[0.06]" />
                            <button
                              onClick={handleLogout}
                              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-colors"
                            >
                              <LogOut className="w-4 h-4" />
                              Çıkış Yap
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={openLogin}
                    className={cn(
                      'flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300',
                      'border border-th-border/10 hover:border-brand-500/30',
                      'bg-th-overlay/[0.04] hover:bg-th-overlay/[0.08]',
                      'text-th-fg-sub hover:text-brand-500'
                    )}
                  >
                    <LogIn className="w-4 h-4" />
                    Giriş
                  </button>

                  <button type="button" onClick={openRegister} className="btn-gold px-4 py-2 text-sm">
                    <UserPlus className="w-4 h-4" />
                    Kayıt Ol
                  </button>
                </>
              )}
            </div>

            {/* Mobile: Location + Theme Toggle + Menu Button */}
            <div className="flex lg:hidden items-center gap-1 ml-auto">
              <button
                type="button"
                onClick={() => setLocationModalOpen(true)}
                className="relative z-10 w-11 h-11 rounded-xl flex items-center justify-center transition-colors duration-300 text-th-fg-sub hover:text-brand-500 active:bg-th-overlay/10 sm:hidden"
                aria-label="Konum seç"
              >
                <MapPin className="w-5 h-5" />
                {hasLocation && (
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-brand-500" />
                )}
              </button>

              <button
                type="button"
                onClick={toggleTheme}
                className="relative z-10 w-11 h-11 rounded-xl flex items-center justify-center transition-colors duration-300 text-th-fg-sub hover:text-brand-500 active:bg-th-overlay/10"
                aria-label={theme === 'dark' ? 'Aydınlık moda geç' : 'Karanlık moda geç'}
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              <button
                type="button"
                onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                className={cn(
                  'relative z-10 flex items-center justify-center w-11 h-11 rounded-xl transition-colors duration-300',
                  isMobileMenuOpen ? 'text-th-fg bg-th-overlay/10' : 'text-th-fg-sub hover:text-th-fg active:bg-th-overlay/10'
                )}
                aria-label={isMobileMenuOpen ? 'Menüyü kapat' : 'Menüyü aç'}
                aria-expanded={isMobileMenuOpen}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {isMobileMenuOpen ? (
                    <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                      <X className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                      <Menu className="w-5 h-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay + Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-hidden="true"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 z-50 h-full w-[320px] max-w-[85vw] bg-th-bg/98 backdrop-blur-xl border-l border-th-border/[0.06] lg:hidden overflow-y-auto overscroll-contain"
            >
              <div className="flex flex-col h-full pt-16 pb-6 px-4 safe-top safe-bottom">
                <nav className="flex-1 space-y-1">
                  {/* Ana navigasyon linkleri */}
                  {[
                    { href: '/', label: 'Ana Sayfa', icon: Home },
                    { href: '/servis-ara', label: 'Servis Ara', icon: Search },
                    { href: '/randevu', label: 'Randevu Al', icon: CalendarDays },
                    { href: '/teklif-al', label: 'Teklif Al', icon: Tag },
                    { href: '/sarj-istasyonlari', label: 'Şarj İstasyonları', icon: Zap },
                  ].map((item, index) => {
                    const isActive = isActiveLink(item.href)
                    const ItemIcon = item.icon
                    return (
                      <motion.div
                        key={item.href}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.04 * index, duration: 0.3 }}
                      >
                        <Link
                          href={item.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={cn(
                            'flex items-center justify-between px-4 py-3.5 rounded-xl text-base font-medium transition-all duration-300',
                            isActive ? 'text-brand-500 bg-brand-500/10' : 'text-th-fg-sub hover:text-th-fg hover:bg-th-overlay/5'
                          )}
                        >
                          <span className="flex items-center gap-2.5">
                            <ItemIcon className={cn('w-4 h-4', isActive ? 'text-brand-500' : 'text-th-fg-muted')} />
                            {item.label}
                          </span>
                          {isActive && <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />}
                        </Link>
                      </motion.div>
                    )
                  })}

                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1, duration: 0.3 }} className="my-3 border-t border-th-border/[0.06]" />

                  {/* Kurumsal linkler */}
                  {SIMPLE_LINKS.map((item, index) => {
                    const isActive = isActiveLink(item.href)
                    const ItemIcon = item.icon
                    return (
                      <motion.div
                        key={item.href}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 * index, duration: 0.3 }}
                      >
                        <Link
                          href={item.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={cn(
                            'flex items-center justify-between px-4 py-3.5 rounded-xl text-base font-medium transition-all duration-300',
                            isActive ? 'text-brand-500 bg-brand-500/10' : 'text-th-fg-sub hover:text-th-fg hover:bg-th-overlay/5'
                          )}
                        >
                          <span className="flex items-center gap-2.5">
                            <ItemIcon className={cn('w-4.5 h-4.5', isActive ? 'text-brand-500' : 'text-th-fg-muted')} />
                            {item.label}
                          </span>
                          {isActive && <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />}
                        </Link>
                      </motion.div>
                    )
                  })}

                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1, duration: 0.3 }} className="my-3 border-t border-th-border/[0.06]" />

                  {/* Mega menu accordions */}
                  {MEGA_MENUS.map((menu, index) => {
                    const Icon = menu.icon
                    const isOpen = openMobileSubmenu === menu.key
                    return (
                      <motion.div
                        key={menu.key}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + 0.05 * index, duration: 0.3 }}
                      >
                        <button
                          type="button"
                          onClick={() => setOpenMobileSubmenu(isOpen ? null : menu.key)}
                          className={cn(
                            'w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-base font-medium transition-all duration-300',
                            isOpen ? 'text-brand-500 bg-brand-500/10' : 'text-th-fg-sub hover:text-th-fg hover:bg-th-overlay/5'
                          )}
                        >
                          <span className="flex items-center gap-2.5">
                            <Icon className={cn('w-4.5 h-4.5', isOpen ? 'text-brand-500' : 'text-th-fg-muted')} />
                            {menu.label}
                          </span>
                          <ChevronDown className={cn('w-4 h-4 transition-transform duration-200', isOpen && 'rotate-180')} />
                        </button>

                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25 }}
                              className="overflow-hidden"
                            >
                              <div className="pl-4 pr-2 pb-2 pt-1 space-y-3">
                                {menu.columns.map((column, cidx) => (
                                  <div key={cidx}>
                                    <p className="text-[10px] font-semibold uppercase tracking-wider text-brand-500/60 mb-1.5 px-3 flex items-center gap-2">
                                      <span className="w-3 h-px bg-brand-500/30 rounded" />
                                      {column.title}
                                    </p>
                                    <div className="space-y-0.5">
                                      {column.items.map((item) => (
                                        <Link
                                          key={item.href}
                                          href={item.href}
                                          onClick={() => { setIsMobileMenuOpen(false); setOpenMobileSubmenu(null) }}
                                          className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-th-fg-sub hover:text-brand-500 hover:bg-brand-500/[0.06] transition-colors"
                                        >
                                          <ChevronRight className="w-3 h-3 text-th-fg-muted/50" />
                                          {item.label}
                                        </Link>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    )
                  })}
                </nav>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                  className="pt-6 border-t border-th-border/[0.06] space-y-2.5"
                >
                  {thUser ? (
                    <div className="space-y-1">
                      {/* Kullanıcı bilgisi */}
                      <div className="flex items-center gap-3 px-3 py-3 mb-1 rounded-xl bg-brand-500/5 border border-brand-500/10">
                        <div className="w-10 h-10 rounded-full bg-brand-500/15 flex items-center justify-center text-brand-500 font-bold text-sm flex-shrink-0">
                          {(thUser.name || thUser.username).charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="block text-sm font-semibold text-th-fg truncate">{thUser.name || thUser.username}</span>
                          {notifCount > 0 && (
                            <span className="flex items-center gap-1 text-xs text-red-400 mt-0.5">
                              <Bell className="w-3 h-3" />
                              {notifCount} yeni bildirim
                            </span>
                          )}
                        </div>
                      </div>
                      {walletBalance !== null && (
                        <Link
                          href="/profilim/cuzdanim"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-3 rounded-xl bg-brand-500/5 border border-brand-500/10"
                        >
                          <Wallet className="w-5 h-5 text-gold" />
                          <span className="text-sm font-bold text-th-fg">Bakiye:</span>
                          <span className="text-sm font-bold text-gold ml-auto">₺{walletBalance.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </Link>
                      )}
                      <Link href="/profilim" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2.5 px-3 py-3 rounded-xl text-sm font-medium text-th-fg-sub active:bg-th-overlay/5 transition-colors">
                        <UserCircle className="w-5 h-5" /> Profilim
                      </Link>
                      <Link href="/profilim/favoriler" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2.5 px-3 py-3 rounded-xl text-sm font-medium text-th-fg-sub active:bg-th-overlay/5 transition-colors">
                        <Heart className="w-5 h-5" /> Favorilerim
                      </Link>
                      <Link href="/profilim/teklifler" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2.5 px-3 py-3 rounded-xl text-sm font-medium text-th-fg-sub active:bg-th-overlay/5 transition-colors">
                        <Tag className="w-5 h-5" /> Tekliflerim
                      </Link>
                      <Link href="/profilim/randevular" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2.5 px-3 py-3 rounded-xl text-sm font-medium text-th-fg-sub active:bg-th-overlay/5 transition-colors">
                        <CalendarDays className="w-5 h-5" /> Randevularım
                      </Link>
                      <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false) }} className="w-full flex items-center gap-2.5 px-3 py-3 rounded-xl text-sm font-medium text-red-400 active:bg-red-500/5 transition-colors">
                        <LogOut className="w-5 h-5" /> Çıkış Yap
                      </button>
                    </div>
                  ) : (
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => { setIsMobileMenuOpen(false); openLogin() }}
                      className="btn-ghost flex-1 text-center text-sm py-3.5 min-h-[44px]"
                    >
                      <LogIn className="w-4 h-4" />
                      Giriş
                    </button>
                    <button
                      type="button"
                      onClick={() => { setIsMobileMenuOpen(false); openRegister() }}
                      className="btn-gold flex-1 text-center text-sm py-3.5 min-h-[44px]"
                    >
                      <UserPlus className="w-4 h-4" />
                      Kayıt Ol
                    </button>
                  </div>
                  )}
                  <Link
                    href="/randevu"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="btn-ghost w-full text-center text-sm py-3.5 min-h-[44px]"
                  >
                    Randevu Al
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onLogin={handleModalLogin}
        defaultTab={loginModalTab}
      />
      <LocationPickerModal
        isOpen={locationModalOpen}
        onClose={() => setLocationModalOpen(false)}
      />
    </>
  )
}
