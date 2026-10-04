import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { resume, type Project } from '../data/resume'

function Cover({ kind }: { kind: Project['cover'] }) {
  if (kind === 'docs')
    return (
      <svg viewBox="0 0 400 250" role="img" aria-label="Export documents being filled automatically">
        <rect className="c-sheet" x="150" y="34" width="190" height="190" rx="10" transform="rotate(7 245 129)" />
        <rect className="c-sheet" x="90" y="28" width="190" height="196" rx="10" transform="rotate(-4 185 126)" />
        <g transform="rotate(-4 185 126)">
          <rect className="c-blue" x="110" y="50" width="70" height="12" rx="4" />
          {[80, 104, 128, 152].map((y, i) => (
            <g key={y}>
              <rect className="c-line" x="110" y={y} width="48" height="8" rx="3" />
              <rect className={i < 3 ? 'c-fill' : 'c-line'} x="168" y={y - 3} width={[92, 70, 84, 60][i]} height="14" rx="4" />
            </g>
          ))}
          <circle className="c-tang" cx="238" cy="192" r="16" />
          <path className="c-check" d="m230 192 6 6 11-12" />
        </g>
        <rect className="c-ink" x="34" y="150" width="120" height="58" rx="12" />
        <rect className="c-paper" x="48" y="166" width="70" height="7" rx="3" />
        <rect className="c-blue" x="48" y="182" width="42" height="7" rx="3" />
      </svg>
    )
  if (kind === 'board')
    return (
      <svg viewBox="0 0 400 250" role="img" aria-label="Leaderboard and activity chart">
        <rect className="c-sheet" x="26" y="26" width="200" height="198" rx="12" />
        {[0, 1, 2, 3, 4].map((i) => (
          <g key={i}>
            <circle className={i === 0 ? 'c-tang' : 'c-line'} cx="50" cy={58 + i * 34} r="9" />
            <rect className="c-line" x="68" y={53 + i * 34} width={[70, 58, 64, 46, 52][i]} height="10" rx="4" />
            <rect className={i === 0 ? 'c-blue' : 'c-fill'} x="160" y={52 + i * 34} width={[52, 44, 38, 30, 24][i]} height="12" rx="4" />
          </g>
        ))}
        <rect className="c-ink" x="244" y="26" width="130" height="118" rx="12" />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <rect key={i} className={i === 4 ? 'c-tang' : 'c-blue'} x={258 + i * 18} y={124 - [34, 52, 44, 70, 86, 62][i]} width="11" height={[34, 52, 44, 70, 86, 62][i]} rx="3" />
        ))}
        <rect className="c-sheet" x="244" y="158" width="130" height="66" rx="12" />
        <path className="c-stroke" d="M258 206c14-4 18-26 32-24s14 16 28 10 20-22 42-24" />
      </svg>
    )
  if (kind === 'cities')
    return (
      <svg viewBox="0 0 400 250" role="img" aria-label="Four connected cities">
        <path className="c-dash" d="M78 170 168 70 262 150 336 78M78 170l184-20" />
        {[
          [78, 170],
          [168, 70],
          [262, 150],
          [336, 78],
        ].map(([x, y], i) => (
          <g key={i}>
            <circle className="c-ring" cx={x} cy={y} r="30" />
            <circle className="c-ring" cx={x} cy={y} r="18" />
            <circle className={i === 2 ? 'c-tang' : 'c-blue'} cx={x} cy={y} r="9" />
          </g>
        ))}
        <rect className="c-ink" x="36" y="30" width="96" height="34" rx="10" />
        <rect className="c-paper" x="50" y="43" width="56" height="8" rx="3" />
        <rect className="c-sheet" x="270" y="186" width="104" height="38" rx="10" />
        <rect className="c-blue" x="284" y="200" width="44" height="9" rx="3" />
      </svg>
    )
  return (
    <svg viewBox="0 0 400 250" role="img" aria-label="Contribution graph">
      {Array.from({ length: 18 * 7 }, (_, i) => {
        const x = Math.floor(i / 7)
        const y = i % 7
        const v = (x * 7 + y * 13 + ((x * y) % 5) * 3) % 9
        return (
          <rect
            key={i}
            className={v > 6 ? 'c-blue' : v > 4 ? 'c-fill' : v === 0 ? 'c-tang' : 'c-cell'}
            x={30 + x * 19}
            y={50 + y * 21}
            width="14"
            height="16"
            rx="4"
          />
        )
      })}
    </svg>
  )
}

function tilt(e: React.PointerEvent<HTMLElement>) {
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
          gsap.fromTo(card.querySelector('.card__cover svg'), { xPercent: -7 }, { xPercent: 7, ease: 'none', scrollTrigger: range })
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
              design <i>—</i> build <i>—</i> deploy <i>—</i> scale <i>—</i>
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
            <p>Real products with real users. Keep scrolling, the gallery moves sideways.</p>
          </header>

          {resume.projects.map((p, i) => (
            <div className="card-wrap" key={p.title}>
              <span className="card__num" aria-hidden>
                {String(i + 1).padStart(2, '0')}
              </span>
              <article className="card" onPointerMove={tilt} onPointerLeave={untilt}>
                <div className="card__cover">
                  <div className="card__chrome">
                    <i />
                    <i />
                    <i />
                    <span>{p.linkLabel || p.title.toLowerCase()}</span>
                  </div>
                  <Cover kind={p.cover} />
                </div>
                <div className="card__body">
                  <div className="card__meta">
                    <span>{p.kind}</span>
                    <span>{p.year}</span>
                  </div>
                  <h3>{p.title}</h3>
                  <p>{p.blurb}</p>
                  {p.points.length > 0 && (
                    <ul>
                      {p.points.map((pt) => (
                        <li key={pt}>{pt}</li>
                      ))}
                    </ul>
                  )}
                  <div className="card__stack">
                    {p.stack.map((s) => (
                      <span key={s}>{s}</span>
                    ))}
                  </div>
                  {p.href && (
                    <a className="card__link" href={p.href} target="_blank" rel="noreferrer">
                      Visit {p.linkLabel} <span aria-hidden>↗</span>
                    </a>
                  )}
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
