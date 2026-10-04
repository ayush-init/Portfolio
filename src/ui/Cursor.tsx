import { useEffect, useRef } from 'react'
import gsap from 'gsap'

// A soft follower ring; the native cursor stays visible.
export default function Cursor() {
  const ring = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ring.current
    if (!el || !matchMedia('(pointer: fine)').matches) return
    const x = gsap.quickTo(el, 'x', { duration: 0.45, ease: 'power3' })
    const y = gsap.quickTo(el, 'y', { duration: 0.45, ease: 'power3' })
    const move = (e: PointerEvent) => {
      x(e.clientX)
      y(e.clientY)
      el.classList.add('is-on')
      el.classList.toggle('is-hover', !!(e.target as Element).closest?.('a, button, [data-hover]'))
    }
    addEventListener('pointermove', move)
    return () => removeEventListener('pointermove', move)
  }, [])

  return <div className="cursor" ref={ring} aria-hidden />
}

export function magnetic(e: React.PointerEvent<HTMLElement>) {
  const el = e.currentTarget
  const r = el.getBoundingClientRect()
  gsap.to(el, {
    x: (e.clientX - r.left - r.width / 2) * 0.3,
    y: (e.clientY - r.top - r.height / 2) * 0.4,
    duration: 0.4,
    ease: 'power3',
  })
}
export function release(e: React.PointerEvent<HTMLElement>) {
  gsap.to(e.currentTarget, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.4)' })
}
