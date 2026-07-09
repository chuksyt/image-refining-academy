// NOTE: server-only module.
import { readJson, writeJson } from './store'
import { INTAKES, type Intake } from './intakes'

const KEY = 'events/intakes.json'

export async function getAllIntakes(): Promise<Intake[]> {
  const data = await readJson<Intake[]>(KEY, INTAKES)
  return Array.isArray(data) ? data : INTAKES
}

export async function upsertIntake(intake: Intake): Promise<Intake[]> {
  const intakes = await getAllIntakes()
  const idx = intakes.findIndex(i => i.id === intake.id)
  const next = [...intakes]
  if (idx === -1) next.push(intake)
  else next[idx] = intake
  await writeJson(KEY, next)
  return next
}

export async function deleteIntake(id: string): Promise<Intake[]> {
  const intakes = await getAllIntakes()
  const next = intakes.filter(i => i.id !== id)
  await writeJson(KEY, next)
  return next
}
