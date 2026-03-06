'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Loader2, AlertTriangle, ChevronLeft, Car } from 'lucide-react'
import AnimatedSection from '@/components/shared/AnimatedSection'

export default function IncelemeDetayPage() {
  const params = useParams()
  const id = params?.id as string
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) {
      setError('Geçersiz inceleme ID')
      setLoading(false)
      return
    }

    async function fetchAndRedirect() {
      try {
        const STRAPI_URL = '/api/ai/analyses'
        const res = await fetch(STRAPI_URL)
        if (!res.ok) throw new Error('Veri yüklenemedi')

        const result = await res.json()
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const entry = (result.data || []).find((a: any) => String(a.id) === id)

        if (entry) {
          const url = `/arac/analiz?brand=${encodeURIComponent(entry.brand)}&model=${encodeURIComponent(entry.model)}&year=${entry.year}`
          window.location.replace(url)
          return
        }

        setError('Bu inceleme bulunamadı.')
      } catch {
        setError('İnceleme yüklenirken bir sorun oluştu.')
      } finally {
        setLoading(false)
      }
    }

    fetchAndRedirect()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex flex-col items-center justify-center">
        <AnimatedSection>
          <div className="text-center">
            <div className="w-20 h-20 bg-brand-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Loader2 className="w-10 h-10 text-brand-500 animate-spin" />
            </div>
            <h2 className="text-xl font-display font-bold text-th-fg mb-3">Yönlendiriliyor...</h2>
            <p className="text-th-fg-sub text-sm">İnceleme sayfasına yönlendiriliyorsunuz.</p>
          </div>
        </AnimatedSection>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
      <AnimatedSection>
        <div className="glass-card p-8 md:p-12 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-xl font-display font-bold text-th-fg mb-3">İnceleme Bulunamadı</h2>
          <p className="text-th-fg-sub mb-6">{error}</p>
          <div className="flex flex-col gap-3">
            <Link
              href="/incelemeler"
              className="inline-flex items-center justify-center gap-2 bg-brand-500 text-th-bg px-6 py-3 rounded-xl font-bold hover:bg-brand-600 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Tüm İncelemelere Dön
            </Link>
            <Link
              href="/arac/genel-bakis"
              className="inline-flex items-center justify-center gap-2 bg-th-fg/10 text-th-fg px-6 py-3 rounded-xl font-bold hover:bg-th-fg/20 transition-colors"
            >
              <Car className="w-4 h-4" />
              Yeni Analiz Yap
            </Link>
          </div>
        </div>
      </AnimatedSection>
    </div>
  )
}
