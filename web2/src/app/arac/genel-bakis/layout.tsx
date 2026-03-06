import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Araç Genel Bakış | Tamirhanem',
  description:
    'Aracınızın genel durumu, bakım ihtiyaçları ve önemli bilgiler tek bir sayfada.',
  keywords: ['araç genel bakış', 'araç durumu', 'araç bilgileri'],
  openGraph: {
    title: 'Araç Genel Bakış | Tamirhanem',
    description:
      'Aracınızın genel durumu, bakım ihtiyaçları ve önemli bilgiler tek bir sayfada.',
    type: 'website',
    locale: 'tr_TR',
    siteName: 'Tamirhanem',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
