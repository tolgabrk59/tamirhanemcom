import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Elektrikli Araç Şarj İstasyonları | Tamirhanem',
  description:
    'Türkiye genelinde elektrikli araç şarj istasyonlarını harita üzerinde bulun. En yakın şarj noktasını keşfedin.',
  keywords: [
    'şarj istasyonu',
    'elektrikli araç şarj',
    'ev şarj istasyonu',
    'şarj noktası',
  ],
  openGraph: {
    title: 'Elektrikli Araç Şarj İstasyonları | Tamirhanem',
    description:
      'Türkiye genelinde elektrikli araç şarj istasyonlarını harita üzerinde bulun. En yakın şarj noktasını keşfedin.',
    type: 'website',
    locale: 'tr_TR',
    siteName: 'Tamirhanem',
    url: 'https://tamirhanem.net/sarj-istasyonlari',
  },
}

export default function ŞarjIstasyonlariLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
