import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Arıza Rehberi | Tamirhanem',
  description:
    'Araç arızaları için kapsamlı rehber. Yaygın arıza belirtileri, uyarı lambaları ve çözüm önerileri.',
  keywords: ['arıza rehberi', 'araç arıza', 'uyarı lambası', 'arıza çözümü', 'araç sorun giderme'],
  openGraph: {
    title: 'Arıza Rehberi | Tamirhanem',
    description:
      'Araç arızaları için kapsamlı rehber. Yaygın arıza belirtileri, uyarı lambaları ve çözüm önerileri.',
    type: 'website',
    locale: 'tr_TR',
    siteName: 'Tamirhanem',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
