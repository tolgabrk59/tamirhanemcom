import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Oto Yıkama Hizmetleri | Tamirhanem',
  description:
    'Profesyonel oto yıkama hizmetleri ve paketleri. İç-dış yıkama, detaylı temizlik ve araç bakım hizmetleri.',
  keywords: [
    'oto yıkama',
    'araç yıkama',
    'detaylı temizlik',
    'iç dış yıkama',
  ],
  openGraph: {
    title: 'Oto Yıkama Hizmetleri | Tamirhanem',
    description:
      'Profesyonel oto yıkama hizmetleri ve paketleri. İç-dış yıkama, detaylı temizlik ve araç bakım hizmetleri.',
    type: 'website',
    locale: 'tr_TR',
    siteName: 'Tamirhanem',
    url: 'https://tamirhanem.net/oto-yikama',
  },
}

export default function OtoYikamaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
