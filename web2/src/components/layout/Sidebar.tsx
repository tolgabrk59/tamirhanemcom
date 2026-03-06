'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Home, Search, CalendarDays, Wrench, Bot, Zap, Bell, Tag,
  ChevronDown, User, X, Menu, Sun, Moon,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTheme } from '@/components/providers/ThemeProvider'

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
    title: 'Hizmetlerimiz',
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
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-brand-500 shadow-lg">
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
            className="lg:hidden fixed inset-0 bg-black/50 z-[45] backdrop-blur-sm"
            onClick={() => setIsMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar Drawer */}
      <aside
        className={cn(
          'lg:hidden fixed top-14 left-0 bottom-0 w-72 bg-brand-500 z-50 transform transition-transform duration-300 ease-in-out shadow-2xl overflow-y-auto',
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
      <aside className="hidden lg:flex fixed top-0 left-0 bottom-0 w-16 z-40 flex-col items-center justify-between py-4 bg-brand-500 shadow-lg">
        <div className="flex flex-col items-center gap-2" />

        <div className="flex flex-col items-center justify-center mb-32 gap-16">
          <Link href="/" className="flex flex-col items-center ml-2">
            <span
              className="text-[#454545] text-3xl text-center font-accent"
              style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
            >
              &ldquo;her araç kıymetlidir&rdquo;
            </span>
          </Link>
          <Link href="/" className="flex flex-col items-center">
            <span
              className="font-extrabold text-6xl tracking-tight text-[#454545] text-center"
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
                  'flex items-center gap-1.5 px-2 xl:px-3 py-2 rounded-lg transition-all text-sm font-semibold font-display',
                  active
                    ? 'bg-brand-600/40 text-brand-950'
                    : 'text-brand-950/80 hover:bg-brand-600/20'
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="whitespace-nowrap">{link.label}</span>
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
                    'flex items-center gap-1.5 px-2 xl:px-3 py-2 rounded-lg transition-all text-sm font-semibold font-display',
                    isOpen
                      ? 'bg-brand-600/40 text-brand-950'
                      : 'text-brand-950/80 hover:bg-brand-600/20'
                  )}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="whitespace-nowrap">{menu.title}</span>
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

          <div className="h-6 w-px bg-brand-700/30 mx-1 xl:mx-2 shrink-0" />

          {/* WhatsApp Destek */}
          <a
            href="https://wa.me/905446207275"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 px-2 xl:px-3 py-2 bg-[#128C7E] hover:bg-[#075E54] rounded-lg transition-all text-white font-semibold text-xs shadow-md hover:shadow-lg font-display shrink-0 whitespace-nowrap"
            title="WhatsApp Destek"
          >
            <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            <span className="hidden xl:inline">Destek</span>
          </a>

          {/* Hatalı Park Bildirimi */}
          <Link
            href="/arac/park-mesaj"
            className="flex items-center justify-center gap-1.5 px-2 xl:px-3 py-2 bg-transparent border-2 border-brand-950/60 hover:border-brand-950 hover:bg-brand-950/10 rounded-lg transition-all text-brand-950 font-semibold text-xs font-display shrink-0 whitespace-nowrap"
            title="Hatalı Park Bildirimi"
          >
            <Bell className="w-4 h-4 shrink-0" />
            <span className="hidden xl:inline">Hatalı Park</span>
          </Link>

          {/* Hata Bildir */}
          <Link
            href="/hata-bildir"
            className="flex items-center justify-center gap-1.5 px-2 xl:px-3 py-2 bg-transparent border-2 border-brand-950/60 hover:border-brand-950 hover:bg-brand-950/10 rounded-lg transition-all text-brand-950 font-semibold text-xs font-display shrink-0 whitespace-nowrap"
            title="Hata Bildir"
          >
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="hidden xl:inline">Sorun Bildir</span>
          </Link>
        </div>

        <div className="flex items-center gap-1.5 shrink ml-2 min-w-0">
          <div className="h-6 w-px bg-brand-700/30 mx-1 shrink-0" />

          {/* AI Soru Sor */}
          <div className="relative group shrink-0">
            <Link
              href="/ai/sohbet"
              className="flex items-center justify-center w-9 h-9 xl:w-10 xl:h-10 bg-gradient-to-br from-brand-950 to-brand-900 text-brand-500 rounded-xl hover:from-brand-900 hover:to-brand-800 transition-all shadow-md hover:shadow-lg hover:scale-105"
              title="AI Soru Sor"
            >
              <Bot className="w-5 h-5" />
            </Link>
            {/* Sabit yazı - simgenin üstünde */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 pointer-events-none">
              <div className="relative bg-brand-950 text-brand-500 px-3 py-2 rounded-lg shadow-xl whitespace-nowrap">
                <p className="text-[11px] font-bold font-display leading-tight">Yapay zeka desteğiyle</p>
                <p className="text-[10px] font-medium text-brand-400 leading-tight">sizi doğru servise yönlendirelim</p>
                {/* Ok işareti - aşağı */}
                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-brand-950 rotate-45" />
              </div>
            </div>
          </div>

          <button
            type="button"
            title="Giriş Yap"
            onClick={() => window.dispatchEvent(new CustomEvent('open-login-modal', { detail: { tab: 'login' } }))}
            className="flex items-center gap-1.5 px-2 xl:px-3 py-2 text-brand-950/80 hover:bg-brand-600/20 rounded-lg transition-colors text-sm font-semibold font-display shrink-0"
          >
            <User className="w-4 h-4" />
            <span className="hidden xl:inline">Giriş</span>
          </button>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent('open-login-modal', { detail: { tab: 'register' } }))}
            className="px-3 xl:px-4 py-2 bg-brand-950 text-brand-500 rounded-lg font-semibold text-sm hover:bg-brand-900 transition-colors font-display shrink-0"
          >
            Kayıt
          </button>
        </div>
      </nav>
    </>
  )
}
