import { NextResponse } from 'next/server'
import { getAllCourses } from '@/lib/courses-store'

// Public, read-only list of courses (used by client components).
export async function GET() {
  const courses = await getAllCourses()
  return NextResponse.json({ courses })
}
