'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Bell,
  CalendarDays,
  Megaphone,
  Settings,
  Gift,
  MessageSquare,
  Wallet,
  Check,
  Trash2,
  CheckCheck,
} from 'lucide-react'

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
}

type NotifType = 'appointment' | 'campaign' | 'system' | 'promotion' | 'message' | 'payment'
type FilterType = 'all' | 'unread' | NotifType

interface Notification {
  id: number
  title: string
  message: string
  type: NotifType
  read: boolean
  createdAt: string
}

const typeConfig: Record<NotifType, { icon: React.ReactNode; iconBg: string }> = {
  appointment: {
    icon: <CalendarDays className="w-5 h-5" />,
    iconBg: 'bg-sky-400/10 text-sky-400',
  },
  campaign: {
    icon: <Megaphone className="w-5 h-5" />,
    iconBg: 'bg-amber-400/10 text-amber-400',
  },
  system: {
    icon: <Settings className="w-5 h-5" />,
    iconBg: 'bg-th-overlay/10 text-th-fg-muted',
  },
  promotion: {
    icon: <Gift className="w-5 h-5" />,
    iconBg: 'bg-pink-400/10 text-pink-400',
  },
  message: {
    icon: <MessageSquare className="w-5 h-5" />,
    iconBg: 'bg-indigo-400/10 text-indigo-400',
  },
  payment: {
    icon: <Wallet className="w-5 h-5" />,
    iconBg: 'bg-emerald-400/10 text-emerald-400',
  },
}

const filterOptions: { key: FilterType; label: string }[] = [
  { key: 'all', label: 'Tümü' },
  { key: 'unread', label: 'Okunmamış' },
  { key: 'appointment', label: 'Randevu' },
  { key: 'campaign', label: 'Kampanya' },
  { key: 'system', label: 'Sistem' },
  { key: 'promotion', label: 'Fırsat' },
]

// Strapi'den gelen Türkçe karaktersiz metinleri düzelt
function fixTurkishChars(text: string): string {
  const replacements: [RegExp, string][] = [
    [/\bIptal\b/g, 'İptal'],
    [/\bUcretsiz\b/g, 'Ücretsiz'],
    [/\bHakki\b/g, 'Hakkı'],
    [/\bTamamlandi\b/gi, 'Tamamlandı'],
    [/\bYikama\b/g, 'Yıkama'],
    [/\bOnaylandi\b/g, 'Onaylandı'],
    [/\bGonderildi\b/g, 'Gönderildi'],
    [/\bGuncellendi\b/g, 'Güncellendi'],
    [/\bHatirlatma\b/g, 'Hatırlatma'],
    [/\bOlusturuldu\b/g, 'Oluşturuldu'],
    [/\bDegistirildi\b/g, 'Değiştirildi'],
    [/\bBasarisiz\b/g, 'Başarısız'],
    [/\bBasarili\b/g, 'Başarılı'],
    [/\bOdeme\b/g, 'Ödeme'],
    [/\bYukleme\b/g, 'Yükleme'],
    [/\bYuklendi\b/g, 'Yüklendi'],
    [/\bEklendi\b/g, 'Eklendi'],
    [/\bGelinmedi\b/g, 'Gelinmedi'],
    [/\bIslem\b/g, 'İşlem'],
    [/\bIslemleri\b/g, 'İşlemleri'],
    [/\bIndirim\b/g, 'İndirim'],
    [/\bFirsat\b/g, 'Fırsat'],
    [/\bDegerlendir/g, 'Değerlendir'],
    [/\bCuzdaniniz/g, 'Cüzdanınız'],
    [/\bCuzdana\b/g, 'Cüzdana'],
    [/\bServisiniz\b/g, 'Servisiniz'],
    [/\btamamlandi\b/gi, 'tamamlandı'],
  ]
  let result = text
  for (const [pattern, replacement] of replacements) {
    result = result.replace(pattern, replacement)
  }
  return result
}

