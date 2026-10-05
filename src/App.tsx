import { useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { app, measureSlots, state } from './lib/state'
import Scene from './three/Scene'
import { loadAvatar } from './three/avatarModel'
import { loadCutout } from './three/cutout'
import Preloader from './ui/Preloader'
import Hud from './ui/Hud'
import Hero from './sections/Hero'
import About from './sections/About'
import Skills from './sections/Skills'
import Experience from './sections/Experience'
import Projects from './sections/Projects'
import Contact from './sections/Contact'

const FONTS = [
  "800 20px 'Bricolage Grotesque Variable'",
  "600 20px 'Martian Mono Variable'",
  "italic 20px 'Instrument Serif'",
]

export default function App() {
  const [fonts, setFonts] = useState(false)
  const [ready, setReady] = useState(false)

  // The 3D labels are drawn to canvas, so the fonts must exist before the scene is built; the avatar model too.
  useEffect(() => {
    const done = () => setFonts(true)
    const timer = setTimeout(done, 6000)
    Promise.all([loadAvatar(), loadCutout(), ...FONTS.map((f) => document.fonts.load(f))]).then(() => document.fonts.ready).then(done, done)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    const lenis = reduced ? null : new Lenis({ lerp: 0.085 })
    app.lenis = lenis
    const tick = (time: number) => lenis?.raf(time * 1000)
    if (lenis) {
      lenis.on('scroll', ScrollTrigger.update)
      gsap.ticker.add(tick)
      gsap.ticker.lagSmoothing(0)
      lenis.stop()
    }
    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return // a finger scrolling is not a cursor to follow
      state.mx = (e.clientX / innerWidth) * 2 - 1
      state.my = (e.clientY / innerHeight) * 2 - 1
    }
    addEventListener('pointermove', move)
    ScrollTrigger.addEventListener('refresh', measureSlots)
    return () => {
      removeEventListener('pointermove', move)
      ScrollTrigger.removeEventListener('refresh', measureSlots)
      gsap.ticker.remove(tick)
      lenis?.destroy()
      app.lenis = null
    }
  }, [])

  useEffect(() => {
    if (!ready) return
    document.documentElement.classList.add('is-ready')
    app.lenis?.start()
    ScrollTrigger.refresh()
  }, [ready])

  return (
    <>
      <Preloader go={fonts} onDone={() => setReady(true)} />
      {fonts && <Scene />}
      <main>
        <Hero ready={ready} />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Contact />
      </main>
      <Hud />
      <div className="grain" aria-hidden />
    </>
  )
}
