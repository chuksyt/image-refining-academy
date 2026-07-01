'use client'
import { useEffect, useRef, useState } from 'react'

export default function Preloader() {
  const [hidden, setHidden] = useState(false)
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let w = 0
    const iv = setInterval(() => {
      w = Math.min(w + Math.random() * 18, 90)
      if (barRef.current) barRef.current.style.width = w + '%'
    }, 120)

    const finish = () => {
      clearInterval(iv)
      if (barRef.current) barRef.current.style.width = '100%'
      setTimeout(() => setHidden(true), 350)
    }

    if (document.readyState === 'complete') {
      finish()
    } else {
      window.addEventListener('load', finish, { once: true })
    }
    return () => clearInterval(iv)
  }, [])

  if (hidden) return null

  return (
    <div className="preloader">
      <div className="preloader-logo"><em>Image</em> Refining Academy</div>
      <div className="preloader-bar-wrap">
        <div className="preloader-bar" ref={barRef} />
      </div>
    </div>
  )
}
