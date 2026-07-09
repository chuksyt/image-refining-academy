import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getAllPosts, getPost } from '@/lib/blog-store'
import ShareButtons from './ShareButtons'

interface Props { params: Promise<{ slug: string }> }

// Posts are stored in Blob and edited live, so render on demand.
export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return {}
  return {
    title: `${post.title} — Image Refining Academy`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [{ url: post.image }],
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const posts = await getAllPosts()
  const post = posts.find(p => p.slug === slug)
  if (!post) notFound()

  const related = posts.filter(p => p.slug !== post.slug && p.category === post.category).slice(0, 3)

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-0 bg-gradient-to-br from-gray-950 via-violet-950 to-gray-950 overflow-hidden">
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 pb-16">
          <div className="flex items-center gap-2 text-sm text-white/50 mb-6">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>›</span>
            <Link href="/blog" className="hover:text-white">Blog</Link>
            <span>›</span>
            <span className="text-purple-400 truncate max-w-[200px]">{post.category}</span>
          </div>
          <span className="inline-block bg-white/10 text-purple-300 text-xs font-semibold px-3 py-1 rounded-full mb-4">{post.category}</span>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">{post.title}</h1>
          <div className="flex items-center gap-4">
            <Image src={post.authorAvatar} alt={post.author} width={44} height={44} className="rounded-full" />
            <div>
              <div className="text-white font-medium">{post.author}</div>
              <div className="text-white/50 text-sm">{post.authorRole} · {post.date} · {post.readTime}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Cover image */}
      <div className="max-w-4xl mx-auto px-6 -mt-6">
        <div className="rounded-2xl overflow-hidden shadow-2xl">
          <Image src={post.image} alt={post.title} width={1200} height={600} className="w-full h-72 lg:h-96 object-cover" />
        </div>
      </div>

      {/* Content */}
      <article className="max-w-3xl mx-auto px-6 py-16">
        <p className="text-xl text-gray-600 leading-relaxed mb-8 font-medium border-l-4 border-violet-500 pl-5">
          {post.excerpt}
        </p>
        <div className="space-y-6">
          {post.content.map((para, i) => (
            <p key={i} className="text-gray-700 leading-relaxed text-lg">{para}</p>
          ))}
        </div>

        <ShareButtons title={post.title} />

        {/* Author card */}
        <div className="mt-10 bg-violet-50 rounded-2xl p-6 flex items-start gap-5">
          <Image src={post.authorAvatar} alt={post.author} width={60} height={60} className="rounded-full flex-shrink-0" />
          <div>
            <div className="font-bold text-gray-900">{post.author}</div>
            <div className="text-violet-600 text-sm mb-2">{post.authorRole}</div>
            <p className="text-gray-600 text-sm leading-relaxed">Chinenye Nmerole is a distinguished etiquette consultant and image coach with over a decade of experience transforming individuals and organisations across Africa and beyond.</p>
          </div>
        </div>
      </article>

      {/* Related posts */}
      {related.length > 0 && (
        <section className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">More in {post.category}</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map(p => (
                <Link key={p.slug} href={`/blog/${p.slug}`} className="group bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                  <div className="img-zoom h-44">
                    <Image src={p.image} alt={p.title} width={600} height={300} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-5">
                    <span className="text-violet-600 text-xs font-semibold">{p.category}</span>
                    <h4 className="font-bold text-gray-900 mt-1 group-hover:text-violet-600 transition-colors">{p.title}</h4>
                    <p className="text-gray-400 text-xs mt-2">{p.date} · {p.readTime}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-white py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="bg-gradient-to-r from-violet-700 to-purple-600 rounded-3xl p-10 shadow-xl">
            <h3 className="text-2xl font-bold text-white mb-3">Ready to put this into practice?</h3>
            <p className="text-white/80 mb-6">Join one of our courses and learn with expert guidance in a live setting.</p>
            <Link href="/courses" className="bg-white text-violet-700 font-bold px-8 py-3 rounded-full hover:shadow-lg transition-all inline-block">
              View Our Courses →
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
