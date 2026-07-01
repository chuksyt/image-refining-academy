'use client'
import { useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'

function CopyButton({ value, label }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false)
  const copy = useCallback(() => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }, [value])
  return (
    <button
      onClick={copy}
      title={`Copy ${label ?? value}`}
      className="inline-flex items-center gap-1.5 align-middle ml-2 bg-purple-100 hover:bg-purple-200 text-purple-700 text-xs font-semibold px-2.5 py-1 rounded-full transition-colors select-none"
    >
      {copied ? (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          Copied!
        </>
      ) : (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
          Copy
        </>
      )}
    </button>
  )
}

const gains = [
  { icon: '💪', title: 'Confidence', desc: 'Build unshakable self-belief and inner strength' },
  { icon: '🍽️', title: 'Etiquette', desc: 'Master modern etiquette for every setting' },
  { icon: '✨', title: 'Personal Branding', desc: 'Discover your unique value and build a strong personal brand' },
  { icon: '🗣️', title: 'Communication', desc: 'Speak with clarity, influence and emotional intelligence' },
  { icon: '🎯', title: 'Purpose', desc: 'Discover your God-given purpose and live intentionally' },
  { icon: '👗', title: 'Image', desc: 'Enhance your personal image with style and elegance' },
  { icon: '🏠', title: 'Managing Home, Career & Stress', desc: 'Balance responsibilities and thrive without burnout' },
]

const bonus = [
  'Premium Workbook',
  'Practical Assignments',
  'Private Community',
  'Exclusive Support',
]

