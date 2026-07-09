import { NextResponse } from 'next/server'
import { getSiteContent } from '@/lib/content-store'

// Public, read-only site copy (home/about).
export async function GET() {
  const content = await getSiteContent()
  return NextResponse.json({ content })
}
