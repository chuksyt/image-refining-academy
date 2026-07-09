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

  const stats: HomeStat[] = Array.isArray(home.stats)
    ? home.stats.map(s => {
        const o = s as Record<string, unknown>
        return {
          n: Number(o.n) || 0,
          suffix: str(o.suffix),
          label: str(o.label),
        }
      })
    : SEED_CONTENT.home.stats

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
    await saveSiteContent(content)
    refresh('/', '/about')
    return NextResponse.json({ content })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 })
  }
}
