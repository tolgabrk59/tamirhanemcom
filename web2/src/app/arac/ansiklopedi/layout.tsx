import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Otomotiv Ansiklopedisi | Tamirhanem',
  description:
    'Otomotiv terimleri ve kavramları ansiklopedisi. Motor, şanzıman, süspansiyon ve daha fazlası hakkında bilgi.',
  keywords: ['otomotiv ansiklopedi', 'araç terimleri', 'motor bilgisi', 'otomotiv sözlük'],
  openGraph: {
    title: 'Otomotiv Ansiklopedisi | Tamirhanem',
    description:
      'Otomotiv terimleri ve kavramları ansiklopedisi. Motor, şanzıman, süspansiyon ve daha fazlası hakkında bilgi.',
    type: 'website',
    locale: 'tr_TR',
    siteName: 'Tamirhanem',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
