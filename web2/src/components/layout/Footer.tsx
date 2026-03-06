'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, ExternalLink, Globe, MessageCircle, Rss, Send, Lock, ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

function MastercardLogo() {
  return (
    <svg width="36" height="22" viewBox="0 0 38 24" fill="none" aria-label="Mastercard">
      <rect width="38" height="24" rx="4" fill="white" fillOpacity="0.07" />
      <circle cx="15" cy="12" r="7" fill="white" fillOpacity="0.5" />
      <circle cx="23" cy="12" r="7" fill="white" fillOpacity="0.3" />
      <path d="M19 6.8a7 7 0 0 1 0 10.4A7 7 0 0 1 19 6.8z" fill="white" fillOpacity="0.4" />
    </svg>
  )
}

function VisaLogo() {
  return (
    <svg width="44" height="22" viewBox="0 0 48 24" fill="none" aria-label="Visa">
      <rect width="48" height="24" rx="4" fill="white" fillOpacity="0.07" />
      <text x="7" y="17" fontFamily="Arial, sans-serif" fontSize="13" fontWeight="800" fill="white" fillOpacity="0.6" letterSpacing="1">VISA</text>
    </svg>
  )
}

function SslBadge() {
  return (
    <div className="flex items-center gap-1 px-2 py-1 rounded border border-white/10 bg-white/[0.05]" title="256-bit SSL Şifreleme">
      <Lock className="w-3 h-3 text-white/50" />
      <span className="text-[10px] font-semibold text-white/50 tracking-wide">SSL</span>
    </div>
  )
}

function KvkkBadge() {
  return (
    <div className="flex items-center gap-1 px-2 py-1 rounded border border-white/10 bg-white/[0.05]" title="KVKK Uyumlu">
      <ShieldCheck className="w-3 h-3 text-white/50" />
      <span className="text-[10px] font-semibold text-white/50 tracking-wide">KVKK</span>
    </div>
  )
}

interface FooterLink {
  label: string
  href: string
  external?: boolean
}

const HIZMETLER_LINKS: FooterLink[] = [
  { label: 'Servis Ara', href: '/servis-ara' },
  { label: 'Randevu Al', href: '/randevu' },
  { label: 'Araç Bilgi', href: '/arac' },
  { label: 'OBD Kodları', href: '/obd' },
  { label: 'Kronik Sorunlar', href: '/kronik-sorunlar' },
]

const KAYNAKLAR_LINKS: FooterLink[] = [
  { label: 'Blog', href: '/blog' },
  { label: 'SSS', href: '/sss' },
  { label: 'Yardım', href: '/yardim' },
  { label: 'API Docs', href: '/api-docs', external: true },
]

const LEGAL_LINKS: FooterLink[] = [
  { label: 'Gizlilik Politikası', href: '/gizlilik' },
  { label: 'KVKK', href: '/kvkk' },
  { label: 'Kullanım Şartları', href: '/kullanim-sartlari' },
]

interface SocialItem {
  label: string
  href: string
  icon: React.ReactNode
}

const SOCIAL_ITEMS: SocialItem[] = [
  {
    label: 'Twitter',
    href: 'https://twitter.com/tamirhanem',
    icon: <MessageCircle className="w-4 h-4" />,
  },
  {
    label: 'Instagram',
    href: 'https://instagram.com/tamirhanem',
    icon: <Rss className="w-4 h-4" />,
  },
  {
    label: 'Telegram',
    href: 'https://t.me/tamirhanem',
    icon: <Send className="w-4 h-4" />,
  },
  {
    label: 'Web',
    href: 'https://tamirhanem.com',
    icon: <Globe className="w-4 h-4" />,
  },
]

function FooterLinkItem({ link }: { link: FooterLink }) {
  const isExternal = link.external || link.href.startsWith('http')
  const Component = isExternal ? 'a' : Link

  const props = isExternal
    ? { href: link.href, target: '_blank', rel: 'noopener noreferrer' }
    : { href: link.href }

  return (
    <li>
      <Component
        {...props}
        className="group flex items-center gap-1.5 text-sm text-slate-500 hover:text-brand-500 transition-colors duration-300"
      >
        <span className="hover-underline">{link.label}</span>
        {isExternal && (
          <ExternalLink className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
        )}
      </Component>
    </li>
  )
}

function FooterColumn({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div>
      <h3 className="font-display text-sm font-semibold text-th-fg tracking-wide uppercase mb-5">
        {title}
      </h3>
      {children}
    </div>
  )
}

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative bg-th-bg">
      {/* Top Divider */}
      <div className="section-divider" />

      {/* Main Footer Content */}
      <div className="section-container py-16 lg:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand Column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <motion.span
                className="text-gold font-display text-xl font-extrabold tracking-tight"
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                TamirHanem
              </motion.span>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed mb-6 max-w-xs">
              Aracının bakım ve onarım ihtiyaçları için en yakın ve en güvenilir servisleri bul.
              Randevu al, araç bilgilerine eriş.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-2">
              {SOCIAL_ITEMS.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    'flex items-center justify-center w-9 h-9 rounded-lg',
                    'bg-th-overlay/[0.04] border border-th-border/[0.06]',
                    'text-slate-500 hover:text-brand-500 hover:border-brand-500/30 hover:bg-brand-500/10',
                    'transition-colors duration-300'
                  )}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Hizmetler Column */}
          <FooterColumn title="Hizmetler">
            <ul className="space-y-3">
              {HIZMETLER_LINKS.map((link) => (
                <FooterLinkItem key={link.href} link={link} />
              ))}
            </ul>
          </FooterColumn>

          {/* Kaynaklar Column */}
          <FooterColumn title="Kaynaklar">
            <ul className="space-y-3">
              {KAYNAKLAR_LINKS.map((link) => (
                <FooterLinkItem key={link.href} link={link} />
              ))}
            </ul>
          </FooterColumn>

          {/* Iletisim Column */}
          <FooterColumn title="İletişim">
            <ul className="space-y-4">
              <li>
                <a
                  href="mailto:info@tamirhanem.com"
                  className="group flex items-start gap-3 text-sm text-slate-500 hover:text-brand-500 transition-colors duration-300"
                >
                  <Mail className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>info@tamirhanem.com</span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+908501234567"
                  className="group flex items-start gap-3 text-sm text-slate-500 hover:text-brand-500 transition-colors duration-300"
                >
                  <Phone className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>0850 123 45 67</span>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-sm text-slate-500">
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>İstanbul, Türkiye</span>
                </div>
              </li>
            </ul>

            {/* Güven Logoları */}
            <div className="flex items-center gap-2 mt-6 pt-5 border-t border-white/[0.06]">
              <MastercardLogo />
              <VisaLogo />
              <SslBadge />
              <KvkkBadge />
            </div>
          </FooterColumn>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-th-border/[0.06]">
        <div className="section-container py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-600">
              &copy; {currentYear} TamirHanem. Tüm hakları saklıdır.
            </p>

            <div className="flex items-center gap-6">
              {LEGAL_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-xs text-slate-600 hover:text-th-fg-sub transition-colors duration-300"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
