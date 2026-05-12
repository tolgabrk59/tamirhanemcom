'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Home, Search, CalendarDays, Wrench, Bot, Zap, Bell, Tag,
  ChevronDown, User, X, Menu, Sun, Moon,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTheme } from '@/components/providers/ThemeProvider'
import { getActiveCampaigns } from '@/data/campaigns'
import type { Campaign } from '@/types/sponsor'

// ─── Tipler ──────────────────────────────────────
interface NavLink {
  href: string
  label: string
  icon: LucideIcon
}

interface MegaMenuItem {
  href: string
  label: string
}

interface MegaMenuColumn {
  title: string
  items: MegaMenuItem[]
}

interface MegaMenuDef {
  title: string
  icon: LucideIcon
  columns: MegaMenuColumn[]
}

// ─── Sabitler ────────────────────────────────────
const navLinks: NavLink[] = [
  { href: '/', label: 'Ana Sayfa', icon: Home },
  { href: '/servis-ara', label: 'Servis Ara', icon: Search },
  { href: '/randevu', label: 'Randevu Al', icon: CalendarDays },
  { href: '/teklif-al', label: 'Teklif Al', icon: Tag },
  { href: '/sarj-istasyonlari', label: 'Şarj İstasyonları', icon: Zap },
]

const megaMenus: Record<string, MegaMenuDef> = {
  hizmetler: {
    title: 'Hizmetler',
    icon: Wrench,
    columns: [{
      title: 'Hizmetler',
      items: [
        { href: '/oto-yikama', label: 'Oto Yıkama' },
        { href: '/oto-sanayi', label: 'Oto Sanayi' },
        { href: '/oto-kiralama', label: 'Oto Kiralama' },
        { href: '/oto-sigorta', label: 'Oto Sigorta' },
        { href: '/arac/2-el-parca', label: '2.El Parça' },
      ],
    }],
  },
  asistan: {
    title: 'AI Asistan',
    icon: Bot,
    columns: [{
      title: 'Yapay Zeka Araçları',
      items: [
        { href: '/ai/ariza-tespit', label: 'TamirHanem Asistan' },
        { href: '/ai/sohbet', label: 'TamirHanem Sohbet' },
      ],
    }],
  },
}

