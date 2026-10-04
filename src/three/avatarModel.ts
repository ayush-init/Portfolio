import * as THREE from 'three'
import { GLTFLoader, type GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { resume } from '../data/resume'
import { state } from '../lib/state'

// Optional: a Mixamo-style humanoid GLB (Hips, Spine, LeftArm, LeftForeArm, Head …) named in resume.avatarModel
// replaces the built-in mascot. Idle, head-look and the wave are driven straight on the bones, no clips needed.

let cached: GLTF | null = null
let pending: Promise<GLTF | null> | null = null

export function loadAvatar() {
  if (!resume.avatarModel) return Promise.resolve(null)
  pending ??= new GLTFLoader().loadAsync(`${import.meta.env.BASE_URL}${resume.avatarModel}`).then(
    (gltf) => (cached = gltf),
    () => null,
  )
  return pending
}
export const loadedAvatar = () => cached

const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const damp = (a: number, b: number, k: number, dt: number) => lerp(a, b, 1 - Math.exp(-k * dt))

export function rigAvatar(model: THREE.Object3D) {
  model.traverse((o) => {
    const mesh = o as THREE.Mesh
    if (!mesh.isMesh) return
    mesh.castShadow = true
    mesh.frustumCulled = false // skinned bounds stay at the bind pose
  })
  // any model, any units: 1.8 tall with its feet on the ground
  const bounds = new THREE.Box3().setFromObject(model)
  const fit = 1.8 / Math.max(0.001, bounds.max.y - bounds.min.y)
  model.scale.multiplyScalar(fit)
  model.position.y -= bounds.min.y * fit
  model.updateMatrixWorld(true)

  const get = (name: string) => model.getObjectByName(name)
  const worldQuat = (o: THREE.Object3D) => o.getWorldQuaternion(new THREE.Quaternion())
  const worldPos = (o: THREE.Object3D) => o.getWorldPosition(new THREE.Vector3())

  // Arms are posed by direction, so the rest pose (T or A) does not matter.
  const arm = (side: 'Left' | 'Right') => {
    const shoulder = get(`${side}Shoulder`)
    const upper = get(`${side}Arm`)
    const fore = get(`${side}ForeArm`)
    const hand = get(`${side}Hand`)
    if (!shoulder || !upper || !fore || !hand) return null
    const fingers = ['Index', 'Middle', 'Ring', 'Pinky'].flatMap((f) =>
      [1, 2, 3].flatMap((i) => {
        const b = get(`${side}Hand${f}${i}`)
        return b ? [{ b, rest: b.quaternion.clone() }] : []
      }),
    )
    return {
      s: side === 'Left' ? 1 : -1,
      upper,
      fore,
      fingers,
      shoulderInv: worldQuat(shoulder).invert(),
      upperRest: worldQuat(upper),
      foreRest: worldQuat(fore),
      upperDir: worldPos(fore).sub(worldPos(upper)).normalize(),
      foreDir: worldPos(hand).sub(worldPos(fore)).normalize(),
    }
  }
  const arms = [arm('Left'), arm('Right')].filter((a) => a !== null)

  const additive = (name: string) => {
    const b = get(name)
    return b ? { b, rest: b.quaternion.clone() } : null
  }
  const neck = additive('Neck')
  const head = additive('Head')
  const spine = additive('Spine')
  const chest = additive('Spine2')
  const eyes = [additive('LeftEye'), additive('RightEye')]

  const smiles: { mesh: THREE.Mesh; i: number }[] = []
  model.traverse((o) => {
    const mesh = o as THREE.Mesh
    const i = mesh.morphTargetDictionary?.mouthSmile
    if (i !== undefined) smiles.push({ mesh, i })
  })

  const d1 = new THREE.Vector3()
  const d2 = new THREE.Vector3()
  const v = new THREE.Vector3()
  const q1 = new THREE.Quaternion()
  const q2 = new THREE.Quaternion()
  const twist = new THREE.Quaternion()
  const tmp = new THREE.Quaternion()
  const e = new THREE.Euler()
  const Z = new THREE.Vector3(0, 0, 1)
  let lookX = 0
  let lookY = 0
  let wave = 0

  const nudge = (part: { b: THREE.Object3D; rest: THREE.Quaternion } | null, x: number, y: number, z = 0) => {
    if (part) part.b.quaternion.copy(part.rest).multiply(tmp.setFromEuler(e.set(x, y, z)))
  }

  function update(dt: number, time: number, waving: number) {
    wave = damp(wave, waving, 7, dt)
    lookX = damp(lookX, state.my * 0.3, 6, dt)
    lookY = damp(lookY, state.mx * 0.55, 6, dt)
    const breath = Math.sin(time * 1.5)

    nudge(spine, 0, Math.sin(time * 0.55) * 0.035, Math.sin(time * 0.8) * 0.012)
    nudge(chest, breath * 0.014, 0)
    nudge(neck, lookX * 0.4, lookY * 0.4)
    nudge(head, lookX * 0.6, lookY * 0.6, wave * 0.07)
    eyes.forEach((eye) => nudge(eye, state.my * 0.12, state.mx * 0.2))

    arms.forEach((a) => {
      const w = a.s > 0 ? wave : 0
      const swing = Math.sin(time * 7) * 0.42
      // upper arm: hanging → out to the side
      d1.set(a.s * 0.15, -1, 0.03 + breath * 0.008).lerp(v.set(a.s * 0.85, -0.12, 0.22), w).normalize()
      // forearm: hanging with a soft elbow bend → raised, swinging
      d2.set(a.s * 0.1, -1, 0.17).lerp(v.set(a.s * (0.12 + swing), 1, 0.14), w).normalize()

      q1.setFromUnitVectors(a.upperDir, d1).multiply(a.upperRest)
      a.upper.quaternion.copy(a.shoulderInv).multiply(q1)
      // turn the palm to face forward while waving
      twist.setFromAxisAngle(d2, a.s * w * -1.45)
      q2.setFromUnitVectors(a.foreDir, d2).multiply(a.foreRest).premultiply(twist)
      a.fore.quaternion.copy(q1).invert().multiply(q2)

      const curl = lerp(0.3, 0.04, w) * a.s
      a.fingers.forEach((f) => f.b.quaternion.copy(f.rest).multiply(tmp.setFromAxisAngle(Z, curl)))
    })

    smiles.forEach(({ mesh, i }) => (mesh.morphTargetInfluences![i] = 0.32 + wave * 0.4))
  }

  return { update }
}
