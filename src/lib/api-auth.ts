import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { isAuthed } from './auth'

/** Returns a 401 response when the request lacks a valid director session. */
export async function requireAuth(): Promise<NextResponse | null> {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return null
}

/** Revalidate the given public routes after a content mutation. */
export function refresh(...paths: string[]) {
  for (const p of paths) revalidatePath(p)
}
