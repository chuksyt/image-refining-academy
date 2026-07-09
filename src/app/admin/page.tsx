import type { Metadata } from 'next'
import { isAuthed, sessionToken } from '@/lib/auth'
import { getAllPosts } from '@/lib/blog-store'
import { getAllCourses } from '@/lib/courses-store'
import { getAllIntakes } from '@/lib/intakes-store'
import { getGallery } from '@/lib/gallery-store'
import { getSiteContent } from '@/lib/content-store'
import { storageWritable } from '@/lib/store'
import AdminLogin from './AdminLogin'
import AdminShell from './AdminShell'

// Never cache and never index the editor.
export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
  title: 'Site Editor — Image Refining Academy',
  robots: { index: false, follow: false },
}

export default async function AdminPage() {
  const configured = Boolean(sessionToken())
  const authed = configured && (await isAuthed())

  if (!authed) {
    return <AdminLogin configured={configured} />
  }

  const [posts, courses, intakes, gallery, content] = await Promise.all([
    getAllPosts(),
    getAllCourses(),
    getAllIntakes(),
    getGallery(),
    getSiteContent(),
  ])

  return (
    <AdminShell
      writable={storageWritable()}
      initialPosts={posts}
      initialCourses={courses}
      initialIntakes={intakes}
      initialGallery={gallery}
      initialContent={content}
    />
  )
}
