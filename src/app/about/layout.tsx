import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us — Image Refining Academy',
  description: 'Learn about Chinenye Nmerole and the story behind Image Refining Academy — a decade of transforming lives through world-class etiquette education.',
  openGraph: {
    title: 'About Us — Image Refining Academy',
    description: 'A decade of transforming lives through the timeless art of etiquette and image refinement.',
    images: [{ url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=1200&q=80' }],
  },
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
