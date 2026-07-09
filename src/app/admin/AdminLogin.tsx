'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin({ configured }: { configured: boolean }) {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (res.ok) {
        router.refresh()
        return
      }
      const data = await res.json().catch(() => ({}))
      setError(data.error || 'Login failed')
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-violet-950 to-gray-950 px-6">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Site Editor</h1>
        <p className="text-gray-500 text-sm mb-6">Director access only.</p>

        {!configured ? (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-xl p-4">
            The editor isn&apos;t configured yet. Set the{' '}
            <code className="font-mono">BLOG_ADMIN_PASSWORD</code> environment
            variable to enable it.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoFocus
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none"
                placeholder="Enter director password"
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={loading || !password}
              className="w-full bg-gradient-to-r from-violet-700 to-purple-600 text-white font-bold py-3 rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        )}
      </div>
    </main>
  )
}
