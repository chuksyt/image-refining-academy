'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import EnrollModal from '@/components/EnrollModal'
import Newsletter from '@/components/Newsletter'
import IntakeCalendar from '@/components/IntakeCalendar'
import { COURSES } from '@/lib/courses'
import { BLOG_POSTS } from '@/lib/blog'
import { SEED_CONTENT } from '@/lib/content'
import { useLiveData } from '@/lib/useLiveData'

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal,.reveal-left,.reveal-right,.reveal-scale,.stagger')
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target) } })
    }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' })
    els.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])
}

function Counter({ target }: { target: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) return
      obs.disconnect()
      let current = 0
      const step = target / (1800 / 16)
      const t = setInterval(() => {
        current += step
        if (current >= target) { current = target; clearInterval(t) }
        if (ref.current) ref.current.textContent = Math.floor(current).toLocaleString()
      }, 16)
    }, { threshold: 0.5 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [target])
  return <span ref={ref}>0</span>
}

function GallerySection({ slides }: { slides: { src: string; caption: string }[] }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const count = slides.length

  const go = (n: number) => setIndex(((n % count) + count) % count)

  useEffect(() => {
    if (paused || count <= 1) return
    const t = setInterval(() => setIndex(i => (i + 1) % count), 1500)
    return () => clearInterval(t)
  }, [paused, count])

  return (
    <section className="relative py-24 overflow-hidden bg-gray-900">
      {/* Faded, blurred full-section backdrop that tracks the current slide */}
      <div className="absolute inset-0" aria-hidden>
        {slides.map((s, i) => (
          <Image
            key={s.src}
            src={s.src}
            alt=""
            fill
            sizes="100vw"
            className={`object-cover scale-110 blur-xl transition-opacity duration-700 ${i === index ? 'opacity-100' : 'opacity-0'}`}
            priority={i === 0}
          />
        ))}
        {/* Soften the backdrop so foreground text stays readable */}
        <div className="absolute inset-0 bg-white/35" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center mb-14 reveal">
          <div className="inline-flex items-center gap-2 text-violet-600 font-semibold text-sm mb-3">🖼 Gallery</div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Moments of <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-purple-500">Elegance</span></h2>
          <div className="w-16 h-1 bg-gradient-to-r from-violet-600 to-purple-500 rounded-full mx-auto" />
        </div>

        <div
          className="reveal relative max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-2xl bg-gray-900"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          aria-roledescription="carousel"
        >
          <div className="relative aspect-[16/10] sm:aspect-[16/9]">
            {slides.map((s, i) => (
              <div
                key={s.src}
                className={`absolute inset-0 transition-opacity duration-700 ${i === index ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                aria-hidden={i !== index}
              >
                <Image
                  src={s.src}
                  alt={s.caption}
                  fill
                  sizes="(max-width: 768px) 100vw, 896px"
                  className="object-cover"
                  priority={i === 0}
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-6 pt-16">
                  <span className="text-white text-lg font-medium">{s.caption}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Prev / Next */}
          <button
            onClick={() => go(index - 1)}
            aria-label="Previous photo"
            className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/25 hover:bg-white/40 backdrop-blur text-white text-xl flex items-center justify-center transition-colors"
          >‹</button>
          <button
            onClick={() => go(index + 1)}
            aria-label="Next photo"
            className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/25 hover:bg-white/40 backdrop-blur text-white text-xl flex items-center justify-center transition-colors"
          >›</button>

          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {slides.map((s, i) => (
              <button
                key={s.src}
                onClick={() => go(i)}
                aria-label={`Go to photo ${i + 1}`}
                aria-current={i === index}
                className={`h-2 rounded-full transition-all ${i === index ? 'w-6 bg-white' : 'w-2 bg-white/50 hover:bg-white/80'}`}
              />
            ))}
          </div>
        </div>

        <div className="text-center mt-10 reveal">
          <Link href="/gallery" className="inline-flex items-center gap-2 border-2 border-violet-600 text-violet-600 font-semibold px-8 py-3.5 rounded-full bg-white/60 hover:bg-violet-600 hover:text-white transition-all">
            View Full Gallery →
          </Link>
        </div>
      </div>
    </section>
  )
}

const features = [
  { icon: '👶', title: "Children's Etiquette",  desc: "Age-appropriate social skills training that builds a lifelong foundation of grace and good manners for children ages 6–12." },
  { icon: '🎓', title: 'Teen Finishing School',   desc: 'Empowering teenagers with the poise, communication skills, and social awareness they need to thrive in every setting.' },
  { icon: '💼', title: 'Corporate Protocol',      desc: 'Professional image and business etiquette training that elevates careers and strengthens leadership presence.' },
  { icon: '🍽️', title: 'Dining Etiquette',        desc: 'Master the art of fine dining — from table settings and cutlery usage to international dining customs.' },
  { icon: '✨', title: 'Personal Branding',       desc: 'Craft a compelling personal image that aligns your outer appearance with your inner strengths and aspirations.' },
  { icon: '📜', title: 'Online Certification',    desc: 'Become a certified etiquette consultant with our flexible 5-week online program, recognised internationally.' },
]

const testimonials = [
  { quote: "Your session was engaging, informative, and truly impactful. The etiquette training helped me develop my self-awareness, empathy, and self-control, leading to greater emotional intelligence. I am excited to continue learning and refining my skills. Thank you for creating such a supportive and educational environment.", name: 'Ike Goodness', role: 'Etiquette Training Graduate', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=IkeGoodness&backgroundColor=b6e3f4' },
  { quote: "I recently attended the 3-day programme on etiquette, purpose, and goal setting, and I found it incredibly insightful. The session was well-structured, engaging, and the interactive elements were excellent. I rate this programme 5/5 and highly recommend it to anyone looking to improve their personal and professional development. I would love to come back over and over again!", name: 'Programme Graduate', role: '3-Day Programme Participant', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=ProgrammeGraduate&backgroundColor=ffd5dc' },
  { quote: "Your training has been a game changer for me. From the very first day to the end it was amazing — the lessons on etiquette, respect, manners, and protocol have been invaluable. I am grateful for the tools and insights you shared to help me build my self-confidence. You have empowered me to believe in myself and my abilities. Thank you ma.", name: 'Training Participant', role: 'Etiquette & Personal Development Graduate', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=TrainingParticipant&backgroundColor=c0aede' },
]

// Landscape-orientation photos only, so the slideshow frame stays filled.
const gallery = [
  { src: '/gallery/workshop-4.jpg', caption: 'Finishing School Session' },
  { src: '/gallery/ushering-1.jpg', caption: 'Refined Ushers — Birthday Celebration' },
  { src: '/gallery/workshop-6.jpg', caption: 'Etiquette & Poise Class' },
  { src: '/gallery/workshop-5.jpg', caption: 'Interactive Training' },
  { src: '/gallery/ushering-3.jpg', caption: 'Cultural Reception Ushers' },
  { src: '/gallery/workshop-7.jpg', caption: 'Personal Refining Workshop' },
]

const whyUs = [
  { icon: '🎯', title: 'Holistic Approach',  desc: 'We address character, communication, and conduct — the complete package.' },
  { icon: '🌍', title: 'Global Standards',   desc: 'Our curriculum meets international etiquette standards recognised worldwide.' },
  { icon: '👩‍🏫', title: 'Expert Faculty',   desc: 'Learn from certified, experienced coaches who live what they teach.' },
  { icon: '📱', title: 'Flexible Learning',  desc: 'In-person and online options to fit your schedule and lifestyle.' },
]

export default function Home() {
  useReveal()
  const [enrollKey, setEnrollKey] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const c = canvas
    const ctx = c.getContext('2d')!
    type P = { x:number;y:number;size:number;sx:number;sy:number;o:number }
    const particles: P[] = []
    function resize() { c.width = c.offsetWidth; c.height = c.offsetHeight }
    resize()
    window.addEventListener('resize', resize)
    for (let i = 0; i < 80; i++) particles.push({ x:Math.random()*c.width, y:Math.random()*c.height, size:Math.random()*2.5+0.5, sx:(Math.random()-0.5)*0.6, sy:(Math.random()-0.5)*0.6, o:Math.random()*0.5+0.1 })
    let raf: number
    function animate() {
      ctx.clearRect(0,0,c.width,c.height)
      particles.forEach(p => {
        p.x+=p.sx; p.y+=p.sy
        if(p.x<0||p.x>c.width||p.y<0||p.y>c.height){p.x=Math.random()*c.width;p.y=Math.random()*c.height}
        ctx.beginPath(); ctx.arc(p.x,p.y,p.size,0,Math.PI*2); ctx.fillStyle=`rgba(192,132,252,${p.o})`; ctx.fill()
      })
      raf = requestAnimationFrame(animate)
    }
    animate()
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])

  // Live, director-editable content (seed renders first, then swaps in).
  const courses = useLiveData('/api/courses', 'courses', COURSES)
  const posts = useLiveData('/api/blog', 'posts', BLOG_POSTS)
  const content = useLiveData('/api/content', 'content', SEED_CONTENT)
  const featuredCourses = courses.slice(0, 3)
  const recentPosts = posts.slice(0, 3)
  const home = content.home

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center bg-gradient-to-br from-gray-950 via-violet-950 to-gray-950 overflow-hidden">
        <canvas ref={canvasRef} id="particles-canvas" />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-16 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
              <span className="text-white/90 text-sm">{home.heroBadge}</span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              {home.heroTitleLine1}<br />
              <em className="not-italic text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">
                {home.heroTitleLine2}
              </em>
            </h1>

            <p className="text-white/70 text-lg leading-relaxed mb-8 max-w-lg">
              {home.heroSubtitle}
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
              <a href="#monthly-training" className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-purple-500 text-white font-semibold px-7 py-3.5 rounded-full hover:shadow-xl hover:shadow-violet-500/40 transition-all">
                📅 Join Monthly Training
              </a>
              <Link href="/about" className="flex items-center gap-2 border border-white/30 text-white font-semibold px-7 py-3.5 rounded-full hover:bg-white/10 transition-all">
                ▶ Our Story
              </Link>
            </div>

            <div className="flex gap-8">
              {home.stats.map(s => (
                <div key={s.label}>
                  <div className="text-3xl font-bold text-white"><Counter target={s.n} />{s.suffix}</div>
                  <div className="text-white/60 text-sm mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden lg:block float-anim">
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/chinenye2.jpg"
                  alt="Chinenye Nmerole — Founder, Image Refining Academy"
                  width={600} height={700}
                  className="w-full h-[500px] object-cover object-top"
                  priority
                />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl p-4 shadow-xl flex items-center gap-3">
                <div className="text-2xl">🏆</div>
                <div>
                  <div className="font-bold text-gray-900 text-sm">Top Rated</div>
                  <div className="text-gray-500 text-xs">Etiquette Academy</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Marquee ── */}
      <div className="bg-gradient-to-r from-violet-700 to-purple-600 py-4 overflow-hidden">
        <div className="marquee-track flex gap-12">
          {['Dining Etiquette','Personal Branding','Corporate Protocol',"Children's Finishing",'Online Certification','Teen Social Skills','Image Consulting',
            'Dining Etiquette','Personal Branding','Corporate Protocol',"Children's Finishing",'Online Certification'].map((t,i) => (
            <span key={i} className="text-white/90 text-sm font-medium flex-shrink-0">✦ {t}</span>
          ))}
        </div>
      </div>

      {/* ── Upcoming Event Spotlight ── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#2D0050] via-[#4A0072] to-[#6B21A8] shadow-2xl reveal">
            {/* gold top bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600" />
            {/* glow blobs */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-yellow-400/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-56 h-56 bg-purple-400/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8 p-8 lg:p-12">
              {/* Flyer thumb */}
              <div className="flex-shrink-0 w-40 h-48 lg:w-48 lg:h-56 rounded-2xl overflow-hidden border-2 border-yellow-500/40 shadow-lg">
                <Image
                  src="/refined-woman-flyer-v2.jpg"
                  alt="Becoming a Refined Woman flyer"
                  width={192} height={224}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Text */}
              <div className="flex-1 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 bg-yellow-400/20 border border-yellow-400/40 text-yellow-300 text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-4">
                  🔥 Upcoming Programme · Registrations Open
                </div>
                <h3 className="text-white font-bold text-3xl lg:text-4xl leading-tight mb-1">
                  Becoming a <span className="text-yellow-300">Refined Woman</span>
                </h3>
                <p className="text-white/60 text-base mb-4">in Today&apos;s World — A 4-Day Premium Online Training</p>
                <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-6">
                  <span className="flex items-center gap-1.5 bg-white/10 border border-white/20 text-white text-sm px-3 py-1.5 rounded-full">📅 16–19 July 2026</span>
                  <span className="flex items-center gap-1.5 bg-white/10 border border-white/20 text-white text-sm px-3 py-1.5 rounded-full">🕖 7 PM WAT Daily</span>
                  <span className="flex items-center gap-1.5 bg-white/10 border border-white/20 text-white text-sm px-3 py-1.5 rounded-full">📲 Telegram Platform</span>
                </div>
                <p className="text-white/60 text-sm leading-relaxed max-w-xl mx-auto lg:mx-0">
                  Build confidence, refine your image, discover purpose, communicate with influence, and lead with grace — in just 4 days.
                </p>
              </div>

              {/* Price + CTA */}
              <div className="flex-shrink-0 text-center">
                <div className="text-yellow-300 font-bold text-4xl mb-6">₦10,000</div>
                <Link href="/refined-woman" className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 font-bold px-8 py-4 rounded-full hover:shadow-xl hover:shadow-yellow-500/30 hover:-translate-y-0.5 transition-all whitespace-nowrap">
                  Learn More & Register →
                </Link>
                <p className="text-white/30 text-xs mt-3">Space is limited</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── What We Offer ── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14 reveal">
            <div className="inline-flex items-center gap-2 text-violet-600 font-semibold text-sm mb-3">✨ What We Offer</div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Transforming Lives Through <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-purple-500">Refined Etiquette</span></h2>
            <div className="w-16 h-1 bg-gradient-to-r from-violet-600 to-purple-500 rounded-full mx-auto mb-4" />
            <p className="text-gray-500 max-w-xl mx-auto">At Image Refining Academy, we go beyond rules and manners. We build character, confidence, and a commanding presence that opens doors in every area of life.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger">
            {features.map(f => (
              <div key={f.title} className="bg-gray-50 rounded-2xl p-7 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-16 bg-gradient-to-r from-violet-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {home.impactStats.map((st, i) => (
            <div key={`${st.label}-${i}`} className="reveal">
              <div className="text-4xl font-bold text-white mb-1"><Counter target={st.n} />{st.suffix}</div>
              <div className="text-white/80 text-sm">{st.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── About snippet ── */}
      <section className="py-24 bg-violet-50">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
          <div className="reveal-left">
            <div className="relative">
              <div className="rounded-2xl overflow-hidden img-zoom">
                <Image
                  src="/chinenye.jpg"
                  alt="Chinenye Nmerole — Founder"
                  width={600} height={480}
                  className="w-full h-[480px] object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-5 shadow-lg text-center">
                <div className="text-3xl font-bold text-violet-700 leading-none">6+</div>
                <div className="text-gray-500 text-xs mt-1">Years Experience</div>
              </div>
              <div className="absolute -top-4 -left-4 w-16 h-16 rounded-full bg-gradient-to-br from-violet-200 to-purple-200 border-2 border-violet-300" />
            </div>
          </div>

          <div className="reveal-right">
            <div className="text-violet-600 font-semibold text-sm mb-3">Meet the Director</div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Driven by Passion for <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-purple-500">Polished Excellence</span></h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              <strong className="text-gray-900">Chinenye Juliet Nmerole</strong> is a Certified Etiquette and Personal Development Consultant, speaker, trainer and transformational coach passionate about helping people become the best version of themselves.
            </p>
            <p className="text-gray-600 leading-relaxed mb-8">
              As Founder of Image Refining Academy, she equips teenagers, women, young adults, schools, churches and professionals with the knowledge, character and practical life skills to thrive without compromising their values. She believes true refinement begins from within — through character, confidence, emotional intelligence and purpose.
            </p>
            <div className="flex flex-wrap gap-4 mb-8">
              {['Certified Etiquette Consultant','Transformational Coach','Speaker & Trainer'].map(tag => (
                <div key={tag} className="flex items-center gap-2 text-violet-700 font-semibold text-sm">
                  <i className="fa-solid fa-circle-check" /> {tag}
                </div>
              ))}
            </div>
            <Link href="/about" className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-purple-500 text-white font-semibold px-6 py-3 rounded-full hover:shadow-lg hover:shadow-violet-500/30 transition-all">
              Read Our Full Story →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Featured Courses (HIDDEN – restore when courses go live) ──
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14 reveal">
            <div className="inline-flex items-center gap-2 text-violet-600 font-semibold text-sm mb-3">📖 Featured Courses</div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Begin Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-purple-500">Transformation Journey</span></h2>
            <div className="w-16 h-1 bg-gradient-to-r from-violet-600 to-purple-500 rounded-full mx-auto mb-4" />
            <p className="text-gray-500 max-w-xl mx-auto">Choose from our curated programmes designed to meet you at every stage of life.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 stagger">
            {featuredCourses.map(c => (
              <div key={c.key} className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow overflow-hidden flex flex-col">
                <div className="img-zoom h-52">
                  <Image src={c.image} alt={c.name} width={600} height={400} className="w-full h-full object-cover" />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <span className="inline-block bg-violet-100 text-violet-700 text-xs font-semibold px-3 py-1 rounded-full mb-3">{c.tag}</span>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">{c.name}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed flex-1">{c.description}</p>
                  <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
                    <div>
                      <div className="font-bold text-violet-700 text-lg">{c.priceDisplay}</div>
                      <div className="text-gray-400 text-xs">{c.duration}</div>
                    </div>
                    <button onClick={() => setEnrollKey(c.key)} className="bg-gradient-to-r from-violet-600 to-purple-500 text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:shadow-lg hover:shadow-violet-500/30 transition-all">Enroll</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10 reveal">
            <Link href="/courses" className="inline-flex items-center gap-2 border-2 border-violet-600 text-violet-600 font-semibold px-8 py-3.5 rounded-full hover:bg-violet-600 hover:text-white transition-all">View All Courses →</Link>
          </div>
        </div>
      </section>
      ── End Featured Courses ── */}

      {/* ── Why Choose Us ── */}
      <section className="py-24 bg-gray-950 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute right-1/4 top-1/2 -translate-y-1/2 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="text-center mb-14 reveal">
            <div className="inline-flex items-center gap-2 text-purple-400 font-semibold text-sm mb-3">🏆 Why Choose Us</div>
            <h2 className="text-4xl font-bold text-white mb-4">The Academy That <span className="text-purple-400">Goes the Distance</span></h2>
            <div className="w-16 h-1 bg-gradient-to-r from-violet-600 to-purple-400 rounded-full mx-auto mb-4" />
            <p className="text-white/60 max-w-xl mx-auto">We don&apos;t just teach etiquette — we build people who carry themselves with undeniable distinction.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger">
            {whyUs.map(w => (
              <div key={w.title} className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-7 text-center hover:bg-white/10 transition-colors">
                <div className="text-4xl mb-4">{w.icon}</div>
                <h4 className="text-white font-bold mb-2">{w.title}</h4>
                <p className="text-white/60 text-sm leading-relaxed">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-24 bg-violet-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14 reveal">
            <div className="inline-flex items-center gap-2 text-violet-600 font-semibold text-sm mb-3">💬 Testimonials</div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Words From Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-purple-500">Graduates</span></h2>
            <div className="w-16 h-1 bg-gradient-to-r from-violet-600 to-purple-500 rounded-full mx-auto" />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 stagger">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-shadow">
                <div className="text-yellow-400 text-lg mb-4">★★★★★</div>
                <p className="text-gray-600 leading-relaxed text-sm mb-6 italic">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={t.avatar} alt={t.name} width={44} height={44} className="rounded-full bg-violet-100" />
                  <div>
                    <div className="font-bold text-gray-900 text-sm">{t.name}</div>
                    <div className="text-gray-400 text-xs">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Gallery preview ── */}
      <GallerySection slides={gallery} />

      {/* ── Intake Calendar (HIDDEN – restore when courses go live) ──
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14 reveal">
            <div className="inline-flex items-center gap-2 text-violet-600 font-semibold text-sm mb-3">📅 Upcoming Intakes</div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Next Available <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-purple-500">Start Dates</span></h2>
            <div className="w-16 h-1 bg-gradient-to-r from-violet-600 to-purple-500 rounded-full mx-auto mb-4" />
            <p className="text-gray-500 max-w-xl mx-auto">Spots are limited. Secure your place in the next cohort before it fills up.</p>
          </div>
          <IntakeCalendar />
        </div>
      </section>
      ── End Intake Calendar ── */}

      {/* ── Monthly Transformation Training ── */}
      <section id="monthly-training" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14 reveal">
            <div className="inline-flex items-center gap-2 text-violet-600 font-semibold text-sm mb-3">📅 Monthly Programmes</div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Monthly <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-purple-500">Transformation Training</span></h2>
            <div className="w-16 h-1 bg-gradient-to-r from-violet-600 to-purple-500 rounded-full mx-auto mb-4" />
            <p className="text-gray-500 max-w-xl mx-auto">In-person and online. Every month, two dedicated sessions — one for teenagers, one for women. Limited slots available.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto stagger">
            {/* 2nd Saturday */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-shadow border-t-4 border-violet-600">
              <div className="relative h-52 overflow-hidden">
                <Image src="/monthly-teen-flyer.jpg" alt="Teenagers Training flyer" width={600} height={400} className="w-full h-full object-cover object-top" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-3 left-4">
                  <div className="inline-flex items-center gap-2 bg-violet-600 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                    2nd Saturday Every Month
                  </div>
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-1">Teenagers Training</h3>
                <div className="text-violet-600 text-xs font-semibold mb-4">
                  Session 1: 10:00AM – 12:00PM &nbsp;|&nbsp; Session 2: 1:00PM – 3:00PM
                </div>
                <div className="flex flex-wrap gap-2 mb-5">
                  {['Confidence', 'Etiquette', 'Leadership', 'Purpose'].map(t => (
                    <span key={t} className="bg-violet-50 text-violet-700 text-xs font-semibold px-3 py-1 rounded-full">{t}</span>
                  ))}
                </div>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">
                  Equipping teenagers with the character, confidence and life skills they need to discover their purpose and navigate today&apos;s world with grace and leadership.
                </p>
                <a
                  href="https://wa.me/2348037269408?text=Hi%20Chinenye%2C%20I%20am%20interested%20in%20the%20Teenagers%20Training%20programme."
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-purple-500 text-white font-semibold px-6 py-3 rounded-full hover:shadow-lg hover:shadow-violet-500/30 transition-all text-sm w-full"
                >
                  Register via WhatsApp →
                </a>
              </div>
            </div>

            {/* 4th Saturday */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-shadow border-t-4 border-purple-500">
              <div className="relative h-52 overflow-hidden">
                <Image src="/monthly-women-flyer.jpg" alt="Women's Training flyer" width={600} height={400} className="w-full h-full object-cover object-top" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-3 left-4">
                  <div className="inline-flex items-center gap-2 bg-purple-600 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                    4th Saturday Every Month
                  </div>
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-1">Women&apos;s Training</h3>
                <div className="text-purple-600 text-xs font-semibold mb-4">
                  1:00PM – 3:00PM
                </div>
                <div className="flex flex-wrap gap-2 mb-5">
                  {['Poise', 'Communication', 'Confidence', 'Social Etiquette', 'Personal Branding'].map(t => (
                    <span key={t} className="bg-purple-50 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full">{t}</span>
                  ))}
                </div>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">
                  A safe and empowering space for women to build confidence, refine their presence, strengthen communication and grow into the best version of themselves.
                </p>
                <a
                  href="https://wa.me/2348037269408?text=Hi%20Chinenye%2C%20I%20am%20interested%20in%20the%20Women%27s%20Training%20programme."
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold px-6 py-3 rounded-full hover:shadow-lg hover:shadow-purple-500/30 transition-all text-sm w-full"
                >
                  Register via WhatsApp →
                </a>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-10 mt-12 reveal">
            {[
              { icon: '🎯', text: 'Practical Life Skills' },
              { icon: '💬', text: 'Interactive Sessions' },
              { icon: '🔢', text: 'Limited Slots Monthly' },
              { icon: '💻', text: 'In-Person & Online' },
            ].map(f => (
              <div key={f.text} className="flex items-center gap-2 text-gray-600 font-medium text-sm">
                <span className="text-xl">{f.icon}</span> {f.text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Blog preview ── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <div className="reveal">
              <div className="inline-flex items-center gap-2 text-violet-600 font-semibold text-sm mb-3">✍️ Latest Articles</div>
              <h2 className="text-4xl font-bold text-gray-900">From Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-purple-500">Blog</span></h2>
            </div>
            <Link href="/blog" className="hidden sm:inline-flex items-center gap-2 border-2 border-violet-600 text-violet-600 font-semibold px-6 py-2.5 rounded-full hover:bg-violet-600 hover:text-white transition-all text-sm">
              View All →
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 stagger">
            {recentPosts.map(post => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden flex flex-col">
                <div className="img-zoom h-48">
                  <Image src={post.image} alt={post.title} width={600} height={400} className="w-full h-full object-cover" />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <span className="text-violet-600 text-xs font-semibold mb-2">{post.category}</span>
                  <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-violet-600 transition-colors flex-1">{post.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-gray-400 text-xs">{post.date}</span>
                    <span className="text-violet-600 text-xs font-semibold">{post.readTime}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8 sm:hidden">
            <Link href="/blog" className="inline-flex items-center gap-2 border-2 border-violet-600 text-violet-600 font-semibold px-8 py-3 rounded-full hover:bg-violet-600 hover:text-white transition-all">
              View All Articles →
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 text-center reveal-scale">
          <div className="bg-gradient-to-r from-violet-700 to-purple-600 rounded-3xl p-12 shadow-2xl">
            <div className="inline-block bg-white/15 text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-4 uppercase tracking-wider">Start Today</div>
            <h2 className="text-4xl font-bold text-white mb-4">Ready to Refine Your Image?</h2>
            <p className="text-white/80 mb-8 max-w-lg mx-auto">Take the first step toward the polished, confident version of yourself. Join a monthly training or register for our upcoming 4-day programme.</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/refined-woman" className="flex items-center gap-2 bg-white text-violet-700 font-bold px-8 py-3.5 rounded-full hover:shadow-lg transition-all">
                ✨ Upcoming Programme
              </Link>
              <a href="#monthly-training" className="flex items-center gap-2 border-2 border-white/50 text-white font-semibold px-8 py-3.5 rounded-full hover:border-white transition-all">
                📅 Monthly Training
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Newsletter ── */}
      <Newsletter />

      <EnrollModal courseKey={enrollKey} onClose={() => setEnrollKey(null)} />
    </>
  )
}
