import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Araç Karşılaştırma | Tamirhanem',
  description:
    'Araçları yan yana karşılaştırın. Teknik özellikler, bakım maliyetleri ve güvenilirlik puanları ile detaylı karşılaştırma.',
  keywords: ['araç karşılaştırma', 'araba karşılaştır', 'model karşılaştırma'],
  openGraph: {
    title: 'Araç Karşılaştırma | Tamirhanem',
    description:
      'Araçları yan yana karşılaştırın. Teknik özellikler, bakım maliyetleri ve güvenilirlik puanları ile detaylı karşılaştırma.',
    type: 'website',
    locale: 'tr_TR',
    siteName: 'Tamirhanem',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
