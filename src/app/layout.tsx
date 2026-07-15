import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import SiteFrame from '@/components/SiteFrame'

// Base URL used to resolve Open Graph / canonical URLs.
// Override with NEXT_PUBLIC_SITE_URL once a custom domain is connected;
// otherwise falls back to the Vercel production URL, then localhost.
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:3000')

const title = 'Image Refining Academy — Etiquette & Image Training'
const description =
  'World-class etiquette and image training for children, teens, and adults. Refine your image from the inside out.'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  keywords: [
    'etiquette training',
    'image consulting',
    'personal branding',
    'finishing school',
    'Image Refining Academy',
    'Chinenye Nmerole',
    'Nigeria etiquette',
  ],
  alternates: { canonical: '/' },
  verification: {
    google: 'tzJTxisuBkETLJDWLligz_JpgEUTQAaWaxHEnBeDW0o',
  },
  openGraph: {
    type: 'website',
    siteName: 'Image Refining Academy',
    locale: 'en_NG',
    url: siteUrl,
    title,
    description,
    images: [{ url: '/social-image', width: 1200, height: 630, alt: 'Image Refining Academy' }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/social-image'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        {/* Apply the saved theme before first paint to avoid a flash of the wrong theme.
            No stored preference → attribute stays unset → CSS follows the OS setting. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark'){document.documentElement.setAttribute('data-theme',t);}}catch(e){}})();`,
          }}
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
        <script src="https://js.paystack.co/v1/inline.js" async />
      </head>
      <body className="min-h-full flex flex-col bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-200">
        <SiteFrame>{children}</SiteFrame>
        <Analytics />
      </body>
    </html>
  )
}
