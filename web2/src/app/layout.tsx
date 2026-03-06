import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import dynamic from 'next/dynamic'
import Footer from '@/components/layout/Footer'

const Sidebar = dynamic(() => import('@/components/layout/Sidebar'), { ssr: false })
const Header = dynamic(() => import('@/components/layout/Header'), { ssr: false })
const CarBrandLogos = dynamic(() => import('@/components/home/CarBrandLogos'), { ssr: false })
const IntroModal = dynamic(() => import('@/components/shared/IntroModal'), { ssr: false })
import ThemeProvider from '@/components/providers/ThemeProvider'

// Türkçe karakter desteği için genişletilmiş subset
const inter = Inter({
  subsets: ['latin', 'latin-ext', 'cyrillic-ext', 'greek-ext', 'vietnamese'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
  fallback: ['Segoe UI', 'Roboto', 'Arial', 'sans-serif'],
})

export const metadata: Metadata = {
  title: {
    default: 'TamirHanem | Aracının Bakımı Senin Elinde',
    template: '%s | TamirHanem',
  },
  description:
    'Aracının bakım ve onarım ihtiyaçları için en yakın ve en güvenilir servisleri bul. Randevu al, araç bilgilerine eriş, OBD kodlarını incele.',
  keywords: [
    'oto servis',
    'araç bakım',
    'tamirci',
    'oto tamir',
    'randevu',
    'OBD kodu',
    'araç onarım',
  ],
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: 'https://tamirhanem.com',
    siteName: 'TamirHanem',
    title: 'TamirHanem | Aracının Bakımı Senin Elinde',
    description: 'En yakın ve en güvenilir oto servisleri bul.',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0a0a12',
}

const themeInitScript = `
  try {
    var t = localStorage.getItem('tamirhanem-theme');
    if (t === 'light') {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  } catch(e) {}
`

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="tr"
      className={`dark ${inter.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-screen bg-th-bg font-body text-th-fg antialiased">
        <ThemeProvider>
          <div className="noise-overlay" aria-hidden="true" />
          <IntroModal />
          <CarBrandLogos />
          <Sidebar />
          <Header />
          <div className="lg:pl-16 lg:pb-14 pt-14 lg:pt-0 min-h-screen flex flex-col">
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
