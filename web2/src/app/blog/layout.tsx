import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog | Tamirhanem',
  description:
    'Araç bakım, onarım ve otomotiv dünyasından en güncel blog yazıları. Uzman tavsiyeleri ve pratik bilgiler.',
  keywords: [
    'araç bakım blog',
    'otomotiv blog',
    'araba tamir',
    'bakım tavsiyeleri',
  ],
  openGraph: {
    title: 'Blog | Tamirhanem',
    description:
      'Araç bakım, onarım ve otomotiv dünyasından en güncel blog yazıları. Uzman tavsiyeleri ve pratik bilgiler.',
    type: 'website',
    locale: 'tr_TR',
    siteName: 'Tamirhanem',
    url: 'https://tamirhanem.net/blog',
  },
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
