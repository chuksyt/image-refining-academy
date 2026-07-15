import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { deriveCategories } from '@/lib/blog'
import { getAllPosts } from '@/lib/blog-store'

// Posts are stored in Blob and edited live, so render on demand.
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Blog & Articles — Image Refining Academy',
  description: 'Etiquette tips, lifestyle insights, and expert guidance from the coaches at Image Refining Academy.',
  openGraph: {
    title: 'Blog & Articles — Image Refining Academy',
    description: 'Etiquette tips, lifestyle insights, and expert guidance from Image Refining Academy.',
    images: [{ url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1200&q=80' }],
  },
}

export default function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  return <BlogContent searchParamsPromise={searchParams} />
}

async function BlogContent({ searchParamsPromise }: { searchParamsPromise: Promise<{ category?: string }> }) {
  const { category } = await searchParamsPromise
  const activeCategory = category || 'All'
  const allPosts = await getAllPosts()
  const CATEGORIES = deriveCategories(allPosts)
  const featured = allPosts.find(p => p.featured)
  const posts = allPosts.filter(p =>
    (activeCategory === 'All' || p.category === activeCategory) && !p.featured
  )

  return (
    <>
      {/* Page hero */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-gray-950 via-violet-950 to-gray-950 overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-2 text-sm text-white/50 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>›</span>
            <span className="text-purple-400">Blog</span>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">Blog & Articles</h1>
          <p className="text-white/60 text-lg max-w-xl">Etiquette insights, lifestyle tips, and expert guidance — published weekly.</p>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-6">

          {/* Featured post */}
          {featured && activeCategory === 'All' && (
            <Link href={`/blog/${featured.slug}`} className="group block mb-16">
              <div className="grid lg:grid-cols-2 gap-0 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow">
                <div className="img-zoom h-72 lg:h-auto">
                  <Image src={featured.image} alt={featured.title} width={800} height={500} className="w-full h-full object-cover" />
                </div>
                <div className="bg-gradient-to-br from-violet-700 to-purple-700 p-10 flex flex-col justify-center">
                  <span className="inline-block bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wider">Featured</span>
                  <span className="text-purple-200 text-sm mb-2">{featured.category}</span>
                  <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4 group-hover:text-purple-200 transition-colors">{featured.title}</h2>
                  <p className="text-white/70 text-sm leading-relaxed mb-6">{featured.excerpt}</p>
                  <div className="flex items-center gap-3">
                    <Image src={featured.authorAvatar} alt={featured.author} width={36} height={36} className="rounded-full" />
                    <div>
                      <div className="text-white text-sm font-medium">{featured.author}</div>
                      <div className="text-white/50 text-xs">{featured.date} · {featured.readTime}</div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* Category filter */}
          <div className="flex flex-wrap gap-3 mb-10">
            {CATEGORIES.map(cat => (
              <Link
                key={cat}
                href={cat === 'All' ? '/blog' : `/blog?category=${cat}`}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                  activeCategory === cat
                    ? 'bg-gradient-to-r from-violet-600 to-purple-500 text-white shadow-lg shadow-violet-500/30'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {cat}
              </Link>
            ))}
          </div>

          {/* Post grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map(post => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group bg-white dark:bg-gray-900 rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden flex flex-col">
                <div className="img-zoom h-48">
                  <Image src={post.image} alt={post.title} width={600} height={400} className="w-full h-full object-cover" />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <span className="text-violet-600 dark:text-violet-400 text-xs font-semibold mb-2">{post.category}</span>
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors flex-1">{post.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-4 line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                    <Image src={post.authorAvatar} alt={post.author} width={32} height={32} className="rounded-full" />
                    <div>
                      <div className="text-gray-700 dark:text-gray-300 text-xs font-medium">{post.author}</div>
                      <div className="text-gray-400 dark:text-gray-500 text-xs">{post.date} · {post.readTime}</div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {posts.length === 0 && (
            <div className="text-center py-20 text-gray-400 dark:text-gray-500">No posts in this category yet.</div>
          )}
        </div>
      </section>
    </>
  )
}
