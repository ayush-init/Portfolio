import { useState } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
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
  const [current, setCurrent] = useState(0)

  useGSAP(() => {
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
      </header>
    </>
  )
}
