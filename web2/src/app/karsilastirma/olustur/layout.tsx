import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Karşılaştırma Oluştur | Tamirhanem',
  description:
    'İki veya daha fazla aracı seçerek detaylı karşılaştırma oluşturun.',
  keywords: ['karşılaştırma oluştur', 'araç seç', 'model seç'],
  openGraph: {
    title: 'Karşılaştırma Oluştur | Tamirhanem',
    description:
      'İki veya daha fazla aracı seçerek detaylı karşılaştırma oluşturun.',
    type: 'website',
    locale: 'tr_TR',
    siteName: 'Tamirhanem',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
