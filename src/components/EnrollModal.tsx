'use client'
import { useEffect, useRef } from 'react'
import { COURSES, type Course } from '@/lib/courses'
import { useLiveData } from '@/lib/useLiveData'

interface Props {
  courseKey: string | null
  onClose: () => void
}

declare global {
  interface Window {
    PaystackPop: {
      setup: (config: Record<string, unknown>) => { openIframe: () => void }
    }
  }
}

export default function EnrollModal({ courseKey, onClose }: Props) {
  const formRef = useRef<HTMLFormElement>(null)
  const courses = useLiveData('/api/courses', 'courses', COURSES)
  const course: Course | undefined = courses.find(c => c.key === courseKey)
  const isOpen = !!course

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [isOpen, onClose])

  function showToast(title: string, message: string, type: 'success' | 'error' | 'info') {
    const existing = document.querySelector('.toast')
    if (existing) existing.remove()
    const icons = { success: '✅', error: '❌', info: 'ℹ️' }
    const el = document.createElement('div')
    el.className = `toast ${type}`
    el.innerHTML = `<span style="font-size:1.2rem">${icons[type]}</span><div><strong style="display:block;font-size:0.9rem;color:#111">${title}</strong><span style="font-size:0.8rem;color:#555">${message}</span></div>`
    document.body.appendChild(el)
    requestAnimationFrame(() => el.classList.add('show'))
    setTimeout(() => { el.classList.remove('show'); setTimeout(() => el.remove(), 400) }, 4500)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!formRef.current || !course) return

    const name  = (formRef.current.querySelector('#enroll-name')  as HTMLInputElement).value.trim()
    const email = (formRef.current.querySelector('#enroll-email') as HTMLInputElement).value.trim()
    const phone = (formRef.current.querySelector('#enroll-phone') as HTMLInputElement).value.trim()

    if (!name || !email || !phone) return showToast('Missing Info', 'Please fill in all fields.', 'error')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return showToast('Invalid Email', 'Please enter a valid email address.', 'error')

    const btn = formRef.current.querySelector('button[type="submit"]') as HTMLButtonElement
    btn.disabled = true
    btn.textContent = 'Connecting…'

    const handler = window.PaystackPop.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
      email,
      amount: course.price,
      currency: 'NGN',
      ref: 'IRA_' + Date.now(),
      metadata: {
        custom_fields: [
          { display_name: 'Student Name',  variable_name: 'student_name',  value: name },
          { display_name: 'Phone Number',  variable_name: 'phone_number',  value: phone },
          { display_name: 'Course',        variable_name: 'course',        value: course.name },
        ],
      },
      callback: async (response: { reference: string }) => {
        onClose()
        formRef.current?.reset()
        // Send confirmation email via API
        fetch('/api/enroll', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            reference: response.reference,
            name,
            email,
            phone,
            courseKey,
            courseName: course.name,
            amount: course.price,
          }),
        }).catch(console.error)
        showToast('Enrollment Successful! 🎉', `Transaction ref: ${response.reference}. A confirmation email is on its way!`, 'success')
      },
      onClose: () => {
        btn.disabled = false
        btn.textContent = 'Proceed to Payment'
        showToast('Payment Cancelled', 'Your payment was not completed.', 'info')
      },
    })
    handler.openIframe()
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
        >
          ✕
        </button>

        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center text-2xl mx-auto mb-3">
            🎓
          </div>
          <h3 className="text-xl font-bold text-gray-900">Enroll in Course</h3>
          <p className="text-sm text-gray-500 mt-1">{course.name}</p>
          <p className="text-violet-600 font-bold text-lg mt-1">{course.priceDisplay}</p>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          {[
            { id: 'enroll-name',  label: 'Full Name',        type: 'text',  placeholder: 'e.g. Chidinma Okafor' },
            { id: 'enroll-email', label: 'Email Address',    type: 'email', placeholder: 'you@example.com' },
            { id: 'enroll-phone', label: 'Phone Number',     type: 'tel',   placeholder: '+234 803 726 9408' },
          ].map(f => (
            <div key={f.id}>
              <label htmlFor={f.id} className="block text-sm font-medium text-gray-700 mb-1">
                {f.label} <span className="text-red-500">*</span>
              </label>
              <input
                id={f.id}
                type={f.type}
                placeholder={f.placeholder}
                required
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>
          ))}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-violet-600 to-purple-500 text-white font-semibold py-3 rounded-xl hover:shadow-lg hover:shadow-violet-500/30 transition-all flex items-center justify-center gap-2 mt-2"
          >
            🔒 Proceed to Payment
          </button>
          <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1">
            🛡️ Secured by Paystack. Your payment is safe.
          </p>
        </form>
      </div>
    </div>
  )
}
