import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Arıza Bul - Belirtiye Göre Arıza Tespit | Tamirhanem',
  description:
    'Aracınızdaki belirtilere göre olası arızaları tespit edin. Motor titremesi, güç kaybı, ses ve koku gibi belirtilerden arıza analizi.',
  keywords: ['arıza bul', 'arıza tespit', 'araç belirtileri', 'motor arıza', 'araç sorun tespit'],
  openGraph: {
    title: 'Arıza Bul - Belirtiye Göre Arıza Tespit | Tamirhanem',
    description:
      'Aracınızdaki belirtilere göre olası arızaları tespit edin. Motor titremesi, güç kaybı, ses ve koku gibi belirtilerden arıza analizi.',
    type: 'website',
    locale: 'tr_TR',
    siteName: 'Tamirhanem',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
