import { useEffect, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import type { PerspectiveCamera } from 'three'
import { buildWorld } from './world'

function World() {
  const world = useMemo(buildWorld, [])
  const camera = useThree((s) => s.camera) as PerspectiveCamera
  const size = useThree((s) => s.size)
  useEffect(() => () => world.dispose(), [world])
  useFrame((s, dt) => world.update(camera, size.width, size.height, Math.min(dt, 0.05), s.clock.elapsedTime))
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
