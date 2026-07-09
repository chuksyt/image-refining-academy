'use client'
import { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { SEED_CONTENT } from '@/lib/content'
import { useLiveData } from '@/lib/useLiveData'

const milestones = [
  { year: '2020', title: 'Image Refining Academy Founded', desc: 'After years in banking and the private sector, Chinenye founded Image Refining Academy to help people move from crude personality to deserving, desirable character — equipping them to seize the opportunities they deserve.' },
  { year: '2022', title: 'Teens Refinement Programme Launched', desc: 'Noticing that many young adults wanted to grow but could not afford full programmes, Chinenye launched a free etiquette and refinement training for teenagers. Over 100 young brands have since been trained at no cost, running every April and September.' },
  { year: '2023', title: 'The Refined Lady (TRL) Launched', desc: 'An online programme created specifically for women who had lost themselves through caregiving, career gaps or the passing of time. TRL helps women above 40 rediscover their identity, rebuild self-esteem and move forward with purpose.' },
  { year: '2023', title: 'The Graceful Women\'s Conference', desc: 'Chinenye founded this annual women\'s conference held every July, bringing together a team dedicated to the physical, emotional and financial empowerment of women — fully sponsored to maximise reach and impact.' },
  { year: '2024', title: 'The Insights W/Chinenye', desc: 'Evolved from the beloved Tuesday W/Chinenye series, this weekly free online programme at 5 PM WAT delivers consistent, value-packed training to a growing community of followers and students.' },
  { year: '2025', title: 'Expanding Global Reach', desc: 'With certifications from Packway Academy, CICM Canada/US and Alison International, Chinenye continues to grow the Academy\'s impact across schools, churches, organisations and professionals worldwide.' },
]

const values = [
  { icon: '💎', title: 'Excellence', desc: 'We hold ourselves to the highest standards in everything we teach and how we operate.' },
  { icon: '🤝', title: 'Integrity', desc: 'Honesty, authenticity, and ethical conduct are at the core of all our programmes.' },
  { icon: '🌱', title: 'Growth', desc: 'We believe every individual has the capacity to grow, refine, and continually become better.' },
  { icon: '🌍', title: 'Impact', desc: 'Our mission extends beyond the classroom — we aim to shape a more gracious society.' },
]

export default function AboutPage() {
  const about = useLiveData('/api/content', 'content', SEED_CONTENT).about
  useEffect(() => {
    const els = document.querySelectorAll('.reveal,.reveal-left,.reveal-right,.stagger')
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target) } })
    }, { threshold: 0.12 })
    els.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return (
    <>
      {/* Page hero */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-gray-950 via-violet-950 to-gray-950 overflow-hidden">
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-2 text-sm text-white/50 mb-6">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>›</span>
            <span className="text-purple-400">About</span>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">{about.heroTitle}</h1>
          <p className="text-white/60 text-lg max-w-xl">{about.heroSubtitle}</p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
          <div className="reveal-left">
            <div className="relative">
              <div className="rounded-2xl overflow-hidden img-zoom">
                <Image
                  src="/chinenye.jpg"
                  alt="Chinenye Nmerole — Founder, Image Refining Academy"
                  width={600} height={500}
                  className="w-full h-[500px] object-cover object-top"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-5 shadow-xl text-center">
                <div className="text-3xl font-bold text-violet-700">6+</div>
                <div className="text-gray-500 text-xs mt-1">Years Experience</div>
              </div>
              <div className="absolute -top-4 -left-4 w-16 h-16 rounded-full bg-gradient-to-br from-violet-200 to-purple-200 border-2 border-violet-300" />
            </div>
          </div>

          <div className="reveal-right">
            <div className="text-violet-600 font-semibold text-sm mb-3">Our Story</div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-purple-500">{about.storyHeading}</span>
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              {about.storyParagraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <div className="flex flex-wrap gap-4 mt-8">
              {['Certified Etiquette Consultant','Transformational Coach','Speaker & Trainer'].map(tag => (
                <div key={tag} className="flex items-center gap-2 text-violet-700 font-semibold text-sm">
                  <i className="fa-solid fa-circle-check" /> {tag}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-violet-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14 reveal">
            <div className="text-violet-600 font-semibold text-sm mb-3">What Drives Us</div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Core <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-purple-500">Values</span></h2>
            <div className="w-16 h-1 bg-gradient-to-r from-violet-600 to-purple-500 rounded-full mx-auto" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger">
            {values.map(v => (
              <div key={v.title} className="bg-white rounded-2xl p-7 text-center shadow-sm hover:shadow-md hover:-translate-y-1 transition-all">
                <div className="text-4xl mb-4">{v.icon}</div>
                <h4 className="font-bold text-gray-900 text-lg mb-2">{v.title}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-14 reveal">
            <div className="text-violet-600 font-semibold text-sm mb-3">Our Journey</div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">A Story of <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-purple-500">Impact</span></h2>
            <div className="w-16 h-1 bg-gradient-to-r from-violet-600 to-purple-500 rounded-full mx-auto" />
          </div>

          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-px bg-violet-100" />
            <div className="space-y-10">
              {milestones.map((m, i) => (
                <div key={i} className={`flex gap-8 items-start reveal`} style={{ transitionDelay: `${i * 0.1}s` }}>
                  <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br from-violet-600 to-purple-500 flex items-center justify-center text-white font-bold text-sm relative z-10">
                    {m.year}
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-6 flex-1">
                    <h3 className="font-bold text-gray-900 text-lg mb-2">{m.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-violet-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="bg-gradient-to-r from-violet-700 to-purple-600 rounded-3xl p-12 shadow-2xl reveal-scale">
            <h2 className="text-3xl font-bold text-white mb-4">{about.ctaTitle}</h2>
            <p className="text-white/80 mb-8 max-w-lg mx-auto">{about.ctaText}</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a href="https://wa.me/2348037269408?text=Hi%20Chinenye%2C%20I%20would%20like%20to%20register%20for%20a%20programme." target="_blank" rel="noopener noreferrer" className="bg-white text-violet-700 font-bold px-8 py-3.5 rounded-full hover:shadow-lg transition-all">Register via WhatsApp</a>
              <Link href="/contact" className="border-2 border-white/50 text-white font-semibold px-8 py-3.5 rounded-full hover:border-white transition-all">✉ Contact Us</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
