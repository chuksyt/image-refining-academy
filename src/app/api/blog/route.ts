import { NextResponse } from 'next/server'
import { getAllPosts } from '@/lib/blog-store'

// Public, read-only feed of blog posts. Used by the homepage teaser (a client
// component) so it reflects the director's live edits. Blog content is public,
// so returning it here exposes nothing sensitive.
export async function GET() {
  const posts = await getAllPosts()
  return NextResponse.json({ posts })
}
