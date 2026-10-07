import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'
import { resume } from '../data/resume'
import { state } from '../lib/state'
import { magnetic, release } from '../ui/Cursor'

export default function Contact() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      ScrollTrigger.create({
        // Looked up directly: selector strings here are scoped to this section.
        trigger: document.getElementById('experience'),
        start: 'top bottom',
        endTrigger: root.current,
        end: 'top bottom',
        onUpdate: (s) => (state.tail = s.progress),
      })
      ScrollTrigger.create({
        trigger: root.current,
        start: 'top bottom',
        end: 'bottom bottom',
        onUpdate: (s) => (state.contact = s.progress),
      })
      const split = new SplitText('.contact h2', { type: 'words' })
      gsap
        .timeline({ scrollTrigger: { trigger: root.current, start: 'top 45%' } })
        .from(split.words, { yPercent: 80, opacity: 0, rotateX: -50, stagger: 0.06, duration: 1, ease: 'expo.out' })
        .from('.term__line', { opacity: 0, x: -14, stagger: 0.35, duration: 0.4 }, 0.3)
        .from('.contact__links > *', { y: 30, opacity: 0, stagger: 0.08, duration: 0.7, ease: 'power3.out' }, 0.5)
    },
    { scope: root },
  )

  return (
    <section className="contact" id="contact" ref={root}>
      <div className="contact__col">
        <span className="tag">05 / the core</span>
        <h2>
          Got something to build? <em>Let's ship it.</em>
        </h2>

        <div className="term" aria-hidden>
          <div className="term__bar">
            <i />
            <i />
            <i />
            <span>zsh</span>
          </div>
          <p className="term__line">
            <b>$</b> curl -X POST /api/hire -d '{`{"to":"${resume.firstName.toLowerCase()}"}`}'
          </p>
          <p className="term__line term__ok">201 Created</p>
          <p className="term__line">
            <b>$</b> <span className="term__caret" />
          </p>
        </div>

        <div className="contact__links">
          <a className="btn btn--solid" href={`mailto:${resume.email}`} onPointerMove={magnetic} onPointerLeave={release}>
            {resume.email} <span aria-hidden>↗</span>
          </a>
          {resume.links.map((l) => (
            <a className="btn" key={l.label} href={l.href} target="_blank" rel="noreferrer" onPointerMove={magnetic} onPointerLeave={release}>
              {l.label} <small>{l.handle}</small>
            </a>
          ))}
          {resume.phone && (
            <a className="btn" href={`tel:${resume.phone.replace(/\s/g, '')}`} onPointerMove={magnetic} onPointerLeave={release}>
              {resume.phone}
            </a>
          )}
          {resume.resumeUrl && (
            <a className="btn" href={resume.resumeUrl} download onPointerMove={magnetic} onPointerLeave={release}>
              Download resume <span aria-hidden>↓</span>
            </a>
          )}
        </div>
      </div>
    </section>
  )
}
