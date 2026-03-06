import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Karşılaştırma Sonuçları | Tamirhanem',
  description:
    'Seçtiğiniz araçların detaylı karşılaştırma sonuçları. Teknik özellikler, bakım maliyetleri ve puanlama.',
  keywords: ['karşılaştırma sonuç', 'araç karşılaştırma detay'],
  openGraph: {
    title: 'Karşılaştırma Sonuçları | Tamirhanem',
    description:
      'Seçtiğiniz araçların detaylı karşılaştırma sonuçları. Teknik özellikler, bakım maliyetleri ve puanlama.',
    type: 'website',
    locale: 'tr_TR',
    siteName: 'Tamirhanem',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
