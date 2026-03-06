import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans, Caveat } from 'next/font/google';
import './globals.css';
import dynamic from 'next/dynamic';
import Footer from '@/components/Footer';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';
import Script from 'next/script';

const GA_MEASUREMENT_ID = 'G-CG4LCJMQBY';

const Sidebar = dynamic(() => import('@/components/Sidebar'), { ssr: false });
const FixedSearchBar = dynamic(() => import('@/components/FixedSearchBar'), { ssr: false });
const ChatWidget = dynamic(() => import('@/components/ChatWidget'), { ssr: false });
const ToastProvider = dynamic(() => import('@/components/ToastProvider'), { ssr: false });
const CookieConsentBanner = dynamic(() => import('@/components/consent/CookieConsentBanner'), { ssr: false });

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-jakarta',
  display: 'swap'
});

const caveat = Caveat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-handwriting',
  display: 'swap'
});

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#2563eb',
};

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
    google: process.env.GOOGLE_SITE_VERIFICATION || '',
  },
  alternates: {
    canonical: 'https://tamirhanem.com',
  },
};

// JSON-LD Structured Data
const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'TamirHanem',
  url: 'https://tamirhanem.com',
  logo: 'https://tamirhanem.com/logo.png',
  description: 'Aracınız için güvenilir hizmeti birkaç adımda bulun. Şeffaf fiyatlandırma ve kalite güvenceli hizmet.',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'TR',
  },
  sameAs: [
    'https://facebook.com/tamirhanem',
    'https://twitter.com/tamirhanem',
    'https://instagram.com/tamirhanem',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    availableLanguage: 'Turkish',
  },
};

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'TamirHanem',
  url: 'https://tamirhanem.com',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://tamirhanem.com/servisler/sonuclar?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
};

const localBusinessJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': 'https://tamirhanem.com',
  name: 'TamirHanem',
  description: 'Araç bakım ve onarım hizmeti bulma platformu',
  url: 'https://tamirhanem.com',
  priceRange: '$$',
  areaServed: {
    '@type': 'Country',
    name: 'Turkey',
  },
  serviceType: [
    'Araç Bakımı',
    'Oto Tamir',
    'Motor Arıza Tespiti',
    'Fren Bakımı',
    'Yağ Değişimi',
  ],
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

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />

        {/* Google Analytics 4 */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
      </head>
      <body className={`${inter.className} ${plusJakarta.variable} ${caveat.variable}`} suppressHydrationWarning>
        {/* Skip Navigation Link - Erişilebilirlik için */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:bg-primary-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg focus:font-semibold focus:outline-none"
        >
          Ana içeriğe atla
        </a>

        <Sidebar />
        <FixedSearchBar />

        {/* Main content wrapper - left sidebar (search) + bottom bar (nav) on desktop */}
        <div className="lg:pl-16 lg:pb-14 pt-14 lg:pt-0 min-h-screen flex flex-col relative">
          <main id="main-content" className="flex-1" role="main">
            {children}
          </main>
          <Footer />
        </div>
        <ChatWidget />
        <ToastProvider />
        <CookieConsentBanner />
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
