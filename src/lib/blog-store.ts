// NOTE: server-only module. Imported exclusively by server components and route
// handlers — never by client components.
import { readJson, writeJson } from './store'
import { SEED_POSTS, type BlogPost } from './blog'

const KEY = 'blog/posts.json'

/** Read every post. Falls back to the built-in SEED_POSTS when none saved yet. */
export async function getAllPosts(): Promise<BlogPost[]> {
  const data = await readJson<BlogPost[]>(KEY, SEED_POSTS)
  return Array.isArray(data) ? data : SEED_POSTS
}

export async function getPost(slug: string): Promise<BlogPost | undefined> {
  const posts = await getAllPosts()
  return posts.find(p => p.slug === slug)
}

/**
 * Create or update a post. `originalSlug` identifies the post being edited when
 * its slug is being changed; omit it for new posts or in-place edits.
 */
export async function upsertPost(
  post: BlogPost,
  originalSlug?: string,
): Promise<BlogPost[]> {
  const posts = await getAllPosts()
  const matchSlug = originalSlug ?? post.slug
  const idx = posts.findIndex(p => p.slug === matchSlug)

  // Guard against a slug collision with a *different* post.
  const collision = posts.findIndex(p => p.slug === post.slug)
  if (collision !== -1 && collision !== idx) {
    throw new Error(`A different post already uses the slug "${post.slug}".`)
  }

  const next = [...posts]
  if (idx === -1) next.unshift(post)
  else next[idx] = post

  await writeJson(KEY, next)
  return next
}

export async function deletePost(slug: string): Promise<BlogPost[]> {
  const posts = await getAllPosts()
  const next = posts.filter(p => p.slug !== slug)
  await writeJson(KEY, next)
  return next
}
