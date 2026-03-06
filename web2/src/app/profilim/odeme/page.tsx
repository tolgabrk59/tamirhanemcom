'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, CreditCard, Plus, Trash2, Shield, CheckCircle } from 'lucide-react'

interface ThUser {
  id: number
  username: string
  jwt: string
  name?: string
}

interface Card {
  id: number
  last4: string
  brand: 'Visa' | 'Mastercard' | 'Troy'
  expiry: string
  isDefault: boolean
}

const BRAND_COLORS: Record<string, string> = {
  Visa: 'from-blue-600 to-blue-800',
  Mastercard: 'from-red-500 to-orange-600',
  Troy: 'from-red-700 to-red-900',
}

export default function OdemePage() {
  const router = useRouter()
  const [user, setUser] = useState<ThUser | null>(null)
  const [cards, setCards] = useState<Card[]>([])
  const [showInfo, setShowInfo] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('th_user')
      if (!stored) { router.push('/'); return }
      setUser(JSON.parse(stored))
    } catch { router.push('/') }
  }, [router])

  const setDefault = (id: number) => {
    setCards(prev => prev.map(c => ({ ...c, isDefault: c.id === id })))
  }

  const removeCard = (id: number) => {
    setCards(prev => prev.filter(c => c.id !== id))
  }

  if (!user) return null

  return (
    <main className="min-h-screen bg-th-bg pt-20 pb-24 lg:pb-8 lg:pl-16">
      <div className="max-w-3xl mx-auto px-4 py-6">

        {/* Geri */}
        <button onClick={() => router.back()} className="flex items-center gap-2 text-th-fg-muted hover:text-th-fg text-sm font-semibold mb-6 transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Geri
        </button>

        {/* Başlık */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-500/15 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-brand-500" />
            </div>
            <h1 className="text-xl font-black text-th-fg">Ödeme Yöntemleri</h1>
          </div>
          <button
            onClick={() => setShowInfo(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-brand-500 hover:bg-brand-600 text-surface-900 font-bold text-sm transition-all shadow-glow-sm hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4" />
            Kart Ekle
          </button>
        </div>

        {/* Güvenlik Notu */}
        <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-400/5 border border-emerald-400/15 mb-6">
          <Shield className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-sm font-semibold text-emerald-400 mb-0.5">Güvenli Ödeme</div>
            <div className="text-xs text-th-fg-muted">Kartlarınız 256-bit SSL şifrelemesiyle korunur. Kart bilgileriniz saklanmaz.</div>
          </div>
        </div>

        {/* Kart Listesi */}
        {cards.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center border border-dashed border-th-border/20">
            <div className="w-16 h-16 rounded-full bg-brand-500/10 flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-8 h-8 text-brand-500/50" />
            </div>
            <h3 className="text-base font-bold text-th-fg mb-2">Kayıtlı kart yok</h3>
            <p className="text-sm text-th-fg-muted mb-5">Kredi veya banka kartı ekleyerek hızlı ödeme yapın.</p>
            <button
              onClick={() => setShowInfo(true)}
              className="px-6 py-2.5 rounded-full bg-brand-500 hover:bg-brand-600 text-surface-900 font-bold text-sm transition-all"
            >
              Kart Ekle
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {cards.map(card => (
              <div key={card.id} className="glass-card rounded-2xl border border-th-border/[0.06] hover:border-brand-500/20 transition-all overflow-hidden">
                {/* Kart Görünümü */}
                <div className={`bg-gradient-to-br ${BRAND_COLORS[card.brand]} p-5 relative`}>
                  <div className="flex items-start justify-between mb-6">
                    <span className="text-white font-bold text-sm opacity-90">{card.brand}</span>
                    {card.isDefault && (
                      <span className="flex items-center gap-1 bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        <CheckCircle className="w-3 h-3" /> Varsayılan
                      </span>
                    )}
                  </div>
                  <div className="text-white font-mono text-lg tracking-widest">•••• •••• •••• {card.last4}</div>
                  <div className="text-white/70 text-xs mt-2">{card.expiry}</div>
                </div>

                {/* Aksiyonlar */}
                <div className="flex items-center justify-between px-5 py-3">
                  {!card.isDefault && (
                    <button onClick={() => setDefault(card.id)} className="text-xs font-semibold text-brand-500 hover:text-brand-400 transition-colors">
                      Varsayılan Yap
                    </button>
                  )}
                  {card.isDefault && <span className="text-xs text-th-fg-muted">Varsayılan kart</span>}
                  <button onClick={() => removeCard(card.id)} className="flex items-center gap-1.5 text-xs font-semibold text-red-400 hover:text-red-300 transition-colors ml-auto">
                    <Trash2 className="w-3.5 h-3.5" />
                    Kaldır
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Desteklenen Ödeme Yöntemleri */}
        <div className="mt-8">
          <h2 className="text-xs font-bold text-th-fg-muted tracking-widest uppercase mb-3 px-1">DESTEKLENEN ÖDEME YÖNTEMLERİ</h2>
          <div className="glass-card rounded-2xl p-4 border border-th-border/[0.06]">
            <div className="flex flex-wrap gap-3">
              {['Visa', 'Mastercard', 'Troy', 'Banka Havalesi', 'TamirHanem Cüzdan'].map(m => (
                <span key={m} className="px-3 py-1.5 rounded-full bg-th-overlay/5 border border-th-border/[0.08] text-xs font-semibold text-th-fg-muted">
                  {m}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Kart Ekle Modal */}
      {showInfo && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={e => { if (e.target === e.currentTarget) setShowInfo(false) }}>
          <div className="glass-card rounded-2xl w-full max-w-sm p-6 shadow-card">
            <h3 className="text-lg font-bold text-th-fg mb-3">Kart Ekle</h3>
            <div className="flex items-start gap-3 p-3 rounded-xl bg-amber-400/5 border border-amber-400/15 mb-4">
              <Shield className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-th-fg-muted">Güvenliğiniz için kart bilgilerinizi yalnızca ödeme sırasında giriniz. Kart bilgileriniz sistemimizde saklanmaz.</p>
            </div>
            <button onClick={() => setShowInfo(false)} className="w-full py-3 rounded-full bg-brand-500 hover:bg-brand-600 text-surface-900 font-bold text-sm transition-all">
              Anladım
            </button>
          </div>
        </div>
      )}
    </main>
  )
}
