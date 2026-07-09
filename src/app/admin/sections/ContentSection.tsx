'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { SiteContent } from '@/lib/content'

const inputCls =
  'w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none'
const label = 'block text-sm font-medium text-gray-700 mb-1'

export default function ContentSection({ initialContent }: { initialContent: SiteContent }) {
  const router = useRouter()
  const [c, setC] = useState<SiteContent>(initialContent)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  function setHome<K extends keyof SiteContent['home']>(k: K, v: SiteContent['home'][K]) {
    setC(prev => ({ ...prev, home: { ...prev.home, [k]: v } }))
  }
  function setAbout<K extends keyof SiteContent['about']>(k: K, v: SiteContent['about'][K]) {
    setC(prev => ({ ...prev, about: { ...prev.about, [k]: v } }))
  }
  function setStat(i: number, patch: Partial<SiteContent['home']['stats'][number]>) {
    setC(prev => {
      const stats = prev.home.stats.map((s, idx) => (idx === i ? { ...s, ...patch } : s))
      return { ...prev, home: { ...prev.home, stats } }
    })
  }

  async function save() {
    setSaving(true); setError(null); setNotice(null)
    try {
      const res = await fetch('/api/admin/content', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content: c }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) { setError(data.error || 'Could not save.'); return }
      setC(data.content); setNotice('Saved. Live on the site.'); router.refresh()
    } catch { setError('Network error. Please try again.') } finally { setSaving(false) }
  }

  return (
    <div className="max-w-3xl space-y-8">
      {/* Home */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
        <h2 className="font-bold text-gray-900">Homepage — Hero</h2>
        <div><label className={label}>Badge text</label><input value={c.home.heroBadge} onChange={e => setHome('heroBadge', e.target.value)} className={inputCls} /></div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className={label}>Headline line 1</label><input value={c.home.heroTitleLine1} onChange={e => setHome('heroTitleLine1', e.target.value)} className={inputCls} /></div>
          <div><label className={label}>Headline line 2 <span className="text-gray-400 font-normal">(highlighted)</span></label><input value={c.home.heroTitleLine2} onChange={e => setHome('heroTitleLine2', e.target.value)} className={inputCls} /></div>
        </div>
        <div><label className={label}>Subtitle</label><textarea value={c.home.heroSubtitle} onChange={e => setHome('heroSubtitle', e.target.value)} rows={3} className={inputCls} /></div>

        <div>
          <label className={label}>Stats</label>
          <div className="space-y-2">
            {c.home.stats.map((s, i) => (
              <div key={i} className="grid grid-cols-[90px_70px_1fr] gap-2">
                <input value={s.n} onChange={e => setStat(i, { n: Number(e.target.value) || 0 })} inputMode="numeric" placeholder="Number" className={inputCls} />
                <input value={s.suffix} onChange={e => setStat(i, { suffix: e.target.value })} placeholder="+" className={inputCls} />
                <input value={s.label} onChange={e => setStat(i, { label: e.target.value })} placeholder="Label" className={inputCls} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* About */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
        <h2 className="font-bold text-gray-900">About page</h2>
        <div><label className={label}>Hero title</label><input value={c.about.heroTitle} onChange={e => setAbout('heroTitle', e.target.value)} className={inputCls} /></div>
        <div><label className={label}>Hero subtitle</label><textarea value={c.about.heroSubtitle} onChange={e => setAbout('heroSubtitle', e.target.value)} rows={2} className={inputCls} /></div>
        <div><label className={label}>Story heading</label><input value={c.about.storyHeading} onChange={e => setAbout('storyHeading', e.target.value)} className={inputCls} /></div>
        <div>
          <label className={label}>Story paragraphs <span className="text-gray-400 font-normal">— separate with a blank line</span></label>
          <textarea value={c.about.storyParagraphs.join('\n\n')} onChange={e => setAbout('storyParagraphs', e.target.value.split(/\n\s*\n/))} rows={10} className={inputCls} />
        </div>
        <div><label className={label}>CTA title</label><input value={c.about.ctaTitle} onChange={e => setAbout('ctaTitle', e.target.value)} className={inputCls} /></div>
        <div><label className={label}>CTA text</label><textarea value={c.about.ctaText} onChange={e => setAbout('ctaText', e.target.value)} rows={2} className={inputCls} /></div>
      </div>

      {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
      {notice && <p className="text-sm text-green-700 bg-green-50 rounded-lg px-3 py-2">{notice}</p>}

      <div className="flex justify-end">
        <button onClick={save} disabled={saving} className="bg-gradient-to-r from-violet-700 to-purple-600 text-white font-bold px-8 py-2.5 rounded-xl hover:shadow-lg transition-all disabled:opacity-50">
          {saving ? 'Saving…' : 'Save & publish'}
        </button>
      </div>
    </div>
  )
}
