import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Yardım Merkezi | Tamirhanem',
  description:
    'Tamirhanem kullanım rehberi ve yardım merkezi. Sıkça sorulan sorular, kullanım kılavuzu ve destek.',
  keywords: ['yardım', 'destek', 'kullanım rehberi', 'nasıl yapılır'],
  openGraph: {
    title: 'Yardım Merkezi | Tamirhanem',
    description:
      'Tamirhanem kullanım rehberi ve yardım merkezi. Sıkça sorulan sorular, kullanım kılavuzu ve destek.',
    type: 'website',
    locale: 'tr_TR',
    siteName: 'Tamirhanem',
  },
}

export default function YardimLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
