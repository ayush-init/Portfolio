import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { resume } from '../data/resume'
import { state } from '../lib/state'

export const C = {
  paper: '#F2EEE5',
  clay: '#FBF9F4',
  ink: '#121210',
  cobalt: '#1D2BFF',
  tang: '#FF5A1F',
}

const MONO = "'Martian Mono Variable', ui-monospace, monospace"
const SLAB = 3.3
const SLAB_H = 0.22
const GAP_CLOSED = 0.32
const GAP_OPEN = 1.75
const LIFT = 1.8
const CHIP = 0.8
const CHIP_H = 0.26
const STAGE_Y = -40
const N = resume.stack.length

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const smooth = (t: number) => t * t * (3 - 2 * t)
const damp = (a: number, b: number, k: number, dt: number) => lerp(a, b, 1 - Math.exp(-k * dt))

// White text on a transparent canvas; the material colour tints it.
function label(text: string, w: number, h: number, size: number, align: CanvasTextAlign = 'center') {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  const ctx = c.getContext('2d')!
  const set = () => (ctx.font = `700 ${size}px ${MONO}`)
  const fits = (s: string) => ctx.measureText(s).width <= w * 0.9
  set()
  // Greedy wrap on tall canvases, then shrink until the widest line fits.
  const wrap = h > size * 2.6
  const lines: string[] = []
  for (const word of text.split(' ')) {
    const last = lines[lines.length - 1]
    if (last === undefined || (wrap && !fits(`${last} ${word}`))) lines.push(word)
    else lines[lines.length - 1] = `${last} ${word}`
  }
  while (!lines.every(fits) && size > 10) {
    size -= 2
    set()
  }
  ctx.fillStyle = '#fff'
  ctx.textAlign = align
  ctx.textBaseline = 'middle'
  lines.forEach((line, i) =>
    ctx.fillText(line, align === 'center' ? w / 2 : 4, h / 2 + size * 0.06 + (i - (lines.length - 1) / 2) * size * 1.2),
  )
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 8
  return t
}

const explode = () => smooth(clamp01(state.skills / 0.07))
const gap = (e: number) => lerp(GAP_CLOSED, GAP_OPEN, e)
// The camera dwells on each layer, then moves quickly to the next.
function layerFloat() {
  const f = clamp01((state.skills - 0.07) / 0.9) * (N - 1)
  const i = Math.floor(f)
  return i + smooth(clamp01((f - i - 0.28) / 0.44))
}
export const activeLayer = () => Math.round(layerFloat())

