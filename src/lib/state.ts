import type Lenis from 'lenis'

// Scroll-driven values shared between the DOM (GSAP ScrollTriggers write) and the WebGL scene (reads every frame).
export const state = {
  intro: 0, // 0 → 1 once the preloader lifts
  wave: 0, // hero greeting wave
  hero: 0, // hero scrolled out
  skillsIn: 0, // skills section approaching
  skills: 0, // pinned skills progress
  tail: 0, // experience top → contact top
  contact: 0, // contact entering
  hoverSkill: '',
  mx: 0,
  my: 0,
  // Free vertical space (viewport px) for the character on phones: under the name in the hero,
  // and above the sign-off at the very end. Measured from the real layout, so any screen height works.
  slot: { heroTop: 0, heroBottom: 0, endTop: 0, endBottom: 0 },
}

const pageTop = (el: HTMLElement) => {
  let y = 0
  for (let n: HTMLElement | null = el; n; n = n.offsetParent as HTMLElement | null) y += n.offsetTop
  return y
}

export function measureSlots() {
  const q = (s: string) => document.querySelector<HTMLElement>(s)
  const name = q('.hero__last')
  const foot = q('.hero__foot')
  const end = q('.contact__col')
  const hud = q('.hud')
  if (!name || !foot || !end || !hud) return
  state.slot.heroTop = pageTop(name) + name.offsetHeight * 0.55 // hair may overlap the tail of the surname
  state.slot.heroBottom = Math.min(pageTop(foot), innerHeight - 8) // never below the first screen
  state.slot.endTop = hud.offsetHeight
  state.slot.endBottom = pageTop(end) - (document.documentElement.scrollHeight - innerHeight)
}

export const app: { lenis: Lenis | null } = { lenis: null }

export const scrollToId = (id: string) => {
  const el = document.getElementById(id)
  if (!el) return
  if (app.lenis) app.lenis.scrollTo(el, { duration: 1.6 })
  else el.scrollIntoView()
}
