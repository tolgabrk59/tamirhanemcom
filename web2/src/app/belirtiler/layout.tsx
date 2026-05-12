import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Araç Arıza Belirtileri | Tamirhanem',
  description:
    'Aracınızdaki belirtilerden olası arızaları tespit edin. Ses, titreşim, koku ve diğer belirtilere göre arıza rehberi.',
  keywords: [
    'arıza belirtileri',
    'araç arıza',
    'motor sesi',
    'titreşim',
    'araç kokusu',
  ],
  openGraph: {
    title: 'Araç Arıza Belirtileri | Tamirhanem',
    description:
      'Aracınızdaki belirtilerden olası arızaları tespit edin. Ses, titreşim, koku ve diğer belirtilere göre arıza rehberi.',
    type: 'website',
    locale: 'tr_TR',
    siteName: 'Tamirhanem',
  },
}

export default function BelirtilerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
