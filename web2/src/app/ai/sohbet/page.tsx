'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles, Wind, Flame, ArrowUpDown, AlertTriangle, Droplets, Thermometer,
  Send, Loader2, Bot, User, ArrowRight, RotateCcw, ShieldAlert, Clock, CircleDot,
  ChevronDown, Car, Info,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import Link from 'next/link'
import AnimatedSection from '@/components/shared/AnimatedSection'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'

// ─── Tipler ────────────────────────────────────────
interface AIResult {
  analysis: string
  possible_causes: string[]
  urgency: 'low' | 'medium' | 'high'
  urgency_label: string
  recommended_category: string
  recommended_action: string
  estimated_cost_range: string
  off_topic?: boolean
  message?: string
}

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  data?: AIResult
}

interface QuickIssue {
  id: string
  label: string
  icon: LucideIcon
  description: string
}

// ─── Sabitler ──────────────────────────────────────
const quickIssues: QuickIssue[] = [
  { id: 'titresim', label: 'Titreşim', icon: ArrowUpDown, description: 'Araç titriyor veya sallantı yapıyor' },
  { id: 'ses', label: 'Anormal Ses', icon: Wind, description: 'Tıkırtı, vınlama veya gıcırdama' },
  { id: 'duman', label: 'Duman/Koku', icon: Flame, description: 'Egzozdan duman veya yanık kokusu' },
  { id: 'uyari', label: 'Uyarı Lambası', icon: AlertTriangle, description: 'Gösterge panelinde uyarı yanıyor' },
  { id: 'sizinti', label: 'Sızıntı', icon: Droplets, description: 'Alttan yağ, su veya sıvı akıyor' },
  { id: 'klima', label: 'Klima/Isıtma', icon: Thermometer, description: 'Klima soğutmuyor veya kalorifer çalışmıyor' },
]

