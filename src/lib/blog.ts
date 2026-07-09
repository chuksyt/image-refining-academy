export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  content: string[]
  category: string
  author: string
  authorRole: string
  authorAvatar: string
  date: string
  readTime: string
  image: string
  featured?: boolean
}

// SEED_POSTS is the built-in default content. It is used as the fallback when
// no posts have been saved to Blob storage yet (e.g. before the first edit, or
// in local dev without a Blob token). Server-side reads/writes live in
// `src/lib/blog-store.ts`. This file stays free of server-only imports so it can
// be safely imported by client components (e.g. the homepage teaser).
export const SEED_POSTS: BlogPost[] = [
  {
    slug: 'meet-the-image-refiner',
    title: 'Meet The Image Refiner: My Story, My Mission, and Why I Do What I Do',
    excerpt: 'My name is Chinenye Juliet Nmerole — also known as The Image Refiner. Here is my story: from over 20 years in banking and the private sector, to building a global etiquette and personal development academy.',
    category: 'Lifestyle',
    author: 'Chinenye Nmerole',
    authorRole: 'Founder & Lead Coach',
    authorAvatar: '/chinenye2.jpg',
    date: 'February 25, 2025',
    readTime: '6 min read',
    image: '/chinenye2.jpg',
    featured: true,
    content: [
      'My name is Chinenye Juliet Nmerole. I am also known as The Image Refiner — because I am deeply passionate about refining and developing personal and corporate brands to help people become refined personalities who shine confidently on a global stage. I do this through mentoring and coaching programmes, speaking engagements, training sessions, online courses, one-on-one sessions, and across my various media channels.',
      'I am the CEO of Image Refining Academy Limited, with a special concentration in Image Refining Finishing School. I founded this organisation in early 2020, after observing how many enlightened, capable people were being sidelined from opportunities simply because they lacked refined character and polished presence. I made it my mission to help people move from a crude personality to a deserving, desirable character.',
      'In 2022, I launched Etiquette and Refining Training for Teenagers. As I worked to refine brands, I noticed many young adults who were eager to discover themselves and grow — but could not afford our full programmes. Teens Refinement became my way of giving back. Since then, over 100 young brands have gone through the training completely free of charge. I run it twice a year, in April and September.',
      'In 2023, I introduced The Refined Lady (TRL) — an online programme specifically designed for women who have lost themselves in the process of time. Whether through years of caregiving, a lack of career growth, or simply feeling stuck after 40, TRL is a safe and empowering space. The programme has since graduated many ladies who have rediscovered themselves and are living with renewed purpose. Send me a DM to sign up.',
      'I am also the Founder of The Graceful Women\'s Conference, where my team works with women on their physical and emotional well-being — straightening, refining, and empowering them financially and in every dimension. The conference runs every July and is fully sponsored so that as many women as possible can experience its impact. If you would like to partner with us, reach out now.',
      'One of the things I enjoy most is The Insights W/Chinenye — a weekly online programme (formerly known as Tuesday W/Chinenye) where I share free, value-packed training to impact my world. You can always join online at 5 PM WAT.',
      'My professional journey began in the Banking Sector, where I worked across several departments for approximately 10 years, eventually resigning at managerial level with a wealth of corporate experience. I then transitioned into the private sector, gaining further expertise in business and people management. Altogether, I have spent over 20 years in corporate and private environments — and every single one of those years has contributed to the coach, consultant, and trainer I am today.',
      'I am a Certified Etiquette and Mentor Coach by Packway Academy, a Certified Chartered Management Consultant (ChMC) from CICM Canada/US, and Certified in Business Etiquette and Professionalism by Alison International. I hold a degree in Secretarial Administration from the Institute of Management and Technology, Enugu State, and an MBA Marketing certificate from Lagos State University — along with many additional certifications earned since I became truly intentional in 2020.',
      'Image Refining Academy offers Leadership Training, Etiquette Training, Personal Development, Ushering and Protocol, Corporate and Organisational Training for schools, companies and churches, Public Speaking, Executive Programmes, Workshops and Seminars, and One-on-One Sessions. Whatever your goal — personal refinement, career elevation, or organisational culture — we have a programme for you.',
      'On a personal note: I am married to Charles Ihueze Nmerole and I am a mother of four wonderful young adults — three sons and a daughter. I am originally from Nkanu, Enugu State, grew up in Enugu, and now live in Lagos. I love speaking, dancing, travelling, writing, and creativity. Above all, I love Jesus and humanity genuinely.',
      'I am always available to serve you. As a Corporate Trainer, Speaker, Consultant, Coach and Mentor — I am very much open to business. Feel free to recommend our services to anyone who needs them. To your progress — Chinenye Nmerole, Certified Etiquette and Personal Development Consultant.',
    ],
  },
  {
    slug: 'personal-branding-image-development',
    title: 'Personal Branding and Image Development',
    excerpt: 'There are countless courses, seminars and trainings on personal branding today — but do you know what to develop and how to go about it? Here are six practical steps to get you started.',
    category: 'Personal Branding',
    author: 'Chinenye Nmerole',
    authorRole: 'Founder & Lead Coach',
    authorAvatar: '/chinenye2.jpg',
    date: 'January 14, 2025',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=800&q=80',
    content: [
      'You will agree with me that there are a lot of courses, seminars and trainings on this topic in recent times. Everyone is being encouraged to develop their personal image or brand to become a better version of themselves. But the question is: do you know what to develop and how to go about it? Here are a few practical steps you can take.',
      '1. Discover who you are. Discovering who you are will help you a great deal in knowing what areas to develop yourself in — your purpose of existence, your unique gifts, your strengths, and the things that set you apart. You cannot build a strong personal brand on an identity you do not yet fully understand.',
      '2. Identify where you are now and what needs to be changed or developed. Honest self-assessment is the foundation of all meaningful growth. Without knowing where you currently stand, you cannot map a clear route to where you want to be.',
      '3. Work on your mind. The work of change and development begins from the inside — it all begins in your mind. What do you think of yourself? How you see yourself will determine how far you go. A person who believes they are worthy of growth will invest in themselves differently from one who doubts their own potential.',
      '4. Prioritise your decisions on what you need to develop yourself in. Once you have identified what needs to change or grow, be deliberate about where you place your focus and resources. Not everything needs attention at the same time — prioritise the decisions and actions that will move you forward most significantly.',
      '5. Focus your attention and energy on developing the areas that will help you fulfil your purpose and accomplish your assignments here on earth. Scattered effort produces scattered results. Channel your energy with intention and direction.',
      '6. Develop yourself well enough to impact others positively. The ultimate goal of personal development is not self-glorification — it is contribution. The more you refine yourself, the more value you can bring to the people and communities around you.',
      'Other areas to consider as you evolve include your confidence, public relations, poise, and etiquette manners — all of which are foundational to how the world perceives and interacts with you.',
      'My name is Chinenye Nmerole. I am always available to refine your image and brand for a global shine. To your progress — Image Refining Academy.',
    ],
  },
]

// Backwards-compatible alias. Prefer the async helpers in `blog-store.ts` for
// live data; this synchronous export only ever reflects the built-in seed.
export const BLOG_POSTS = SEED_POSTS

export function getPostBySlug(slug: string): BlogPost | undefined {
  return SEED_POSTS.find(p => p.slug === slug)
}

// Category list is derived from the actual posts so newly-added categories show
// up automatically. "All" is always first.
export function deriveCategories(posts: BlogPost[]): string[] {
  const seen = new Set<string>()
  for (const p of posts) {
    if (p.category) seen.add(p.category)
  }
  return ['All', ...seen]
}
