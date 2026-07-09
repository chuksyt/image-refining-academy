import { NextResponse } from 'next/server'
import { getAllIntakes } from '@/lib/intakes-store'

// Public, read-only list of upcoming intakes/events.
export async function GET() {
  const intakes = await getAllIntakes()
  return NextResponse.json({ intakes })
}
