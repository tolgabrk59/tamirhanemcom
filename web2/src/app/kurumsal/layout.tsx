import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kurumsal | Tamirhanem',
  description:
    'Tamirhanem hakkında kurumsal bilgiler. Misyonumuz, vizyonumuz ve araç bakım sektöründeki hizmetlerimiz.',
  keywords: ['tamirhanem', 'kurumsal', 'hakkımızda', 'araç bakım platformu'],
  openGraph: {
    title: 'Kurumsal | Tamirhanem',
    description:
      'Tamirhanem hakkında kurumsal bilgiler. Misyonumuz, vizyonumuz ve araç bakım sektöründeki hizmetlerimiz.',
    type: 'website',
    locale: 'tr_TR',
    siteName: 'Tamirhanem',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
