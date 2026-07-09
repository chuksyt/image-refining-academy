import { NextRequest, NextResponse } from 'next/server'
import { requireAuth, refresh } from '@/lib/api-auth'
import { deleteIntake, getAllIntakes, upsertIntake } from '@/lib/intakes-store'
import type { Intake } from '@/lib/intakes'

const CATEGORIES = ['children', 'teen', 'adult', 'online']

function parseIntake(body: unknown): Intake {
  if (typeof body !== 'object' || body === null) throw new Error('Invalid data')
  const b = body as Record<string, unknown>

  const id = String(b.id ?? '').trim()
  if (!id) throw new Error('Missing intake id.')
  const courseName = String(b.courseName ?? '').trim()
  if (!courseName) throw new Error('Programme name is required.')

  const category = String(b.category ?? '')
  if (!CATEGORIES.includes(category)) {
    throw new Error('Category must be one of: children, teen, adult, online.')
  }

  const spotsTotal = Number(b.spotsTotal)
  const spotsLeft = Number(b.spotsLeft)
  if (!Number.isFinite(spotsTotal) || !Number.isFinite(spotsLeft)) {
    throw new Error('Spots must be numbers.')
  }

  return {
    id,
    courseKey: String(b.courseKey ?? '').trim(),
    courseName,
    date: String(b.date ?? '').trim(),
    isoDate: String(b.isoDate ?? '').trim(),
    format: String(b.format ?? '').trim(),
    duration: String(b.duration ?? '').trim(),
    spotsTotal,
    spotsLeft,
    price: String(b.price ?? '').trim(),
    category: category as Intake['category'],
    rolling: Boolean(b.rolling),
  }
}

export async function GET() {
  const unauth = await requireAuth()
  if (unauth) return unauth
  return NextResponse.json({ intakes: await getAllIntakes() })
}

export async function PUT(req: NextRequest) {
  const unauth = await requireAuth()
  if (unauth) return unauth
  let payload: { intake?: unknown }
  try {
    payload = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
  try {
    const intake = parseIntake(payload.intake)
    const intakes = await upsertIntake(intake)
    refresh('/', '/courses')
    return NextResponse.json({ intakes })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 })
  }
}

export async function DELETE(req: NextRequest) {
  const unauth = await requireAuth()
  if (unauth) return unauth
  const id = req.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  const intakes = await deleteIntake(id)
  refresh('/', '/courses')
  return NextResponse.json({ intakes })
}
