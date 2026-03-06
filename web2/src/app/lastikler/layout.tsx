import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Lastik Seçim Rehberi | Tamirhanem',
  description:
    'Aracınıza uygun lastik seçimi yapın. Lastik boyutları, mevsimsel lastik rehberi ve lastik karşılaştırma.',
  keywords: [
    'lastik',
    'lastik seçimi',
    'kış lastiği',
    'yaz lastiği',
    'lastik ebatı',
  ],
  openGraph: {
    title: 'Lastik Seçim Rehberi | Tamirhanem',
    description:
      'Aracınıza uygun lastik seçimi yapın. Lastik boyutları, mevsimsel lastik rehberi ve lastik karşılaştırma.',
    type: 'website',
    locale: 'tr_TR',
    siteName: 'Tamirhanem',
  },
}

export default function LastiklerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
