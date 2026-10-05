import gsap from 'gsap'

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
