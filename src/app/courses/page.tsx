'use client'
import Link from 'next/link'

// ── Courses page (HIDDEN – restore when courses go live) ──────────────────────
// To restore: delete from here to the end of this comment block, then
// uncomment the original page below by removing the /* and */ delimiters.
// ─────────────────────────────────────────────────────────────────────────────

export default function CoursesPage() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-950 via-violet-950 to-gray-950 px-6 text-center">
      <div className="max-w-lg">
        <div className="text-6xl mb-6">🎓</div>
        <h1 className="text-4xl font-bold text-white mb-4">Courses Coming Soon</h1>
        <p className="text-white/60 text-lg mb-8 leading-relaxed">
          Our programmes are currently being prepared. In the meantime, join our free Monthly Transformation Training — every second and fourth Saturday.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <a
            href="https://wa.me/2348037269408?text=Hi%20Chinenye%2C%20I%20would%20like%20to%20register%20for%20a%20programme."
            target="_blank" rel="noopener noreferrer"
            className="bg-gradient-to-r from-violet-600 to-purple-500 text-white font-bold px-8 py-3.5 rounded-full hover:shadow-lg hover:shadow-violet-500/30 transition-all"
          >
            Register via WhatsApp
          </a>
          <Link href="/" className="border-2 border-white/30 text-white font-semibold px-8 py-3.5 rounded-full hover:border-white transition-all">
            Back to Home
          </Link>
        </div>
      </div>
    </section>
  )
}

