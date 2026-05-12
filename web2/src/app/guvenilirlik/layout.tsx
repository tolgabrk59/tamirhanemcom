import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Marka Güvenilirlik Karşılaştırması | Tamirhanem',
  description:
    'Araç markalarının güvenilirlik puanları ve karşılaştırması. Hangi marka daha güvenilir? Detaylı analiz ve skorlar.',
  keywords: [
    'güvenilirlik',
    'araç güvenilirlik',
    'marka karşılaştırma',
    'en güvenilir araba',
  ],
  openGraph: {
    title: 'Marka Güvenilirlik Karşılaştırması | Tamirhanem',
    description:
      'Araç markalarının güvenilirlik puanları ve karşılaştırması. Hangi marka daha güvenilir? Detaylı analiz ve skorlar.',
    type: 'website',
    locale: 'tr_TR',
    siteName: 'Tamirhanem',
  },
}

export default function GuvenilirlikLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
