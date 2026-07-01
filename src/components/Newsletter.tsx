'use client'
import { useState } from 'react'

export default function Newsletter() {
  const [email, setEmail]   = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      setStatus(res.ok ? 'success' : 'error')
    } catch {
      setStatus('error')
    }
  }

  return (
    <section className="py-20 bg-gradient-to-br from-violet-700 to-purple-700">
      <div className="max-w-2xl mx-auto px-6 text-center">
        <div className="text-purple-200 font-semibold text-sm mb-3 uppercase tracking-wider">Stay Inspired</div>
        <h2 className="text-3xl font-bold text-white mb-4">
          Get Weekly Elegance Tips in Your Inbox
        </h2>
        <p className="text-white/70 mb-8">
          Join 500+ subscribers receiving etiquette insights, course updates, and exclusive early-bird offers — delivered every Tuesday.
        </p>

        {status === 'success' ? (
          <div className="bg-white/15 backdrop-blur rounded-2xl p-6 text-white">
            <div className="text-3xl mb-2">🎉</div>
            <div className="font-bold text-lg mb-1">You&apos;re on the list!</div>
            <div className="text-white/80 text-sm">Check your inbox for a welcome message from us.</div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className="flex-1 bg-white/15 backdrop-blur border border-white/30 text-white placeholder-white/50 rounded-full px-5 py-3 text-sm focus:outline-none focus:border-white focus:bg-white/20 transition-all"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="bg-white text-violet-700 font-bold px-7 py-3 rounded-full hover:shadow-lg hover:scale-105 transition-all disabled:opacity-60 whitespace-nowrap text-sm"
            >
              {status === 'loading' ? 'Joining…' : 'Subscribe Free'}
            </button>
          </form>
        )}

        {status === 'error' && (
          <p className="text-red-300 text-sm mt-3">Something went wrong. Please try again.</p>
        )}

        <p className="text-white/40 text-xs mt-4">No spam. Unsubscribe anytime.</p>
      </div>
    </section>
  )
}
