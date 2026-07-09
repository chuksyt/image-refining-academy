import { NextRequest, NextResponse } from 'next/server'
import { requireAuth, refresh } from '@/lib/api-auth'
import { deleteCourse, getAllCourses, upsertCourse } from '@/lib/courses-store'
import type { Course } from '@/lib/courses'

const CATEGORIES = ['children', 'teen', 'adult', 'online']

function parseCourse(body: unknown): Course {
  if (typeof body !== 'object' || body === null) throw new Error('Invalid data')
  const b = body as Record<string, unknown>

  const key = String(b.key ?? '').trim().toLowerCase()
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(key)) {
    throw new Error('Key must contain only lowercase letters, numbers and hyphens.')
  }
  const name = String(b.name ?? '').trim()
  if (!name) throw new Error('Programme name is required.')

  const category = String(b.category ?? '')
  if (!CATEGORIES.includes(category)) {
    throw new Error('Category must be one of: children, teen, adult, online.')
  }

  const price = Number(b.price)
  if (!Number.isFinite(price) || price < 0) throw new Error('Price must be a number (in kobo).')

  const features = Array.isArray(b.features)
    ? b.features.map(f => String(f).trim()).filter(Boolean)
    : String(b.features ?? '').split('\n').map(f => f.trim()).filter(Boolean)

  return {
    key,
    name,
    tag: String(b.tag ?? '').trim(),
    category: category as Course['category'],
    description: String(b.description ?? '').trim(),
    features,
    price,
    priceDisplay: String(b.priceDisplay ?? '').trim(),
    duration: String(b.duration ?? '').trim(),
    image: String(b.image ?? '').trim(),
    popular: Boolean(b.popular),
  }
}

export async function GET() {
  const unauth = await requireAuth()
  if (unauth) return unauth
  return NextResponse.json({ courses: await getAllCourses() })
}

export async function PUT(req: NextRequest) {
  const unauth = await requireAuth()
  if (unauth) return unauth
  let payload: { course?: unknown; originalKey?: unknown }
  try {
    payload = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
  try {
    const course = parseCourse(payload.course)
    const originalKey = typeof payload.originalKey === 'string' ? payload.originalKey : undefined
    const courses = await upsertCourse(course, originalKey)
    refresh('/', '/courses')
    return NextResponse.json({ courses })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 })
  }
}

export async function DELETE(req: NextRequest) {
  const unauth = await requireAuth()
  if (unauth) return unauth
  const key = req.nextUrl.searchParams.get('key')
  if (!key) return NextResponse.json({ error: 'Missing key' }, { status: 400 })
  const courses = await deleteCourse(key)
  refresh('/', '/courses')
  return NextResponse.json({ courses })
}
