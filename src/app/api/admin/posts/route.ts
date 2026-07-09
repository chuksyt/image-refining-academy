import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { isAuthed } from '@/lib/auth'
import { deletePost, getAllPosts, upsertPost } from '@/lib/blog-store'
import type { BlogPost } from '@/lib/blog'

async function requireAuth(): Promise<NextResponse | null> {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return null
}

function refreshBlogRoutes(slug?: string) {
  revalidatePath('/')
  revalidatePath('/blog')
  revalidatePath('/sitemap.xml')
  if (slug) revalidatePath(`/blog/${slug}`)
}

const REQUIRED_STRINGS = [
  'title', 'excerpt', 'category', 'author',
  'authorRole', 'authorAvatar', 'date', 'readTime', 'image',
] as const

/** Validate + normalize an incoming post payload. Throws on invalid input. */
function parsePost(body: unknown): BlogPost {
  if (typeof body !== 'object' || body === null) {
    throw new Error('Invalid post data')
  }
  const b = body as Record<string, unknown>

  const slug = String(b.slug ?? '').trim().toLowerCase()
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error('Slug must contain only lowercase letters, numbers and hyphens.')
  }

  for (const key of REQUIRED_STRINGS) {
    if (typeof b[key] !== 'string' || (b[key] as string).trim() === '') {
      throw new Error(`Field "${key}" is required.`)
    }
  }

  let content: string[]
  if (Array.isArray(b.content)) {
    content = b.content.map(p => String(p).trim()).filter(Boolean)
  } else if (typeof b.content === 'string') {
    content = b.content.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean)
  } else {
    content = []
  }
  if (content.length === 0) {
    throw new Error('Post content cannot be empty.')
  }

  return {
    slug,
    title: (b.title as string).trim(),
    excerpt: (b.excerpt as string).trim(),
    content,
    category: (b.category as string).trim(),
    author: (b.author as string).trim(),
    authorRole: (b.authorRole as string).trim(),
    authorAvatar: (b.authorAvatar as string).trim(),
    date: (b.date as string).trim(),
    readTime: (b.readTime as string).trim(),
    image: (b.image as string).trim(),
    featured: Boolean(b.featured),
  }
}

export async function GET() {
  const unauth = await requireAuth()
  if (unauth) return unauth
  const posts = await getAllPosts()
  return NextResponse.json({ posts })
}

export async function PUT(req: NextRequest) {
  const unauth = await requireAuth()
  if (unauth) return unauth

  let payload: { post?: unknown; originalSlug?: unknown }
  try {
    payload = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  let post: BlogPost
  try {
    post = parsePost(payload.post)
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 })
  }

  const originalSlug =
    typeof payload.originalSlug === 'string' ? payload.originalSlug : undefined

  try {
    const posts = await upsertPost(post, originalSlug)
    refreshBlogRoutes(post.slug)
    if (originalSlug && originalSlug !== post.slug) refreshBlogRoutes(originalSlug)
    return NextResponse.json({ posts })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 })
  }
}

export async function DELETE(req: NextRequest) {
  const unauth = await requireAuth()
  if (unauth) return unauth

  const slug = req.nextUrl.searchParams.get('slug')
  if (!slug) {
    return NextResponse.json({ error: 'Missing slug' }, { status: 400 })
  }

  try {
    const posts = await deletePost(slug)
    refreshBlogRoutes(slug)
    return NextResponse.json({ posts })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