function buildTower() {
  const root = new THREE.Group()
  const slabGeo = new RoundedBoxGeometry(SLAB, SLAB_H, SLAB, 4, 0.05)
  const trimGeo = new RoundedBoxGeometry(SLAB + 0.05, 0.05, SLAB + 0.05, 2, 0.02)
  const chipGeo = new RoundedBoxGeometry(CHIP, CHIP_H, CHIP, 4, 0.07)
  const topGeo = new THREE.PlaneGeometry(CHIP * 0.9, CHIP * 0.9)
  const sideGeo = new THREE.PlaneGeometry(2.2, 0.14)
  const clay = new THREE.Color(C.clay)
  const cobalt = new THREE.Color(C.cobalt)
  const tang = new THREE.Color(C.tang)
  const ink = new THREE.Color(C.ink)
  const white = new THREE.Color('#ffffff')

  const layers = resume.stack.map((layer) => {
    const g = new THREE.Group()
    const slab = new THREE.Mesh(slabGeo, new THREE.MeshStandardMaterial({ color: C.clay, roughness: 0.9 }))
    slab.castShadow = slab.receiveShadow = true
    const trimMat = new THREE.MeshStandardMaterial({ color: C.ink, roughness: 0.7 })
    const trim = new THREE.Mesh(trimGeo, trimMat)
    trim.position.y = -SLAB_H / 2 + 0.005
    g.add(slab, trim)

    const sideTex = label(`${layer.code} / ${layer.name.toUpperCase()}`, 1024, 64, 40, 'left')
    const sideMat = new THREE.MeshBasicMaterial({ map: sideTex, transparent: true, color: C.ink })
    const front = new THREE.Mesh(sideGeo, sideMat)
    front.position.set(-SLAB / 2 + 1.3, 0.02, SLAB / 2 + 0.002)
    const right = new THREE.Mesh(sideGeo, sideMat)
    right.rotation.y = Math.PI / 2
    right.position.set(SLAB / 2 + 0.002, 0.02, SLAB / 2 - 1.3)
    g.add(front, right)

    const n = layer.skills.length
    const cols = n <= 4 ? 2 : 3
    const rows = Math.ceil(n / cols)
    const chips = layer.skills.map((skill, j) => {
      const row = Math.floor(j / cols)
      const inRow = row === rows - 1 ? n - row * cols : cols
      const holder = new THREE.Group()
      holder.position.set(((j % cols) - (inRow - 1) / 2) * 0.98, SLAB_H / 2, (row - (rows - 1) / 2) * 0.98)
      const mat = new THREE.MeshStandardMaterial({ color: C.clay, roughness: 0.55 })
      const body = new THREE.Mesh(chipGeo, mat)
      body.castShadow = body.receiveShadow = true
      const textMat = new THREE.MeshBasicMaterial({ map: label(skill.name, 256, 256, 46), transparent: true, color: C.ink })
      const text = new THREE.Mesh(topGeo, textMat)
      text.rotation.x = -Math.PI / 2
      holder.add(body, text)
      g.add(holder)
      return { name: skill.name, holder, body, text, mat, textMat, v: 0, h: 0 }
    })
    root.add(g)
    return { g, chips, trimMat }
  })

  // Corner rails with request "packets" travelling the stack.
  const railMat = new THREE.MeshStandardMaterial({ color: '#b4aea0', roughness: 0.6 })
  const railGeo = new THREE.CylinderGeometry(0.012, 0.012, 1, 10)
  const corner = SLAB / 2 - 0.16
  const rails = [-1, 1].flatMap((x) =>
    [-1, 1].map((z) => {
      const m = new THREE.Mesh(railGeo, railMat)
      m.position.set(x * corner, 0, z * corner)
      root.add(m)
      return m
    }),
  )
  const packetGeo = new THREE.SphereGeometry(0.06, 16, 12)
  const packetMat = new THREE.MeshStandardMaterial({ color: C.tang, roughness: 0.4, emissive: C.tang, emissiveIntensity: 0.25 })
  const packets = Array.from({ length: 8 }, (_, i) => {
    const m = new THREE.Mesh(packetGeo, packetMat)
    m.castShadow = true
    root.add(m)
    return { m, rail: i % 4, offset: i * 0.37, dir: i % 2 ? 1 : -1 }
  })

  let focus = 0
  function update(dt: number, time: number) {
    const e = explode()
    const lf = layerFloat()
    const gp = gap(e)
    focus = -SLAB_H / 2 - lf * gp
    let topY = 0
    let botY = 0
    layers.forEach((layer, i) => {
      const lift = smooth(clamp01(lf - i)) * LIFT * e
      const y = -SLAB_H / 2 - i * gp + lift
      layer.g.position.y = y
      if (i === 0) topY = y
      if (i === N - 1) botY = y
      const on = e * smooth(clamp01(1 - Math.abs(lf - i) * 1.7))
      layer.trimMat.color.lerpColors(ink, cobalt, on)
      layer.chips.forEach((chip, j) => {
        chip.v = damp(chip.v, on, 9 - Math.min(j, 6) * 0.8, dt)
        chip.h = damp(chip.h, state.hoverSkill === chip.name && on > 0.5 ? 1 : 0, 12, dt)
        const s = lerp(0.28, 1, chip.v) + chip.h * 0.55
        chip.body.scale.y = s
        chip.body.position.y = (CHIP_H * s) / 2
        chip.text.position.y = CHIP_H * s + 0.003
        chip.mat.color.lerpColors(clay, cobalt, chip.v).lerp(tang, chip.h)
        chip.textMat.color.lerpColors(ink, white, chip.v)
      })
    })
    const span = Math.max(0.001, topY - botY)
    rails.forEach((r) => {
      r.scale.y = span
      r.position.y = (topY + botY) / 2
    })
    packets.forEach((p) => {
      const r = rails[p.rail]
      const t = (((time * 0.22 * p.dir + p.offset) % 1) + 1) % 1
      p.m.position.set(r.position.x, lerp(topY, botY, t), r.position.z)
      p.m.scale.setScalar(e)
    })
  }
  return { root, update, focusY: () => focus }
}

