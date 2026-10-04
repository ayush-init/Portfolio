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
}

export const app: { lenis: Lenis | null } = { lenis: null }

export const scrollToId = (id: string) => {
  const el = document.getElementById(id)
  if (!el) return
  if (app.lenis) app.lenis.scrollTo(el, { duration: 1.6 })
  else el.scrollIntoView()
}
