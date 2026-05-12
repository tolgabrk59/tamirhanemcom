import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Plaka ile Araç Kayıt | Tamirhanem',
  description:
    'Plakanızı girerek aracınızı hızlıca kaydedin ve tüm Tamirhanem hizmetlerinden yararlanın.',
  keywords: ['plaka kayıt', 'araç kayıt', 'plaka sorgulama'],
  openGraph: {
    title: 'Plaka ile Araç Kayıt | Tamirhanem',
    description:
      'Plakanızı girerek aracınızı hızlıca kaydedin ve tüm Tamirhanem hizmetlerinden yararlanın.',
    type: 'website',
    locale: 'tr_TR',
    siteName: 'Tamirhanem',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
