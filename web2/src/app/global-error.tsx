'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Global error boundary caught:', error)
  }, [error])

  return (
    <html lang="tr">
      <body className="flex min-h-screen items-center justify-center bg-[#0a0a12] font-sans text-[#f8fafc]">
        <div className="mx-auto max-w-md rounded-2xl border border-white/10 bg-[#14172a] p-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#f87171"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
              <path d="M12 9v4" />
              <path d="M12 17h.01" />
            </svg>
          </div>
          <h2 className="mb-2 text-xl font-bold">Kritik Hata</h2>
          <p className="mb-6 text-sm text-[#94a3b8]">
            Uygulama beklenmeyen bir hatayla karsilasti. Lutfen sayfayi yeniden
            yuklemeyi deneyin.
          </p>
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-xl bg-[#FBC91D] px-6 py-3 text-sm font-semibold text-[#0a0a12] transition-transform hover:-translate-y-0.5"
          >
            Tekrar Dene
          </button>
        </div>
      </body>
    </html>
  )
}
