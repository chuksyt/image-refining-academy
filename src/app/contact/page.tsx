'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

export default function ContactPage() {
  const formRef = useRef<HTMLFormElement>(null)
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  useEffect(() => {
    const els = document.querySelectorAll('.reveal,.reveal-left,.reveal-right,.stagger')
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target) } })
    }, { threshold: 0.12 })
    els.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!formRef.current) return
    setStatus('sending')
    const data = new FormData(formRef.current)
    const body = Object.fromEntries(data.entries())
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      if (res.ok) { setStatus('sent'); formRef.current.reset() }
      else setStatus('error')
    } catch { setStatus('error') }
  }

  return (
    <>
      {/* Page hero */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-gray-950 via-violet-950 to-gray-950 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-violet-600/20 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-2 text-sm text-white/50 mb-6">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>›</span>
            <span className="text-purple-400">Contact</span>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">Get In Touch</h1>
          <p className="text-white/60 text-lg max-w-xl">We&apos;d love to hear from you. Reach out and we&apos;ll respond as soon as possible.</p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-16">
          {/* Info */}
          <div className="reveal-left">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Let&apos;s Start a <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-purple-500">Conversation</span></h2>
            <p className="text-gray-600 leading-relaxed mb-10">Whether you have a question about our courses, want to enroll a group, or simply want to learn more about our programmes, our team is ready to assist you.</p>

            <div className="space-y-6 mb-10">
              {[
                { icon: 'fa-phone', label: 'Phone', value: '+234 803 726 9408' },
                { icon: 'fa-envelope', label: 'Email', value: 'imagerefining7@gmail.com' },
                { icon: 'fa-clock', label: 'Working Hours', value: 'Monday – Friday, 9am – 5pm' },
                { icon: 'fa-location-dot', label: 'Location', value: 'Nigeria (Online & In-Person)' },
              ].map(item => (
                <div key={item.label} className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center flex-shrink-0">
                    <i className={`fa-solid ${item.icon} text-violet-600`} />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">{item.label}</div>
                    <div className="text-gray-500 text-sm mt-0.5">{item.value}</div>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <div className="font-semibold text-gray-900 mb-3 text-sm">Follow Us</div>
              <div className="flex gap-3">
                {[
                  { icon: 'facebook-f', href: 'https://facebook.com/chinenye.nmerole' },
                  { icon: 'instagram',  href: 'https://www.instagram.com/image_refining_academy/' },
                  { icon: 'tiktok',     href: 'https://www.tiktok.com/@chinenye.nmerole?lang=en' },
                ].map(s => (
                  <a key={s.icon} href={s.href} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-violet-500 hover:text-violet-600 transition-colors text-sm">
                    <i className={`fab fa-${s.icon}`} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="reveal-right">
            <div className="bg-gray-50 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Send Us a Message</h3>

              {status === 'sent' ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                  <div className="text-3xl mb-2">✅</div>
                  <h4 className="font-bold text-green-900 mb-1">Message Sent!</h4>
                  <p className="text-green-700 text-sm">We&apos;ll get back to you within 24 hours.</p>
                  <button onClick={() => setStatus('idle')} className="mt-4 text-sm text-green-700 underline">Send another message</button>
                </div>
              ) : (
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    {[{ name:'name', label:'Full Name', type:'text', placeholder:'Chidinma Okafor' },
                      { name:'email', label:'Email', type:'email', placeholder:'you@example.com' }].map(f => (
                      <div key={f.name}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{f.label} <span className="text-red-500">*</span></label>
                        <input name={f.name} type={f.type} placeholder={f.placeholder} required className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white" />
                      </div>
                    ))}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input name="phone" type="tel" placeholder="+234 803 726 9408" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject <span className="text-red-500">*</span></label>
                    <select name="subject" required className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white text-gray-700">
                      <option value="">Select a subject…</option>
                      <option>Course Enquiry</option>
                      <option>Group / Corporate Booking</option>
                      <option>Payment Issue</option>
                      <option>General Question</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message <span className="text-red-500">*</span></label>
                    <textarea name="message" rows={5} placeholder="Tell us how we can help…" required className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none bg-white" />
                  </div>
                  {status === 'error' && (
                    <p className="text-red-500 text-sm">Something went wrong. Please try again or email us directly.</p>
                  )}
                  <button type="submit" disabled={status === 'sending'} className="w-full bg-gradient-to-r from-violet-600 to-purple-500 text-white font-semibold py-3 rounded-xl hover:shadow-lg hover:shadow-violet-500/30 transition-all disabled:opacity-60">
                    {status === 'sending' ? 'Sending…' : '✉ Send Message'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
