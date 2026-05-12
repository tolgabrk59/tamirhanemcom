'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  MessageSquare,
  Send,
  Building2,
  MapPin,
  Phone,
  ChevronRight,
  Circle,
  Loader2,
  Inbox,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface ThUser {
  id: number
  username: string
  name?: string
  email?: string
  phone?: string
  firstName?: string
  lastName?: string
}

interface ConversationService {
  id: number
  name: string
  location: string
  phone: string
}

interface LastMessage {
  id: number
  text: string
  isRead: boolean
  createdAt: string
  senderType: 'user' | 'service'
}

interface Conversation {
  id: number
  type: string
  createdAt: string
  updatedAt: string
  service: ConversationService
  lastMessage: LastMessage | null
  unreadCount: number
}

interface ChatMessage {
  id: number
  text: string
  isRead: boolean
  createdAt: string
  senderType: 'user' | 'service'
  senderName: string
}

function formatRelativeTime(dateStr: string): string {
  try {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'Az önce'
    if (mins < 60) return `${mins} dk`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours} sa`
    const days = Math.floor(hours / 24)
    if (days < 7) return `${days} gün`
    return new Date(dateStr).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })
  } catch {
    return ''
  }
}

function formatMessageTime(dateStr: string): string {
  try {
    const date = new Date(dateStr)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    const time = date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })

    if (diffDays === 0) return time
    if (diffDays === 1) return `Dün ${time}`
    if (diffDays < 7) {
      const day = date.toLocaleDateString('tr-TR', { weekday: 'short' })
      return `${day} ${time}`
    }
    return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' }) + ` ${time}`
  } catch {
    return ''
  }
}

export default function MesajlarPage() {
  const router = useRouter()
  const [user, setUser] = useState<ThUser | null>(null)
  const [jwt, setJwt] = useState<string>('')
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)

  // Chat detay
  const [activeConv, setActiveConv] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [chatLoading, setChatLoading] = useState(false)
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    try {
      const storedJwt = localStorage.getItem('tamirhanem_jwt')
      if (!storedJwt) { router.push('/'); return }
      setJwt(storedJwt)
      const storedUser = localStorage.getItem('tamirhanem_user')
      const parsed = storedUser ? JSON.parse(storedUser) : {}
      const u: ThUser = { id: parsed.id || 0, username: parsed.username || '', name: parsed.name, email: parsed.email, phone: parsed.phone, firstName: parsed.firstName, lastName: parsed.lastName }
      setUser(u)
      loadConversations(storedJwt)
    } catch {
      router.push('/')
    }
  }, [router])

  const loadConversations = async (token: string) => {
    setLoading(true)
    try {
      const res = await fetch('/api/user/messages', { headers: { Authorization: 'Bearer ' + token } })
      const data = await res.json()
      if (data.success) {
        // En yeni mesajı olan konuşma en üstte olacak şekilde sırala
        const sorted = [...(data.conversations || [])].sort((a: Conversation, b: Conversation) => {
          const aTime = a.lastMessage?.createdAt || a.updatedAt || a.createdAt
          const bTime = b.lastMessage?.createdAt || b.updatedAt || b.createdAt
          return new Date(bTime).getTime() - new Date(aTime).getTime()
        })
        setConversations(sorted)
      }
    } catch {
      // Sessizce devam et
    } finally {
      setLoading(false)
    }
  }

  const openConversation = useCallback(async (conv: Conversation) => {
    if (!user || !jwt) return
    setActiveConv(conv)
    setChatLoading(true)
    setMessages([])

    try {
      const res = await fetch(`/api/user/messages/${conv.id}`, { headers: { Authorization: 'Bearer ' + jwt } })
      const data = await res.json()
      if (data.success) {
        setMessages(data.messages || [])
      }

      // Mesajlari okundu yap
      if (conv.unreadCount > 0) {
        await fetch(`/api/user/messages/${conv.id}`, {
          method: 'PUT',
          headers: { Authorization: 'Bearer ' + jwt },
        })
        setConversations(prev =>
          prev.map(c => c.id === conv.id ? { ...c, unreadCount: 0 } : c)
        )
      }
    } catch {
      // Sessizce devam et
    } finally {
      setChatLoading(false)
    }
  }, [user, jwt])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!user || !jwt || !activeConv || !newMessage.trim() || sending) return
    const text = newMessage.trim()
    setNewMessage('')
    setSending(true)

    // Optimistic update
    const tempMsg: ChatMessage = {
      id: Date.now(),
      text,
      isRead: false,
      createdAt: new Date().toISOString(),
      senderType: 'user',
      senderName: user.name || user.username,
    }
    setMessages(prev => [...prev, tempMsg])

    try {
      const res = await fetch('/api/user/messages', {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + jwt, 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId: activeConv.id, text }),
      })
      const data = await res.json()
      if (data.success && data.message) {
        const msgAttrs = (data.message.attributes || data.message) as Record<string, unknown>
        const newCreatedAt = String(msgAttrs.createdAt || tempMsg.createdAt)
        setMessages(prev =>
          prev.map(m =>
            m.id === tempMsg.id
              ? { ...m, id: (data.message.id || m.id) as number, createdAt: newCreatedAt }
              : m
          )
        )
        // Aktif konuşmayı listenin başına taşı (en yeni mesaj = en üstte)
        setConversations(prev => {
          const updated = prev.map(c =>
            c.id === activeConv.id
              ? { ...c, updatedAt: newCreatedAt, lastMessage: { id: (data.message.id || tempMsg.id) as number, text, isRead: false, createdAt: newCreatedAt, senderType: 'user' as const } }
              : c
          )
          return updated.sort((a, b) => {
            const aTime = a.lastMessage?.createdAt || a.updatedAt || a.createdAt
            const bTime = b.lastMessage?.createdAt || b.updatedAt || b.createdAt
            return new Date(bTime).getTime() - new Date(aTime).getTime()
          })
        })
      }
    } catch {
      // Hata durumunda mesaji geri al
      setMessages(prev => prev.filter(m => m.id !== tempMsg.id))
      setNewMessage(text)
    } finally {
      setSending(false)
      inputRef.current?.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const goBack = () => {
    if (activeConv) {
      setActiveConv(null)
      setMessages([])
    } else {
      router.back()
    }
  }

  if (!user) return null

  const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0)

  // ─── Chat Detay Gorunumu ────────────────────────
  if (activeConv) {
    return (
      <main className="min-h-screen bg-th-bg pt-20 pb-0 lg:pl-16 animate-fade-in">
        <div className="max-w-7xl mx-auto flex flex-col h-[calc(100vh-5rem)]">

          {/* Chat Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-th-border/[0.08] bg-th-bg/80 backdrop-blur-sm flex-shrink-0">
            <button
              onClick={goBack}
              className="w-9 h-9 rounded-full flex items-center justify-center text-th-fg-muted hover:text-th-fg hover:bg-th-overlay/10 transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="w-10 h-10 rounded-full bg-brand-500/15 flex items-center justify-center flex-shrink-0">
              <Building2 className="w-5 h-5 text-brand-500" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-bold text-th-fg truncate">{activeConv.service.name}</h2>
              {activeConv.service.location && (
                <p className="text-xs text-th-fg-muted truncate flex items-center gap-1">
                  <MapPin className="w-3 h-3 flex-shrink-0" />
                  {activeConv.service.location}
                </p>
              )}
            </div>
            {activeConv.service.phone && (
              <a
                href={`tel:${activeConv.service.phone}`}
                className="w-9 h-9 rounded-full flex items-center justify-center text-brand-500 hover:bg-brand-500/10 transition-all"
              >
                <Phone className="w-4 h-4" />
              </a>
            )}
          </div>

          {/* Mesajlar */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3" style={{ scrollbarWidth: 'thin' }}>
            {chatLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-6 h-6 text-brand-500 animate-spin" />
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-14 h-14 rounded-full bg-th-overlay/5 flex items-center justify-center mb-3">
                  <MessageSquare className="w-7 h-7 text-th-fg-muted/40" />
                </div>
                <p className="text-sm text-th-fg-muted">Henüz mesaj yok</p>
                <p className="text-xs text-th-fg-muted/60 mt-1">Servise mesaj göndermek için aşağıya yazın</p>
              </div>
            ) : (
              <>
                {/* Konusma tipi badge */}
                <div className="flex justify-center mb-2">
                  <span className="text-[10px] font-semibold text-th-fg-muted bg-th-overlay/5 px-3 py-1 rounded-full">
                    {activeConv.type === 'pre-offer' ? 'Teklif Öncesi Görüşme' : 'Mesajlaşma'}
                  </span>
                </div>

                {messages.map(msg => (
                  <div
                    key={msg.id}
                    className={cn(
                      'flex',
                      msg.senderType === 'user' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    <div
                      className={cn(
                        'max-w-[80%] rounded-2xl px-4 py-2.5 relative',
                        msg.senderType === 'user'
                          ? 'bg-brand-500 text-brand-950 rounded-br-sm'
                          : 'bg-th-overlay/[0.08] text-th-fg border border-th-border/[0.06] rounded-bl-sm'
                      )}
                    >
                      {msg.senderType === 'service' && (
                        <p className="text-[10px] font-bold text-brand-500 mb-1">{msg.senderName}</p>
                      )}
                      <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{msg.text}</p>
                      <p
                        className={cn(
                          'text-[10px] mt-1 text-right',
                          msg.senderType === 'user' ? 'text-brand-950/60' : 'text-th-fg-muted/60'
                        )}
                      >
                        {formatMessageTime(msg.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Mesaj Girisi */}
          <div className="border-t border-th-border/[0.08] bg-th-bg/80 backdrop-blur-sm px-4 py-3 flex-shrink-0">
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Mesajınızı yazın..."
                rows={1}
                className="flex-1 resize-none bg-th-overlay/5 border border-th-border/[0.08] rounded-2xl px-4 py-3 text-sm text-th-fg placeholder:text-th-fg-muted/50 focus:outline-none focus:border-brand-500/30 focus:bg-th-overlay/[0.08] transition-all max-h-32"
                style={{ minHeight: '44px' }}
              />
              <button
                onClick={handleSend}
                disabled={!newMessage.trim() || sending}
                className={cn(
                  'w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200',
                  newMessage.trim() && !sending
                    ? 'bg-brand-500 text-brand-950 hover:bg-brand-400 shadow-lg shadow-brand-500/20'
                    : 'bg-th-overlay/5 text-th-fg-muted/40'
                )}
              >
                {sending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
            <p className="text-[10px] text-th-fg-muted/40 text-center mt-2 pb-safe">
              Mesajlarınız servis ile paylaşılacaktır
            </p>
          </div>
        </div>
      </main>
    )
  }

  // ─── Konusma Listesi ────────────────────────────
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

        {/* Baslik */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-xl bg-brand-500/15 flex items-center justify-center relative">
                <MessageSquare className="w-5 h-5 text-brand-500" />
                {totalUnread > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                    {totalUnread}
                  </span>
                )}
              </div>
              <h1 className="text-xl font-black text-th-fg">Mesajlar</h1>
            </div>
            <p className="text-sm text-th-fg-muted pl-1">
              {totalUnread > 0 ? `${totalUnread} okunmamış mesaj` : 'Servislerle mesajlaşınız'}
            </p>
          </div>
        </div>

        {/* Konusma Listesi */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 rounded-2xl bg-th-overlay/5 animate-pulse" />
            ))}
          </div>
        ) : conversations.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center border border-dashed border-th-border/20">
            <div className="w-16 h-16 rounded-full bg-th-overlay/5 flex items-center justify-center mx-auto mb-4">
              <Inbox className="w-8 h-8 text-th-fg-muted/40" />
            </div>
            <h3 className="text-base font-bold text-th-fg mb-2">Mesaj bulunamadı</h3>
            <p className="text-sm text-th-fg-muted">
              Henüz bir servis ile mesajlaşmanız bulunmuyor.<br />
              Bir servisten teklif istediğinizde burada görünecektir.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {conversations.map(conv => (
              <button
                key={conv.id}
                onClick={() => openConversation(conv)}
                className={cn(
                  'w-full glass-card rounded-2xl p-4 flex items-center gap-3.5 border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card text-left',
                  conv.unreadCount > 0
                    ? 'border-l-4 border-l-brand-500 border-th-border/[0.06] bg-brand-500/[0.02]'
                    : 'border-th-border/[0.06]'
                )}
              >
                {/* Servis Avatar */}
                <div className="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-5 h-5 text-brand-500" />
                </div>

                {/* Icerik */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <h3 className={cn(
                      'text-sm font-bold truncate',
                      conv.unreadCount > 0 ? 'text-th-fg' : 'text-th-fg-sub'
                    )}>
                      {conv.service.name}
                    </h3>
                    {conv.lastMessage && (
                      <span className="text-[10px] text-th-fg-muted whitespace-nowrap flex-shrink-0">
                        {formatRelativeTime(conv.lastMessage.createdAt)}
                      </span>
                    )}
                  </div>

                  {conv.lastMessage ? (
                    <p className={cn(
                      'text-xs leading-relaxed truncate',
                      conv.unreadCount > 0 ? 'text-th-fg font-medium' : 'text-th-fg-muted'
                    )}>
                      {conv.lastMessage.senderType === 'user' && (
                        <span className="text-th-fg-muted/60">Siz: </span>
                      )}
                      {conv.lastMessage.text}
                    </p>
                  ) : (
                    <p className="text-xs text-th-fg-muted/50 italic">Henüz mesaj yok</p>
                  )}

                  {conv.type === 'pre-offer' && (
                    <span className="inline-block mt-1 text-[10px] font-semibold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full">
                      Teklif Görüşmesi
                    </span>
                  )}
                </div>

                {/* Sag Taraf */}
                <div className="flex flex-col items-center gap-1 flex-shrink-0">
                  {conv.unreadCount > 0 ? (
                    <span className="w-5 h-5 rounded-full bg-brand-500 text-brand-950 text-[10px] font-bold flex items-center justify-center">
                      {conv.unreadCount}
                    </span>
                  ) : (
                    <ChevronRight className="w-4 h-4 text-th-fg-muted/30" />
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
