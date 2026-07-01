import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Our Courses — Image Refining Academy',
  description: 'Explore etiquette and image refinement courses for children, teens, adults, and professionals. Enrol securely via Paystack.',
  openGraph: {
    title: 'Our Courses — Image Refining Academy',
    description: 'From children to corporate executives — we have a course designed just for you.',
    images: [{ url: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&q=80' }],
  },
}

export default function CoursesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
