'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Intake } from '@/lib/intakes'

type Draft = Omit<Intake, 'spotsTotal' | 'spotsLeft'> & { spotsTotal: string; spotsLeft: string }

const inputCls =
  'w-full rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-gray-100 dark:placeholder-gray-500 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-200 dark:focus:ring-violet-900/50 outline-none'

function draftFromIntake(i: Intake): Draft {
  return { ...i, spotsTotal: String(i.spotsTotal), spotsLeft: String(i.spotsLeft), rolling: Boolean(i.rolling) }
}
function emptyDraft(): Draft {
  return {
    id: `intake-${Date.now()}`, courseKey: '', courseName: '', date: '', isoDate: '',
    format: 'In-person', duration: '', spotsTotal: '20', spotsLeft: '20', price: '', category: 'adult', rolling: false,
  }
}

export default function EventsSection({ initialIntakes }: { initialIntakes: Intake[] }) {
  const router = useRouter()
  const [intakes, setIntakes] = useState<Intake[]>(initialIntakes)
  const [draft, setDraft] = useState<Draft | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [confirmingDelete, setConfirmingDelete] = useState(false)

  function set<K extends keyof Draft>(k: K, v: Draft[K]) { setDraft(d => (d ? { ...d, [k]: v } : d)) }

  function openNew() { setDraft(emptyDraft()); setIsNew(true); setError(null); setNotice(null); setConfirmingDelete(false) }
  function openEdit(i: Intake) { setDraft(draftFromIntake(i)); setIsNew(false); setError(null); setNotice(null); setConfirmingDelete(false) }

  async function save() {
    if (!draft) return
    setSaving(true); setError(null); setNotice(null)
    try {
      const intake = { ...draft, spotsTotal: Number(draft.spotsTotal || '0'), spotsLeft: Number(draft.spotsLeft || '0') }
      const res = await fetch('/api/admin/events', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ intake }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) { setError(data.error || 'Could not save.'); return }
      setIntakes(data.intakes); setIsNew(false); setNotice('Saved. Live on the site.'); router.refresh()
    } catch { setError('Network error. Please try again.') } finally { setSaving(false) }
  }

  async function remove() {
    if (!draft) return
    setSaving(true); setError(null)
    try {
      const res = await fetch(`/api/admin/events?id=${encodeURIComponent(draft.id)}`, { method: 'DELETE' })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) { setError(data.error || 'Could not delete.'); return }
      setIntakes(data.intakes); setDraft(null); setConfirmingDelete(false); setNotice('Event deleted.'); router.refresh()
    } catch { setError('Network error. Please try again.') } finally { setSaving(false) }
  }

  return (
    <div className="grid lg:grid-cols-[300px_1fr] gap-8">
      <aside>
        <button onClick={openNew} className="w-full mb-4 bg-gradient-to-r from-violet-700 to-purple-600 text-white font-semibold py-2.5 rounded-xl hover:shadow-lg transition-all">＋ New event</button>
        <div className="space-y-2">
          {intakes.map(i => (
            <button key={i.id} onClick={() => openEdit(i)} className={`w-full text-left rounded-xl px-4 py-3 border transition-colors ${draft?.id === i.id && !isNew ? 'border-violet-400 bg-violet-50 dark:border-violet-500 dark:bg-violet-950/40' : 'border-gray-200 bg-white hover:border-violet-300 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-violet-700'}`}>
              <span className="font-medium text-gray-900 dark:text-white text-sm line-clamp-1">{i.courseName}</span>
              <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{i.date} · {i.spotsLeft}/{i.spotsTotal} spots</div>
            </button>
          ))}
        </div>
      </aside>

      <section>
        {!draft ? (
          <div className="bg-white dark:bg-gray-900 border border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-16 text-center text-gray-400 dark:text-gray-500">Select an event to edit, or add a new one.</div>
        ) : (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-gray-900 dark:text-white">{isNew ? 'New event' : 'Edit event'}</h2>
              <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <input type="checkbox" checked={draft.rolling} onChange={e => set('rolling', e.target.checked)} className="rounded border-gray-300 dark:border-gray-600 dark:bg-gray-800 text-violet-600 focus:ring-violet-500" />
                Rolling enrollment
              </label>
            </div>

            <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Programme name</label><input value={draft.courseName} onChange={e => set('courseName', e.target.value)} className={inputCls} /></div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date <span className="text-gray-400 dark:text-gray-500 font-normal">(display)</span></label><input value={draft.date} onChange={e => set('date', e.target.value)} placeholder="July 14, 2026" className={inputCls} /></div>
              <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ISO date <span className="text-gray-400 dark:text-gray-500 font-normal">(YYYY-MM-DD, for sorting)</span></label><input value={draft.isoDate} onChange={e => set('isoDate', e.target.value)} placeholder="2026-07-14" className={inputCls} /></div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Format</label><input value={draft.format} onChange={e => set('format', e.target.value)} className={inputCls} /></div>
              <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Duration</label><input value={draft.duration} onChange={e => set('duration', e.target.value)} className={inputCls} /></div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Total spots</label><input value={draft.spotsTotal} onChange={e => set('spotsTotal', e.target.value)} inputMode="numeric" className={inputCls} /></div>
              <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Spots left</label><input value={draft.spotsLeft} onChange={e => set('spotsLeft', e.target.value)} inputMode="numeric" className={inputCls} /></div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                <select value={draft.category} onChange={e => set('category', e.target.value as Intake['category'])} className={inputCls}>
                  <option value="children">children</option><option value="teen">teen</option><option value="adult">adult</option><option value="online">online</option>
                </select>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price label</label><input value={draft.price} onChange={e => set('price', e.target.value)} placeholder="₦35,000" className={inputCls} /></div>
              <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Course key <span className="text-gray-400 dark:text-gray-500 font-normal">(links to a programme)</span></label><input value={draft.courseKey} onChange={e => set('courseKey', e.target.value)} className={inputCls} /></div>
            </div>

            {error && <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 rounded-lg px-3 py-2">{error}</p>}
            {notice && <p className="text-sm text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950/30 rounded-lg px-3 py-2">{notice}</p>}

            <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
              <div>
                {!isNew && (confirmingDelete ? (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Delete this event?</span>
                    <button onClick={remove} disabled={saving} className="text-sm font-semibold text-red-600 dark:text-red-400 hover:text-red-800 disabled:opacity-50">Yes, delete</button>
                    <button onClick={() => setConfirmingDelete(false)} className="text-sm text-gray-500 dark:text-gray-400">Cancel</button>
                  </div>
                ) : (<button onClick={() => setConfirmingDelete(true)} className="text-sm text-red-600 dark:text-red-400 hover:text-red-800">Delete</button>))}
              </div>
              <button onClick={save} disabled={saving} className="bg-gradient-to-r from-violet-700 to-purple-600 text-white font-bold px-8 py-2.5 rounded-xl hover:shadow-lg transition-all disabled:opacity-50">{saving ? 'Saving…' : 'Save & publish'}</button>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
