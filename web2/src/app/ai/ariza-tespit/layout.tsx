import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Yapay Zeka ile Arıza Tespit | Tamirhanem',
  description:
    'Yapay zeka destekli araç arıza tespit sistemi. Belirtileri girin, olası arızaları ve çözümleri öğrenin.',
  keywords: [
    'arıza tespit',
    'yapay zeka arıza',
    'araç arıza analiz',
    'akıllı arıza tespit',
  ],
  openGraph: {
    title: 'Yapay Zeka ile Arıza Tespit | Tamirhanem',
    description:
      'Yapay zeka destekli araç arıza tespit sistemi. Belirtileri girin, olası arızaları ve çözümleri öğrenin.',
    type: 'website',
    locale: 'tr_TR',
    siteName: 'Tamirhanem',
    url: 'https://tamirhanem.net/ai/ariza-tespit',
  },
}

export default function ArizaTespitLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
