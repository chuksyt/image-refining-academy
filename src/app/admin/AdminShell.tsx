'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { BlogPost } from '@/lib/blog'
import type { Course } from '@/lib/courses'
import type { Intake } from '@/lib/intakes'
import type { GalleryItem } from '@/lib/gallery'
import type { SiteContent } from '@/lib/content'
import BlogSection from './sections/BlogSection'
import CoursesSection from './sections/CoursesSection'
import EventsSection from './sections/EventsSection'
import GallerySection from './sections/GallerySection'
import ContentSection from './sections/ContentSection'
import ThemeToggle from '@/components/ThemeToggle'

type Tab = 'blog' | 'courses' | 'events' | 'gallery' | 'content'

const TABS: { key: Tab; label: string }[] = [
  { key: 'blog', label: 'Blog' },
  { key: 'courses', label: 'Courses & Pricing' },
  { key: 'events', label: 'Events' },
  { key: 'gallery', label: 'Gallery' },
  { key: 'content', label: 'Page Text' },
]

interface Props {
  writable: boolean
  initialPosts: BlogPost[]
  initialCourses: Course[]
  initialIntakes: Intake[]
  initialGallery: GalleryItem[]
  initialContent: SiteContent
}

export default function AdminShell({
  writable,
  initialPosts,
  initialCourses,
  initialIntakes,
  initialGallery,
  initialContent,
}: Props) {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('blog')

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div>
            <h1 className="font-bold text-gray-900 dark:text-white">Site Editor</h1>
            <p className="text-xs text-gray-400 dark:text-gray-500">Image Refining Academy</p>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle scrolled />
            <Link href="/" target="_blank" className="text-sm text-violet-600 dark:text-violet-400 hover:text-violet-800 dark:hover:text-violet-300 font-medium">
              View site ↗
            </Link>
            <button onClick={logout} className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
              Log out
            </button>
          </div>
        </div>
        {/* Tabs */}
        <div className="max-w-6xl mx-auto px-6 flex gap-1 overflow-x-auto">
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                tab === t.key
                  ? 'border-violet-600 text-violet-700 dark:text-violet-300'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </header>

      {!writable && (
        <div className="max-w-6xl mx-auto px-6 pt-4">
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-300 text-sm rounded-xl px-4 py-3">
            <strong>Read-only:</strong> storage isn&apos;t configured, so changes can&apos;t be saved.
            Link a Vercel Blob store (<code className="font-mono">BLOB_READ_WRITE_TOKEN</code>) to enable saving in production.
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-6 py-8">
        {tab === 'blog' && <BlogSection initialPosts={initialPosts} />}
        {tab === 'courses' && <CoursesSection initialCourses={initialCourses} />}
        {tab === 'events' && <EventsSection initialIntakes={initialIntakes} />}
        {tab === 'gallery' && <GallerySection initialItems={initialGallery} />}
        {tab === 'content' && <ContentSection initialContent={initialContent} />}
      </div>
    </div>
  )
}
