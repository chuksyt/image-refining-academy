import { NextRequest, NextResponse } from 'next/server'
import { requireAuth, refresh } from '@/lib/api-auth'
import { getSiteContent, saveSiteContent } from '@/lib/content-store'
import { SEED_CONTENT, type SiteContent, type HomeStat, type AboutValue, type Milestone } from '@/lib/content'

function str(v: unknown, fallback = ''): string {
  return typeof v === 'string' ? v : fallback
}

function parseContent(body: unknown): SiteContent {
  const b = (body ?? {}) as Record<string, unknown>
  const home = (b.home ?? {}) as Record<string, unknown>
  const about = (b.about ?? {}) as Record<string, unknown>

  const parseStats = (val: unknown, fallback: HomeStat[]): HomeStat[] =>
    Array.isArray(val)
      ? val.map(s => {
          const o = s as Record<string, unknown>
          return { n: Number(o.n) || 0, suffix: str(o.suffix), label: str(o.label) }
        })
      : fallback

  const stats = parseStats(home.stats, SEED_CONTENT.home.stats)
  const impactStats = parseStats(home.impactStats, SEED_CONTENT.home.impactStats)

  const storyParagraphs = Array.isArray(about.storyParagraphs)
    ? about.storyParagraphs.map(p => str(p)).filter(p => p.trim() !== '')
    : SEED_CONTENT.about.storyParagraphs

  const values: AboutValue[] = Array.isArray(about.values)
    ? about.values.map(v => {
        const o = v as Record<string, unknown>
        return { icon: str(o.icon), title: str(o.title), desc: str(o.desc) }
      }).filter(v => v.title.trim() !== '' || v.desc.trim() !== '')
    : SEED_CONTENT.about.values

  const milestones: Milestone[] = Array.isArray(about.milestones)
    ? about.milestones.map(m => {
        const o = m as Record<string, unknown>
        return { year: str(o.year), title: str(o.title), desc: str(o.desc) }
      }).filter(m => m.title.trim() !== '' || m.desc.trim() !== '')
    : SEED_CONTENT.about.milestones

  return {
    home: {
      heroBadge: str(home.heroBadge, SEED_CONTENT.home.heroBadge),
      heroTitleLine1: str(home.heroTitleLine1, SEED_CONTENT.home.heroTitleLine1),
      heroTitleLine2: str(home.heroTitleLine2, SEED_CONTENT.home.heroTitleLine2),
      heroSubtitle: str(home.heroSubtitle, SEED_CONTENT.home.heroSubtitle),
      stats,
      impactStats,
    },
    about: {
      heroTitle: str(about.heroTitle, SEED_CONTENT.about.heroTitle),
      heroSubtitle: str(about.heroSubtitle, SEED_CONTENT.about.heroSubtitle),
      storyHeading: str(about.storyHeading, SEED_CONTENT.about.storyHeading),
      storyParagraphs,
      values,
      milestones,
      ctaTitle: str(about.ctaTitle, SEED_CONTENT.about.ctaTitle),
      ctaText: str(about.ctaText, SEED_CONTENT.about.ctaText),
    },
  }
}

/**
 * Guard against accidental junk (e.g. a stray keystroke saved as a one-letter
 * hero title). Throws with a human-readable message the editor surfaces; the
 * PUT handler turns it into a 400 so nothing is written.
 */
function validateContent(c: SiteContent): void {
  const problems: string[] = []
  const minLen = (name: string, val: string, min: number) => {
    if (val.trim().length < min) problems.push(`${name} must be at least ${min} characters.`)
  }

  minLen('Homepage badge', c.home.heroBadge, 3)
  minLen('Headline line 1', c.home.heroTitleLine1, 3)
  minLen('Headline line 2', c.home.heroTitleLine2, 3)
  minLen('Hero subtitle', c.home.heroSubtitle, 10)

  if (c.home.stats.length < 1) problems.push('Add at least one hero stat.')
  c.home.stats.forEach((s, i) => {
    if (s.label.trim() === '') problems.push(`Hero stat ${i + 1} needs a label.`)
  })

  minLen('About hero title', c.about.heroTitle, 2)

  if (problems.length) throw new Error(problems.join(' '))
}

export async function GET() {
  const unauth = await requireAuth()
  if (unauth) return unauth
  return NextResponse.json({ content: await getSiteContent() })
}

export async function PUT(req: NextRequest) {
  const unauth = await requireAuth()
  if (unauth) return unauth
  let payload: { content?: unknown }
  try {
    payload = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
  try {
    const content = parseContent(payload.content)
    validateContent(content)
    await saveSiteContent(content)
    refresh('/', '/about')
    return NextResponse.json({ content })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 })
  }
}
