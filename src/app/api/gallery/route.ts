import { NextResponse } from 'next/server'
import { getGallery } from '@/lib/gallery-store'

// Public, read-only gallery list.
export async function GET() {
  const items = await getGallery()
  return NextResponse.json({ items })
}