// ─── Component ──────────────────────────────────
export default function Sidebar() {
  const pathname = usePathname()
  const { theme, toggleTheme } = useTheme()
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [openMobileSubmenu, setOpenMobileSubmenu] = useState<string | null>(null)
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null)
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [campaignIndex, setCampaignIndex] = useState(0)

  useEffect(() => {
    const active = getActiveCampaigns()
    if (active.length > 0) setCampaigns(active)
  }, [])

  useEffect(() => {
    if (campaigns.length <= 1) return
    const interval = setInterval(() => {
      setCampaignIndex((prev) => (prev + 1) % campaigns.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [campaigns.length])

  useEffect(() => {
    setIsMobileOpen(false)
    setOpenMobileSubmenu(null)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isMobileOpen])

  const isActive = (href: string) => {
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

  return (
    <>
      {/* ═══════════════════════════════════════════
          MOBILE: Top Gold Bar + Slide-out Drawer
         ═══════════════════════════════════════════ */}
      <div className="hidden fixed top-0 left-0 right-0 z-50 bg-brand-500 shadow-lg">
        <div className="flex items-center justify-between h-14 px-4">
          <Link href="/" onClick={(e) => handleNavClick(e, '/')} className="flex items-center">
            <span className="text-2xl font-extrabold tracking-tight font-display">
              <span className="text-brand-950">tamirhane</span>
              <span className="text-brand-950">m</span>
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-lg text-brand-950 hover:bg-brand-600/50 transition-colors"
              aria-label={theme === 'dark' ? 'Aydınlık mod' : 'Karanlık mod'}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <button
              type="button"
              onClick={() => setIsMobileOpen((p) => !p)}
              className="p-2 rounded-lg text-brand-950 hover:bg-brand-600/50 transition-colors"
              aria-label="Menü"
              aria-expanded={isMobileOpen}
            >
              {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="hidden fixed inset-0 bg-black/50 z-[45] backdrop-blur-sm"
            onClick={() => setIsMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar Drawer */}
      <aside
        className={cn(
          'hidden fixed top-14 left-0 bottom-0 w-72 bg-brand-500 z-50 transform transition-transform duration-300 ease-in-out shadow-2xl overflow-y-auto',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full py-4 px-2">
          <nav className="flex-1 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon
              const active = isActive(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={(e) => { handleNavClick(e, link.href); setIsMobileOpen(false) }}
                  className={cn(
                    'flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200',
                    active
                      ? 'bg-brand-600/40 text-brand-950'
                      : 'text-brand-950/80 hover:bg-brand-600/20'
                  )}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span className="text-[15px] font-semibold font-display">{link.label}</span>
                </Link>
              )
            })}

            <div className="my-3 border-t border-brand-700/30" />

            {Object.entries(megaMenus).map(([key, menu]) => {
              const Icon = menu.icon
              const isOpen = openMobileSubmenu === key
              return (
                <div key={key}>
                  <button
                    type="button"
                    onClick={() => setOpenMobileSubmenu(isOpen ? null : key)}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200',
                      isOpen
                        ? 'bg-brand-600/40 text-brand-950'
                        : 'text-brand-950/80 hover:bg-brand-600/20'
                    )}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    <span className="flex-1 text-left text-[15px] font-semibold font-display">{menu.title}</span>
                    <ChevronDown className={cn('w-4 h-4 transition-transform duration-200', isOpen && 'rotate-180')} />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-1 ml-3 pl-3 border-l-2 border-brand-700/30 space-y-1">
                          {menu.columns.map((col, idx) => (
                            <div key={idx}>
                              <p className="text-brand-800/60 text-[10px] font-bold uppercase tracking-wider px-3 mb-1 font-display">
                                {col.title}
                              </p>
                              {col.items.map((item) => (
                                <Link
                                  key={item.href}
                                  href={item.href}
                                  onClick={() => { setIsMobileOpen(false); setOpenMobileSubmenu(null) }}
                                  className={cn(
                                    'block px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                                    isActive(item.href)
                                      ? 'bg-brand-600/40 text-brand-950'
                                      : 'text-brand-900/70 hover:bg-brand-600/20 hover:text-brand-950'
                                  )}
                                >
                                  {item.label}
                                </Link>
                              ))}
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </nav>

          <div className="p-3 border-t border-brand-700/30 space-y-2">
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent('open-login-modal', { detail: { tab: 'login' } }))}
              className="flex items-center justify-center gap-2 w-full bg-brand-950 text-brand-500 px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-brand-900 transition-colors font-display"
            >
              <User className="w-4 h-4" />
              Giriş Yap
            </button>
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent('open-login-modal', { detail: { tab: 'register' } }))}
              className="flex items-center justify-center w-full bg-brand-500/20 text-brand-950 px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-brand-500/30 transition-colors border border-brand-700/30 font-display"
            >
              Kayıt Ol
            </button>
          </div>
        </div>
      </aside>

      {/* ═══════════════════════════════════════════
          DESKTOP: Left Branding Sidebar
         ═══════════════════════════════════════════ */}
      <aside className="hidden lg:flex fixed top-0 left-0 bottom-0 w-16 z-40 flex-col items-center justify-between py-4 bg-brand-500 shadow-lg overflow-visible">
        <div className="flex flex-col items-center gap-2" />

        <div className="flex flex-col items-center justify-center mb-24 gap-12 overflow-visible">
          <Link href="/" className="flex flex-col items-center overflow-visible">
            <span
              className="text-[#454545] text-sm text-center font-light italic whitespace-nowrap"
              style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', letterSpacing: '0.02em' }}
            >
              &ldquo;her araç kıymetlidir&rdquo;
            </span>
          </Link>
          <Link href="/" className="flex flex-col items-center overflow-visible">
            <span
              className="font-extrabold text-3xl leading-none tracking-tight text-[#454545] text-center whitespace-nowrap"
              style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
            >
              tamirhanem
            </span>
          </Link>
        </div>
      </aside>

      {/* ═══════════════════════════════════════════
          DESKTOP: Bottom Navigation Bar (Hizmetler)
         ═══════════════════════════════════════════ */}
      <nav className="hidden lg:flex fixed bottom-0 left-16 right-0 h-14 bg-brand-500 z-40 items-center justify-between px-2 xl:px-4 shadow-[0_-2px_10px_rgba(0,0,0,0.1)]" style={{ overflowX: 'clip', overflowY: 'visible' }}>
        <div className="flex items-center gap-0.5 xl:gap-1 flex-1 min-w-0">
          {navLinks.map((link) => {
            const Icon = link.icon
            const active = isActive(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                title={link.label}
                className={cn(
                  'flex items-center gap-1 px-1.5 xl:px-3 py-2 rounded-lg transition-all font-semibold font-display whitespace-nowrap',
                  active
                    ? 'bg-brand-950 text-brand-500'
                    : 'text-brand-950/80 hover:bg-brand-950/10 hover:text-brand-950'
                )}
                style={{ fontSize: 'clamp(10px, 1.1vw, 14px)' }}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{link.label}</span>
              </Link>
            )
          })}

          <div className="h-6 w-px bg-brand-700/30 mx-1 xl:mx-2 shrink-0" />

          {Object.entries(megaMenus).map(([key, menu]) => {
            const Icon = menu.icon
            const isOpen = hoveredMenu === key
            const multiCol = menu.columns.length > 1
            return (
              <div
                key={key}
                className="relative"
                onMouseEnter={() => setHoveredMenu(key)}
                onMouseLeave={() => setHoveredMenu(null)}
              >
                <button
                  type="button"
                  className={cn(
                    'flex items-center gap-1 px-1.5 xl:px-3 py-2 rounded-lg transition-all font-semibold font-display whitespace-nowrap',
                    isOpen
                      ? 'bg-brand-950 text-brand-500'
                      : 'text-brand-950/80 hover:bg-brand-950/10 hover:text-brand-950'
                  )}
                  style={{ fontSize: 'clamp(10px, 1.1vw, 14px)' }}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{menu.title}</span>
                  <ChevronDown className={cn('w-3 h-3 transition-transform shrink-0', isOpen && 'rotate-180')} />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute bottom-full left-0 pb-2 z-[60]"
                    >
                      <div className={cn(
                        'bg-th-bg/95 backdrop-blur-xl rounded-xl border border-th-border/[0.08] shadow-2xl shadow-black/20 overflow-hidden',
                        multiCol ? 'w-[420px]' : 'w-[250px]'
                      )}>
                        <div className="bg-gradient-to-r from-brand-500/25 to-brand-500/5 px-4 py-2.5 border-b border-th-border/[0.06]">
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4 text-brand-500" />
                            <h3 className="text-sm font-semibold text-brand-500 font-display">{menu.title}</h3>
                          </div>
                        </div>

                        <div className={cn('p-3', multiCol && 'grid grid-cols-2 gap-3')}>
                          {menu.columns.map((col, idx) => (
                            <div key={idx}>
                              <p className="text-[10px] font-semibold uppercase tracking-wider text-brand-500/60 mb-2 px-2 flex items-center gap-2">
                                <span className="w-4 h-px bg-brand-500/30 rounded" />
                                {col.title}
                              </p>
                              <div className="space-y-0.5">
                                {col.items.map((item) => (
                                  <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                      'block px-3 py-2 rounded-lg text-sm transition-colors',
                                      isActive(item.href)
                                        ? 'bg-brand-500/15 text-brand-500 font-medium'
                                        : 'text-th-fg-sub hover:bg-brand-500/10 hover:text-th-fg'
                                    )}
                                  >
                                    {item.label}
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

        </div>

        {/* Kampanya Alanı */}
        {campaigns.length > 0 && (
          <div className="hidden xl:flex items-center gap-2 mx-2 min-w-0 shrink justify-end">
            <div className="h-6 w-px bg-brand-700/30 shrink-0" />
            <AnimatePresence mode="wait">
              <motion.div
                key={campaigns[campaignIndex].id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="flex items-center gap-2 min-w-0 bg-brand-950/10 rounded-lg px-2 xl:px-3 py-1.5"
              >
                <span className="text-base flex-shrink-0">{campaigns[campaignIndex].emoji}</span>
                <div className="flex flex-col min-w-0">
                  <span className="text-brand-950 font-bold text-xs leading-tight truncate">
                    {campaigns[campaignIndex].title}
                  </span>
                  <span className="hidden 2xl:inline text-brand-950/70 text-[10px] leading-tight truncate">
                    {campaigns[campaignIndex].description}
                  </span>
                </div>
                <Link
                  href={campaigns[campaignIndex].url}
                  className="flex-shrink-0 bg-brand-950 hover:bg-brand-900 text-brand-500 px-3 py-1 rounded-lg text-xs font-bold transition-colors whitespace-nowrap"
                >
                  {campaigns[campaignIndex].ctaText} →
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        <div className="flex items-center gap-1 shrink ml-1 min-w-0">
          <div className="h-6 w-px bg-brand-700/30 mx-0.5 shrink-0" />

          {/* AI Sohbet Butonu */}
          <div className="relative group shrink-0">
            <Link
              href="/ai/sohbet"
              className="relative flex items-center gap-1 px-2 xl:px-4 py-2 bg-brand-950 text-brand-500 rounded-lg font-semibold hover:bg-brand-900 transition-colors font-display shrink-0"
              style={{ fontSize: 'clamp(10px, 1.1vw, 14px)' }}
              title="AI Asistana Sor"
            >
              <Image src="/testbott.webp" alt="AI Asistan" width={20} height={20} className="w-5 h-5" unoptimized />
              <span>AI</span>
            </Link>
          </div>

        </div>
      </nav>
    </>
  )
}
