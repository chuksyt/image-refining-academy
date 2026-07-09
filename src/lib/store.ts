// NOTE: server-only module. Shared storage layer for all editable site content.
// Imported exclusively by server components and route handlers — never by
// client components (it pulls in @vercel/blob and node:fs).
import { unstable_cache, revalidateTag } from 'next/cache'
import { get, put, del } from '@vercel/blob'
import { promises as fs } from 'node:fs'
import path from 'node:path'

// Storage backends, in priority order:
//   1. Vercel Blob   — when BLOB_READ_WRITE_TOKEN is set (production).
//   2. Local file    — dev without a token, so editors work with zero setup.
//   3. Read-only seed — production with no token (never breaks the site).
const LOCAL_DIR = path.join(process.cwd(), '.cms-data')

function hasBlob(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN)
}

// Only fall back to the local file in dev — Vercel's filesystem is read-only.
function isLocalFileMode(): boolean {
  return !hasBlob() && process.env.NODE_ENV !== 'production'
}

/** True when saving is possible (Blob configured, or local dev). */
export function storageWritable(): boolean {
  return hasBlob() || isLocalFileMode()
}

function cacheTag(key: string): string {
  return `store:${key}`
}

async function readJsonUncached<T>(key: string, fallback: T): Promise<T> {
  if (hasBlob()) {
    try {
      // useCache:false → read fresh from origin. The result is then held in the
      // Next data cache (below) and only re-fetched when a write revalidates it.
      const result = await get(key, { access: 'public', useCache: false })
      if (!result || result.statusCode !== 200) return fallback
      const data = await new Response(result.stream).json()
      return (data ?? fallback) as T
    } catch (err) {
      console.error(`[store] blob read failed for ${key}:`, err)
      return fallback
    }
  }

  if (isLocalFileMode()) {
    try {
      const raw = await fs.readFile(path.join(LOCAL_DIR, key), 'utf8')
      return JSON.parse(raw) as T
    } catch {
      return fallback // not written yet
    }
  }

  return fallback
}

/**
 * Read a JSON document by key (e.g. "blog/posts.json"). Cached in the Next data
 * cache and tagged so a write to the same key invalidates it — this keeps reads
 * off the Blob origin on every request while staying instantly fresh after edits.
 */
export async function readJson<T>(key: string, fallback: T): Promise<T> {
  const cached = unstable_cache(
    () => readJsonUncached(key, fallback),
    ['store', key],
    { tags: [cacheTag(key)] },
  )
  return cached()
}

/** Write a JSON document by key and invalidate its cached read. */
export async function writeJson<T>(key: string, data: T): Promise<void> {
  const json = JSON.stringify(data, null, 2)

  if (hasBlob()) {
    await put(key, json, {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false,
      allowOverwrite: true,
    })
  } else if (isLocalFileMode()) {
    const file = path.join(LOCAL_DIR, key)
    await fs.mkdir(path.dirname(file), { recursive: true })
    await fs.writeFile(file, json, 'utf8')
  } else {
    throw new Error(
      'Storage is not configured — cannot save. Link a Vercel Blob store to this project (BLOB_READ_WRITE_TOKEN).',
    )
  }

  // expire: 0 → purge with no stale-serve window, so edits show immediately.
  revalidateTag(cacheTag(key), { expire: 0 })
}

/**
 * Store an uploaded image and return a public URL for it. In production this
 * goes to Vercel Blob; in local dev it is written under public/gallery/uploads
 * so Next serves it statically.
 */
export async function uploadImage(
  filename: string,
  data: ArrayBuffer,
  contentType: string,
): Promise<string> {
  const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, '_') || 'image'

  if (hasBlob()) {
    const res = await put(`gallery/uploads/${safeName}`, Buffer.from(data), {
      access: 'public',
      contentType,
      addRandomSuffix: true,
    })
    return res.url
  }

  if (isLocalFileMode()) {
    const dir = path.join(process.cwd(), 'public', 'gallery', 'uploads')
    await fs.mkdir(dir, { recursive: true })
    const unique = `${Date.now()}-${safeName}`
    await fs.writeFile(path.join(dir, unique), Buffer.from(data))
    return `/gallery/uploads/${unique}`
  }

  throw new Error('Storage is not configured — cannot upload images.')
}

/**
 * Delete a previously-uploaded image so removed gallery items don't orphan
 * files in storage. Only touches images we own (Blob-hosted or local uploads);
 * external/seed URLs are left alone.
 */
export async function deleteUpload(url: string): Promise<void> {
  if (!url) return
  try {
    if (hasBlob() && url.includes('.public.blob.vercel-storage.com')) {
      await del(url)
    } else if (isLocalFileMode() && url.startsWith('/gallery/uploads/')) {
      await fs.rm(path.join(process.cwd(), 'public', url), { force: true })
    }
  } catch (err) {
    console.error('[store] deleteUpload failed for', url, err)
  }
}
