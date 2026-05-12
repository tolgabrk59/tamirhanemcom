import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '2. El Oto Yedek Parça | Tamirhanem',
  description:
    'Uygun fiyatlı 2. el oto yedek parça bulun. Güvenilir satıcılar ve kaliteli parçalar ile aracınızı ekonomik onarın.',
  keywords: [
    '2 el yedek parça',
    'oto parça',
    'ikinci el parça',
    'yedek parça',
  ],
  openGraph: {
    title: '2. El Oto Yedek Parça | Tamirhanem',
    description:
      'Uygun fiyatlı 2. el oto yedek parça bulun. Güvenilir satıcılar ve kaliteli parçalar ile aracınızı ekonomik onarın.',
    type: 'website',
    locale: 'tr_TR',
    siteName: 'Tamirhanem',
  },
}

export default function IkinciElParcaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