function formatRelativeTime(dateStr: string): string {
  try {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'Az önce'
    if (mins < 60) return `${mins} dk önce`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours} saat önce`
    const days = Math.floor(hours / 24)
    if (days < 7) return `${days} gün önce`
    return new Date(dateStr).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })
  } catch {
    return ''
  }
}

function generateMockNotifications(): Notification[] {
  const now = Date.now()
  return [
    {
      id: 1,
      title: 'Randevu Onaylandı',
      message: 'ABC Oto Servis randevunuz onaylandı. 25.12.2024 saat 14:00',
      type: 'appointment',
      read: false,
      createdAt: new Date(now - 1000 * 60 * 30).toISOString(),
    },
    {
      id: 2,
      title: 'Yeni Kampanya!',
      message: 'Kış lastiği değişiminde %30 indirim! Kampanya detaylarını inceleyin.',
      type: 'campaign',
      read: false,
      createdAt: new Date(now - 1000 * 60 * 60 * 2).toISOString(),
    },
    {
      id: 3,
      title: 'Randevu Hatırlatması',
      message: "Yarın saat 10:00'da randevunuz bulunmaktadır. XYZ Oto Yıkama",
      type: 'appointment',
      read: true,
      createdAt: new Date(now - 1000 * 60 * 60 * 5).toISOString(),
    },
    {
      id: 4,
      title: 'Cüzdanım Güncellendi',
      message: 'Cüzdanınıza 500 TL yükleme işlemi başarıyla tamamlandı.',
      type: 'payment',
      read: true,
      createdAt: new Date(now - 1000 * 60 * 60 * 24).toISOString(),
    },
    {
      id: 5,
      title: 'İndirim Fırsatı!',
      message: 'Sadece bugün! Tüm servis işlemlerinde %20 indirim.',
      type: 'promotion',
      read: false,
      createdAt: new Date(now - 1000 * 60 * 60 * 24 * 2).toISOString(),
    },
    {
      id: 6,
      title: 'Yeni Araç Eklendi',
      message: '34ABC123 plakalı aracınız başarıyla sisteme eklendi.',
      type: 'system',
      read: true,
      createdAt: new Date(now - 1000 * 60 * 60 * 24 * 3).toISOString(),
    },
  ]
}

export default function BildirimlerPage() {
  const router = useRouter()
  const [user, setUser] = useState<ThUser | null>(null)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')

  useEffect(() => {
    try {
      const stored = localStorage.getItem('th_user')
      if (!stored) { router.push('/'); return }
      const u: ThUser = JSON.parse(stored)
      setUser(u)
      loadNotifications(u)
    } catch {
      router.push('/')
    }
  }, [router])


  const loadNotifications = async (u: ThUser) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/user/notifications-full?jwt=${encodeURIComponent(u.jwt)}`)
      const data = await res.json()
      const rawList = data.data?.data || data.data || []
      if (data.success && Array.isArray(rawList)) {
        setNotifications(
          rawList.map((n: { id: number; attributes?: Record<string, unknown> } & Record<string, unknown>) => {
            const attrs = (n.attributes || n) as Record<string, unknown>
            return {
              id: n.id,
              title: fixTurkishChars(String(attrs.title || '')),
              message: fixTurkishChars(String(attrs.message || attrs.description || '')),
              type: String(attrs.type || 'system') as NotifType,
              read: Boolean(attrs.read),
              createdAt: String(attrs.createdAt || ''),
            }
          })
        )
      } else {
        setNotifications([])
      }
    } catch {
      setNotifications([])
    } finally {
      setLoading(false)
    }
  }

  const emitBadgeUpdate = () => window.dispatchEvent(new Event('badge-update'))

  const markAsRead = async (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
    try {
      if (user) {
        await fetch(`/api/user/notifications-full`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ jwt: user.jwt, id }),
        })
      }
    } catch {
      // sessizce devam et
    }
    emitBadgeUpdate()
  }

  const deleteNotification = async (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
    if (user) {
      try {
        await fetch('/api/user/notifications-full', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ jwt: user.jwt, id }),
        })
      } catch {
        // sessizce devam et
      }
    }
    emitBadgeUpdate()
  }

  const markAllRead = async () => {
    const unread = notifications.filter(n => !n.read)
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    if (user && unread.length > 0) {
      try {
        await Promise.all(
          unread.map(n =>
            fetch('/api/user/notifications-full', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ jwt: user.jwt, id: n.id }),
            })
          )
        )
      } catch {
        // sessizce devam et
      }
    }
    emitBadgeUpdate()
  }

  const clearAll = async () => {
    if (!window.confirm('Tüm bildirimleri silmek istiyor musunuz?')) return
    const allIds = notifications.map(n => n.id)
    setNotifications([])
    if (user && allIds.length > 0) {
      try {
        await fetch('/api/user/notifications-full', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ jwt: user.jwt, ids: allIds }),
        })
      } catch {
        // sessizce devam et
      }
    }
    emitBadgeUpdate()
  }

  if (!user) return null

  const unreadCount = notifications.filter(n => !n.read).length

  const filtered = (() => {
    let list = notifications
    if (activeFilter === 'unread') list = notifications.filter(n => !n.read)
    else if (activeFilter !== 'all') list = notifications.filter(n => n.type === activeFilter)
    return [...list].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  })()

  return (
    <main className="min-h-screen bg-th-bg pt-20 pb-24 lg:pb-8 lg:pl-16 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* Geri */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-th-fg-muted hover:text-th-fg text-sm font-semibold mb-6 transition-colors duration-200 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
          Geri
        </button>

        {/* Baslik + Aksiyonlar */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-xl bg-brand-500/15 flex items-center justify-center relative">
                <Bell className="w-5 h-5 text-brand-500" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </div>
              <h1 className="text-xl font-black text-th-fg">Bildirimler</h1>
            </div>
            <p className="text-sm text-th-fg-muted pl-1">
              {unreadCount > 0 ? `${unreadCount} okunmamış bildirim` : 'Tüm bildirimler okundu'}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={markAllRead}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full border border-th-border/10 text-th-fg-muted hover:text-th-fg hover:border-th-border/20 text-xs font-semibold transition-all duration-200"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tümünü Oku</span>
            </button>
            <button
              onClick={clearAll}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full border border-th-border/10 text-th-fg-muted hover:text-red-400 hover:border-red-400/20 text-xs font-semibold transition-all duration-200"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Temizle</span>
            </button>
          </div>
        </div>

        {/* Filtreler */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6" style={{ scrollbarWidth: 'none' }}>
          {filterOptions.map(f => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-semibold text-sm whitespace-nowrap transition-all duration-200 border flex-shrink-0 ${
                activeFilter === f.key
                  ? 'bg-th-fg text-th-bg border-th-fg'
                  : 'bg-th-overlay/5 border-th-border/[0.08] text-th-fg-muted hover:bg-th-overlay/10 hover:text-th-fg'
              }`}
            >
              {f.key === 'all' && (
                <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${
                  activeFilter === f.key ? 'bg-brand-500 text-surface-900' : 'bg-th-overlay/10'
                }`}>
                  {notifications.length}
                </span>
              )}
              {f.key === 'unread' && (
                <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${
                  activeFilter === f.key ? 'bg-brand-500 text-surface-900' : 'bg-th-overlay/10'
                }`}>
                  {unreadCount}
                </span>
              )}
              {f.label}
            </button>
          ))}
        </div>

        {/* Bildirim Listesi */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-20 rounded-2xl bg-th-overlay/5 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center border border-dashed border-th-border/20">
            <div className="w-16 h-16 rounded-full bg-th-overlay/5 flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 text-th-fg-muted/40" />
            </div>
            <h3 className="text-base font-bold text-th-fg mb-2">Bildirim bulunamadı</h3>
            <p className="text-sm text-th-fg-muted">
              {activeFilter === 'all' ? 'Henüz bildiriminiz yok.' :
               activeFilter === 'unread' ? 'Tüm bildirimler okundu.' :
               'Bu kategoride bildirim bulunamadı.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(notif => {
              const tc = typeConfig[notif.type] || typeConfig.system
              return (
                <div
                  key={notif.id}
                  className={`glass-card rounded-2xl p-4 flex gap-4 border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card relative overflow-hidden ${
                    !notif.read
                      ? 'border-l-4 border-l-brand-500 border-th-border/[0.06] bg-brand-500/[0.02]'
                      : 'border-th-border/[0.06]'
                  }`}
                >
                  {/* Tip ikonu */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${tc.iconBg}`}>
                    {tc.icon}
                  </div>

                  {/* Icerik */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className={`text-sm font-bold ${!notif.read ? 'text-th-fg' : 'text-th-fg-sub'} flex items-center gap-2`}>
                        {notif.title}
                        {!notif.read && <span className="w-2 h-2 rounded-full bg-brand-500 flex-shrink-0 inline-block" />}
                      </h3>
                      <span className="text-xs text-th-fg-muted whitespace-nowrap flex-shrink-0 ml-2">
                        {formatRelativeTime(notif.createdAt)}
                      </span>
                    </div>
                    <p className="text-xs text-th-fg-muted leading-relaxed">{notif.message}</p>
                  </div>

                  {/* Aksiyonlar */}
                  <div className="flex flex-col gap-1.5 justify-center pl-3 border-l border-th-border/[0.06] flex-shrink-0">
                    {!notif.read && (
                      <button
                        onClick={() => markAsRead(notif.id)}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-emerald-400 hover:bg-emerald-400/10 transition-all duration-200"
                        title="Okundu işaretle"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notif.id)}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-th-fg-muted hover:text-red-400 hover:bg-red-400/10 transition-all duration-200"
                      title="Sil"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
