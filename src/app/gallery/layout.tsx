import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gallery — Image Refining Academy',
  description: 'Moments of elegance captured — glimpses into our programmes, events, and student transformations.',
  openGraph: {
    title: 'Gallery — Image Refining Academy',
    description: 'Moments of elegance from Image Refining Academy workshops and events.',
    images: [{ url: '/gallery/ushering-1.jpg' }],
  },
}

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
