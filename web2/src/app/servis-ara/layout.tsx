import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Servis Ara | Tamirhanem',
  description:
    'Bulunduğunuz konuma en yakın oto servisleri bulun. Puan, yorum ve fiyat karşılaştırması ile en uygun servisi seçin.',
  keywords: ['servis ara', 'oto servis bul', 'yakın servis', 'oto tamir', 'servis karşılaştırma'],
  openGraph: {
    title: 'Servis Ara | Tamirhanem',
    description:
      'Bulunduğunuz konuma en yakın oto servisleri bulun. Puan, yorum ve fiyat karşılaştırması ile en uygun servisi seçin.',
    type: 'website',
    locale: 'tr_TR',
    siteName: 'Tamirhanem',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
