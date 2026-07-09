// NOTE: server-only module.
import { readJson, writeJson } from './store'
import { SEED_CONTENT, type SiteContent } from './content'

const KEY = 'content/site.json'

export async function getSiteContent(): Promise<SiteContent> {
  const data = await readJson<SiteContent>(KEY, SEED_CONTENT)
  // Shallow-merge so newly-added fields fall back to seed if an older document
  // is stored.
  return {
    home: { ...SEED_CONTENT.home, ...(data?.home ?? {}) },
    about: { ...SEED_CONTENT.about, ...(data?.about ?? {}) },
  }
}

export async function saveSiteContent(content: SiteContent): Promise<SiteContent> {
  await writeJson(KEY, content)
  return content
}
