import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'İletişim | Tamirhanem',
  description:
    'Tamirhanem ile iletişime geçin. Sorularınız, önerileriniz ve iş birliği talepleriniz için bize ulaşın.',
  keywords: ['iletişim', 'bize ulaşın', 'destek', 'iş birliği'],
  openGraph: {
    title: 'İletişim | Tamirhanem',
    description:
      'Tamirhanem ile iletişime geçin. Sorularınız, önerileriniz ve iş birliği talepleriniz için bize ulaşın.',
    type: 'website',
    locale: 'tr_TR',
    siteName: 'Tamirhanem',
  },
}

export default function IletisimLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
