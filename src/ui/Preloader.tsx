import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { resume } from '../data/resume'

export default function Preloader({ go, onDone }: { go: boolean; onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null)
  const num = useRef<HTMLSpanElement>(null)

  useGSAP(
    () => {
      if (!go) return
      const count = { v: 0 }
      gsap
        .timeline({ onComplete: onDone })
        .to(count, {
          v: 100,
          duration: 1.5,
          ease: 'power2.inOut',
          onUpdate: () => {
            if (num.current) num.current.textContent = String(Math.round(count.v)).padStart(3, '0')
          },
        })
        .to('.boot__row', { opacity: 1, x: 0, stagger: 0.22, duration: 0.3 }, 0.1)
        .to(root.current, { yPercent: -100, duration: 0.9, ease: 'expo.inOut' }, '+=0.15')
        .set(root.current, { display: 'none' })
    },
    { scope: root, dependencies: [go] },
  )

  return (
    <div className="boot" ref={root} role="status" aria-label="Loading">
      <div className="boot__rows">
        {resume.stack.map((l) => (
          <div className="boot__row" key={l.code}>
            <span>{l.code}</span>
            <span>{l.name}</span>
            <span>ok</span>
          </div>
        ))}
      </div>
      <div className="boot__count">
        <span ref={num}>000</span>
        <small>booting the stack</small>
      </div>
    </div>
  )
}
