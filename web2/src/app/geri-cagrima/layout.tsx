import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Araç Geri Çağırma Kampanyaları | Tamirhanem',
  description:
    'Güncel araç geri çağırma kampanyalarını takip edin. Marka ve modele göre geri çağırma bilgileri ve güvenlik uyarıları.',
  keywords: [
    'geri çağırma',
    'araç geri çağırma',
    'recall',
    'güvenlik kampanyası',
  ],
  openGraph: {
    title: 'Araç Geri Çağırma Kampanyaları | Tamirhanem',
    description:
      'Güncel araç geri çağırma kampanyalarını takip edin. Marka ve modele göre geri çağırma bilgileri ve güvenlik uyarıları.',
    type: 'website',
    locale: 'tr_TR',
    siteName: 'Tamirhanem',
  },
}

export default function GeriCagrimaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