export default function RefinedWomanPage() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal,.reveal-left,.reveal-right,.stagger')
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target) } })
    }, { threshold: 0.1 })
    els.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return (
    <>
      {/* ── HERO ── */}
      <section className="relative min-h-[92vh] flex items-center bg-gradient-to-br from-[#2D0050] via-[#4A0072] to-[#6B21A8] overflow-hidden pt-24 pb-16">
        {/* decorative blobs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-yellow-400/10 rounded-full blur-3xl pointer-events-none" />
        {/* gold accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center w-full">
          {/* Left – text */}
          <div>
            {/* breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-white/40 mb-6">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <span>›</span>
              <span className="text-yellow-400">Special Programme</span>
            </div>

            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-yellow-300 text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full mb-6">
              🎓 Online Registration Open
            </div>

            <p className="text-yellow-300/80 font-medium text-sm uppercase tracking-widest mb-2">
              Image Refining Academy Presents
            </p>
            <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight mb-2">
              Becoming a
            </h1>
            <h1 className="text-5xl lg:text-6xl font-bold text-yellow-300 leading-tight mb-2">
              Refined Woman
            </h1>
            <h2 className="text-2xl lg:text-3xl font-semibold text-white/80 mb-6">
              in Today&apos;s World
            </h2>
            <p className="text-white/60 italic mb-8 text-base">
              &ldquo;Transform Your Confidence. Refine Your Presence. Discover Your Purpose.&rdquo;
            </p>

            {/* event details pills */}
            <div className="flex flex-wrap gap-3 mb-10">
              {[
                { icon: '📅', label: '16th – 19th July, 2026' },
                { icon: '🕖', label: '7:00 PM – 8:00 PM WAT Daily' },
                { icon: '📲', label: 'Telegram (Live + Recordings)' },
              ].map(p => (
                <div key={p.label} className="flex items-center gap-2 bg-white/10 border border-white/20 text-white text-sm px-4 py-2.5 rounded-full">
                  <span>{p.icon}</span> {p.label}
                </div>
              ))}
            </div>

            {/* price + CTA */}
            <div className="flex flex-wrap items-center gap-6">
              <div>
                <div className="text-yellow-300 font-bold text-4xl">₦8,000</div>
                <div className="text-yellow-400 text-xs font-semibold mt-0.5">Early Bird — ends July 9, 2026</div>
                <div className="text-white/40 text-xs mt-0.5">₦10,000 after early bird</div>
              </div>
              <a
                href="/refined-woman-form.html"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-yellow-400 text-gray-900 font-bold text-base px-8 py-4 rounded-full hover:shadow-xl hover:shadow-yellow-500/30 hover:-translate-y-0.5 transition-all"
              >
                Register Now →
              </a>
            </div>
            <p className="text-white/30 text-xs mt-4">Space is limited — secure your spot today.</p>
          </div>

          {/* Right – Chinenye photo with flyer overlay feel */}
          <div className="hidden lg:flex justify-center items-end reveal-right">
            <div className="relative">
              <div className="w-[400px] h-[480px] rounded-3xl overflow-hidden border-2 border-yellow-500/30 shadow-2xl">
                <Image
                  src="/chinenye.jpg"
                  alt="Chinenye Nmerole — Lead Trainer"
                  width={400} height={480}
                  className="w-full h-full object-cover object-top"
                />
              </div>
              {/* crown badge */}
              <div className="absolute -top-4 -right-4 bg-gradient-to-br from-yellow-400 to-yellow-600 text-gray-900 font-bold text-xs text-center px-4 py-3 rounded-2xl shadow-lg max-w-[120px] leading-tight">
                👑<br/>Become the Woman God Created You to Be
              </div>
              {/* tags strip */}
              <div className="absolute -bottom-4 left-0 right-0 flex flex-wrap justify-center gap-1.5 px-2">
                {['Leadership', 'Etiquette', 'Personal Dev.', 'Protocol'].map(t => (
                  <span key={t} className="bg-white/90 text-purple-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ABOUT THE TRAINING ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center reveal">
            <div className="text-violet-600 font-semibold text-sm mb-3">About This Training</div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              A 4-Day <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-purple-500">Premium Transformation</span> Experience
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              A premium 4-day transformation experience designed to help women build confidence, refine their image, discover purpose, communicate with influence, and lead with grace in today&apos;s world.
            </p>
          </div>
        </div>
      </section>

      {/* ── WHAT YOU WILL GAIN ── */}
      <section className="py-20 bg-purple-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14 reveal">
            <div className="text-violet-600 font-semibold text-sm mb-3">What You Will Gain</div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              7 Powerful Areas of <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-purple-500">Transformation</span>
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-violet-600 to-purple-500 rounded-full mx-auto" />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger">
            {gains.map(g => (
              <div key={g.title} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all text-center">
                <div className="text-4xl mb-3">{g.icon}</div>
                <h4 className="font-bold text-gray-900 text-base mb-2">{g.title}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{g.desc}</p>
              </div>
            ))}
            {/* Bonus card */}
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-300 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all text-center">
              <div className="text-4xl mb-3">🎁</div>
              <h4 className="font-bold text-gray-900 text-base mb-3">Bonus Package</h4>
              <ul className="space-y-1.5">
                {bonus.map(b => (
                  <li key={b} className="flex items-center gap-2 text-sm text-gray-700 text-left">
                    <span className="text-yellow-600 font-bold">✓</span> {b}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── EVENT DETAILS STRIP ── */}
      <section className="py-16 bg-gradient-to-r from-[#2D0050] to-[#6B21A8]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {[
              { icon: '📅', label: 'Date', value: '16th – 19th July 2026' },
              { icon: '🕖', label: 'Time', value: '7:00 PM – 8:00 PM WAT' },
              { icon: '📲', label: 'Platform', value: 'Telegram (Live + Recordings)' },
              { icon: '💰', label: 'Fee', value: '₦8,000 Early Bird (until July 9)' },
            ].map(d => (
              <div key={d.label} className="bg-white/10 border border-white/20 rounded-2xl p-6">
                <div className="text-3xl mb-2">{d.icon}</div>
                <div className="text-yellow-300 text-xs font-bold uppercase tracking-widest mb-1">{d.label}</div>
                <div className="text-white font-semibold text-sm leading-tight">{d.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── REGISTER CTA ── */}
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-6 text-center reveal">
          <div className="text-violet-600 font-semibold text-sm mb-3">Ready to Transform?</div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Invest in Yourself.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-purple-500">
              Become the Woman of Value and Impact.
            </span>
          </h2>
          <p className="text-gray-500 mb-10 max-w-xl mx-auto leading-relaxed">
            Complete the registration form below and make your payment to secure your place. Your Telegram access details will be sent after payment confirmation.
          </p>

          {/* Payment reminder */}
          <div className="bg-purple-50 border border-purple-200 rounded-2xl p-6 mb-10 text-left max-w-lg mx-auto">
            <div className="text-purple-800 font-bold text-sm mb-3 uppercase tracking-wide">Payment Details</div>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex justify-between"><span className="text-gray-500">Bank</span><span className="font-semibold">Zenith Bank PLC</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Account Name</span><span className="font-semibold">Image Refining Academy Ltd</span></div>
              <div className="flex justify-between items-center"><span className="text-gray-500">Account Number</span><span className="font-bold text-purple-700 text-base flex items-center">1224596762<CopyButton value="1224596762" label="account number" /></span></div>
              <div className="flex justify-between"><span className="text-gray-500">Amount</span><span className="font-bold text-purple-700">₦8,000 <span className="text-gray-400 text-xs font-normal">(Early Bird until July 9)</span></span></div>
            </div>
            <div className="mt-4 pt-4 border-t border-purple-200 text-sm text-green-700 flex items-start gap-2">
              <span>📲</span>
              <span>After payment, send your receipt via WhatsApp to <strong>+234 803 726 9408</strong><CopyButton value="+2348037269408" label="WhatsApp number" /> with your full name.</span>
            </div>
          </div>

          <a
            href="/refined-woman-form.html"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-violet-700 to-purple-500 text-white font-bold text-lg px-12 py-5 rounded-full hover:shadow-2xl hover:shadow-violet-500/40 hover:-translate-y-1 transition-all"
          >
            Complete Registration Form →
          </a>
          <p className="text-gray-400 text-xs mt-4">Your information is safe and will only be used for this training.</p>
        </div>
      </section>

      {/* ── ABOUT THE TRAINER ── */}
      <section className="py-20 bg-purple-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-white rounded-3xl shadow-md overflow-hidden flex flex-col md:flex-row items-center gap-0 reveal">
            <div className="w-full md:w-64 h-64 md:h-auto flex-shrink-0">
              <Image
                src="/chinenye.jpg"
                alt="Chinenye Nmerole"
                width={256} height={320}
                className="w-full h-64 md:h-full object-cover object-top"
              />
            </div>
            <div className="p-8 md:p-10">
              <div className="text-violet-600 font-semibold text-sm mb-2">Your Trainer</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Chinenye Juliet Nmerole</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">
                Certified Etiquette and Personal Development Consultant, speaker, and transformational coach. Founder of Image Refining Academy — dedicated to helping women rediscover their identity, build confidence, and lead with elegance and purpose.
              </p>
              <div className="flex flex-wrap gap-2">
                {['Certified Etiquette Consultant', 'Transformational Coach', 'Speaker & Trainer'].map(tag => (
                  <span key={tag} className="bg-violet-100 text-violet-700 text-xs font-semibold px-3 py-1 rounded-full">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-16 bg-gradient-to-r from-[#2D0050] to-[#6B21A8]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Space is Limited — Don&apos;t Miss Out</h2>
          <p className="text-white/70 mb-8">16th – 19th July 2026 · 7 PM WAT · Telegram</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="/refined-woman-form.html"
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 font-bold px-10 py-4 rounded-full hover:shadow-xl hover:shadow-yellow-500/30 hover:-translate-y-0.5 transition-all"
            >
              Register Now
            </a>
            <a
              href="https://wa.me/2348037269408?text=Hi%20Chinenye%2C%20I%20would%20like%20to%20know%20more%20about%20the%20Becoming%20a%20Refined%20Woman%20training."
              target="_blank" rel="noopener noreferrer"
              className="border-2 border-white/40 text-white font-semibold px-10 py-4 rounded-full hover:border-white transition-all"
            >
              Enquire via WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
