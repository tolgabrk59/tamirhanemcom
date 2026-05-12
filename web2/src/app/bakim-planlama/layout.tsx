import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Bakım Planlama | Tamirhanem',
  description:
    'Aracınız için kişiselleştirilmiş bakım planı oluşturun. Marka, model ve kilometreye göre bakım takvimi.',
  keywords: [
    'araç bakım planlama',
    'bakım takvimi',
    'araç bakım programı',
  ],
  openGraph: {
    title: 'Bakım Planlama | Tamirhanem',
    description:
      'Aracınız için kişiselleştirilmiş bakım planı oluşturun. Marka, model ve kilometreye göre bakım takvimi.',
    type: 'website',
    locale: 'tr_TR',
    siteName: 'Tamirhanem',
    url: 'https://tamirhanem.net/bakim-planlama',
  },
}

export default function BakimPlanlamaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
