import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sıkça Sorulan Sorular | Tamirhanem',
  description:
    'Araç bakım ve onarım hakkında en çok sorulan sorular ve uzman yanıtları.',
  keywords: [
    'sss',
    'sıkça sorulan sorular',
    'araç bakım soruları',
  ],
  openGraph: {
    title: 'Sıkça Sorulan Sorular | Tamirhanem',
    description:
      'Araç bakım ve onarım hakkında en çok sorulan sorular ve uzman yanıtları.',
    type: 'website',
    locale: 'tr_TR',
    siteName: 'Tamirhanem',
    url: 'https://tamirhanem.net/sss',
  },
}

export default function SSSLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
