import { NextRequest, NextResponse } from 'next/server'
import { ADMIN_COOKIE, sessionToken, verifyPassword } from '@/lib/auth'

// Best-effort in-memory rate limiting. Note: serverless instances don't share
// this map, so it's a speed bump against brute force rather than a hard gate —
// a strong password remains the real protection.
const WINDOW_MS = 15 * 60 * 1000 // 15 minutes
const MAX_ATTEMPTS = 10
const attempts = new Map<string, { count: number; resetAt: number }>()

function clientIp(req: NextRequest): string {
  const fwd = req.headers.get('x-forwarded-for')
  return fwd ? fwd.split(',')[0].trim() : 'unknown'
}

function isBlocked(ip: string): boolean {
  const rec = attempts.get(ip)
  if (!rec || Date.now() > rec.resetAt) return false
  return rec.count >= MAX_ATTEMPTS
}

function recordFailure(ip: string) {
  const now = Date.now()
  const rec = attempts.get(ip)
  if (!rec || now > rec.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS })
  } else {
    rec.count++
  }
}

export async function POST(req: NextRequest) {
  const ip = clientIp(req)
  if (isBlocked(ip)) {
    return NextResponse.json(
      { error: 'Too many attempts. Please try again later.' },
      { status: 429 },
    )
  }

  let password: unknown
  try {
    ({ password } = await req.json())
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const token = sessionToken()
  if (!token) {
    return NextResponse.json(
      { error: 'Editor is not configured. Set BLOG_ADMIN_PASSWORD.' },
      { status: 503 },
    )
  }

  if (typeof password !== 'string' || !verifyPassword(password)) {
    recordFailure(ip)
    return NextResponse.json({ error: 'Incorrect password' }, { status: 401 })
  }

  attempts.delete(ip) // successful login clears the counter
  const res = NextResponse.json({ success: true })
  res.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  })
  return res
}
