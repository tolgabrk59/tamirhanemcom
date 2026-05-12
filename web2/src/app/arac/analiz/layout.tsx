import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Araç Analiz Raporu | Tamirhanem',
  description:
    'Aracınız için yapay zeka destekli detaylı analiz raporu. Bakım geçmişi, kronik sorunlar ve maliyet tahmini.',
  keywords: ['araç analiz', 'araç rapor', 'araç değerlendirme', 'detaylı analiz'],
  openGraph: {
    title: 'Araç Analiz Raporu | Tamirhanem',
    description:
      'Aracınız için yapay zeka destekli detaylı analiz raporu. Bakım geçmişi, kronik sorunlar ve maliyet tahmini.',
    type: 'website',
    locale: 'tr_TR',
    siteName: 'Tamirhanem',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
