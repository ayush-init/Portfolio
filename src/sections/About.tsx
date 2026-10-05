import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'
import { resume } from '../data/resume'
import { state } from '../lib/state'

export default function About() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      ScrollTrigger.create({
        trigger: root.current,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (s) => (state.about = s.progress),
      })
      const split = new SplitText('.about__lead', { type: 'words' })
      gsap.fromTo(
        split.words,
        { opacity: 0.12 },
        {
          opacity: 1,
          stagger: 0.08,
          ease: 'none',
          scrollTrigger: { trigger: '.about__lead', start: 'top 82%', end: 'bottom 48%', scrub: true },
        },
      )
      gsap.from('.about__body p', {
        y: 40,
        opacity: 0,
        stagger: 0.15,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.about__body', start: 'top 85%' },
      })
      gsap.utils.toArray<HTMLElement>('.stat').forEach((el, i) => {
        const num = el.querySelector('b span')!
        const end = Number(el.dataset.value)
        const count = { v: 0 }
        gsap
          .timeline({ scrollTrigger: { trigger: '.about__stats', start: 'top 88%' }, delay: i * 0.12 })
          .from(el, { y: 50, opacity: 0, duration: 0.8, ease: 'power3.out' })
          .to(
            count,
            {
              v: end,
              duration: 1.6,
              ease: 'power2.out',
              onUpdate: () => (num.textContent = Math.round(count.v).toLocaleString('en-IN')),
            },
            0,
          )
      })
    },
    { scope: root },
  )

  return (
    <section className="about" id="about" ref={root}>
      <div className="about__col">
        <span className="tag">01 / readme.md</span>
        <h2 className="about__lead">
          {resume.about.lead} <em>{resume.about.leadAccent}</em>
        </h2>
        <div className="about__body">
          {resume.about.body.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
        <div className="about__stats">
          {resume.about.stats.map((s) => (
            <div className="stat" key={s.label} data-value={s.value}>
              <b>
                {s.prefix}
                <span>{s.value.toLocaleString('en-IN')}</span>
                {s.suffix}
              </b>
              <small>{s.label}</small>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
