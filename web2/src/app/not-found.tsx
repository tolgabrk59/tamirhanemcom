import Link from 'next/link'
import { Search, Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="glass-card mx-auto max-w-md p-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-500/10">
          <Search className="h-7 w-7 text-brand-500" />
        </div>
        <h1 className="mb-1 font-display text-4xl font-extrabold text-gold">
          404
        </h1>
        <h2 className="mb-2 font-display text-xl font-bold text-th-fg">
          Sayfa Bulunamadı
        </h2>
        <p className="mb-6 text-sm text-th-fg-sub">
          Aradığınız sayfa mevcut değil veya taşındı. Ana sayfaya dönerek devam
          edebilirsiniz.
        </p>
        <Link
          href="/"
          className="btn-gold inline-flex items-center gap-2 px-6 py-3 text-sm"
        >
          <Home className="h-4 w-4" />
          Ana Sayfa
        </Link>
      </div>
    </div>
  )
}
