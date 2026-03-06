import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Araç Bilgileri | Tamirhanem',
  description:
    'Aracınız hakkında detaylı bilgiler. Kronik sorunlar, bakım önerileri, teknik özellikler ve daha fazlası.',
  keywords: ['araç bilgileri', 'araç detay', 'kronik sorunlar', 'bakım önerisi', 'teknik özellikler'],
  openGraph: {
    title: 'Araç Bilgileri | Tamirhanem',
    description:
      'Aracınız hakkında detaylı bilgiler. Kronik sorunlar, bakım önerileri, teknik özellikler ve daha fazlası.',
    type: 'website',
    locale: 'tr_TR',
    siteName: 'Tamirhanem',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
