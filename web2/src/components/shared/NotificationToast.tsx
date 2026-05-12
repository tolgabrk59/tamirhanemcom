'use client'

import { useState, useEffect, useCallback } from 'react'
import { Bell, MessageSquare, CalendarDays, X, CheckCircle2, AlertTriangle, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ToastNotification {
  id: string
  title: string
  message: string
  type: 'notification' | 'message' | 'appointment' | 'success' | 'warning' | 'info'
  timestamp: number
}

const ICON_MAP = {
  notification: Bell,
  message: MessageSquare,
  appointment: CalendarDays,
  success: CheckCircle2,
  warning: AlertTriangle,
  info: Info,
}

const COLOR_MAP = {
  notification: 'border-brand-500/30 bg-brand-500/5',
  message: 'border-sky-500/30 bg-sky-500/5',
  appointment: 'border-violet-500/30 bg-violet-500/5',
  success: 'border-emerald-500/30 bg-emerald-500/5',
  warning: 'border-amber-500/30 bg-amber-500/5',
  info: 'border-blue-500/30 bg-blue-500/5',
}

const ICON_COLOR_MAP = {
  notification: 'text-brand-500 bg-brand-500/10',
  message: 'text-sky-500 bg-sky-500/10',
  appointment: 'text-violet-500 bg-violet-500/10',
  success: 'text-emerald-500 bg-emerald-500/10',
  warning: 'text-amber-500 bg-amber-500/10',
  info: 'text-blue-500 bg-blue-500/10',
}

export default function NotificationToast() {
  const [toasts, setToasts] = useState<ToastNotification[]>([])
  const [prevNotifIds, setPrevNotifIds] = useState<Set<number>>(new Set())
  const [prevMsgCount, setPrevMsgCount] = useState(0)
  const [initialized, setInitialized] = useState(false)

  const addToast = useCallback((title: string, message: string, type: ToastNotification['type']) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
    setToasts(prev => [...prev.slice(-4), { id, title, message, type, timestamp: Date.now() }])
    // 5 saniye sonra otomatik kaldır
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 5000)
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  // Bildirim ve mesaj polling — yeni gelenleri toast olarak göster
  useEffect(() => {
    let stored: { id: number; username: string; jwt: string } | null = null
    try {
      const raw = localStorage.getItem('th_user')
      if (raw) stored = JSON.parse(raw)
    } catch {}
    if (!stored) return

    const jwt = stored.jwt

    const poll = async () => {
      // Bildirimler
      try {
        const res = await fetch(`/api/user/notifications-full?jwt=${encodeURIComponent(jwt)}`)
        const data = await res.json()
        if (data.success && data.data?.data) {
          const items = data.data.data as Array<{ id: number; title?: string; message?: string; type?: string; read?: boolean; createdAt?: string }>
          const currentIds = new Set(items.map(n => n.id))

          if (initialized) {
            // Sadece yeni gelen (önceki poll'da olmayan) bildirimleri toast yap
            items.forEach(n => {
              if (!prevNotifIds.has(n.id) && !n.read) {
                const type = n.type === 'appointment' ? 'appointment' : 'notification'
                addToast(n.title || 'Bildirim', n.message || 'Yeni bir bildiriminiz var', type)
              }
            })
          }

          setPrevNotifIds(currentIds)
        }
      } catch {}

      // Mesajlar
      try {
        const res = await fetch(`/api/user/messages?jwt=${encodeURIComponent(jwt)}`)
        const data = await res.json()
        if (data.success && Array.isArray(data.conversations)) {
          const total = data.conversations.reduce((sum: number, c: { unreadCount?: number }) => sum + (c.unreadCount || 0), 0)

          if (initialized && total > prevMsgCount) {
            const diff = total - prevMsgCount
            addToast('Yeni Mesaj', `${diff} yeni mesajınız var`, 'message')
          }

          setPrevMsgCount(total)
        }
      } catch {}

      if (!initialized) setInitialized(true)
    }

    poll()
    const timer = setInterval(poll, 30_000) // 30 saniyede bir kontrol
    return () => clearInterval(timer)
  }, [initialized, prevNotifIds, prevMsgCount, addToast])

  // Custom event ile dışarıdan toast tetikleme
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ title: string; message: string; type?: ToastNotification['type'] }>).detail
      if (detail) addToast(detail.title, detail.message, detail.type || 'info')
    }
    window.addEventListener('show-toast', handler)
    return () => window.removeEventListener('show-toast', handler)
  }, [addToast])

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast, i) => {
        const Icon = ICON_MAP[toast.type]
        return (
          <div
            key={toast.id}
            className={cn(
              'pointer-events-auto rounded-xl border shadow-2xl backdrop-blur-xl p-3.5 flex items-start gap-3 transition-all duration-300',
              COLOR_MAP[toast.type],
              'animate-in slide-in-from-right-5 fade-in duration-300'
            )}
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center shrink-0', ICON_COLOR_MAP[toast.type])}>
              <Icon className="w-4.5 h-4.5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-th-fg truncate">{toast.title}</p>
              <p className="text-xs text-th-fg-muted line-clamp-2 mt-0.5">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-th-fg-muted hover:text-th-fg hover:bg-th-overlay/10 transition-all"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
