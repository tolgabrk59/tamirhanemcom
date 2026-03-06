import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Park Mesaj Kartı | Tamirhanem',
  description:
    'Dijital park mesaj kartı oluşturun. Aracınıza ulaşmak isteyenler için QR kodlu iletişim kartı.',
  keywords: ['park mesaj', 'park kartı', 'araç iletişim', 'QR kod'],
  openGraph: {
    title: 'Park Mesaj Kartı | Tamirhanem',
    description:
      'Dijital park mesaj kartı oluşturun. Aracınıza ulaşmak isteyenler için QR kodlu iletişim kartı.',
    type: 'website',
    locale: 'tr_TR',
    siteName: 'Tamirhanem',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
