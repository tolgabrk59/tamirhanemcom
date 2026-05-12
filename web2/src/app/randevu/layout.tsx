import type { Metadata } from 'next'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Servis Randevusu Al | Tamirhanem',
  description:
    'Oto servis, yıkama, sigorta ve kiralama için online randevu alın. Aracınıza uygun servisi seçin ve hızlıca randevu oluşturun.',
  keywords: ['servis randevusu', 'oto servis randevu', 'online randevu', 'araç bakım randevusu'],
  openGraph: {
    title: 'Servis Randevusu Al | Tamirhanem',
    description:
      'Oto servis, yıkama, sigorta ve kiralama için online randevu alın. Aracınıza uygun servisi seçin ve hızlıca randevu oluşturun.',
    type: 'website',
    locale: 'tr_TR',
    siteName: 'Tamirhanem',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <Suspense>{children}</Suspense>
}
