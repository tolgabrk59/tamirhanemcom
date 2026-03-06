import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Araç Değer Hesaplama | Tamirhanem',
  description:
    'Aracınızın güncel piyasa değerini öğrenin. Marka, model, yıl ve kilometreye göre araç değer hesaplama.',
  keywords: ['araç değeri', 'araba değeri', 'ikinci el fiyat', 'araç değer hesaplama'],
  openGraph: {
    title: 'Araç Değer Hesaplama | Tamirhanem',
    description:
      'Aracınızın güncel piyasa değerini öğrenin. Marka, model, yıl ve kilometreye göre araç değer hesaplama.',
    type: 'website',
    locale: 'tr_TR',
    siteName: 'Tamirhanem',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
