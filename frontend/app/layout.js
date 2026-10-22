import Script from 'next/script';
import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import OneSignalInit from '../components/OneSignalInit';
import SiteEntitySchema from '../components/SiteEntitySchema';

export const metadata = {
  metadataBase: new URL('https://sarkarijobalerts.com'),
  title: {
    default: 'Sarkari Result 2026 – Sarkari Naukri & Latest Govt Jobs',
    template: '%s | SarkariJobAlerts',
  },
  description: 'Sarkari Job Alerts 2026: Real-time notifications for latest govt jobs, sarkari results, admit cards, and recruitment notices for SSC, Railway, UPSC & Banking.',
  keywords: ['sarkari result', 'sarkari naukri', 'latest govt jobs 2026', 'apply online govt jobs', 'sarkari job alerts', 'admit card download', 'SSC recruitment 2026', 'railway jobs', 'UPSC notification'],
  authors: [{ name: 'Rohit Sharma, SarkariJobAlerts Editorial Team', url: 'https://sarkarijobalerts.com/about/' }],
  creator: 'SarkariJobAlerts Editorial Team',
  publisher: 'SarkariJobAlerts',
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
    title: 'Sarkari Result 2026 – Sarkari Naukri & Latest Govt Jobs',
    description: 'Sarkari Job Alerts 2026: Real-time notifications for latest govt jobs, sarkari results, admit cards, and recruitment notices for SSC, Railway, UPSC & Banking.',
    url: 'https://sarkarijobalerts.com/',
    siteName: 'SarkariJobAlerts',
    images: [
      {
        url: 'https://sarkarijobalerts.com/og-banner.png',
        width: 1200,
        height: 630,
        alt: 'Sarkari Result & Sarkari Naukri 2026 – SarkariJobAlerts.com',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@SarkariJobAlert',
    creator: '@SarkariJobAlert',
    title: 'Sarkari Result & Sarkari Naukri 2026 – Latest Govt Jobs, Apply Online Govt Jobs',
    description: 'Sarkari Job Alerts 2026: Get real-time sarkari naukri notifications, sarkari result updates, and admit card links.',
    images: ['https://sarkarijobalerts.com/og-banner.png'],
  },
  alternates: {
    canonical: 'https://sarkarijobalerts.com/',
    types: {
      'application/rss+xml': 'https://sarkarijobalerts.com/rss.xml',
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico?v=2' },
      { url: '/icon.png?v=2', type: 'image/png' },
    ],
    shortcut: ['/favicon.ico?v=2'],
    apple: [
      { url: '/apple-touch-icon.png?v=2' },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="shortcut icon" href="/favicon.ico?v=2" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icon.png?v=2" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png?v=2" />
        <link rel="alternate" type="text/markdown" href="/llms.txt" title="LLMs.txt" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="author" content="Rohit Sharma, SarkariJobAlerts Editorial Team" />
        <Script
          src="https://analytics.ahrefs.com/analytics.js"
          data-key="C9BXfs/kiNaI3aLJ69SADg"
          strategy="beforeInteractive"
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-LZX9S60MR4"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-LZX9S60MR4');
          `}
        </Script>
      </head>
      <body className="flex flex-col min-h-screen bg-slate-950 text-slate-100">
        <SiteEntitySchema />
        <OneSignalInit />
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

