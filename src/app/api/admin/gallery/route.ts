import { NextRequest, NextResponse } from 'next/server'
import { requireAuth, refresh } from '@/lib/api-auth'
import { getGallery, saveGallery } from '@/lib/gallery-store'
import { GALLERY_CATEGORIES, type GalleryItem } from '@/lib/gallery'

const VALID_CATS = GALLERY_CATEGORIES.map(c => c.key)

function parseItems(body: unknown): GalleryItem[] {
  if (!Array.isArray(body)) throw new Error('Expected a list of gallery items.')
  return body.map((raw, i) => {
    const b = raw as Record<string, unknown>
    const src = String(b.src ?? '').trim()
    if (!src) throw new Error(`Item ${i + 1} is missing an image.`)
    const category = String(b.category ?? '')
    if (!VALID_CATS.includes(category as GalleryItem['category'])) {
      throw new Error(`Item ${i + 1} has an invalid category.`)
    }
    const item: GalleryItem = {
      id: String(b.id ?? '').trim() || `g-${Date.now()}-${i}`,
      src,
      caption: String(b.caption ?? '').trim(),
      category: category as GalleryItem['category'],
    }
    const videoId = String(b.videoId ?? '').trim()
    if (videoId) item.videoId = videoId
    return item
  })
}

export async function GET() {
  const unauth = await requireAuth()
  if (unauth) return unauth
  return NextResponse.json({ items: await getGallery() })
}

export async function PUT(req: NextRequest) {
  const unauth = await requireAuth()
  if (unauth) return unauth
  let payload: { items?: unknown }
  try {
    payload = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
  try {
    const items = parseItems(payload.items)
    await saveGallery(items)
    refresh('/gallery')
    return NextResponse.json({ items })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 })
  }
}
