import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Araç Bakım Tavsiyeleri | Tamirhanem',
  description:
    'Aracınıza özel bakım tavsiyeleri. Uzman önerileri ile aracınızın ömrünü uzatın.',
  keywords: ['bakım tavsiyesi', 'araç bakım önerisi', 'uzman tavsiye'],
  openGraph: {
    title: 'Araç Bakım Tavsiyeleri | Tamirhanem',
    description:
      'Aracınıza özel bakım tavsiyeleri. Uzman önerileri ile aracınızın ömrünü uzatın.',
    type: 'website',
    locale: 'tr_TR',
    siteName: 'Tamirhanem',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
