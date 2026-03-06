'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Wallet, Plus, ArrowUpRight, ArrowDownLeft, Clock, CheckCircle } from 'lucide-react'

interface ThUser {
  id: number
  username: string
  jwt: string
  name?: string
}

interface Transaction {
  id: number
  type: 'giris' | 'cikis'
  amount: string
  description: string
  date: string
  status: 'tamamlandi' | 'bekliyor'
}

export default function CuzdanimPage() {
  const router = useRouter()
  const [user, setUser] = useState<ThUser | null>(null)
  const [balance, setBalance] = useState('0,00')
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ toplamHarcama: '₺0', toplamYukleme: '₺0', puan: '0' })

  useEffect(() => {
    try {
      const stored = localStorage.getItem('th_user')
      if (!stored) { router.push('/'); return }
      const u: ThUser = JSON.parse(stored)
      setUser(u)
      loadWallet(u)
    } catch { router.push('/') }
  }, [router])

  const loadWallet = async (u: ThUser) => {
    setLoading(true)
    try {
      const [walletRes, txRes] = await Promise.all([
        fetch(`/api/user/wallet?jwt=${encodeURIComponent(u.jwt)}`),
        fetch(`/api/user/transactions?jwt=${encodeURIComponent(u.jwt)}&pageSize=20`),
      ])

      // Bakiye — route { success, data: { id, balance } }
      if (walletRes.ok) {
        const walletData = await walletRes.json()
        const bal = walletData?.data?.balance ?? null
        if (bal !== null) {
          setBalance(Number(bal).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
        }
      }

      // İşlemler — route { success, data: [{id, type, amount, description, status, createdAt}] }
      if (txRes.ok) {
        const txData = await txRes.json()
        const rawList: { id: number; type: string; amount: number; description: string; status: string; createdAt: string }[] = txData.data || []

        const mapped: Transaction[] = rawList.map(t => ({
          id: t.id,
          type: t.type === 'giris' ? 'giris' : 'cikis',
          amount: t.type === 'giris'
            ? `+₺${t.amount.toLocaleString('tr-TR')}`
            : `-₺${t.amount.toLocaleString('tr-TR')}`,
          description: t.description,
          date: t.createdAt ? new Date(t.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }) : '',
          status: (t.status === 'completed' || t.status === 'tamamlandi') ? 'tamamlandi' : 'bekliyor',
        }))

        setTransactions(mapped)

        // İstatistikler
        const harcama = mapped.filter(t => t.type === 'cikis').reduce((s, t) => s + parseInt(t.amount.replace(/\D/g, '')), 0)
        const yukleme = mapped.filter(t => t.type === 'giris').reduce((s, t) => s + parseInt(t.amount.replace(/\D/g, '')), 0)
        setStats({
          toplamHarcama: `₺${harcama.toLocaleString('tr-TR')}`,
          toplamYukleme: `₺${yukleme.toLocaleString('tr-TR')}`,
          puan: '0',
        })
      }
    } catch {
      // sessizce devam
    } finally {
      setLoading(false)
    }
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

        {/* Bakiye Kartı */}
        <div className="relative bg-gradient-to-br from-gold/20 via-gold/10 to-brand-500/5 rounded-2xl border border-gold/20 p-6 mb-6 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent pointer-events-none" />
          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gold/20 border border-gold/30 flex items-center justify-center">
                <Wallet className="w-5 h-5 text-gold" />
              </div>
              <div>
                <div className="text-xs font-semibold text-th-fg-muted uppercase tracking-wide">TamirHanem Cüzdan</div>
                <div className="text-xs text-th-fg-muted">{user.name || user.username}</div>
              </div>
            </div>

            <div className="mb-6">
              {loading ? (
                <div className="h-10 w-32 bg-gold/10 animate-pulse rounded-xl" />
              ) : (
                <div className="text-4xl font-black text-gold">₺{balance}</div>
              )}
              <div className="text-xs text-th-fg-muted mt-1">Mevcut Bakiye</div>
            </div>

            {/* Aksiyonlar */}
            <div className="flex gap-3">
              <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gold text-surface-900 font-bold text-sm transition-all hover:-translate-y-0.5 shadow-lg hover:bg-gold/90">
                <Plus className="w-4 h-4" />
                Bakiye Yükle
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-th-overlay/10 border border-th-border/10 text-th-fg font-bold text-sm transition-all hover:bg-th-overlay/15">
                <ArrowUpRight className="w-4 h-4" />
                Para Çek
              </button>
            </div>
          </div>
        </div>

        {/* Hızlı İstatistikler */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: 'Toplam Harcama', value: stats.toplamHarcama, color: 'text-red-400' },
            { label: 'Toplam Yükleme', value: stats.toplamYukleme, color: 'text-emerald-400' },
            { label: 'Kazanılan Puan', value: stats.puan, color: 'text-gold' },
          ].map(s => (
            <div key={s.label} className="glass-card rounded-xl p-3 border border-th-border/[0.06] text-center">
              <div className={`text-lg font-black ${s.color}`}>{s.value}</div>
              <div className="text-[10px] text-th-fg-muted font-semibold tracking-wide mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* İşlem Geçmişi */}
        <div>
          <h2 className="text-xs font-bold text-th-fg-muted tracking-widest uppercase mb-3 px-1">İŞLEM GEÇMİŞİ</h2>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => <div key={i} className="h-16 rounded-2xl bg-th-overlay/5 animate-pulse" />)}
            </div>
          ) : transactions.length === 0 ? (
            <div className="glass-card rounded-2xl p-10 text-center border border-dashed border-th-border/20">
              <Wallet className="w-10 h-10 text-gold/30 mx-auto mb-3" />
              <p className="text-sm text-th-fg-muted">Henüz işlem bulunmuyor</p>
            </div>
          ) : (
            <div className="glass-card rounded-2xl border border-th-border/[0.06] overflow-hidden divide-y divide-th-border/[0.06]">
              {transactions.map(tx => (
                <div key={tx.id} className="flex items-center gap-4 px-5 py-4 hover:bg-brand-500/[0.02] transition-colors">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                    tx.type === 'giris' ? 'bg-emerald-400/10' : 'bg-red-400/10'
                  }`}>
                    {tx.type === 'giris'
                      ? <ArrowDownLeft className="w-4 h-4 text-emerald-400" />
                      : <ArrowUpRight className="w-4 h-4 text-red-400" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-th-fg">{tx.description}</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-th-fg-muted">{tx.date}</span>
                      {tx.status === 'bekliyor' && (
                        <span className="flex items-center gap-1 text-[10px] font-semibold text-amber-400">
                          <Clock className="w-3 h-3" /> Bekliyor
                        </span>
                      )}
                      {tx.status === 'tamamlandi' && (
                        <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400">
                          <CheckCircle className="w-3 h-3" /> Tamamlandı
                        </span>
                      )}
                    </div>
                  </div>
                  <div className={`text-sm font-black flex-shrink-0 ${tx.type === 'giris' ? 'text-emerald-400' : 'text-red-400'}`}>
                    {tx.amount}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
