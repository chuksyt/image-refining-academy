'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { BlogPost } from '@/lib/blog'

interface Draft {
  slug: string
  title: string
  excerpt: string
  contentText: string
  category: string
  author: string
  authorRole: string
  authorAvatar: string
  date: string
  readTime: string
  image: string
  featured: boolean
}

function todayLong() {
  return new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

function emptyDraft(): Draft {
  return {
    slug: '', title: '', excerpt: '', contentText: '', category: '',
    author: 'Chinenye Nmerole', authorRole: 'Founder & Lead Coach', authorAvatar: '/chinenye2.jpg',
    date: todayLong(), readTime: '4 min read', image: '', featured: false,
  }
}

function draftFromPost(post: BlogPost): Draft {
  return {
    slug: post.slug, title: post.title, excerpt: post.excerpt,
    contentText: post.content.join('\n\n'), category: post.category,
    author: post.author, authorRole: post.authorRole, authorAvatar: post.authorAvatar,
    date: post.date, readTime: post.readTime, image: post.image, featured: Boolean(post.featured),
  }
}

function slugify(title: string) {
  return title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

const inputCls =
  'w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none'

export default function BlogSection({ initialPosts }: { initialPosts: BlogPost[] }) {
  const router = useRouter()
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts)
  const [draft, setDraft] = useState<Draft | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [originalSlug, setOriginalSlug] = useState<string | undefined>(undefined)
  const [slugTouched, setSlugTouched] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [confirmingDelete, setConfirmingDelete] = useState(false)

  function set<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft(d => (d ? { ...d, [key]: value } : d))
  }

  function openNew() {
    setDraft(emptyDraft()); setIsNew(true); setOriginalSlug(undefined)
    setSlugTouched(false); setError(null); setNotice(null); setConfirmingDelete(false)
  }
  function openEdit(post: BlogPost) {
    setDraft(draftFromPost(post)); setIsNew(false); setOriginalSlug(post.slug)
    setSlugTouched(true); setError(null); setNotice(null); setConfirmingDelete(false)
  }
  function onTitleChange(value: string) {
    setDraft(d => {
      if (!d) return d
      const next = { ...d, title: value }
      if (isNew && !slugTouched) next.slug = slugify(value)
      return next
    })
  }

  async function save() {
    if (!draft) return
    setSaving(true); setError(null); setNotice(null)
    try {
      const post = {
        slug: draft.slug, title: draft.title, excerpt: draft.excerpt, content: draft.contentText,
        category: draft.category, author: draft.author, authorRole: draft.authorRole,
        authorAvatar: draft.authorAvatar, date: draft.date, readTime: draft.readTime,
        image: draft.image, featured: draft.featured,
      }
      const res = await fetch('/api/admin/posts', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ post, originalSlug }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) { setError(data.error || 'Could not save.'); return }
      setPosts(data.posts); setIsNew(false); setOriginalSlug(draft.slug); setSlugTouched(true)
      setNotice('Saved. Changes are live on the blog.'); router.refresh()
    } catch { setError('Network error. Please try again.') } finally { setSaving(false) }
  }

  async function remove() {
    if (!originalSlug) return
    setSaving(true); setError(null)
    try {
      const res = await fetch(`/api/admin/posts?slug=${encodeURIComponent(originalSlug)}`, { method: 'DELETE' })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) { setError(data.error || 'Could not delete.'); return }
      setPosts(data.posts); setDraft(null); setConfirmingDelete(false)
      setNotice('Post deleted.'); router.refresh()
    } catch { setError('Network error. Please try again.') } finally { setSaving(false) }
  }

  return (
    <div className="grid lg:grid-cols-[300px_1fr] gap-8">
      <aside>
        <button onClick={openNew} className="w-full mb-4 bg-gradient-to-r from-violet-700 to-purple-600 text-white font-semibold py-2.5 rounded-xl hover:shadow-lg transition-all">
          ＋ New post
        </button>
        <div className="space-y-2">
          {posts.map(post => (
            <button key={post.slug} onClick={() => openEdit(post)}
              className={`w-full text-left rounded-xl px-4 py-3 border transition-colors ${originalSlug === post.slug && !isNew ? 'border-violet-400 bg-violet-50' : 'border-gray-200 bg-white hover:border-violet-300'}`}>
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900 text-sm line-clamp-1">{post.title}</span>
                {post.featured && <span className="text-[10px] font-bold text-violet-600 bg-violet-100 px-1.5 py-0.5 rounded-full flex-shrink-0">FEATURED</span>}
              </div>
              <div className="text-xs text-gray-400 mt-0.5">{post.category} · {post.date}</div>
            </button>
          ))}
          {posts.length === 0 && <p className="text-sm text-gray-400 text-center py-8">No posts yet.</p>}
        </div>
      </aside>

      <section>
        {!draft ? (
          <div className="bg-white border border-dashed border-gray-300 rounded-2xl p-16 text-center text-gray-400">
            Select a post to edit, or create a new one.
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-gray-900">{isNew ? 'New post' : 'Edit post'}</h2>
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input type="checkbox" checked={draft.featured} onChange={e => set('featured', e.target.checked)} className="rounded border-gray-300 text-violet-600 focus:ring-violet-500" />
                Featured post
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input value={draft.title} onChange={e => onTitleChange(e.target.value)} className={inputCls} />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug <span className="text-gray-400 font-normal">(URL)</span></label>
                <input value={draft.slug} onChange={e => { setSlugTouched(true); set('slug', e.target.value) }} className={inputCls} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <input value={draft.category} onChange={e => set('category', e.target.value)} className={inputCls} list="cat-list" />
                <datalist id="cat-list">{[...new Set(posts.map(p => p.category))].map(c => <option key={c} value={c} />)}</datalist>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
              <textarea value={draft.excerpt} onChange={e => set('excerpt', e.target.value)} rows={2} className={inputCls} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Content <span className="text-gray-400 font-normal">— separate paragraphs with a blank line</span></label>
              <textarea value={draft.contentText} onChange={e => set('contentText', e.target.value)} rows={16} className={`${inputCls} font-mono leading-relaxed`} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cover image URL <span className="text-gray-400 font-normal">(or a path like /chinenye2.jpg)</span></label>
              <input value={draft.image} onChange={e => set('image', e.target.value)} className={inputCls} />
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Author</label><input value={draft.author} onChange={e => set('author', e.target.value)} className={inputCls} /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Author role</label><input value={draft.authorRole} onChange={e => set('authorRole', e.target.value)} className={inputCls} /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Author avatar URL</label><input value={draft.authorAvatar} onChange={e => set('authorAvatar', e.target.value)} className={inputCls} /></div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Date</label><input value={draft.date} onChange={e => set('date', e.target.value)} className={inputCls} /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Read time</label><input value={draft.readTime} onChange={e => set('readTime', e.target.value)} className={inputCls} /></div>
            </div>

            {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
            {notice && <p className="text-sm text-green-700 bg-green-50 rounded-lg px-3 py-2">{notice}</p>}

            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <div>
                {!isNew && (confirmingDelete ? (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Delete this post?</span>
                    <button onClick={remove} disabled={saving} className="text-sm font-semibold text-red-600 hover:text-red-800 disabled:opacity-50">Yes, delete</button>
                    <button onClick={() => setConfirmingDelete(false)} className="text-sm text-gray-500">Cancel</button>
                  </div>
                ) : (
                  <button onClick={() => setConfirmingDelete(true)} className="text-sm text-red-600 hover:text-red-800">Delete</button>
                ))}
              </div>
              <button onClick={save} disabled={saving} className="bg-gradient-to-r from-violet-700 to-purple-600 text-white font-bold px-8 py-2.5 rounded-xl hover:shadow-lg transition-all disabled:opacity-50">
                {saving ? 'Saving…' : 'Save & publish'}
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
