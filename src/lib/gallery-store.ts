// NOTE: server-only module.
import { readJson, writeJson } from './store'
import { SEED_GALLERY, type GalleryItem } from './gallery'

const KEY = 'gallery/gallery.json'

export async function getGallery(): Promise<GalleryItem[]> {
  const data = await readJson<GalleryItem[]>(KEY, SEED_GALLERY)
  return Array.isArray(data) ? data : SEED_GALLERY
}

/** Replace the entire gallery list (handles add / edit / reorder / remove). */
export async function saveGallery(items: GalleryItem[]): Promise<GalleryItem[]> {
  await writeJson(KEY, items)
  return items
}
