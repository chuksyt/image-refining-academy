// NOTE: server-only module. Handles the shared-password director session.
import { cookies } from 'next/headers'
import crypto from 'node:crypto'

export const ADMIN_COOKIE = 'ira_admin'
// Bump this to invalidate all existing sessions.
const TOKEN_NAMESPACE = 'image-refining-admin-v1'

/**
 * The session token is an HMAC derived from the configured password. It never
 * contains the password itself, and rotating the password automatically
 * invalidates every previously-issued cookie. Returns null when no password is
 * configured (feature effectively disabled).
 */
export function sessionToken(): string | null {
  const pw = process.env.BLOG_ADMIN_PASSWORD
  if (!pw) return null
  return crypto.createHmac('sha256', pw).update(TOKEN_NAMESPACE).digest('hex')
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a)
  const bb = Buffer.from(b)
  if (ab.length !== bb.length) return false
  return crypto.timingSafeEqual(ab, bb)
}

/** Validate a submitted password against BLOG_ADMIN_PASSWORD (constant-time). */
export function verifyPassword(input: string): boolean {
  const pw = process.env.BLOG_ADMIN_PASSWORD
  if (!pw || typeof input !== 'string') return false
  return safeEqual(input, pw)
}

/** True when the current request carries a valid director session cookie. */
export async function isAuthed(): Promise<boolean> {
  const expected = sessionToken()
  if (!expected) return false
  const store = await cookies()
  const value = store.get(ADMIN_COOKIE)?.value
  if (!value) return false
  return safeEqual(value, expected)
}
