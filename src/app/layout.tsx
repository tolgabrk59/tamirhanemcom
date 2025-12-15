import type { Metadata } from 'next';
import { Inter, Dancing_Script } from 'next/font/google';
import './globals.css';
import dynamic from 'next/dynamic';
import Footer from '@/components/Footer';

const Header = dynamic(() => import('@/components/Header'), { ssr: false });
const ChatWidget = dynamic(() => import('@/components/ChatWidget'), { ssr: false });

const inter = Inter({ subsets: ['latin'] });

const dancingScript = Dancing_Script({ 
  subsets: ['latin'],
  variable: '--font-handwriting'
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL || 'https://tamirhanem.com'),
  title: {
    default: 'TamirHanem - Araç Bakım ve Onarım Platformu',
    template: '%s | TamirHanem',
  },
  description:
    'Aracınız için güvenilir hizmeti birkaç adımda bulun. Şeffaf fiyatlandırma, izlenebilir geçmiş ve kalite güvenceli hizmet.',
  keywords: [
    'araç bakım',
    'oto tamir',
    'araç servis',
    'motor arıza',
    'OBD kodu',
    'fren bakımı',
    'yağ değişimi',
    'araç muayene',
    'oto servis fiyat',
    'tamir maliyeti',
  ],
  authors: [{ name: 'TamirHanem' }],
  creator: 'TamirHanem',
  publisher: 'TamirHanem',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: 'https://tamirhanem.com',
    siteName: 'TamirHanem',
    title: 'TamirHanem - Araç Bakım ve Onarım Platformu',
    description:
      'Aracınız için güvenilir hizmeti birkaç adımda bulun. Şeffaf fiyatlandırma ve kalite güvenceli hizmet.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'TamirHanem',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TamirHanem - Araç Bakım ve Onarım Platformu',
    description:
      'Aracınız için güvenilir hizmeti birkaç adımda bulun. Şeffaf fiyatlandırma ve kalite güvenceli hizmet.',
    images: ['/og-image.jpg'],
  },
  verification: {
    google: 'google-site-verification-code',
  },
  alternates: {
    canonical: 'https://tamirhanem.com',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2563eb" />
      </head>
      <body className={`${inter.className} ${dancingScript.variable}`} suppressHydrationWarning>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <ChatWidget />
      </body>
    </html>
  );
}
