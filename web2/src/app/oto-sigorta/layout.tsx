import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Oto Sigorta Rehberi | Tamirhanem',
  description:
    'Kasko, trafik sigortası ve araç sigorta türleri hakkında kapsamlı rehber. Sigorta karşılaştırma ve bilgilendirme.',
  keywords: [
    'oto sigorta',
    'kasko',
    'trafik sigortası',
    'araç sigorta',
  ],
  openGraph: {
    title: 'Oto Sigorta Rehberi | Tamirhanem',
    description:
      'Kasko, trafik sigortası ve araç sigorta türleri hakkında kapsamlı rehber. Sigorta karşılaştırma ve bilgilendirme.',
    type: 'website',
    locale: 'tr_TR',
    siteName: 'Tamirhanem',
    url: 'https://tamirhanem.net/oto-sigorta',
  },
}

export default function OtoSigortaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
