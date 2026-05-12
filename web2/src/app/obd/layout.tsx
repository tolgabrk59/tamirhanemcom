import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'OBD Arıza Kodu Sorgulama | Tamirhanem',
  description:
    'OBD-II arıza kodlarını sorgulayın. P0300, P0171 gibi motor arıza kodlarının anlamları, nedenleri ve çözümleri.',
  keywords: ['OBD kodu', 'arıza kodu', 'OBD-II', 'motor arıza kodu', 'arıza kodu sorgulama'],
  openGraph: {
    title: 'OBD Arıza Kodu Sorgulama | Tamirhanem',
    description:
      'OBD-II arıza kodlarını sorgulayın. P0300, P0171 gibi motor arıza kodlarının anlamları, nedenleri ve çözümleri.',
    type: 'website',
    locale: 'tr_TR',
    siteName: 'Tamirhanem',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