/*
── ORIGINAL COURSES PAGE – uncomment below to restore ──────────────────────────

'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import EnrollModal from '@/components/EnrollModal'
import { COURSES } from '@/lib/courses'
import { useLiveData } from '@/lib/useLiveData'

type Filter = 'all' | 'children' | 'teen' | 'adult' | 'online'

const faqs = [
  { q: 'How do I enroll and make payment?', a: 'Simply click the "Enroll Now" button on your chosen course, fill in your details, and complete payment securely via Paystack. You will receive a confirmation email immediately after payment.' },
  { q: 'Can I enroll my child without attending a physical class?', a: "Yes! Some of our children's and teen programmes offer hybrid options. Contact us to discuss the best format for your child's schedule and location." },
  { q: 'Is the Online Certification Programme internationally recognised?', a: 'Yes. Our Online Certification is accredited and recognised by partnering international etiquette bodies. Graduates can use it to start coaching businesses both locally and internationally.' },
  { q: 'What is the refund policy?', a: 'We offer a full refund if you cancel at least 7 days before the course start date. After that, a 50% credit can be transferred to a future intake.' },
  { q: 'Do you offer group or corporate discounts?', a: 'Absolutely! We offer group rates for organisations enrolling 5 or more participants, as well as custom corporate workshops. Reach out via our contact page for a quote.' },
  { q: 'When is the next intake?', a: "New intakes run every quarter. Enroll now to secure your spot in the upcoming cohort. You'll receive your confirmed start date via email after enrollment." },
]

export default function CoursesPage() {
  const [filter, setFilter] = useState<Filter>('all')
  const [enrollKey, setEnrollKey] = useState<string | null>(null)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  useEffect(() => {
    const els = document.querySelectorAll('.reveal,.reveal-left,.reveal-right,.reveal-scale,.stagger')
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target) } })
    }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' })
    els.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  const courses = useLiveData('/api/courses', 'courses', COURSES)
  const filtered = courses.filter(c => filter === 'all' || c.category === filter)
  const tabs: { key: Filter; label: string }[] = [
    { key: 'all',      label: 'All Courses' },
    { key: 'children', label: 'Children' },
    { key: 'teen',     label: 'Teens' },
    { key: 'adult',    label: 'Adults' },
    { key: 'online',   label: 'Online' },
  ]

  return (
    <>
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-gray-950 via-violet-950 to-gray-950 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-violet-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-60 h-60 bg-purple-500/15 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-2 text-sm text-white/50 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>›</span>
            <span className="text-purple-400">Courses</span>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">Our Programmes</h1>
          <p className="text-white/60 text-lg max-w-xl">From children to corporate executives — we have a course designed just for you.</p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12 reveal">
            <div className="inline-flex items-center gap-2 text-violet-600 font-semibold text-sm mb-3">🎓 All Programmes</div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-purple-500">Perfect Course</span></h2>
            <div className="w-16 h-1 bg-gradient-to-r from-violet-600 to-purple-500 rounded-full mx-auto mb-4" />
            <p className="text-gray-500 max-w-xl mx-auto">Browse by category or scroll through all programmes below. Every course includes a certificate of completion.</p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {tabs.map(t => (
              <button
                key={t.key}
                onClick={() => setFilter(t.key)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                  filter === t.key
                    ? 'bg-gradient-to-r from-violet-600 to-purple-500 text-white shadow-lg shadow-violet-500/30'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map(c => (
              <div key={c.key} className={`bg-white rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden flex flex-col ${c.popular ? 'ring-2 ring-violet-500' : ''}`}>
                {c.popular && (
                  <div className="bg-gradient-to-r from-violet-600 to-purple-500 text-white text-center text-xs font-bold py-1.5 tracking-wider uppercase">
                    ⭐ Most Popular
                  </div>
                )}
                <div className="img-zoom h-56">
                  <Image src={c.image} alt={c.name} width={600} height={400} className="w-full h-full object-cover" />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <span className="inline-block bg-violet-100 text-violet-700 text-xs font-semibold px-3 py-1 rounded-full mb-3">{c.tag}</span>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">{c.name}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4">{c.description}</p>
                  <ul className="space-y-1.5 mb-5 flex-1">
                    {c.features.map(f => (
                      <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                        <i className="fa-solid fa-circle-check text-violet-500 text-xs" /> {f}
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                      <div className="font-bold text-violet-700 text-xl">{c.priceDisplay}</div>
                      <div className="text-gray-400 text-xs mt-0.5">⏱ {c.duration}</div>
                    </div>
                    <button
                      onClick={() => setEnrollKey(c.key)}
                      className="bg-gradient-to-r from-violet-600 to-purple-500 text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:shadow-lg hover:shadow-violet-500/30 transition-all"
                    >
                      Enroll Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-violet-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12 reveal">
            <div className="inline-flex items-center gap-2 text-violet-600 font-semibold text-sm mb-3">🏅 Why Enroll with Us</div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Every Course Comes <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-purple-500">Fully Equipped</span></h2>
            <div className="w-16 h-1 bg-gradient-to-r from-violet-600 to-purple-500 rounded-full mx-auto" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger">
            {[{ icon:'📜',title:'Certificate',desc:'Every graduate receives an official certificate of completion from Image Refining Academy.' },
              { icon:'👩‍🏫',title:'Expert Coaches',desc:'Learn from trained, certified etiquette professionals with real-world experience.' },
              { icon:'📱',title:'Flexible Formats',desc:'Choose in-person, hybrid, or fully online — we adapt to your lifestyle.' },
              { icon:'🔒',title:'Secure Payment',desc:'All payments are processed securely through Paystack with full transaction records.' },
            ].map(item => (
              <div key={item.title} className="bg-white rounded-2xl p-7 text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h4 className="font-bold text-gray-900 mb-2">{item.title}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12 reveal">
            <div className="inline-flex items-center gap-2 text-violet-600 font-semibold text-sm mb-3">❓ FAQ</div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-purple-500">Questions</span></h2>
            <div className="w-16 h-1 bg-gradient-to-r from-violet-600 to-purple-500 rounded-full mx-auto" />
          </div>
          <div className="space-y-3 reveal">
            {faqs.map((faq, i) => (
              <div key={i} className={`accordion-item border border-gray-200 rounded-xl overflow-hidden ${openFaq === i ? 'open' : ''}`}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left font-semibold text-gray-900 hover:bg-gray-50 transition-colors"
                >
                  {faq.q}
                  <span className="accordion-icon text-violet-500 text-xl ml-4 flex-shrink-0">+</span>
                </button>
                <div className="accordion-body">
                  <div className="px-6 pb-4 text-gray-600 text-sm leading-relaxed">{faq.a}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-violet-50">
        <div className="max-w-4xl mx-auto px-6 text-center reveal-scale">
          <div className="bg-gradient-to-r from-violet-700 to-purple-600 rounded-3xl p-12 shadow-2xl">
            <h2 className="text-3xl font-bold text-white mb-4">Still Have Questions?</h2>
            <p className="text-white/80 mb-8">Our team is happy to help you choose the right programme.</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/contact" className="bg-white text-violet-700 font-bold px-8 py-3.5 rounded-full hover:shadow-lg transition-all">✉ Contact Us</Link>
              <a href="tel:+2348037269408" className="border-2 border-white/50 text-white font-semibold px-8 py-3.5 rounded-full hover:border-white transition-all">📞 Call Now</a>
            </div>
          </div>
        </div>
      </section>

      <EnrollModal courseKey={enrollKey} onClose={() => setEnrollKey(null)} />
    </>
  )
}
── END ORIGINAL COURSES PAGE ────────────────────────────────────────────────────
*/
