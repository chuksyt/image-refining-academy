'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Course } from '@/lib/courses'

interface Draft {
  key: string
  name: string
  tag: string
  category: Course['category']
  description: string
  featuresText: string
  price: string // naira, whole units, in the editor
  priceDisplay: string
  duration: string
  image: string
  popular: boolean
}

const inputCls =
  'w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none'

function keyify(name: string) {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

// Prices are stored in kobo (₦1 = 100 kobo). Show naira in the editor.
function draftFromCourse(c: Course): Draft {
  return {
    key: c.key, name: c.name, tag: c.tag, category: c.category, description: c.description,
    featuresText: c.features.join('\n'), price: String(Math.round(c.price / 100)),
    priceDisplay: c.priceDisplay, duration: c.duration, image: c.image, popular: Boolean(c.popular),
  }
}
function emptyDraft(): Draft {
  return { key: '', name: '', tag: '', category: 'adult', description: '', featuresText: '', price: '', priceDisplay: '', duration: '', image: '', popular: false }
}

export default function CoursesSection({ initialCourses }: { initialCourses: Course[] }) {
  const router = useRouter()
  const [courses, setCourses] = useState<Course[]>(initialCourses)
  const [draft, setDraft] = useState<Draft | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [originalKey, setOriginalKey] = useState<string | undefined>(undefined)
  const [keyTouched, setKeyTouched] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [confirmingDelete, setConfirmingDelete] = useState(false)

  function set<K extends keyof Draft>(k: K, v: Draft[K]) { setDraft(d => (d ? { ...d, [k]: v } : d)) }

  function openNew() {
    setDraft(emptyDraft()); setIsNew(true); setOriginalKey(undefined); setKeyTouched(false)
    setError(null); setNotice(null); setConfirmingDelete(false)
  }
  function openEdit(c: Course) {
    setDraft(draftFromCourse(c)); setIsNew(false); setOriginalKey(c.key); setKeyTouched(true)
    setError(null); setNotice(null); setConfirmingDelete(false)
  }
  function onNameChange(v: string) {
    setDraft(d => { if (!d) return d; const n = { ...d, name: v }; if (isNew && !keyTouched) n.key = keyify(v); return n })
  }
  // Auto-fill the ₦ display from the numeric price if the director hasn't typed one.
  function onPriceChange(v: string) {
    setDraft(d => {
      if (!d) return d
      const n = { ...d, price: v }
      const num = Number(v)
      if (Number.isFinite(num) && num > 0) n.priceDisplay = '₦' + num.toLocaleString('en-NG')
      return n
    })
  }

  async function save() {
    if (!draft) return
    setSaving(true); setError(null); setNotice(null)
    try {
      const course = {
        key: draft.key, name: draft.name, tag: draft.tag, category: draft.category,
        description: draft.description, features: draft.featuresText,
        price: Math.round(Number(draft.price || '0') * 100), // naira → kobo
        priceDisplay: draft.priceDisplay, duration: draft.duration, image: draft.image, popular: draft.popular,
      }
      const res = await fetch('/api/admin/courses', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ course, originalKey }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) { setError(data.error || 'Could not save.'); return }
      setCourses(data.courses); setIsNew(false); setOriginalKey(draft.key); setKeyTouched(true)
      setNotice('Saved. Live on the site.'); router.refresh()
    } catch { setError('Network error. Please try again.') } finally { setSaving(false) }
  }

  async function remove() {
    if (!originalKey) return
    setSaving(true); setError(null)
    try {
      const res = await fetch(`/api/admin/courses?key=${encodeURIComponent(originalKey)}`, { method: 'DELETE' })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) { setError(data.error || 'Could not delete.'); return }
      setCourses(data.courses); setDraft(null); setConfirmingDelete(false); setNotice('Programme deleted.'); router.refresh()
    } catch { setError('Network error. Please try again.') } finally { setSaving(false) }
  }

  return (
    <div className="grid lg:grid-cols-[300px_1fr] gap-8">
      <aside>
        <button onClick={openNew} className="w-full mb-4 bg-gradient-to-r from-violet-700 to-purple-600 text-white font-semibold py-2.5 rounded-xl hover:shadow-lg transition-all">＋ New programme</button>
        <div className="space-y-2">
          {courses.map(c => (
            <button key={c.key} onClick={() => openEdit(c)} className={`w-full text-left rounded-xl px-4 py-3 border transition-colors ${originalKey === c.key && !isNew ? 'border-violet-400 bg-violet-50' : 'border-gray-200 bg-white hover:border-violet-300'}`}>
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900 text-sm line-clamp-1">{c.name}</span>
                {c.popular && <span className="text-[10px] font-bold text-violet-600 bg-violet-100 px-1.5 py-0.5 rounded-full flex-shrink-0">POPULAR</span>}
              </div>
              <div className="text-xs text-gray-400 mt-0.5">{c.priceDisplay} · {c.tag}</div>
            </button>
          ))}
        </div>
      </aside>

      <section>
        {!draft ? (
          <div className="bg-white border border-dashed border-gray-300 rounded-2xl p-16 text-center text-gray-400">Select a programme to edit, or add a new one.</div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-gray-900">{isNew ? 'New programme' : 'Edit programme'}</h2>
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input type="checkbox" checked={draft.popular} onChange={e => set('popular', e.target.checked)} className="rounded border-gray-300 text-violet-600 focus:ring-violet-500" />
                Mark as popular
              </label>
            </div>

            <div><label className="block text-sm font-medium text-gray-700 mb-1">Programme name</label><input value={draft.name} onChange={e => onNameChange(e.target.value)} className={inputCls} /></div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price <span className="text-gray-400 font-normal">(₦, numbers)</span></label>
                <input value={draft.price} onChange={e => onPriceChange(e.target.value)} inputMode="numeric" className={inputCls} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price label</label>
                <input value={draft.priceDisplay} onChange={e => set('priceDisplay', e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select value={draft.category} onChange={e => set('category', e.target.value as Course['category'])} className={inputCls}>
                  <option value="children">children</option>
                  <option value="teen">teen</option>
                  <option value="adult">adult</option>
                  <option value="online">online</option>
                </select>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Tag <span className="text-gray-400 font-normal">(e.g. &quot;Ages 6 – 12&quot;)</span></label><input value={draft.tag} onChange={e => set('tag', e.target.value)} className={inputCls} /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Duration</label><input value={draft.duration} onChange={e => set('duration', e.target.value)} className={inputCls} /></div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Key <span className="text-gray-400 font-normal">(internal id — used by enrollment; avoid changing)</span></label>
              <input value={draft.key} onChange={e => { setKeyTouched(true); set('key', e.target.value) }} className={inputCls} />
            </div>

            <div><label className="block text-sm font-medium text-gray-700 mb-1">Description</label><textarea value={draft.description} onChange={e => set('description', e.target.value)} rows={3} className={inputCls} /></div>

            <div><label className="block text-sm font-medium text-gray-700 mb-1">Features <span className="text-gray-400 font-normal">— one per line</span></label><textarea value={draft.featuresText} onChange={e => set('featuresText', e.target.value)} rows={5} className={inputCls} /></div>

            <div><label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label><input value={draft.image} onChange={e => set('image', e.target.value)} className={inputCls} /></div>

            {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
            {notice && <p className="text-sm text-green-700 bg-green-50 rounded-lg px-3 py-2">{notice}</p>}

            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <div>
                {!isNew && (confirmingDelete ? (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Delete this programme?</span>
                    <button onClick={remove} disabled={saving} className="text-sm font-semibold text-red-600 hover:text-red-800 disabled:opacity-50">Yes, delete</button>
                    <button onClick={() => setConfirmingDelete(false)} className="text-sm text-gray-500">Cancel</button>
                  </div>
                ) : (<button onClick={() => setConfirmingDelete(true)} className="text-sm text-red-600 hover:text-red-800">Delete</button>))}
              </div>
              <button onClick={save} disabled={saving} className="bg-gradient-to-r from-violet-700 to-purple-600 text-white font-bold px-8 py-2.5 rounded-xl hover:shadow-lg transition-all disabled:opacity-50">{saving ? 'Saving…' : 'Save & publish'}</button>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
