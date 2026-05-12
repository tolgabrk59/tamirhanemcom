import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Araç İncelemeleri | Tamirhanem',
  description:
    'Detaylı araç incelemeleri ve kullanıcı yorumları. Marka ve modele göre araç değerlendirmeleri.',
  keywords: ['araç inceleme', 'araba inceleme', 'kullanıcı yorumu', 'araç değerlendirme'],
  openGraph: {
    title: 'Araç İncelemeleri | Tamirhanem',
    description:
      'Detaylı araç incelemeleri ve kullanıcı yorumları. Marka ve modele göre araç değerlendirmeleri.',
    type: 'website',
    locale: 'tr_TR',
    siteName: 'Tamirhanem',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