const urgencyConfig = {
  low: { color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20', icon: Clock },
  medium: { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: CircleDot },
  high: { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: ShieldAlert },
}

// ─── Sonuç Kartı ───────────────────────────────────
function ResultCard({ data, onSearchService }: { data: AIResult; onSearchService: (cat: string) => void }) {
  const urg = urgencyConfig[data.urgency] || urgencyConfig.medium
  const UrgencyIcon = urg.icon

  if (data.off_topic) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-4 border border-th-border/[0.08]"
      >
        <p className="text-th-fg-sub text-sm">{data.message || 'Bu konuda yardımcı olamıyorum.'}</p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-4 space-y-3 border border-th-border/[0.08]"
    >
      {/* Aciliyet */}
      <div className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold', urg.bg, urg.border, urg.color, 'border')}>
        <UrgencyIcon className="w-3 h-3" />
        {data.urgency_label} Aciliyet
      </div>

      {/* Analiz */}
      <p className="text-sm text-th-fg leading-relaxed">{data.analysis}</p>

      {/* Olası nedenler */}
      {data.possible_causes.length > 0 && (
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-th-fg-muted mb-1.5">Olası Nedenler</p>
          <ul className="space-y-1">
            {data.possible_causes.map((cause, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-th-fg-sub">
                <span className="w-1 h-1 rounded-full bg-brand-500/60 mt-1.5 shrink-0" />
                {cause}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Alt bilgi + CTA */}
      <div className="flex items-center justify-between pt-2 border-t border-th-border/[0.06]">
        <div className="text-[11px] text-th-fg-muted">
          {data.estimated_cost_range && <span>Tahmini: {data.estimated_cost_range}</span>}
        </div>
        {data.recommended_category && (
          <button
            type="button"
            onClick={() => onSearchService(data.recommended_category)}
            className="inline-flex items-center gap-1 text-xs font-semibold text-brand-400 hover:text-brand-300 transition-colors"
          >
            Servis Ara
            <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>
    </motion.div>
  )
}

// ─── Ana Sayfa ─────────────────────────────────────
export default function SohbetPage() {
  const [activeTab, setActiveTab] = useState<'quick' | 'chat'>('quick')
  const [selectedIssue, setSelectedIssue] = useState<string | null>(null)
  const [quickResult, setQuickResult] = useState<AIResult | null>(null)
  const [quickLoading, setQuickLoading] = useState(false)

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [chatInput, setChatInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  // Araç bilgileri (opsiyonel)
  const [showVehicleInfo, setShowVehicleInfo] = useState(false)
  const [vBrand, setVBrand] = useState('')
  const [vModel, setVModel] = useState('')
  const [vYear, setVYear] = useState('')
  const [vFuel, setVFuel] = useState('')
  const [brands, setBrands] = useState<{ brand: string }[]>([])
  const [models, setModels] = useState<{ model: string }[]>([])
  const [brandsLoading, setBrandsLoading] = useState(false)
  const [modelsLoading, setModelsLoading] = useState(false)

  const router = useRouter()

  const vehiclePayload = (vBrand || vModel || vYear || vFuel)
    ? { brand: vBrand || undefined, model: vModel || undefined, year: vYear || undefined, fuel: vFuel || undefined }
    : undefined

  // Markaları yükle
  useEffect(() => {
    if (!showVehicleInfo || brands.length > 0) return
    setBrandsLoading(true)
    fetch('/api/brands?vehicleType=otomobil')
      .then((res) => res.json())
      .then((data) => { if (data.success) setBrands(data.data) })
      .catch(() => {})
      .finally(() => setBrandsLoading(false))
  }, [showVehicleInfo, brands.length])

  // Modelleri yükle
  useEffect(() => {
    if (!vBrand) { setModels([]); return }
    setModelsLoading(true)
    setVModel('')
    fetch(`/api/models?brand=${encodeURIComponent(vBrand)}&vehicleType=otomobil`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setModels(data.data)
        else setModels([])
      })
      .catch(() => setModels([]))
      .finally(() => setModelsLoading(false))
  }, [vBrand])

  const scrollToBottom = useCallback(() => {
    const container = chatEndRef.current?.parentElement
    if (container) {
      container.scrollTop = container.scrollHeight
    }
  }, [])

  useEffect(() => {
    if (chatMessages.length > 0) {
      scrollToBottom()
    }
  }, [chatMessages, scrollToBottom])

  const handleSearchService = (category: string) => {
    router.push(`/servis-ara?q=${encodeURIComponent(category)}`)
  }

  // ─── Hızlı Öneri ───
  const handleQuickIssue = async (issueId: string) => {
    const issue = quickIssues.find((i) => i.id === issueId)
    if (!issue) return

    setSelectedIssue(issueId)
    setQuickResult(null)
    setQuickLoading(true)

    try {
      const res = await fetch('/api/ai/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'quick', issue_type: `${issue.label}: ${issue.description}`, vehicle: vehiclePayload }),
      })
      const data = await res.json()
      if (data.success) {
        setQuickResult(data.data)
      }
    } catch {
      setQuickResult({ analysis: 'Bir hata oluştu, lütfen tekrar deneyin.', possible_causes: [], urgency: 'medium', urgency_label: 'Orta', recommended_category: '', recommended_action: '', estimated_cost_range: '' })
    } finally {
      setQuickLoading(false)
    }
  }

  // ─── Chat ───
  const handleChatSend = async () => {
    const msg = chatInput.trim()
    if (!msg || chatLoading) return

    setChatInput('')
    setChatMessages((prev) => [...prev, { role: 'user', content: msg }])
    setChatLoading(true)

    try {
      const res = await fetch('/api/ai/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'chat', message: msg, vehicle: vehiclePayload }),
      })
      const data = await res.json()
      if (data.success) {
        setChatMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: data.data.off_topic ? data.data.message : data.data.analysis,
            data: data.data,
          },
        ])
      }
    } catch {
      setChatMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Bir hata oluştu, lütfen tekrar deneyin.' },
      ])
    } finally {
      setChatLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-20 lg:pb-24">
      {/* Background glow */}
      <div className="glow-dot w-96 h-96 top-0 left-1/2 -translate-x-1/2 opacity-20" />

      {/* Header */}
      <section className="section-container mb-10">
        <AnimatedSection className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-px bg-brand-500/50" />
            <span className="text-brand-500 text-sm font-semibold tracking-widest uppercase">
              Yapay Zeka
            </span>
            <div className="w-8 h-px bg-brand-500/50" />
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-extrabold mb-4">
            AI <span className="text-gold">Servis Asistanı</span>
          </h1>
          <p className="text-th-fg text-lg max-w-xl mx-auto">
            Aracının sorununu anlat, sana en uygun servisi önerelim
          </p>
        </AnimatedSection>
      </section>

      {/* Tab Switcher - mobil */}
      <div className="section-container">
        <div className="flex md:hidden justify-center gap-2 mb-6">
          {[
            { key: 'quick' as const, label: 'Hızlı Analiz' },
            { key: 'chat' as const, label: 'Sohbet' },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium transition-all',
                activeTab === tab.key
                  ? 'bg-brand-500/20 text-brand-400 border border-brand-500/30'
                  : 'text-th-fg-muted border border-th-border/[0.08] hover:text-th-fg'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* İki Sütunlu Layout */}
      <section className="section-container">
        <AnimatedSection delay={0.1}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Sol: Hızlı Öneriler */}
            <div className={cn('space-y-4', activeTab !== 'quick' && 'hidden md:block')}>
              <div className="glass-card p-5 md:p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-brand-500" />
                  <h3 className="font-display font-bold text-base text-th-fg">Hızlı Arıza Analizi</h3>
                </div>

                <p className="text-xs text-th-fg-muted mb-4">Aracında gözlemlediğin sorunu seç, AI analiz etsin</p>

                {/* Sorun Kartları */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
                  {quickIssues.map((issue) => {
                    const Icon = issue.icon
                    const isActive = selectedIssue === issue.id
                    return (
                      <button
                        key={issue.id}
                        type="button"
                        onClick={() => handleQuickIssue(issue.id)}
                        disabled={quickLoading}
                        className={cn(
                          'flex flex-col items-center gap-1.5 p-3 rounded-xl border text-center transition-all duration-200',
                          isActive
                            ? 'border-brand-500/40 bg-brand-500/10 shadow-glow-sm'
                            : 'border-th-border/[0.08] bg-th-overlay/[0.03] hover:border-brand-500/20 hover:bg-brand-500/[0.04]',
                          quickLoading && 'opacity-60 cursor-wait'
                        )}
                      >
                        <Icon className={cn('w-5 h-5', isActive ? 'text-brand-500' : 'text-th-fg-sub')} />
                        <span className={cn('text-xs font-medium', isActive ? 'text-brand-400' : 'text-th-fg')}>{issue.label}</span>
                      </button>
                    )
                  })}
                </div>

                {/* Sonuç */}
                <AnimatePresence mode="wait">
                  {quickLoading && (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center justify-center gap-2 py-8"
                    >
                      <Loader2 className="w-5 h-5 text-brand-500 animate-spin" />
                      <span className="text-sm text-th-fg-muted">AI analiz ediyor...</span>
                    </motion.div>
                  )}

                  {!quickLoading && quickResult && (
                    <ResultCard key="result" data={quickResult} onSearchService={handleSearchService} />
                  )}

                  {!quickLoading && !quickResult && !selectedIssue && (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-6"
                    >
                      <Bot className="w-8 h-8 text-th-fg-muted/30 mx-auto mb-2" />
                      <p className="text-xs text-th-fg-muted">Bir sorun tipi seçerek başlayın</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Sağ: Mini Chat */}
            <div className={cn('', activeTab !== 'chat' && 'hidden md:block')}>
              <div className="glass-card p-5 md:p-6 flex flex-col h-full min-h-[480px]">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Bot className="w-5 h-5 text-brand-500" />
                    <h3 className="font-display font-bold text-base text-th-fg">Sorununu Anlat</h3>
                  </div>
                  {chatMessages.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setChatMessages([])}
                      className="text-th-fg-muted hover:text-th-fg transition-colors"
                      title="Sohbeti temizle"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Opsiyonel Araç Bilgisi */}
                <div className="mb-3">
                  <button
                    type="button"
                    onClick={() => setShowVehicleInfo((p) => !p)}
                    className="flex items-center gap-1.5 text-[11px] text-th-fg-muted hover:text-brand-400 transition-colors"
                  >
                    <Car className="w-3.5 h-3.5" />
                    <span>{showVehicleInfo ? 'Araç bilgisini gizle' : 'Araç bilgisi ekle (opsiyonel)'}</span>
                    <ChevronDown className={cn('w-3 h-3 transition-transform', showVehicleInfo && 'rotate-180')} />
                    {vBrand && !showVehicleInfo && (
                      <span className="text-brand-400 font-medium ml-1">
                        {vBrand}{vModel ? ` ${vModel}` : ''}{vYear ? ` (${vYear})` : ''}
                      </span>
                    )}
                  </button>

                  <AnimatePresence>
                    {showVehicleInfo && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {/* Marka */}
                          <div className="relative">
                            <select
                              value={vBrand}
                              onChange={(e) => setVBrand(e.target.value)}
                              disabled={brandsLoading}
                              className="w-full bg-th-overlay/[0.05] border border-th-border/[0.08] rounded-lg px-3 py-1.5 text-xs text-th-fg appearance-none cursor-pointer outline-none focus:border-brand-500/30 transition-colors"
                            >
                              <option value="" className="bg-th-bg-alt">{brandsLoading ? 'Yükleniyor...' : 'Marka'}</option>
                              {brands.map((b) => <option key={b.brand} value={b.brand} className="bg-th-bg-alt">{b.brand}</option>)}
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-th-fg-muted pointer-events-none" />
                          </div>

                          {/* Model */}
                          <div className="relative">
                            <select
                              value={vModel}
                              onChange={(e) => setVModel(e.target.value)}
                              disabled={!vBrand || modelsLoading}
                              className={cn(
                                'w-full bg-th-overlay/[0.05] border border-th-border/[0.08] rounded-lg px-3 py-1.5 text-xs text-th-fg appearance-none cursor-pointer outline-none focus:border-brand-500/30 transition-colors',
                                !vBrand && 'opacity-50 cursor-not-allowed'
                              )}
                            >
                              <option value="" className="bg-th-bg-alt">{modelsLoading ? 'Yükleniyor...' : 'Model'}</option>
                              {models.map((m) => <option key={m.model} value={m.model} className="bg-th-bg-alt">{m.model}</option>)}
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-th-fg-muted pointer-events-none" />
                          </div>

                          {/* Yıl */}
                          <div className="relative">
                            <select
                              value={vYear}
                              onChange={(e) => setVYear(e.target.value)}
                              className="w-full bg-th-overlay/[0.05] border border-th-border/[0.08] rounded-lg px-3 py-1.5 text-xs text-th-fg appearance-none cursor-pointer outline-none focus:border-brand-500/30 transition-colors"
                            >
                              <option value="" className="bg-th-bg-alt">Yıl</option>
                              {Array.from({ length: 30 }, (_, i) => 2026 - i).map((y) => (
                                <option key={y} value={String(y)} className="bg-th-bg-alt">{y}</option>
                              ))}
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-th-fg-muted pointer-events-none" />
                          </div>

                          {/* Yakıt */}
                          <div className="relative">
                            <select
                              value={vFuel}
                              onChange={(e) => setVFuel(e.target.value)}
                              className="w-full bg-th-overlay/[0.05] border border-th-border/[0.08] rounded-lg px-3 py-1.5 text-xs text-th-fg appearance-none cursor-pointer outline-none focus:border-brand-500/30 transition-colors"
                            >
                              <option value="" className="bg-th-bg-alt">Yakıt</option>
                              <option value="Benzin" className="bg-th-bg-alt">Benzin</option>
                              <option value="Dizel" className="bg-th-bg-alt">Dizel</option>
                              <option value="LPG" className="bg-th-bg-alt">LPG</option>
                              <option value="Hibrit" className="bg-th-bg-alt">Hibrit</option>
                              <option value="Elektrik" className="bg-th-bg-alt">Elektrik</option>
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-th-fg-muted pointer-events-none" />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Mesajlar */}
                <div className="flex-1 overflow-y-auto space-y-3 mb-4 max-h-[400px] pr-1 scrollbar-thin">
                  {chatMessages.length === 0 && (
                    <div className="text-center py-10">
                      <Sparkles className="w-8 h-8 text-th-fg-muted/30 mx-auto mb-3" />
                      <p className="text-sm text-th-fg-muted mb-1">Aracının sorununu yaz</p>
                      <p className="text-[11px] text-th-fg-muted/70">
                        Örn: &quot;Fren pedalı yumuşak hissediyorum&quot;
                      </p>
                    </div>
                  )}

                  {chatMessages.map((msg, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn('flex gap-2', msg.role === 'user' ? 'justify-end' : 'justify-start')}
                    >
                      {msg.role === 'assistant' && (
                        <div className="w-6 h-6 rounded-full bg-brand-500/15 border border-brand-500/20 flex items-center justify-center shrink-0 mt-0.5">
                          <Bot className="w-3.5 h-3.5 text-brand-500" />
                        </div>
                      )}

                      <div className={cn('max-w-[85%]', msg.role === 'user' ? 'order-first' : '')}>
                        {msg.role === 'user' ? (
                          <div className="bg-brand-500/15 border border-brand-500/20 rounded-2xl rounded-br-md px-3.5 py-2">
                            <p className="text-sm text-th-fg">{msg.content}</p>
                          </div>
                        ) : msg.data && !msg.data.off_topic ? (
                          <ResultCard data={msg.data} onSearchService={handleSearchService} />
                        ) : (
                          <div className="glass-card px-3.5 py-2 border border-th-border/[0.08]">
                            <p className="text-sm text-th-fg-sub">{msg.content}</p>
                          </div>
                        )}
                      </div>

                      {msg.role === 'user' && (
                        <div className="w-6 h-6 rounded-full bg-th-overlay/[0.1] border border-th-border/[0.1] flex items-center justify-center shrink-0 mt-0.5">
                          <User className="w-3.5 h-3.5 text-th-fg-sub" />
                        </div>
                      )}
                    </motion.div>
                  ))}

                  {chatLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-2"
                    >
                      <div className="w-6 h-6 rounded-full bg-brand-500/15 border border-brand-500/20 flex items-center justify-center shrink-0">
                        <Bot className="w-3.5 h-3.5 text-brand-500" />
                      </div>
                      <div className="glass-card px-3.5 py-2.5 border border-th-border/[0.08]">
                        <div className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div ref={chatEndRef} />
                </div>

                {/* Input */}
                <form
                  onSubmit={(e) => { e.preventDefault(); handleChatSend() }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Aracındaki sorunu yaz..."
                    disabled={chatLoading}
                    className="flex-1 bg-th-overlay/[0.05] border border-th-border/[0.08] rounded-xl px-4 py-2.5 text-sm text-th-fg placeholder:text-th-fg-muted outline-none focus:border-brand-500/30 transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={chatLoading || !chatInput.trim()}
                    className={cn(
                      'w-10 h-10 rounded-xl flex items-center justify-center transition-all shrink-0',
                      chatInput.trim() && !chatLoading
                        ? 'bg-brand-500 text-brand-950 hover:bg-brand-400'
                        : 'bg-th-overlay/[0.05] text-th-fg-muted border border-th-border/[0.08]'
                    )}
                  >
                    {chatLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </button>
                </form>
              </div>
            </div>

          </div>
        </AnimatedSection>
      </section>

      {/* Info Bar */}
      <section className="section-container mt-8">
        <AnimatedSection delay={0.2}>
          <div className="glass-card p-4">
            <div className="flex items-start gap-3 text-sm">
              <Info className="w-5 h-5 text-brand-500 flex-shrink-0 mt-0.5" />
              <p className="text-th-fg-sub">
                <strong className="text-th-fg font-medium">Not:</strong>{' '}
                Bu asistan sadece araç bakımı, tamir ve arıza konularında yardımcı
                olabilir. Ciddi sorunlar için mutlaka profesyonel bir servise
                danışın.{' '}
                <Link
                  href="/servis-ara"
                  className="text-brand-500 hover:text-brand-400 underline underline-offset-2"
                >
                  Servis Bul
                </Link>
              </p>
            </div>
          </div>
        </AnimatedSection>
      </section>
    </div>
  )
}
