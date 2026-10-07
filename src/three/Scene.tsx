import { useEffect, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import type { PerspectiveCamera } from 'three'
import { buildWorld } from './world'
import { state } from '../lib/state'

function World() {
  const world = useMemo(buildWorld, [])
  const camera = useThree((s) => s.camera) as PerspectiveCamera
  const size = useThree((s) => s.size)
  const canvas = useThree((s) => s.gl.domElement)
  const regions = useMemo(() => ({
    hero: document.getElementById('hero'),
    stack: document.querySelector('.skills__scene'),
    contact: document.querySelector('.contact__scene'),
  }), [])
  useEffect(() => () => world.dispose(), [world])
  useFrame((s, dt) => {
    if (size.width < 900) {
      const hero = regions.hero?.getBoundingClientRect()
      const stack = regions.stack?.getBoundingClientRect()
      const contact = regions.contact?.getBoundingClientRect()
      if (stack) {
        state.slot.stackTop = stack.top
        state.slot.stackBottom = stack.bottom
      }
      if (contact) {
        state.slot.endTop = contact.top
        state.slot.endBottom = contact.bottom
      }
      // Each mobile illustration owns a layout slot; it cannot paint across readable content.
      const region = hero && hero.bottom > 0 ? hero
        : stack && stack.top < size.height && stack.bottom > 0 ? stack
        : contact && contact.top < size.height && contact.bottom > 0 ? contact : null
      canvas.style.clipPath = region
        ? `inset(${Math.max(0, region.top)}px 0 ${Math.max(0, size.height - region.bottom)}px 0)`
        : 'inset(50% 0 50% 0)'
    } else {
      canvas.style.clipPath = ''
    }
    const show = world.update(camera, size.width, size.height, Math.min(dt, 0.05), s.clock.elapsedTime)
    canvas.style.opacity = show.toFixed(3)
  })
  return <primitive object={world.root} />
}

export default function Scene() {
  return (
    <Canvas
      className="webgl"
      flat
      shadows
      dpr={[1, 1.75]}
      camera={{ fov: 32, near: 0.1, far: 90, position: [0, 1.25, 5.1] }}
      gl={{ antialias: true, alpha: true }}
      style={{ position: 'fixed', inset: 0, pointerEvents: 'none' }}
      aria-hidden
    >
      <World />
    </Canvas>
  )
}