function buildAvatar() {
  const root = new THREE.Group()
  const mat = (color: string, roughness = 0.75) => new THREE.MeshStandardMaterial({ color, roughness })
  const clay = mat(C.clay)
  const cobalt = mat(C.cobalt, 0.65)
  const ink = mat(C.ink, 0.6)
  const tang = mat(C.tang, 0.8)
  const add = (parent: THREE.Object3D, geo: THREE.BufferGeometry, m: THREE.Material, x = 0, y = 0, z = 0) => {
    const mesh = new THREE.Mesh(geo, m)
    mesh.position.set(x, y, z)
    mesh.castShadow = true
    parent.add(mesh)
    return mesh
  }

  const legGeo = new THREE.CapsuleGeometry(0.085, 0.42, 6, 16)
  const shoeGeo = new RoundedBoxGeometry(0.18, 0.12, 0.32, 3, 0.05)
  for (const x of [-0.125, 0.125]) {
    add(root, legGeo, ink, x, 0.4, 0)
    add(root, shoeGeo, clay, x, 0.06, 0.05)
  }

  const upper = new THREE.Group()
  root.add(upper)
  add(upper, new THREE.CapsuleGeometry(0.235, 0.32, 8, 24), cobalt, 0, 1.02, 0).scale.z = 0.82
  add(upper, new THREE.TorusGeometry(0.15, 0.06, 12, 32), cobalt, 0, 1.32, 0).rotation.x = Math.PI / 2
  const badge = new THREE.Mesh(
    new THREE.PlaneGeometry(0.2, 0.1),
    new THREE.MeshBasicMaterial({ map: label('</>', 128, 64, 44), transparent: true, color: C.clay }),
  )
  badge.position.set(0, 1.1, 0.197)
  upper.add(badge)

  const armGeo = new THREE.CapsuleGeometry(0.068, 0.36, 6, 14)
  const handGeo = new THREE.SphereGeometry(0.082, 20, 16)
  const arm = (side: number) => {
    const pivot = new THREE.Group()
    pivot.position.set(side * 0.3, 1.22, 0)
    pivot.rotation.z = side * 0.22
    add(pivot, armGeo, cobalt, 0, -0.24, 0)
    add(pivot, handGeo, clay, 0, -0.5, 0)
    upper.add(pivot)
    return pivot
  }
  arm(-1)
  const waveArm = arm(1)

  const head = new THREE.Group()
  head.position.set(0, 1.64, 0)
  upper.add(head)
  add(head, new THREE.SphereGeometry(0.27, 40, 32), clay).scale.y = 0.96
  add(head, new RoundedBoxGeometry(0.42, 0.16, 0.14, 4, 0.065), ink, 0, -0.01, 0.185)
  const eyeMat = new THREE.MeshBasicMaterial({ color: '#AEB8FF' })
  const eyeGeo = new THREE.SphereGeometry(0.034, 16, 12)
  const eyes = [-0.09, 0.09].map((x) => {
    const eye = new THREE.Mesh(eyeGeo, eyeMat)
    eye.position.set(x, -0.01, 0.256)
    eye.scale.set(1, 1.35, 0.4)
    head.add(eye)
    return eye
  })
  const beanie = new THREE.Group()
  beanie.rotation.x = -0.24
  beanie.position.y = 0.045
  add(beanie, new THREE.SphereGeometry(0.283, 40, 20, 0, Math.PI * 2, 0, Math.PI / 2), tang)
  add(beanie, new THREE.TorusGeometry(0.276, 0.04, 12, 48), tang).rotation.x = Math.PI / 2
  add(beanie, new THREE.SphereGeometry(0.06, 16, 12), clay, 0, 0.3, 0)
  head.add(beanie)

  // Code glyphs in orbit.
  const orbit = new THREE.Group()
  orbit.position.y = 1.15
  root.add(orbit)
  const glyphs = ['{ }', '</>', '=>', '( )', '&&', '[ ]'].map((g, i) => {
    const sprite = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: label(g, 160, 96, 60), color: i % 3 === 1 ? C.tang : C.cobalt, transparent: true }),
    )
    orbit.add(sprite)
    return sprite
  })

  const stage = new THREE.Group()
  stage.position.y = STAGE_Y
  const disc = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 1.1, 0.16, 72), mat(C.clay, 0.9))
  disc.position.y = -0.08
  disc.receiveShadow = true
  const ring = new THREE.Mesh(new THREE.TorusGeometry(1.06, 0.014, 8, 96), mat(C.cobalt))
  ring.rotation.x = Math.PI / 2
  stage.add(disc, ring)

  let yaw = 0
  function update(dt: number, time: number, cam: THREE.Vector3) {
    const e = explode()
    const onStage = state.tail > 0.5
    root.position.y = onStage ? STAGE_Y : e * e * 9
    root.scale.setScalar(Math.max(0.0001, state.intro))

    yaw = damp(yaw, Math.atan2(cam.x, cam.z - root.position.z) * 0.8 + state.mx * 0.18, 5, dt)
    root.rotation.y = yaw
    upper.position.y = Math.sin(time * 1.7) * 0.012
    head.rotation.y = damp(head.rotation.y, state.mx * 0.55, 6, dt)
    head.rotation.x = damp(head.rotation.x, state.my * 0.28, 6, dt)

    const blink = time % 3.4 > 3.25 ? 0.12 : 1.35
    eyes.forEach((eye) => (eye.scale.y = damp(eye.scale.y, blink, 30, dt)))

    const w = Math.max(state.wave, smooth(clamp01((state.contact - 0.35) / 0.3)))
    waveArm.rotation.z = damp(waveArm.rotation.z, lerp(0.22, 2.55 + Math.sin(time * 7) * 0.32, w), 10, dt)

    orbit.rotation.y = time * 0.35
    const show = state.intro * (1 - e)
    glyphs.forEach((sprite, i) => {
      const a = (i / glyphs.length) * Math.PI * 2
      sprite.position.set(Math.cos(a) * 1.02, Math.sin(time * 0.9 + i * 1.7) * 0.28 + (i % 2 ? 0.25 : -0.2), Math.sin(a) * 1.02)
      sprite.scale.set(0.34 * show, 0.2 * show, 1)
    })
  }
  return { root, stage, update }
}

