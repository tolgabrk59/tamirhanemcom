import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Oto Sanayi Rehberi | Tamirhanem',
  description:
    'Yakınındaki oto sanayi ve tamir servisleri. Güvenilir usta ve servis önerileri.',
  keywords: [
    'oto sanayi',
    'oto tamirci',
    'araç servisi',
    'oto tamir',
  ],
  openGraph: {
    title: 'Oto Sanayi Rehberi | Tamirhanem',
    description:
      'Yakınındaki oto sanayi ve tamir servisleri. Güvenilir usta ve servis önerileri.',
    type: 'website',
    locale: 'tr_TR',
    siteName: 'Tamirhanem',
    url: 'https://tamirhanem.net/oto-sanayi',
  },
}

export default function OtoSanayiLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
