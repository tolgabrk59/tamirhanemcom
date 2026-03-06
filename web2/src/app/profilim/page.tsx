'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  User, Car, Heart, Wallet, CreditCard,
  CalendarDays, Tag, Star, MessageCircle,
  Bell, HelpCircle, LogOut, ChevronRight,
  Phone, Mail, Shield, Crown,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface ThUser {
  id: number
  username: string
  jwt: string
  name?: string
  email?: string
  phone?: string
  firstName?: string
  lastName?: string
}

interface ProfileStats {
  appointments: number
  completed: number
  points: number
  balance: string
}

export default function ProfilimPage() {
  const router = useRouter()
  const [user, setUser] = useState<ThUser | null>(null)
  const [stats, setStats] = useState<ProfileStats>({ appointments: 0, completed: 0, points: 0, balance: '0' })
  const [loadingStats, setLoadingStats] = useState(true)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('th_user')
      if (!stored) { router.push('/'); return }
      const u: ThUser = JSON.parse(stored)
      setUser(u)
      fetchStats(u)
    } catch {
      router.push('/')
    }
  }, [router])

  const fetchStats = async (u: ThUser) => {
    setLoadingStats(true)
    try {
      const res = await fetch(`/api/user/stats?jwt=${encodeURIComponent(u.jwt)}`)
      if (res.ok) {
        const data = await res.json()
        if (data.success) setStats(data.stats)
      }
    } catch {}
    setLoadingStats(false)
  }

  const handleLogout = () => {
    localStorage.removeItem('th_user')
    window.dispatchEvent(new CustomEvent('th-logout'))
    router.push('/')
  }

  if (!user) return null

  const displayName = user.name || user.username
  const initial = displayName.charAt(0).toUpperCase()

  const menuSections = [
    {
      title: 'HESABIM',
      items: [
        { icon: User, label: 'Profili Düzenle', desc: 'Kişisel bilgilerinizi güncelleyin', href: '/profilim/duzenle' },
        { icon: Car, label: 'Araçlarım', desc: 'Kayıtlı araçları yönetin', href: '/profilim/araclar' },
        { icon: Heart, label: 'Favori Servislerim', desc: 'Beğendiğiniz servislere hızlı erişim', href: '/profilim/favoriler' },
      ],
    },
    {
      title: 'FİNANS & ÖDEMELER',
      items: [
        { icon: Wallet, label: 'TamirHanem Cüzdan', desc: 'Bakiye ve ödemeler', href: '/profilim/cuzdanim' },
        { icon: CreditCard, label: 'Ödeme Yöntemleri', desc: 'Kayıtlı kartlarınızı yönetin', href: '/profilim/odeme' },
      ],
    },
    {
      title: 'AKTİVİTELERİM',
      items: [
        { icon: CalendarDays, label: 'Randevularım', desc: 'Geçmiş ve gelecek randevular', href: '/profilim/randevular' },
        { icon: Tag, label: 'Tekliflerim', desc: 'Aldığınız teklifleri görüntüleyin', href: '/profilim/teklifler' },
        { icon: Star, label: 'Değerlendirmelerim', desc: 'Verdiğiniz puanlar ve yorumlar', href: '/profilim/degerlendirmeler' },
        { icon: MessageCircle, label: 'Soru & Cevaplarım', desc: 'Sorularınız ve yanıtlar', href: '/profilim/sorular' },
      ],
    },
    {
      title: 'AYARLAR & DESTEK',
      items: [
        { icon: Bell, label: 'Bildirimler', desc: 'Bildirim tercihlerinizi yönetin', href: '/profilim/bildirimler' },
        { icon: HelpCircle, label: 'Yardım Merkezi', desc: 'Sıkça sorulan sorular ve destek', href: '/yardim' },
      ],
    },
  ]

  return (
    <main className="min-h-screen bg-th-bg pt-20 pb-24 lg:pb-8 lg:pl-16">
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-5">

        {/* Üst Kart */}
        <div className="relative bg-gradient-to-br from-brand-500/10 via-th-overlay/[0.03] to-th-overlay/[0.01] rounded-2xl border border-brand-500/10 p-5 overflow-hidden">
          {/* Arka plan efekti */}
          <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent pointer-events-none" />

          <div className="relative flex items-center gap-4">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-full bg-gold/15 border-2 border-gold/40 flex items-center justify-center text-gold font-black text-2xl flex-shrink-0 shadow-lg">
              {initial}
            </div>

            {/* Bilgi */}
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-black text-th-fg truncate">{displayName}</h1>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Shield className="w-3.5 h-3.5 text-gold" />
                <span className="text-xs font-semibold text-gold">Yeni Üye</span>
              </div>
            </div>

            {/* Kral rozeti */}
            <div className="w-10 h-10 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center flex-shrink-0">
              <Crown className="w-5 h-5 text-gold" />
            </div>
          </div>

          {/* İstatistikler */}
          <div className="grid grid-cols-4 gap-3 mt-5">
            {[
              { label: 'RANDEVU', value: loadingStats ? '–' : stats.appointments },
              { label: 'TAMAMLANAN', value: loadingStats ? '–' : stats.completed },
              { label: 'PUAN', value: loadingStats ? '–' : stats.points },
              { label: 'BAKİYE', value: loadingStats ? '–' : `₺${stats.balance}` },
            ].map((s) => (
              <div key={s.label} className="bg-th-bg/60 rounded-xl p-3 text-center border border-th-border/[0.06]">
                <div className="text-lg font-black text-th-fg">{s.value}</div>
                <div className="text-[10px] font-semibold text-th-fg-muted tracking-wide mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>

          {/* İletişim */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            {user.email && (
              <div className="flex items-center gap-2 bg-th-bg/40 rounded-lg px-3 py-2 border border-th-border/[0.06]">
                <Mail className="w-4 h-4 text-brand-500 flex-shrink-0" />
                <div>
                  <div className="text-[10px] text-th-fg-muted uppercase tracking-wide font-semibold">E-POSTA</div>
                  <div className="text-sm text-th-fg font-medium truncate">{user.email}</div>
                </div>
              </div>
            )}
            {user.phone && (
              <div className="flex items-center gap-2 bg-th-bg/40 rounded-lg px-3 py-2 border border-th-border/[0.06]">
                <Phone className="w-4 h-4 text-brand-500 flex-shrink-0" />
                <div>
                  <div className="text-[10px] text-th-fg-muted uppercase tracking-wide font-semibold">TELEFON</div>
                  <div className="text-sm text-th-fg font-medium">{user.phone}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Menü Bölümleri */}
        {menuSections.map((section) => (
          <div key={section.title}>
            <h2 className="text-[11px] font-bold text-th-fg-muted tracking-widest uppercase mb-2 px-1">
              {section.title}
            </h2>
            <div className="bg-th-bg/60 rounded-2xl border border-th-border/[0.06] overflow-hidden divide-y divide-th-border/[0.06]">
              {section.items.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3.5 px-4 py-3.5 transition-colors duration-200',
                      'hover:bg-brand-500/[0.04] group'
                    )}
                  >
                    <div className="w-9 h-9 rounded-xl bg-brand-500/8 border border-brand-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-500/12 transition-colors">
                      <Icon className="w-4.5 h-4.5 text-brand-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-th-fg group-hover:text-brand-500 transition-colors">{item.label}</div>
                      <div className="text-xs text-th-fg-muted mt-0.5">{item.desc}</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-th-fg-muted/40 group-hover:text-brand-500/60 transition-colors flex-shrink-0" />
                  </Link>
                )
              })}
            </div>
          </div>
        ))}

        {/* Çıkış Yap */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-red-500/[0.06] border border-red-500/10 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200 font-semibold text-sm"
        >
          <LogOut className="w-4 h-4" />
          Çıkış Yap
        </button>

      </div>
    </main>
  )
}
