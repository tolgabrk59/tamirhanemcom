import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Workshop Kılavuzları | Tamirhanem',
  description:
    'Araç bakım ve onarım workshop kılavuzları. Adım adım teknik rehberler ve uygulama talimatları.',
  keywords: ['workshop kılavuzu', 'tamir rehberi', 'bakım kılavuzu', 'teknik rehber'],
  openGraph: {
    title: 'Workshop Kılavuzları | Tamirhanem',
    description:
      'Araç bakım ve onarım workshop kılavuzları. Adım adım teknik rehberler ve uygulama talimatları.',
    type: 'website',
    locale: 'tr_TR',
    siteName: 'Tamirhanem',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
