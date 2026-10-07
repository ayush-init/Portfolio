import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { resume } from '../data/resume'

function tilt(e: React.PointerEvent<HTMLElement>) {
  if (e.pointerType !== 'mouse') return
  const el = e.currentTarget
  const r = el.getBoundingClientRect()
  const x = (e.clientX - r.left) / r.width - 0.5
  const y = (e.clientY - r.top) / r.height - 0.5
  gsap.to(el, { rotateY: x * 9, rotateX: -y * 9, duration: 0.5, ease: 'power3' })
}
function untilt(e: React.PointerEvent<HTMLElement>) {
  gsap.to(e.currentTarget, { rotateY: 0, rotateX: 0, duration: 1, ease: 'elastic.out(1, 0.5)' })
}

export default function Projects() {
  const root = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      gsap.to('.marquee__inner', {
        xPercent: -35,
        ease: 'none',
        scrollTrigger: { trigger: '.marquee', start: 'top bottom', end: 'bottom top', scrub: true },
      })
      const mm = gsap.matchMedia()
      mm.add('(min-width: 900px)', () => {
        const el = track.current!
        const dist = () => el.scrollWidth - innerWidth
        const slide = gsap.to(el, {
          x: () => -dist(),
          ease: 'none',
          scrollTrigger: {
            trigger: '.work__pin',
            start: 'top top',
            end: () => `+=${dist()}`,
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        })
        // Inside the horizontal run, numbers and covers travel at their own speeds.
        gsap.utils.toArray<HTMLElement>('.card').forEach((card) => {
          const range = { containerAnimation: slide, trigger: card, start: 'left right', end: 'right left', scrub: true }
          gsap.fromTo(card.querySelector('.card__num'), { xPercent: 45 }, { xPercent: -45, ease: 'none', scrollTrigger: range })
          gsap.fromTo(card.querySelector('.card__cover > *'), { xPercent: -5 }, { xPercent: 5, ease: 'none', scrollTrigger: range })
        })
      })
      mm.add('(max-width: 899px)', () => {
        gsap.utils.toArray<HTMLElement>('.card').forEach((card) =>
          gsap.from(card, { y: 80, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: card, start: 'top 85%' } }),
        )
      })
    },
    { scope: root },
  )

  return (
    <section className="work" id="projects" ref={root}>
      <div className="marquee" aria-hidden>
        <div className="marquee__inner">
          {Array.from({ length: 4 }, (_, i) => (
            <span key={i}>
              design <i>-</i> build <i>-</i> deploy <i>-</i> scale <i>-</i>
            </span>
          ))}
        </div>
      </div>

      <div className="work__pin">
        <div className="work__track" ref={track}>
          <header className="work__head">
            <span className="tag">04 / deployments</span>
            <h2>
              Things I <em>shipped</em>
            </h2>
            <p>
              Real products with real users.<span className="wide-only"> Keep scrolling, the gallery moves sideways.</span>
            </p>
          </header>

          {resume.projects.map((p, i) => (
            <div className="card-wrap" key={p.title}>
              <span className="card__num" aria-hidden>
                {String(i + 1).padStart(2, '0')}
              </span>
              <article className="card" onPointerMove={tilt} onPointerLeave={untilt}>
                <a
                  className="card__cover"
                  href={p.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Open ${p.linkLabel}`}
                  data-hover
                >
                  {p.imageKind === 'logo' ? (
                    <img className="card__logo" src={`${import.meta.env.BASE_URL}projects/${p.image}`} alt="" loading="lazy" />
                  ) : (
                    <div className="card__shot">
                      <div className="card__chrome">
                        <i />
                        <i />
                        <i />
                        <span>{p.linkLabel}</span>
                      </div>
                      <img src={`${import.meta.env.BASE_URL}projects/${p.image}`} alt={`${p.title} home page`} loading="lazy" />
                    </div>
                  )}
                </a>
                <div className="card__body">
                  <span className="card__meta">{p.kind}</span>
                  <h3>{p.title}</h3>
                  <p>{p.blurb}</p>
                  <a className="card__link" href={p.href} target="_blank" rel="noreferrer">
                    Visit {p.linkLabel} <span aria-hidden>↗</span>
                  </a>
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
