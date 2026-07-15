'use client'
import { useEffect, useState } from 'react'

type Mode = 'light' | 'dark'

/**
 * Sun/moon button that overrides the OS theme.
 *
 * On first visit (no stored choice) the site follows the OS setting; the first
 * click writes an explicit `data-theme` on <html> + a localStorage entry, so the
 * choice sticks and wins over the system preference from then on.
 */
export default function ThemeToggle({ scrolled = false }: { scrolled?: boolean }) {
  const [mounted, setMounted] = useState(false)
  const [mode, setMode] = useState<Mode>('light')

  useEffect(() => {
    setMounted(true)
    let stored: string | null = null
    try { stored = localStorage.getItem('theme') } catch {}
    const system: Mode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    setMode(stored === 'light' || stored === 'dark' ? stored : system)
  }, [])

  function toggle() {
    const next: Mode = mode === 'dark' ? 'light' : 'dark'
    setMode(next)
    document.documentElement.setAttribute('data-theme', next)
    try { localStorage.setItem('theme', next) } catch {}
  }

  const isDark = mounted && mode === 'dark'
  const color = scrolled
    ? 'text-gray-700 dark:text-gray-200 hover:text-violet-500'
    : 'text-white/90 hover:text-white'

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`flex items-center justify-center w-9 h-9 rounded-full transition-colors ${color}`}
    >
      {/* Keep markup stable across the mount to avoid a hydration mismatch;
          swap only the visible icon once we know the real theme. */}
      {isDark ? (
        // Sun — click to go light
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
      ) : (
        // Moon — click to go dark
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  )
}
