// NOTE: server-only module. Shared storage layer for all editable site content.
// Imported exclusively by server components and route handlers — never by
// client components (it pulls in @vercel/blob and node:fs).
import { get, put } from '@vercel/blob'
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
function useLocalFile(): boolean {
  return !hasBlob() && process.env.NODE_ENV !== 'production'
}

/** True when saving is possible (Blob configured, or local dev). */
export function storageWritable(): boolean {
  return hasBlob() || useLocalFile()
}

/**
 * Read a JSON document by key (e.g. "blog/posts.json"). Returns `fallback` when
 * nothing has been saved yet or storage isn't configured. Always fresh.
 */
export async function readJson<T>(key: string, fallback: T): Promise<T> {
  if (hasBlob()) {
    try {
      const result = await get(key, { access: 'public', useCache: false })
      if (!result || result.statusCode !== 200) return fallback
      const data = await new Response(result.stream).json()
      return (data ?? fallback) as T
    } catch (err) {
      console.error(`[store] blob read failed for ${key}:`, err)
      return fallback
    }
  }

  if (useLocalFile()) {
    try {
      const raw = await fs.readFile(path.join(LOCAL_DIR, key), 'utf8')
      return JSON.parse(raw) as T
    } catch {
      return fallback // not written yet
    }
  }

  return fallback
}

/** Write a JSON document by key. Throws if storage isn't writable. */
export async function writeJson<T>(key: string, data: T): Promise<void> {
  const json = JSON.stringify(data, null, 2)

  if (hasBlob()) {
    await put(key, json, {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false,
      allowOverwrite: true,
    })
    return
  }

  if (useLocalFile()) {
    const file = path.join(LOCAL_DIR, key)
    await fs.mkdir(path.dirname(file), { recursive: true })
    await fs.writeFile(file, json, 'utf8')
    return
  }

  throw new Error(
    'Storage is not configured — cannot save. Link a Vercel Blob store to this project (BLOB_READ_WRITE_TOKEN).',
  )
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

  if (useLocalFile()) {
    const dir = path.join(process.cwd(), 'public', 'gallery', 'uploads')
    await fs.mkdir(dir, { recursive: true })
    const unique = `${Date.now()}-${safeName}`
    await fs.writeFile(path.join(dir, unique), Buffer.from(data))
    return `/gallery/uploads/${unique}`
  }

  throw new Error('Storage is not configured — cannot upload images.')
}
