import { useRef, useState } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { resume } from '../data/resume'
import { state } from '../lib/state'
import { activeLayer } from '../three/world'

export default function Skills() {
  const root = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)
  const layers = resume.stack

  useGSAP(
    () => {
      ScrollTrigger.create({
        trigger: root.current,
        start: 'top bottom',
        end: 'top top',
        onUpdate: (s) => (state.skillsIn = s.progress),
      })
      ScrollTrigger.create({
        trigger: root.current,
        start: 'top top',
        // less scrolling per layer on phones
        end: () => `+=${layers.length * (innerWidth < 900 ? 60 : 95)}%`,
        invalidateOnRefresh: true,
        pin: true,
        onUpdate: (s) => {
          state.skills = s.progress
          setActive(activeLayer())
        },
        onLeave: () => (state.hoverSkill = ''),
        onLeaveBack: () => (state.hoverSkill = ''),
      })
    },
    { scope: root },
  )

  return (
    <section className="skills" id="skills" ref={root}>
      <div className="skills__inner">
        <header className="skills__head">
          <span className="tag">02 / the stack</span>
          <h2>
            Everything I <em>stand on</em>
          </h2>
        </header>

        <div className="skills__scene" aria-hidden />
        <div className="skills__panels">
          {layers.map((layer, i) => (
            <article className={`layer ${i === active ? 'is-active' : ''}`} key={layer.code} aria-hidden={i !== active}>
              <div className="layer__top">
                <span className="layer__code">{layer.code}</span>
                <div>
                  <h3>{layer.name}</h3>
                  <p>{layer.blurb}</p>
                </div>
              </div>
              <ul>
                {layer.skills.map((skill, j) => (
                  <li
                    key={skill.name}
                    style={{ transitionDelay: `${i === active ? 0.12 + j * 0.04 : 0}s` }}
                    onPointerEnter={() => (state.hoverSkill = skill.name)}
                    onPointerLeave={() => (state.hoverSkill = '')}
                    data-hover
                  >
                    <span>{skill.name}</span>
                    <small>{skill.note}</small>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <ol className="skills__nav" aria-hidden>
          {layers.map((layer, i) => (
            <li key={layer.code} className={i === active ? 'is-active' : ''}>
              <span>{layer.code}</span>
              {layer.name}
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
