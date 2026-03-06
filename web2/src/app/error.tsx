'use client'

import { useEffect } from 'react'
import { AlertTriangle, RotateCcw } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Root error boundary caught:', error)
  }, [error])

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="glass-card mx-auto max-w-md p-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10">
          <AlertTriangle className="h-7 w-7 text-red-400" />
        </div>
        <h2 className="mb-2 font-display text-xl font-bold text-th-fg">
          Bir sorun olustu
        </h2>
        <p className="mb-6 text-sm text-th-fg-sub">
          Sayfa yuklenirken beklenmeyen bir hata meydana geldi. Lutfen tekrar
          deneyin.
        </p>
        <button
          onClick={reset}
          className="btn-gold inline-flex items-center gap-2 px-6 py-3 text-sm"
        >
          <RotateCcw className="h-4 w-4" />
          Tekrar Dene
        </button>
      </div>
    </div>
  )
}
