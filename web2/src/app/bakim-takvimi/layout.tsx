import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Bakım Takvimi | Tamirhanem',
  description:
    'Araç tipine göre periyodik bakım takvimi. Yağ değişimi, fren bakımı, filtre değişimi ve daha fazlası için zamanlama rehberi.',
  keywords: [
    'bakım takvimi',
    'periyodik bakım',
    'araç bakım zamanı',
    'yağ değişimi zamanı',
  ],
  openGraph: {
    title: 'Bakım Takvimi | Tamirhanem',
    description:
      'Araç tipine göre periyodik bakım takvimi. Yağ değişimi, fren bakımı, filtre değişimi ve daha fazlası için zamanlama rehberi.',
    type: 'website',
    locale: 'tr_TR',
    siteName: 'Tamirhanem',
  },
}

export default function BakimTakvimiLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
