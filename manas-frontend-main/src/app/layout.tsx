import type { Metadata } from 'next';
import { EB_Garamond, Lato } from 'next/font/google';
import { ClientAuthProvider } from '@/context/ClientAuthProvider';
import ClientToaster from '@/components/ClientToaster';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import './globals.css';

const ebGaramond = EB_Garamond({
  subsets: ['latin'],
  variable: '--font-eb-garamond',
  display: 'swap',
});

const lato = Lato({
  weight: ['300', '400', '700'],
  subsets: ['latin'],
  variable: '--font-lato',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'MANAS Foundation | Empowering Women, Transforming Lives',
  description:
    'MANAS Foundation is dedicated to empowering widows and divorced women through compassionate support, meaningful connections, and pathways to remarriage. Join our mission to break social barriers and create new beginnings.',
  keywords:
    'NGO, women empowerment, widow support, remarriage, India, social welfare, community support',
  authors: [{ name: 'MANAS Foundation' }],
  openGraph: {
    title: 'MANAS Foundation | Empowering Women, Transforming Lives',
    description:
      'MANAS Foundation is dedicated to empowering widows and divorced women through compassionate support, meaningful connections, and pathways to remarriage.',
    type: 'website',
    locale: 'en_IN',
    siteName: 'MANAS Foundation',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MANAS Foundation | Empowering Women, Transforming Lives',
    description:
      'MANAS Foundation is dedicated to empowering widows and divorced women through compassionate support, meaningful connections, and pathways to remarriage.',
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [{ url: '/images/logo.png', type: 'image/png' }],
    apple: [{ url: '/images/logo.png', type: 'image/png' }],
  },
};

type Props = { children: React.ReactNode };

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en" className={`${ebGaramond.variable} ${lato.variable}`}>
      <head>
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body
        className={`${lato.className} m-0 overflow-x-hidden bg-background p-0 antialiased text-text transition-colors duration-200`}
        suppressHydrationWarning
      >
        <ClientAuthProvider>
          <Navbar />
          <main className="relative z-0 min-h-screen">{children}</main>
          <Footer />
          <ClientToaster />
        </ClientAuthProvider>
      </body>
    </html>
  );
}
