'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const images = [
  { src: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=700&q=75', caption: 'Workshop Session',    category: 'workshops' },
  { src: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=700&q=75', caption: 'Dining Masterclass',   category: 'dining' },
  { src: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=700&q=75', caption: 'Corporate Training',  category: 'corporate' },
  { src: 'https://images.unsplash.com/photo-1519671282429-b44b4eb07a1f?w=700&q=75', caption: 'Graduation Ceremony', category: 'events' },
  { src: 'https://images.unsplash.com/photo-1531545514256-b1400bc00f31?w=700&q=75', caption: 'Teen Finishing School',category: 'workshops' },
  { src: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=700&q=75', caption: 'Personal Branding',   category: 'branding' },
  { src: '/chinenye.jpg', caption: 'Image Consulting',    category: 'branding' },
  { src: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=700&q=75', caption: "Children's Class",    category: 'workshops' },
  { src: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=700&q=75', caption: 'Team Building',       category: 'corporate' },
]

type Cat = 'all' | 'workshops' | 'dining' | 'corporate' | 'events' | 'branding'

export default function GalleryPage() {
  const [filter, setFilter] = useState<Cat>('all')
  const [lightbox, setLightbox] = useState<number | null>(null)

  useEffect(() => {
    const els = document.querySelectorAll('.reveal,.stagger')
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target) } })
    }, { threshold: 0.12 })
    els.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (lightbox === null) return
      if (e.key === 'Escape') setLightbox(null)
      if (e.key === 'ArrowLeft') setLightbox(i => i !== null ? (i - 1 + filtered.length) % filtered.length : null)
      if (e.key === 'ArrowRight') setLightbox(i => i !== null ? (i + 1) % filtered.length : null)
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = lightbox !== null ? 'hidden' : ''
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [lightbox]) // eslint-disable-line react-hooks/exhaustive-deps

  const filtered = images.filter(img => filter === 'all' || img.category === filter)
  const tabs: { key: Cat; label: string }[] = [
    { key: 'all',       label: 'All' },
    { key: 'workshops', label: 'Workshops' },
    { key: 'dining',    label: 'Dining' },
    { key: 'corporate', label: 'Corporate' },
    { key: 'events',    label: 'Events' },
    { key: 'branding',  label: 'Branding' },
  ]

  return (
    <>
      {/* Page hero */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-gray-950 via-violet-950 to-gray-950 overflow-hidden">
        <div className="absolute top-1/3 left-1/3 w-72 h-72 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-2 text-sm text-white/50 mb-6">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>›</span>
            <span className="text-purple-400">Gallery</span>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">Our Gallery</h1>
          <p className="text-white/60 text-lg max-w-xl">Moments of elegance captured — glimpses into our programmes, events, and transformations.</p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10 reveal">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Moments of <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-purple-500">Elegance</span></h2>
            <div className="w-16 h-1 bg-gradient-to-r from-violet-600 to-purple-500 rounded-full mx-auto" />
          </div>

          {/* Filter tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {tabs.map(t => (
              <button key={t.key} onClick={() => { setFilter(t.key); setLightbox(null) }}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${filter === t.key ? 'bg-gradient-to-r from-violet-600 to-purple-500 text-white shadow-lg shadow-violet-500/30' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {t.label}
              </button>
            ))}
          </div>

          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4 stagger">
            {filtered.map((img, i) => (
              <div key={img.src} onClick={() => setLightbox(i)}
                className="break-inside-avoid img-zoom rounded-2xl overflow-hidden relative group cursor-pointer">
                <Image src={img.src} alt={img.caption} width={700} height={500} className="w-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <span className="text-white text-sm font-medium">{img.caption}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox !== null && (
        <div className="lightbox open" onClick={() => setLightbox(null)}>
          <button onClick={() => setLightbox(null)} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30 z-10">✕</button>
          <button onClick={e => { e.stopPropagation(); setLightbox(i => i !== null ? (i - 1 + filtered.length) % filtered.length : null) }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30 z-10">‹</button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={filtered[lightbox].src} alt={filtered[lightbox].caption} style={{ maxWidth: '90vw', maxHeight: '85vh', objectFit: 'contain', borderRadius: '0.5rem' }} onClick={e => e.stopPropagation()} />
          <button onClick={e => { e.stopPropagation(); setLightbox(i => i !== null ? (i + 1) % filtered.length : null) }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30 z-10">›</button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">{filtered[lightbox].caption}</div>
        </div>
      )}
    </>
  )
}
