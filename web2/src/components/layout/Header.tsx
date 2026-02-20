'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ChevronRight, ChevronDown, Sun, Moon, Car, BookOpen } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTheme } from '@/components/providers/ThemeProvider'

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
const SIMPLE_LINKS = [
  { label: 'Kurumsal', href: '/kurumsal' },
  { label: 'İletişim', href: '/iletisim' },
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
          'fixed top-0 left-0 lg:left-16 right-0 z-50 transition-all duration-500',
          isScrolled
            ? 'bg-th-bg/90 backdrop-blur-xl border-b border-th-border/[0.06] shadow-lg shadow-black/10'
            : 'bg-transparent border-b border-transparent'
        )}
      >
        <nav className="section-container">
          <div className="flex h-16 items-center justify-between">
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
            <div className="hidden lg:flex items-center gap-1">
              {/* Kurumsal */}
              <Link
                href={SIMPLE_LINKS[0].href}
                className={cn(
                  'relative px-4 py-2 text-sm font-medium transition-colors duration-300 rounded-lg',
                  isActiveLink(SIMPLE_LINKS[0].href) ? 'text-brand-500' : 'text-th-fg-sub hover:text-th-fg'
                )}
              >
                {SIMPLE_LINKS[0].label}
                {isActiveLink(SIMPLE_LINKS[0].href) && (
                  <motion.span layoutId="headerActiveNav" className="absolute bottom-0 left-2 right-2 h-[2px] bg-brand-500 rounded-full" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />
                )}
              </Link>

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
                        'flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300',
                        isOpen
                          ? 'text-brand-500 bg-brand-500/10'
                          : 'text-th-fg-sub hover:text-th-fg'
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      {menu.label}
                      <ChevronDown className={cn('w-3 h-3 transition-transform duration-200', isOpen && 'rotate-180')} />
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

              {/* İletişim */}
              <Link
                href={SIMPLE_LINKS[1].href}
                className={cn(
                  'relative px-4 py-2 text-sm font-medium transition-colors duration-300 rounded-lg',
                  isActiveLink(SIMPLE_LINKS[1].href) ? 'text-brand-500' : 'text-th-fg-sub hover:text-th-fg'
                )}
              >
                {SIMPLE_LINKS[1].label}
                {isActiveLink(SIMPLE_LINKS[1].href) && (
                  <motion.span layoutId="headerActiveNav" className="absolute bottom-0 left-2 right-2 h-[2px] bg-brand-500 rounded-full" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />
                )}
              </Link>
            </div>

            {/* Desktop CTA + Theme Toggle */}
            <div className="hidden lg:flex items-center gap-3">
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

              <Link href="/randevu" className="btn-ghost px-5 py-2.5 text-sm">
                Randevu Al
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Mobile: Theme Toggle + Menu Button */}
            <div className="flex lg:hidden items-center gap-2">
              <button
                type="button"
                onClick={toggleTheme}
                className="relative z-10 w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-300 text-th-fg-sub hover:text-brand-500 hover:bg-th-overlay/5"
                aria-label={theme === 'dark' ? 'Aydınlık moda geç' : 'Karanlık moda geç'}
              >
                {theme === 'dark' ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
              </button>

              <button
                type="button"
                onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                className={cn(
                  'relative z-10 flex items-center justify-center w-10 h-10 rounded-lg transition-colors duration-300',
                  isMobileMenuOpen ? 'text-th-fg bg-th-overlay/10' : 'text-th-fg-sub hover:text-th-fg hover:bg-th-overlay/5'
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
              className="fixed top-0 right-0 z-50 h-full w-[300px] max-w-[85vw] bg-th-bg/95 backdrop-blur-xl border-l border-th-border/[0.06] lg:hidden overflow-y-auto"
            >
              <div className="flex flex-col h-full pt-20 pb-8 px-6">
                <nav className="flex-1 space-y-1">
                  {/* Simple links */}
                  {SIMPLE_LINKS.map((item, index) => {
                    const isActive = isActiveLink(item.href)
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
                          <span>{item.label}</span>
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
                  className="pt-6 border-t border-th-border/[0.06]"
                >
                  <Link
                    href="/randevu"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="btn-gold w-full text-center text-sm py-3.5"
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
    </>
  )
}
