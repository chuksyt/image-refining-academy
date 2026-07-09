'use client'
import { usePathname } from 'next/navigation'
import Navbar from './Navbar'
import Footer from './Footer'
import Preloader from './Preloader'
import WhatsAppWidget from './WhatsAppWidget'

/**
 * Wraps page content with the public site chrome (nav, footer, widgets) — but
 * skips all of it on the director's admin area, which has its own layout.
 */
export default function SiteFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith('/admin')

  if (isAdmin) {
    return <main className="flex-1">{children}</main>
  }

  return (
    <>
      <Preloader />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppWidget />
    </>
  )
}