function buildAmbient() {
  const root = new THREE.Group()
  let seed = 7
  const rnd = () => {
    seed = (seed * 16807) % 2147483647
    return seed / 2147483647
  }
  const geos = [
    new RoundedBoxGeometry(0.26, 0.26, 0.26, 2, 0.04),
    new THREE.TorusGeometry(0.16, 0.055, 10, 28),
    new THREE.OctahedronGeometry(0.19),
    new THREE.CapsuleGeometry(0.07, 0.3, 4, 12),
  ]
  const palette = [C.clay, C.clay, C.clay, C.clay, C.cobalt, C.cobalt, C.tang]
  const items = Array.from({ length: 96 }, (_, i) => {
    const mesh = new THREE.Mesh(
      geos[i % geos.length],
      new THREE.MeshStandardMaterial({ color: palette[Math.floor(rnd() * palette.length)], roughness: 0.7 }),
    )
    const side = rnd() > 0.5 ? 1 : -1
    mesh.position.set(side * lerp(2.9, 9, rnd()), lerp(5, STAGE_Y - 4, rnd()), lerp(-8, 1.5, rnd()))
    mesh.scale.setScalar(lerp(0.6, 1.7, rnd()))
    mesh.castShadow = true
    root.add(mesh)
    return { mesh, y: mesh.position.y, sx: rnd() - 0.5, sy: rnd() - 0.5, phase: rnd() * 6.28 }
  })
  function update(time: number) {
    items.forEach((it) => {
      it.mesh.rotation.x = time * it.sx * 0.7 + it.phase
      it.mesh.rotation.y = time * it.sy * 0.7
      it.mesh.position.y = it.y + Math.sin(time * 0.5 + it.phase) * 0.16
    })
  }
  return { root, update }
}

