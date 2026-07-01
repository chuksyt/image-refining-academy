import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/logo.png"
                alt="Image Refining Academy"
                width={56}
                height={56}
                className="object-contain"
              />
              <div>
                <div className="text-white font-bold text-sm">Image Refining Academy</div>
                <div className="text-purple-400 text-xs">Est. 2020</div>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-5">
              Empowering individuals with world-class etiquette education. Elegance is not a luxury — it&apos;s a lifestyle.
            </p>
            <div className="flex gap-3">
              {[
                { icon: 'facebook-f', href: 'https://facebook.com/chinenye.nmerole' },
                { icon: 'instagram',  href: 'https://www.instagram.com/image_refining_academy/' },
                { icon: 'tiktok',     href: 'https://www.tiktok.com/@chinenye.nmerole?lang=en' },
              ].map(s => (
                <a key={s.icon} href={s.href} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 hover:border-purple-500 hover:text-purple-400 transition-colors text-xs">
                  <i className={`fab fa-${s.icon}`} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h5 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Quick Links</h5>
            <ul className="space-y-2.5">
              {[['/', 'Home'], ['/about', 'About Us'], ['/blog', 'Blog'], ['/gallery', 'Gallery'], ['/contact', 'Contact']].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-gray-400 hover:text-purple-400 transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Monthly Programmes */}
          <div>
            <h5 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Monthly Training</h5>
            <ul className="space-y-2.5">
              {[
                ['2nd Saturday', 'Teenagers Training'],
                ['4th Saturday', 'Women\'s Training'],
              ].map(([when, what]) => (
                <li key={what}>
                  <a href="https://wa.me/2348037269408" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-purple-400 transition-colors">
                    <span className="text-purple-400 text-xs">{when} — </span>{what}
                  </a>
                </li>
              ))}
              <li className="pt-2">
                <a href="https://wa.me/2348037269408" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-purple-400 font-semibold hover:text-purple-300 transition-colors">
                  Register via WhatsApp →
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h5 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Contact</h5>
            <div className="space-y-3">
              {[
                { icon: 'fa-phone',   text: '+234 803 726 9408' },
                { icon: 'fa-envelope',text: 'imagerefining7@gmail.com' },
                { icon: 'fa-clock',   text: 'Mon–Fri: 9am – 5pm' },
              ].map(({ icon, text }) => (
                <div key={icon} className="flex items-center gap-3 text-sm text-gray-400">
                  <i className={`fa-solid ${icon} text-purple-400 w-4`} />
                  {text}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
          <span>&copy; {new Date().getFullYear()} Image Refining Academy. All rights reserved.</span>
          <span>Designed with elegance for Chinenye Nmerole</span>
        </div>
      </div>
    </footer>
  )
}
