import { NextRequest, NextResponse } from 'next/server'
import { ADMIN_COOKIE, sessionToken, verifyPassword } from '@/lib/auth'

export async function POST(req: NextRequest) {
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
    return NextResponse.json({ error: 'Incorrect password' }, { status: 401 })
  }

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
