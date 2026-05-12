import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Araç Arıza Lambaları Rehberi | Tamirhanem',
  description:
    'Gösterge panelindeki arıza lambalarının anlamları. Motor, ABS, airbag ve diğer uyarı ışıklarının açıklaması.',
  keywords: ['arıza lambası', 'uyarı ışığı', 'gösterge paneli', 'motor arıza lambası'],
  openGraph: {
    title: 'Araç Arıza Lambaları Rehberi | Tamirhanem',
    description:
      'Gösterge panelindeki arıza lambalarının anlamları. Motor, ABS, airbag ve diğer uyarı ışıklarının açıklaması.',
    type: 'website',
    locale: 'tr_TR',
    siteName: 'Tamirhanem',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
