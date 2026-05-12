import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Araç Kronik Sorunları | Tamirhanem',
  description:
    'Marka ve modele göre bilinen kronik araç sorunları. Sık karşılaşılan arızalar ve çözüm önerileri.',
  keywords: [
    'kronik sorun',
    'bilinen arızalar',
    'araç sorunları',
    'sık arıza',
  ],
  openGraph: {
    title: 'Araç Kronik Sorunları | Tamirhanem',
    description:
      'Marka ve modele göre bilinen kronik araç sorunları. Sık karşılaşılan arızalar ve çözüm önerileri.',
    type: 'website',
    locale: 'tr_TR',
    siteName: 'Tamirhanem',
    url: 'https://tamirhanem.net/kronik-sorunlar',
  },
}

export default function KronikSorunlarLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
