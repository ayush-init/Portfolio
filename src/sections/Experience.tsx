import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { resume } from '../data/resume'
import { state } from '../lib/state'

export default function Experience() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      ScrollTrigger.create({
        trigger: root.current,
        start: 'top bottom',
        end: 'top 50%',
        onUpdate: (s) => (state.xpIn = s.progress),
      })
      gsap.from('.xp__head > *', {
        y: 60,
        opacity: 0,
        stagger: 0.1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.xp__head', start: 'top 80%' },
      })
      gsap.fromTo(
        '.xp__fill',
        { scaleY: 0 },
        { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.xp__log', start: 'top 62%', end: 'bottom 62%', scrub: true } },
      )
      gsap.utils.toArray<HTMLElement>('.commit').forEach((el) => {
        gsap
          .timeline({ scrollTrigger: { trigger: el, start: 'top 82%' } })
          .from(el.querySelector('.commit__node'), { scale: 0, duration: 0.5, ease: 'back.out(3)' })
          .from(
            el.querySelector('.commit__card'),
            { y: 70, opacity: 0, rotateX: -22, duration: 1.1, ease: 'expo.out' },
            0.05,
          )
          .from(el.querySelectorAll('.commit__card li, .commit__tags span'), {
            y: 16,
            opacity: 0,
            stagger: 0.05,
            duration: 0.5,
          }, 0.35)
        // Cards drift at a slightly different rate than the page.
        gsap.to(el.querySelector('.commit__card'), {
          yPercent: -8,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
        })
      })
    },
    { scope: root },
  )

  return (
    <section className="xp" id="experience" ref={root}>
      <header className="xp__head">
        <span className="tag">03 / git log --experience</span>
        <h2>
          Commit <em>history</em>
        </h2>
        <p>Where I have worked, what I shipped, and where I am studying.</p>
      </header>

      <div className="xp__log">
        <span className="xp__line">
          <span className="xp__fill" />
        </span>
        {resume.experience.map((c) => (
          <article className={`commit commit--${c.kind}`} key={c.hash}>
            <span className="commit__node" />
            <div className="commit__card">
              <div className="commit__meta">
                <span className="commit__hash">
                  {c.kind === 'edu' ? 'branch edu' : 'commit'} {c.hash}
                </span>
                <span>{c.period}</span>
              </div>
              <h3>{c.role}</h3>
              <p className="commit__org">
                {c.org}
                {c.orgNote && <small>{c.orgNote}</small>}
              </p>
              {c.points.length > 0 && (
                <ul>
                  {c.points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              )}
              {c.tags.length > 0 && (
                <div className="commit__tags">
                  {c.tags.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
