import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Hata Bildir | Tamirhanem',
  description:
    'Tamirhanem platformunda karşılaştığınız hata veya sorunları bize bildirin. Geri bildiriminiz bizim için değerli.',
  keywords: ['hata bildir', 'geri bildirim', 'sorun bildir'],
  openGraph: {
    title: 'Hata Bildir | Tamirhanem',
    description:
      'Tamirhanem platformunda karşılaştığınız hata veya sorunları bize bildirin. Geri bildiriminiz bizim için değerli.',
    type: 'website',
    locale: 'tr_TR',
    siteName: 'Tamirhanem',
  },
}

export default function HataBildirLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
