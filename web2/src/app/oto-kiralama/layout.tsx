import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Oto Kiralama | Tamirhanem',
  description:
    'Araç kiralama hizmetleri ve fiyat karşılaştırması. Günlük, haftalık ve aylık kiralama seçenekleri.',
  keywords: [
    'oto kiralama',
    'araç kiralama',
    'rent a car',
    'araba kiralama',
  ],
  openGraph: {
    title: 'Oto Kiralama | Tamirhanem',
    description:
      'Araç kiralama hizmetleri ve fiyat karşılaştırması. Günlük, haftalık ve aylık kiralama seçenekleri.',
    type: 'website',
    locale: 'tr_TR',
    siteName: 'Tamirhanem',
    url: 'https://tamirhanem.net/oto-kiralama',
  },
}

export default function OtoKiralamaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
