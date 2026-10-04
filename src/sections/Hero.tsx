import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'
import { resume } from '../data/resume'
import { state } from '../lib/state'

export default function Hero({ ready }: { ready: boolean }) {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const st = { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true }
      ScrollTrigger.create({ ...st, onUpdate: (s) => (state.hero = s.progress) })
      // Three layers leave at three speeds.
      gsap.to('.hero__first', { yPercent: -35, ease: 'none', scrollTrigger: st })
      gsap.to('.hero__last', { yPercent: -110, xPercent: 6, ease: 'none', scrollTrigger: st })
      gsap.to('.hero__foot', { yPercent: -60, opacity: 0, ease: 'none', scrollTrigger: st })
    },
    { scope: root },
  )

  useGSAP(
    () => {
      if (!ready) return
      const first = new SplitText('.hero__first', { type: 'chars' })
      const last = new SplitText('.hero__last', { type: 'chars' })
      gsap
        .timeline({ defaults: { ease: 'expo.out' } })
        .from(first.chars, { yPercent: 90, opacity: 0, rotateX: -70, stagger: 0.06, duration: 1.2 })
        .from(last.chars, { yPercent: 60, opacity: 0, stagger: 0.025, duration: 0.9 }, 0.35)
        .from('.hero__meta > *, .hero__foot > *', { y: 24, opacity: 0, stagger: 0.07, duration: 0.9 }, 0.6)
      gsap.to(state, { intro: 1, duration: 1.3, ease: 'back.out(1.5)', delay: 0.15 })
      gsap
        .timeline({ delay: 1.1 })
        .to(state, { wave: 1, duration: 0.35 })
        .to(state, { wave: 0, duration: 0.5 }, '+=1.5')
    },
    { scope: root, dependencies: [ready] },
  )

  return (
    <section className="hero" id="hero" ref={root} data-ready={ready}>
      <div className="hero__meta">
        <span>Portfolio / 2026</span>
        <span>12.97° N, 77.59° E</span>
      </div>
      <h1 className="hero__title" aria-label={`${resume.firstName} ${resume.lastName}`}>
        <span className="hero__first" aria-hidden>{resume.firstName}</span>
        <span className="hero__last" aria-hidden>{resume.lastName}</span>
      </h1>
      <div className="hero__foot">
        <div className="hero__role">
          <span className="tag">L0 / client</span>
          <strong>{resume.role}</strong>
          <p>{resume.tagline}</p>
        </div>
        <div className="hero__scroll">
          <span className="hero__wheel" />
          scroll to descend the stack
        </div>
      </div>
    </section>
  )
}
