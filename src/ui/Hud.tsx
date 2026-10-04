import { useRef, useState } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { resume } from '../data/resume'
import { scrollToId } from '../lib/state'

const SECTIONS = [
  { id: 'hero', label: 'intro', nav: '' },
  { id: 'about', label: 'readme', nav: 'About' },
  { id: 'skills', label: 'the stack', nav: 'Stack' },
  { id: 'experience', label: 'git log', nav: 'Experience' },
  { id: 'projects', label: 'deployments', nav: 'Work' },
  { id: 'contact', label: 'contact', nav: 'Contact' },
]

export default function Hud() {
  const fill = useRef<HTMLSpanElement>(null)
  const pct = useRef<HTMLSpanElement>(null)
  const [current, setCurrent] = useState(0)

  useGSAP(() => {
    ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (s) => {
        if (fill.current) fill.current.style.transform = `scaleY(${s.progress})`
        if (pct.current) pct.current.textContent = String(Math.round(s.progress * 100)).padStart(3, '0')
      },
    })
    SECTIONS.forEach((sec, i) => {
      const el = document.getElementById(sec.id)!
      // A pinned section only spans one screen; its spacer spans the whole pinned distance.
      const spacer = el.parentElement?.classList.contains('pin-spacer') ? el.parentElement : el
      ScrollTrigger.create({
        trigger: spacer,
        start: 'top center',
        end: 'bottom center',
        onToggle: (s) => s.isActive && setCurrent(i),
      })
    })
  })

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    scrollToId(id)
  }

  return (
    <>
      <header className="hud">
        <a className="hud__mark" href="#hero" onClick={go('hero')} data-hover>
          <b>{resume.firstName[0]}{resume.lastName[0]}</b>
          <span>resume.v1</span>
        </a>
        <nav className="hud__nav" aria-label="Sections">
          {SECTIONS.filter((s) => s.nav).map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              onClick={go(s.id)}
              className={SECTIONS[current].id === s.id ? 'is-current' : ''}
              data-hover
            >
              {s.nav}
            </a>
          ))}
        </nav>
        <span className="hud__status">
          <i /> {resume.location}
        </span>
      </header>
      <aside className="depth" aria-hidden>
        <span className="depth__label">
          {String(current).padStart(2, '0')} / {SECTIONS[current].label}
        </span>
        <span className="depth__track">
          <span className="depth__fill" ref={fill} />
        </span>
        <span className="depth__pct">
          depth <span ref={pct}>000</span>
        </span>
      </aside>
    </>
  )
}
