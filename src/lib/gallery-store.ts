// NOTE: server-only module.
import { readJson, writeJson, deleteUpload } from './store'
import { SEED_GALLERY, type GalleryItem } from './gallery'

const KEY = 'gallery/gallery.json'

export async function getGallery(): Promise<GalleryItem[]> {
  const data = await readJson<GalleryItem[]>(KEY, SEED_GALLERY)
  return Array.isArray(data) ? data : SEED_GALLERY
}

/** Replace the entire gallery list (handles add / edit / reorder / remove). */
export async function saveGallery(items: GalleryItem[]): Promise<GalleryItem[]> {
  const previous = await getGallery()
  await writeJson(KEY, items)

  // Clean up uploaded images that were removed, so they don't orphan in storage.
  const keptSrcs = new Set(items.map(i => i.src))
  const removed = previous.filter(p => !keptSrcs.has(p.src))
  await Promise.all(removed.map(r => deleteUpload(r.src)))

  return items
}
