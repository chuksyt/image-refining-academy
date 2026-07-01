import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us — Image Refining Academy',
  description: 'Get in touch with Image Refining Academy. We\'d love to hear from you about our courses, group bookings, and programmes.',
  openGraph: {
    title: 'Contact Us — Image Refining Academy',
    description: 'Reach out to the Image Refining Academy team — we\'re happy to help.',
    images: [{ url: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&q=80' }],
  },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
