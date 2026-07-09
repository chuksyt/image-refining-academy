import { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/blog-store'

const BASE_URL = 'https://imagerefiningacademy.vercel.app'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blogPosts = await getAllPosts()
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL,             lastModified: new Date(), changeFrequency: 'weekly',  priority: 1 },
    { url: `${BASE_URL}/about`,  lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/courses`,lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${BASE_URL}/gallery`,lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/contact`,lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.7 },
    { url: `${BASE_URL}/blog`,   lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.8 },
  ]

  const blogRoutes: MetadataRoute.Sitemap = blogPosts.map(post => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [...staticRoutes, ...blogRoutes]
}
