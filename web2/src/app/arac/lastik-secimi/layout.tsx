import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Aracınıza Uygun Lastik Seçimi | Tamirhanem',
  description:
    'Aracınızın marka ve modeline uygun lastik seçeneklerini bulun. AI destekli lastik önerisi.',
  keywords: ['lastik seçimi', 'uygun lastik', 'lastik önerisi', 'araç lastiği'],
  openGraph: {
    title: 'Aracınıza Uygun Lastik Seçimi | Tamirhanem',
    description:
      'Aracınızın marka ve modeline uygun lastik seçeneklerini bulun. AI destekli lastik önerisi.',
    type: 'website',
    locale: 'tr_TR',
    siteName: 'Tamirhanem',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
