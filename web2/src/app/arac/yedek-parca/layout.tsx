import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Yedek Parça Kataloğu | Tamirhanem',
  description:
    'Aracınıza uygun yedek parçaları bulun. Motor, fren, süspansiyon, elektrik ve daha fazlası için parça arama ve fiyat karşılaştırma.',
  keywords: ['yedek parça', 'oto yedek parça', 'araç parçası', 'parça kataloğu', 'parça fiyat'],
  openGraph: {
    title: 'Yedek Parça Kataloğu | Tamirhanem',
    description:
      'Aracınıza uygun yedek parçaları bulun. Motor, fren, süspansiyon, elektrik ve daha fazlası için parça arama ve fiyat karşılaştırma.',
    type: 'website',
    locale: 'tr_TR',
    siteName: 'Tamirhanem',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
