import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Araç Bakım Videoları | Tamirhanem',
  description:
    'Araç bakım ve onarım eğitim videoları. Kendin yap rehberleri ve uzman anlatımları.',
  keywords: ['araç bakım video', 'tamir videosu', 'kendin yap', 'bakım rehberi'],
  openGraph: {
    title: 'Araç Bakım Videoları | Tamirhanem',
    description:
      'Araç bakım ve onarım eğitim videoları. Kendin yap rehberleri ve uzman anlatımları.',
    type: 'website',
    locale: 'tr_TR',
    siteName: 'Tamirhanem',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
