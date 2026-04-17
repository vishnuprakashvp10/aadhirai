import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import { CartProvider } from '@/context/CartContext';

const cormorant = localFont({
  src: [
    { path: '../../node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-300-normal.woff2', weight: '300', style: 'normal' },
    { path: '../../node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-400-normal.woff2', weight: '400', style: 'normal' },
    { path: '../../node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-500-normal.woff2', weight: '500', style: 'normal' },
    { path: '../../node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-600-normal.woff2', weight: '600', style: 'normal' },
    { path: '../../node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-700-normal.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-cormorant',
  display: 'swap',
});

const jost = localFont({
  src: [
    { path: '../../node_modules/@fontsource/jost/files/jost-latin-300-normal.woff2', weight: '300', style: 'normal' },
    { path: '../../node_modules/@fontsource/jost/files/jost-latin-400-normal.woff2', weight: '400', style: 'normal' },
    { path: '../../node_modules/@fontsource/jost/files/jost-latin-500-normal.woff2', weight: '500', style: 'normal' },
    { path: '../../node_modules/@fontsource/jost/files/jost-latin-600-normal.woff2', weight: '600', style: 'normal' },
    { path: '../../node_modules/@fontsource/jost/files/jost-latin-700-normal.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-jost',
  display: 'swap',
});

const cinzel = localFont({
  src: [
    { path: '../../node_modules/@fontsource/cinzel/files/cinzel-latin-400-normal.woff2', weight: '400', style: 'normal' },
    { path: '../../node_modules/@fontsource/cinzel/files/cinzel-latin-600-normal.woff2', weight: '600', style: 'normal' },
    { path: '../../node_modules/@fontsource/cinzel/files/cinzel-latin-700-normal.woff2', weight: '700', style: 'normal' },
    { path: '../../node_modules/@fontsource/cinzel/files/cinzel-latin-800-normal.woff2', weight: '800', style: 'normal' },
    { path: '../../node_modules/@fontsource/cinzel/files/cinzel-latin-900-normal.woff2', weight: '900', style: 'normal' },
  ],
  variable: '--font-cinzel',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://aadhirai.com'),
  title: {
    default: 'Aadhirai — Curated Indian Divine Statues & Sculptures',
    template: '%s | Aadhirai',
  },
  description:
    'Discover exquisite handcrafted divine statues and sacred sculptures from master artisans across India. Ganesha, Shiva, Lakshmi, and more — curated for discerning collectors and devotees.',
  keywords: ['divine statues', 'Indian sculptures', 'brass statues', 'bronze statues', 'Ganesha', 'Shiva', 'Lakshmi', 'puja idols', 'handcrafted'],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://aadhirai.com',
    siteName: 'Aadhirai',
    title: 'Aadhirai — Curated Indian Divine Statues & Sculptures',
    description: 'Discover exquisite handcrafted divine statues and sacred sculptures from master artisans across India.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Aadhirai' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aadhirai — Curated Indian Divine Statues',
    description: 'Exquisite handcrafted divine statues from master Indian artisans.',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jost.variable} ${cinzel.variable}`}>
      <body className="font-body antialiased bg-white text-stone-900">
        <CartProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                fontFamily: 'var(--font-jost)',
                fontSize: '14px',
                borderRadius: '4px',
              },
              success: { iconTheme: { primary: '#053726', secondary: '#fff' } },
            }}
          />
        </CartProvider>
      </body>
    </html>
  );
}
