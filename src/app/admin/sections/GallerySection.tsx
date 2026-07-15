'use client'
import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { GALLERY_CATEGORIES, type GalleryItem, type GalleryCategory } from '@/lib/gallery'

const inputCls =
  'w-full rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 px-2 py-1.5 text-gray-900 dark:text-gray-100 dark:placeholder-gray-500 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-200 dark:focus:ring-violet-900/50 outline-none'

function newId() { return `g-${Date.now()}-${Math.floor(Math.random() * 1000)}` }

export default function GallerySection({ initialItems }: { initialItems: GalleryItem[] }) {
  const router = useRouter()
  const [items, setItems] = useState<GalleryItem[]>(initialItems)
  const [dirty, setDirty] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  function update(id: string, patch: Partial<GalleryItem>) {
    setItems(list => list.map(it => (it.id === id ? { ...it, ...patch } : it)))
    setDirty(true)
  }
  function removeItem(id: string) { setItems(list => list.filter(it => it.id !== id)); setDirty(true) }
  function move(id: string, dir: -1 | 1) {
    setItems(list => {
      const idx = list.findIndex(it => it.id === id)
      const to = idx + dir
      if (idx < 0 || to < 0 || to >= list.length) return list
      const next = [...list]
      ;[next[idx], next[to]] = [next[to], next[idx]]
      return next
    })
    setDirty(true)
  }
  function addByUrl() {
    setItems(list => [{ id: newId(), src: '', caption: '', category: 'workshop' as GalleryCategory }, ...list])
    setDirty(true)
  }

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) e.target.value = '' // allow re-selecting same file later
    if (!file) return
    setUploading(true); setError(null); setNotice(null)
    try {
      const fd = new FormData(); fd.append('file', file)
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) { setError(data.error || 'Upload failed.'); return }
      setItems(list => [{ id: newId(), src: data.url, caption: '', category: 'workshop' as GalleryCategory }, ...list])
      setDirty(true); setNotice('Image uploaded — remember to Save gallery.')
    } catch { setError('Network error during upload.') } finally { setUploading(false) }
  }

  async function save() {
    setSaving(true); setError(null); setNotice(null)
    try {
      const res = await fetch('/api/admin/gallery', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) { setError(data.error || 'Could not save.'); return }
      setItems(data.items); setDirty(false); setNotice('Gallery saved. Live on the site.'); router.refresh()
    } catch { setError('Network error. Please try again.') } finally { setSaving(false) }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <button onClick={() => fileRef.current?.click()} disabled={uploading} className="bg-gradient-to-r from-violet-700 to-purple-600 text-white font-semibold px-5 py-2.5 rounded-xl hover:shadow-lg transition-all disabled:opacity-50">
          {uploading ? 'Uploading…' : '⬆ Upload photo'}
        </button>
        <input ref={fileRef} type="file" accept="image/*" onChange={onFile} className="hidden" />
        <button onClick={addByUrl} className="border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium px-4 py-2.5 rounded-xl hover:border-violet-400">＋ Add by URL / YouTube</button>
        <div className="flex-1" />
        <button onClick={save} disabled={saving || !dirty} className="bg-gray-900 dark:bg-gray-700 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-gray-800 dark:hover:bg-gray-600 transition-all disabled:opacity-40">
          {saving ? 'Saving…' : dirty ? 'Save gallery' : 'Saved'}
        </button>
      </div>

      {error && <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 rounded-lg px-3 py-2">{error}</p>}
      {notice && <p className="text-sm text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950/30 rounded-lg px-3 py-2">{notice}</p>}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((it, idx) => (
          <div key={it.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-3 space-y-2">
            <div className="relative h-40 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {it.src ? <img src={it.src} alt={it.caption} className="w-full h-full object-cover" /> : <span className="text-gray-400 dark:text-gray-500 text-sm">No image</span>}
              <div className="absolute top-2 right-2 flex gap-1">
                <button onClick={() => move(it.id, -1)} disabled={idx === 0} title="Move up" className="w-7 h-7 rounded-full bg-white/90 dark:bg-gray-900/90 text-gray-700 dark:text-gray-200 disabled:opacity-30 shadow">↑</button>
                <button onClick={() => move(it.id, 1)} disabled={idx === items.length - 1} title="Move down" className="w-7 h-7 rounded-full bg-white/90 dark:bg-gray-900/90 text-gray-700 dark:text-gray-200 disabled:opacity-30 shadow">↓</button>
              </div>
            </div>
            <input value={it.src} onChange={e => update(it.id, { src: e.target.value })} placeholder="Image URL" className={inputCls} />
            <input value={it.caption} onChange={e => update(it.id, { caption: e.target.value })} placeholder="Caption" className={inputCls} />
            <div className="flex gap-2">
              <select value={it.category} onChange={e => update(it.id, { category: e.target.value as GalleryCategory })} className={inputCls}>
                {GALLERY_CATEGORIES.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
              </select>
              <button onClick={() => removeItem(it.id)} className="text-sm text-red-600 dark:text-red-400 hover:text-red-800 px-2 whitespace-nowrap">Remove</button>
            </div>
            <input value={it.videoId ?? ''} onChange={e => update(it.id, { videoId: e.target.value || undefined })} placeholder="YouTube video ID (optional)" className={inputCls} />
          </div>
        ))}
      </div>
      {items.length === 0 && <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-10">No images yet. Upload one to get started.</p>}
    </div>
  )
}
