import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { state } from '../lib/state'

// The site's own character: cel-shaded, ink-outlined, black hoodie, cargo pants, backpack, sneakers.
// Faces +z, feet at y = 0, about 1.78 tall. "Left" is the character's left (+x).

const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const damp = (a: number, b: number, k: number, dt: number) => lerp(a, b, 1 - Math.exp(-k * dt))
const DOWN = new THREE.Vector3(0, -1, 0)
const UP = new THREE.Vector3(0, 1, 0)
type V3 = [number, number, number]

export function buildMascot() {
  const ramp = new THREE.DataTexture(new Uint8Array([84, 150, 210, 255]), 4, 1, THREE.RedFormat)
  ramp.minFilter = ramp.magFilter = THREE.NearestFilter
  ramp.needsUpdate = true
  const toon = (color: string, rim = 0) => {
    const m = new THREE.MeshToonMaterial({ color, gradientMap: ramp })
    if (rim)
      m.onBeforeCompile = (sh) => {
        sh.fragmentShader = sh.fragmentShader.replace(
          '#include <opaque_fragment>',
          `outgoingLight += vec3(0.2, 0.26, 0.75) * pow(1.0 - saturate(dot(normalize(normal), normalize(vViewPosition))), 2.6) * ${rim.toFixed(2)};
          #include <opaque_fragment>`,
        )
      }
    return m
  }
  const flat = (color: string) => new THREE.MeshBasicMaterial({ color })
  const M = {
    hoodie: toon('#2b2b32', 0.42),
    trim: toon('#383841', 0.42),
    pants: toon('#4b4b57', 0.28),
    pack: toon('#17171b', 0.5),
    skin: toon('#e0aa86'),
    hair: toon('#1d1d24', 0.45),
    white: toon('#f1ede4'),
    black: toon('#1d1d22', 0.3),
    cobalt: toon('#1d2bff'),
  }

  // Inverted hull pushed out along the normals gives the drawn ink line.
  const ink = new THREE.MeshBasicMaterial({ color: '#0e0e10', side: THREE.BackSide })
  ink.onBeforeCompile = (s) => {
    s.vertexShader = s.vertexShader.replace(
      '#include <begin_vertex>',
      '#include <begin_vertex>\n  transformed += normalize(normal) * 0.0065;',
    )
  }

  const put = (
    parent: THREE.Object3D,
    geo: THREE.BufferGeometry,
    mat: THREE.Material,
    pos: V3 = [0, 0, 0],
    o: { rot?: V3; scale?: V3; line?: boolean } = {},
  ) => {
    const mesh = new THREE.Mesh(geo, mat)
    mesh.position.set(...pos)
    if (o.rot) mesh.rotation.set(...o.rot)
    if (o.scale) mesh.scale.set(...o.scale)
    mesh.castShadow = true
    if (o.line !== false) mesh.add(new THREE.Mesh(geo, ink))
    parent.add(mesh)
    return mesh
  }
  const group = (parent: THREE.Object3D, pos: V3 = [0, 0, 0]) => {
    const g = new THREE.Group()
    g.position.set(...pos)
    parent.add(g)
    return g
  }
  const aim = (g: THREE.Object3D, dir: V3) => g.quaternion.setFromUnitVectors(DOWN, new THREE.Vector3(...dir).normalize())
  const sphere = (r: number) => new THREE.SphereGeometry(r, 28, 20)
  const capsule = (r: number, len: number) => new THREE.CapsuleGeometry(r, len, 8, 20)
  const box = (w: number, h: number, d: number, r: number) => new RoundedBoxGeometry(w, h, d, 3, r)
  const torus = (r: number, tube: number) => new THREE.TorusGeometry(r, tube, 10, 32)
  const FLAT: V3 = [Math.PI / 2, 0, 0]

  const root = new THREE.Group()
  root.rotation.y = -0.5 // three-quarter stance; the head turns back to the viewer

  // ---------- legs, cargo pants, sneakers ----------
  put(root, sphere(0.185), M.pants, [0, 0.9, 0], { scale: [1, 0.62, 0.8] })
  const leg = (side: number, dir: V3, toeOut: number) => {
    const hip = group(root, [side * 0.092, 0.9, 0])
    aim(hip, dir)
    put(hip, new THREE.CylinderGeometry(0.102, 0.086, 0.74, 24), M.pants, [0, -0.36, 0])
    put(hip, box(0.04, 0.15, 0.11, 0.012), M.pants, [side * 0.088, -0.3, 0.005])
    put(hip, box(0.046, 0.04, 0.116, 0.012), M.pants, [side * 0.09, -0.23, 0.005])
    // fabric stacking over the shoe
    put(hip, torus(0.074, 0.03), M.pants, [0, -0.7, 0], { rot: FLAT })
    put(hip, torus(0.07, 0.028), M.pants, [0, -0.745, 0.004], { rot: FLAT })

    const foot = group(hip, [0, -0.81, 0])
    foot.quaternion.copy(hip.quaternion).invert().multiply(new THREE.Quaternion().setFromAxisAngle(UP, toeOut))
    put(foot, box(0.122, 0.042, 0.305, 0.018), M.white, [0, -0.064, 0.05])
    put(foot, box(0.108, 0.07, 0.25, 0.03), M.white, [0, -0.014, 0.05])
    put(foot, sphere(0.055), M.black, [0, -0.02, 0.152], { scale: [0.98, 0.62, 1.1] })
    put(foot, box(0.114, 0.086, 0.09, 0.03), M.black, [0, -0.008, -0.045])
    put(foot, box(0.112, 0.03, 0.12, 0.012), M.black, [0, 0.012, 0.06])
    put(foot, torus(0.05, 0.022), M.black, [0, 0.03, -0.012], { rot: FLAT })
    put(foot, box(0.03, 0.04, 0.012, 0.004), M.cobalt, [0, 0.022, -0.093], { line: false })
    root.updateMatrixWorld(true)
    // plant the sole on the ground whatever the leg angle
    foot.position.y += 0.085 - foot.getWorldPosition(new THREE.Vector3()).y
  }
  leg(1, [0.06, -1, 0.07], 0.3)
  leg(-1, [-0.09, -1, -0.03], -0.22)

  // ---------- hoodie ----------
  const torso = group(root)
  const profile: [number, number][] = [
    [0, 0.86], [0.18, 0.86], [0.197, 0.885], [0.193, 0.915], [0.212, 0.95], [0.222, 1.08],
    [0.226, 1.22], [0.218, 1.31], [0.19, 1.39], [0.125, 1.445], [0.072, 1.475], [0, 1.475],
  ]
  put(torso, new THREE.LatheGeometry(profile.map(([r, y]) => new THREE.Vector2(r, y)), 44), M.hoodie, [0, 0, 0], {
    scale: [1.06, 1, 0.8],
  })
  put(torso, box(0.26, 0.115, 0.06, 0.028), M.trim, [0, 0.995, 0.15]) // kangaroo pocket
  put(torso, sphere(0.15), M.hoodie, [0, 1.43, -0.105], { scale: [1.12, 0.8, 0.82] }) // hood, down
  put(torso, torus(0.1, 0.044), M.hoodie, [0, 1.465, 0.005], { rot: [Math.PI / 2 - 0.22, 0, 0] })
  put(torso, box(0.05, 0.026, 0.006, 0.003), M.cobalt, [0.105, 1.24, 0.172], { rot: [0, 0.45, 0], line: false })
  const strings = [-1, 1].map((s) => {
    const g = group(torso, [s * 0.045, 1.42, 0.118])
    put(g, capsule(0.0065, 0.12), M.white, [0, -0.07, 0.022], { rot: [-0.16, 0, 0], line: false })
    put(g, capsule(0.009, 0.016), M.cobalt, [0, -0.146, 0.035], { rot: [-0.16, 0, 0], line: false })
    return g
  })

  // ---------- backpack ----------
  put(torso, box(0.3, 0.36, 0.15, 0.06), M.pack, [0, 1.14, -0.232])
  put(torso, box(0.23, 0.15, 0.05, 0.02), M.pack, [0, 1.065, -0.318])
  put(torso, torus(0.034, 0.01), M.pack, [0, 1.325, -0.2], { rot: [0, Math.PI / 2, 0] })
  put(torso, box(0.014, 0.036, 0.012, 0.004), M.cobalt, [0.1, 1.215, -0.312], { line: false })
  for (const s of [-1, 1]) {
    const pts: V3[] = [
      [s * 0.13, 1.3, -0.17], [s * 0.15, 1.452, -0.03], [s * 0.168, 1.33, 0.146],
      [s * 0.19, 1.12, 0.15], [s * 0.205, 0.99, 0.03], [s * 0.17, 0.99, -0.17],
    ]
    const curve = new THREE.CatmullRomCurve3(pts.map((p) => new THREE.Vector3(...p)))
    put(torso, new THREE.TubeGeometry(curve, 40, 0.019, 8), M.pack)
  }

  // ---------- arms ----------
  const arm = (side: number) => {
    const shoulder = group(torso, [side * 0.228, 1.335, -0.005])
    put(shoulder, sphere(0.078), M.hoodie)
    put(shoulder, capsule(0.067, 0.2), M.hoodie, [0, -0.14, 0])
    const elbow = group(shoulder, [0, -0.28, 0])
    put(elbow, sphere(0.069), M.hoodie)
    put(elbow, capsule(0.063, 0.17), M.hoodie, [0, -0.125, 0])
    put(elbow, torus(0.051, 0.02), M.trim, [0, -0.25, 0], { rot: FLAT })
    return { shoulder, elbow }
  }
  // near arm: hand buried in the hoodie pocket
  const pocket = arm(1)
  aim(pocket.shoulder, [0.22, -1, -0.12])
  const q = new THREE.Quaternion().setFromUnitVectors(DOWN, new THREE.Vector3(-0.17, -0.07, 0.185).normalize())
  pocket.elbow.quaternion.copy(pocket.shoulder.quaternion).invert().multiply(q)
  // far arm: relaxed, and the one that waves
  const free = arm(-1)
  put(free.elbow, sphere(0.047), M.skin, [0, -0.305, 0], { scale: [0.82, 1.18, 0.6] })
  put(free.elbow, sphere(0.018), M.skin, [0, -0.29, 0.03], { scale: [1, 1.5, 1] })

  // ---------- head ----------
  const head = group(torso, [0, 1.5, 0])
  head.scale.setScalar(1.2)
  head.rotation.set(-0.07, 0.42, 0)
  put(torso, new THREE.CylinderGeometry(0.047, 0.052, 0.1, 16), M.skin, [0, 1.5, 0])
  put(head, sphere(0.128), M.skin, [0, 0.13, 0], { scale: [1, 1.08, 1.03] })
  put(head, sphere(0.098), M.skin, [0, 0.066, 0.02], { scale: [1, 0.9, 1] })
  for (const s of [-1, 1]) put(head, sphere(0.03), M.skin, [s * 0.125, 0.112, -0.005], { scale: [0.45, 1, 0.75] })
  put(head, sphere(0.009), toon('#cf9872'), [0, 0.098, 0.134], { line: false })
  put(head, capsule(0.0038, 0.02), flat('#9c5a48'), [0.004, 0.056, 0.117], { rot: [0, 0, Math.PI / 2 + 0.14], line: false })
  const eyes = [-1, 1].map((s) => {
    const eye = put(head, sphere(0.026), flat('#1a1210'), [s * 0.052, 0.12, 0.118], { scale: [0.95, 1.3, 0.3], line: false })
    put(eye, sphere(0.0075), flat('#ffffff'), [0.008, 0.009, 0.024], { line: false })
    put(head, capsule(0.0042, 0.034), flat('#17171c'), [s * 0.052, 0.172, 0.117], {
      rot: [0, 0, Math.PI / 2 - s * 0.16],
      line: false,
    })
    return eye
  })

  // messy hair: a cap plus spiky tufts
  put(head, new THREE.SphereGeometry(0.138, 32, 20, 0, Math.PI * 2, 0, Math.PI * 0.56), M.hair, [0, 0.135, -0.01], {
    rot: [-0.38, 0, 0],
    scale: [1.03, 1.05, 1.06],
  })
  let seed = 11
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647 - 0.5) * 2
  const tuft = (anchor: V3, dir: V3, r: number, h: number) => {
    const d = new THREE.Vector3(...dir).normalize()
    const m = put(head, new THREE.ConeGeometry(r, h, 7), M.hair, [0, 0, 0])
    m.position.set(...anchor).addScaledVector(d, h * 0.42)
    m.quaternion.setFromUnitVectors(UP, d)
    return m
  }
  for (const a of [-1.0, -0.52, -0.05, 0.42, 0.92]) // fringe, swept to one side
    tuft([Math.sin(a) * 0.1, 0.232, Math.cos(a) * 0.105], [Math.sin(a) * 0.6 - 0.22, -0.72, Math.cos(a) * 0.52], 0.043, 0.1 + rnd() * 0.012)
  for (let i = 0; i < 9; i++) {
    // crown
    const a = (i / 9) * Math.PI * 2 + rnd() * 0.3
    const rad = i % 3 === 0 ? 0.03 : 0.085
    tuft([Math.sin(a) * rad, 0.262 - rad * 0.35, Math.cos(a) * rad - 0.015], [Math.sin(a) * 0.75 + rnd() * 0.3, 0.75, Math.cos(a) * 0.75 + rnd() * 0.3], 0.05, 0.1 + rnd() * 0.025)
  }
  for (const a of [1.5, 2.05, 2.6, 3.14, -2.6, -2.05, -1.5]) // sides and nape
    tuft([Math.sin(a) * 0.118, 0.14, Math.cos(a) * 0.122 - 0.01], [Math.sin(a) * 0.5 + rnd() * 0.15, -0.8, Math.cos(a) * 0.5], 0.046, 0.105 + rnd() * 0.02)

  const d1 = new THREE.Vector3()
  const d2 = new THREE.Vector3()
  const v = new THREE.Vector3()
  const qa = new THREE.Quaternion()
  let wave = 0

  function update(dt: number, time: number, waving: number) {
    wave = damp(wave, waving, 7, dt)
    const breath = Math.sin(time * 1.5)
    torso.scale.set(1 + breath * 0.006, 1 + breath * 0.004, 1 + breath * 0.012)
    torso.rotation.z = Math.sin(time * 0.7) * 0.012
    strings.forEach((s, i) => (s.rotation.z = Math.sin(time * 1.3 + i) * 0.05))

    // the head undoes most of the body turn, then follows the cursor
    head.rotation.y = damp(head.rotation.y, 0.42 + state.mx * 0.45, 6, dt)
    head.rotation.x = damp(head.rotation.x, -0.07 + state.my * 0.22, 6, dt)
    head.rotation.z = damp(head.rotation.z, wave * -0.08, 6, dt)
    const blink = time % 3.6 > 3.46 ? 0.12 : 1.3
    eyes.forEach((eye) => (eye.scale.y = damp(eye.scale.y, blink, 32, dt)))

    const swing = Math.sin(time * 7) * 0.4
    d1.set(-0.16, -1, 0.03 + breath * 0.01).lerp(v.set(-0.82, -0.08, 0.26), wave).normalize()
    d2.set(-0.1, -1, 0.2).lerp(v.set(-0.14 - swing, 1, 0.16), wave).normalize()
    free.shoulder.quaternion.setFromUnitVectors(DOWN, d1)
    free.elbow.quaternion.copy(free.shoulder.quaternion).invert().multiply(qa.setFromUnitVectors(DOWN, d2))
  }

  return { root, update }
}