export function buildWorld() {
  const root = new THREE.Group()
  const tower = buildTower()
  const avatar = buildAvatar()
  const ambient = buildAmbient()
  root.add(tower.root, avatar.root, avatar.stage, ambient.root)

  root.add(new THREE.HemisphereLight('#ffffff', '#d9d2c2', 1.5))
  const sun = new THREE.DirectionalLight('#fff6e8', 2.3)
  sun.castShadow = true
  sun.shadow.mapSize.set(2048, 2048)
  sun.shadow.camera.left = sun.shadow.camera.bottom = -6
  sun.shadow.camera.right = sun.shadow.camera.top = 6
  sun.shadow.camera.near = 0.5
  sun.shadow.camera.far = 30
  sun.shadow.bias = -0.0004
  sun.shadow.normalBias = 0.03
  sun.shadow.radius = 7
  const fill = new THREE.DirectionalLight('#aab4ff', 0.7)
  root.add(sun, sun.target, fill, fill.target)

  const pos = new THREE.Vector3(0, 1.3, 5)
  const tgt = new THREE.Vector3(0, 1, 0)
  const wantPos = new THREE.Vector3()
  const wantTgt = new THREE.Vector3()
  const a = new THREE.Vector3()
  const b = new THREE.Vector3()
  const shift = { x: 0.2, y: 0 }
  let first = true

  function update(camera: THREE.PerspectiveCamera, width: number, height: number, dt: number, time: number) {
    tower.update(dt, time)
    ambient.update(time)

    const mobile = width < 860
    const far = mobile ? 1.5 : 1
    const s1 = smooth(state.hero)
    const s2 = smooth(state.skillsIn)
    const t = smooth(state.tail)
    const c = smooth(state.contact)
    const fy = tower.focusY()

    // Hero → pull back to reveal the stack → isometric descent → drift to the stage → contact.
    wantPos.set(0, 1.25, 5.1 * far).lerp(a.set(3.4, 2.5, 8.4 * far), s1)
    wantTgt.set(0, 1.02, 0).lerp(b.set(0, 0.25, 0), s1)
    wantPos.lerp(a.set(3 * far, fy + 3.9 * far, 8.6 * far), s2)
    wantTgt.lerp(b.set(0, fy - 0.15, 0), s2)
    wantPos.lerp(a.set(0, STAGE_Y + 5.6, 7.4), t)
    wantTgt.lerp(b.set(0, STAGE_Y + 5.4, 0), t)
    wantPos.lerp(a.set(0, STAGE_Y + 1.3, mobile ? 9.3 : 5.3), c)
    wantTgt.lerp(b.set(0, STAGE_Y + 1.02, 0), c)
    wantPos.x += state.mx * 0.3
    wantPos.y -= state.my * 0.18

    const sx = mobile ? 0 : lerp(lerp(lerp(0.2, 0.29, s1), 0.23, s2), 0.25, c)
    const sy = mobile ? lerp(lerp(-0.13, 0.2, s2), 0.29, c) : 0
    const k = first ? 1 : 1 - Math.exp(-7 * dt)
    first = false
    pos.lerp(wantPos, k)
    tgt.lerp(wantTgt, k)
    shift.x = lerp(shift.x, sx, k)
    shift.y = lerp(shift.y, sy, k)

    camera.position.copy(pos)
    camera.lookAt(tgt)
    camera.setViewOffset(width, height, -shift.x * width, shift.y * height, width, height)

    sun.target.position.copy(tgt)
    sun.position.copy(tgt).add(a.set(3.6, 7.5, 4.6))
    fill.target.position.copy(tgt)
    fill.position.copy(tgt).add(a.set(-6, 2, 3))

    avatar.update(dt, time, pos)
  }

  function dispose() {
    root.traverse((o) => {
      const mesh = o as THREE.Mesh
      mesh.geometry?.dispose()
      const m = mesh.material as THREE.Material | THREE.Material[] | undefined
      for (const x of Array.isArray(m) ? m : m ? [m] : []) {
        ;(x as THREE.MeshBasicMaterial).map?.dispose()
        x.dispose()
      }
    })
  }
  return { root, update, dispose }
}
