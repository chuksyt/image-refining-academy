// NOTE: server-only module.
import { readJson, writeJson } from './store'
import { COURSES, type Course } from './courses'

const KEY = 'courses/courses.json'

export async function getAllCourses(): Promise<Course[]> {
  const data = await readJson<Course[]>(KEY, COURSES)
  return Array.isArray(data) ? data : COURSES
}

export async function getCourse(key: string): Promise<Course | undefined> {
  return (await getAllCourses()).find(c => c.key === key)
}

export async function upsertCourse(
  course: Course,
  originalKey?: string,
): Promise<Course[]> {
  const courses = await getAllCourses()
  const matchKey = originalKey ?? course.key
  const idx = courses.findIndex(c => c.key === matchKey)

  const collision = courses.findIndex(c => c.key === course.key)
  if (collision !== -1 && collision !== idx) {
    throw new Error(`A different programme already uses the key "${course.key}".`)
  }

  const next = [...courses]
  if (idx === -1) next.push(course)
  else next[idx] = course

  await writeJson(KEY, next)
  return next
}

export async function deleteCourse(key: string): Promise<Course[]> {
  const courses = await getAllCourses()
  const next = courses.filter(c => c.key !== key)
  await writeJson(KEY, next)
  return next
}
