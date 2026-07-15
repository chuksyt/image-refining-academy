'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import ThemeToggle from './ThemeToggle'

const links = [
  { href: '/',        label: 'Home' },
  { href: '/about',   label: 'About' },
  { href: '/blog',    label: 'Blog' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the mobile menu whenever the route changes.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setMenuOpen(false) }, [pathname])

  const navBg = scrolled
    ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-md dark:shadow-black/40'
    : 'bg-transparent'

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-18 py-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Image
              src="/logo.png"
              alt="Image Refining Academy"
              width={48}
              height={48}
              className="object-contain"
            />
            <div className="flex flex-col leading-tight">
              <span className={`font-bold text-sm tracking-wide transition-colors ${scrolled ? 'text-gray-900 dark:text-white' : 'text-white'}`}>
                Image Refining
              </span>
              <span className={`text-xs transition-colors ${scrolled ? 'text-violet-600 dark:text-purple-400' : 'text-purple-300'}`}>
                Academy
              </span>
            </div>
          </Link>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-8">
            {links.map(l => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={`text-sm font-medium transition-colors hover:text-violet-500 ${
                    pathname === l.href
                      ? 'text-violet-500'
                      : scrolled ? 'text-gray-700 dark:text-gray-200' : 'text-white/90'
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle scrolled={scrolled} />
            <a
              href="https://wa.me/2348037269408?text=Hi%20Chinenye%2C%20I%20would%20like%20to%20register%20for%20a%20programme."
              target="_blank" rel="noopener noreferrer"
              className="ripple-btn flex items-center gap-2 bg-gradient-to-r from-violet-600 to-purple-500 text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:shadow-lg hover:shadow-violet-500/30 transition-all"
            >
              Register Now
            </a>
          </div>

          {/* Mobile: theme toggle + hamburger */}
          <div className="md:hidden flex items-center gap-1">
            <ThemeToggle scrolled={scrolled} />
            <button
              onClick={() => setMenuOpen(o => !o)}
              className="flex flex-col gap-1.5 p-2"
              aria-label="Toggle menu"
            >
              <span className={`block w-6 h-0.5 transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''} ${scrolled ? 'bg-gray-800 dark:bg-gray-200' : 'bg-white'}`} />
              <span className={`block w-6 h-0.5 transition-all duration-300 ${menuOpen ? 'opacity-0' : ''} ${scrolled ? 'bg-gray-800 dark:bg-gray-200' : 'bg-white'}`} />
              <span className={`block w-6 h-0.5 transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''} ${scrolled ? 'bg-gray-800 dark:bg-gray-200' : 'bg-white'}`} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className={`fixed inset-x-0 top-0 z-40 bg-white dark:bg-gray-900 shadow-xl pt-20 pb-6 px-6 flex flex-col gap-3 transition-all duration-300 md:hidden ${menuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
        {links.map(l => (
          <Link
            key={l.href}
            href={l.href}
            className={`text-base font-medium py-2 border-b border-gray-100 dark:border-gray-800 ${pathname === l.href ? 'text-violet-600 dark:text-violet-400' : 'text-gray-700 dark:text-gray-200'}`}
          >
            {l.label}
          </Link>
        ))}
        <a href="https://wa.me/2348037269408?text=Hi%20Chinenye%2C%20I%20would%20like%20to%20register%20for%20a%20programme." target="_blank" rel="noopener noreferrer" className="mt-2 text-center bg-gradient-to-r from-violet-600 to-purple-500 text-white font-semibold py-3 rounded-full">
          Register Now
        </a>
      </div>
    </>
  )
}
