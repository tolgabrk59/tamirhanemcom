import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'API Dökümantasyonu | Tamirhanem',
  description:
    'Tamirhanem API entegrasyon dökümantasyonu. Geliştirici rehberi ve API referansı.',
  keywords: ['api', 'geliştirici', 'entegrasyon', 'dökümantasyon'],
  openGraph: {
    title: 'API Dökümantasyonu | Tamirhanem',
    description:
      'Tamirhanem API entegrasyon dökümantasyonu. Geliştirici rehberi ve API referansı.',
    type: 'website',
    locale: 'tr_TR',
    siteName: 'Tamirhanem',
  },
}

export default function ApiDocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
