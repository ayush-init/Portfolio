import * as THREE from 'three'
import { resume } from '../data/resume'
import { state } from '../lib/state'

// The illustrated character, staged as a 2.5D figure: the flat artwork is pushed into relief by a depth map,
// lit along its edges from the cursor, breathes, casts a real shadow and scans in.
// Needs two files in /public: the transparent cutout (resume.avatarImage) and "<name>-depth.png" beside it.

const PAD = 14 // transparent margin, in pixels, baked around the cutout
const HEIGHT = 2.15

type Art = { map: THREE.Texture; depth: THREE.Texture }
let cached: Art | null = null
let pending: Promise<Art | null> | null = null

export function loadCutout() {
  if (!resume.avatarImage) return Promise.resolve(null)
  const base = import.meta.env.BASE_URL
  const loader = new THREE.TextureLoader()
  pending ??= Promise.all([
    loader.loadAsync(base + resume.avatarImage),
    loader.loadAsync(base + resume.avatarImage.replace(/\.\w+$/, '-depth.png')),
  ]).then(
    ([map, depth]) => {
      map.colorSpace = THREE.SRGBColorSpace
      map.anisotropy = 8
      return (cached = { map, depth })
    },
    () => null,
  )
  return pending
}
export const loadedCutout = () => cached

const vertex = /* glsl */ `
  uniform sampler2D uDepth;
  uniform float uTime;
  uniform vec2 uMouse;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vec3 p = position;
    p.z += texture2D(uDepth, uv).r * 0.15;

    float breath = sin(uTime * 1.5);
    float chest = smoothstep(0.5, 0.68, uv.y) * (1.0 - smoothstep(0.78, 0.88, uv.y));
    p.y += smoothstep(0.42, 0.9, uv.y) * breath * 0.0065;
    p.x += (uv.x - 0.5) * chest * breath * 0.014;

    // weight shifts from the feet; the head leads the cursor; the hair moves last
    p.x += uv.y * uv.y * sin(uTime * 0.7) * 0.007;
    float head = smoothstep(0.8, 0.9, uv.y);
    p.x += head * uMouse.x * 0.014;
    p.y -= head * uMouse.y * 0.006;
    p.x += smoothstep(0.9, 1.0, uv.y) * sin(uTime * 1.9 + uv.x * 9.0) * 0.004;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`

const fragment = /* glsl */ `
  uniform sampler2D uMap;
  uniform sampler2D uDepth;
  uniform vec2 uTexel;
  uniform vec2 uMouse;
  uniform float uReveal;
  uniform vec3 uAccent;
  varying vec2 vUv;

  void main() {
    vec4 c = texture2D(uMap, vUv);
    float cut = uReveal * 1.1 - 0.05;
    if (c.a < 0.02 || vUv.y > cut) discard;

    // Soft, natural relief slope avoiding harsh depth artifacts
    vec2 slope = vec2(
      texture2D(uDepth, vUv - vec2(uTexel.x, 0.0)).r - texture2D(uDepth, vUv + vec2(uTexel.x, 0.0)).r,
      texture2D(uDepth, vUv - vec2(0.0, uTexel.y)).r - texture2D(uDepth, vUv + vec2(0.0, uTexel.y)).r
    ) * 0.8;
    vec2 light = normalize(vec2(uMouse.x * 1.4 - 0.35, 0.55 - uMouse.y));
    vec3 col = c.rgb;
    // Gentle highlights that preserve the original illustrated artwork
    col += vec3(1.0, 0.98, 0.94) * max(dot(slope, light), 0.0) * 0.12;
    col += vec3(0.88, 0.92, 1.0) * max(dot(slope, -light), 0.0) * 0.08;

    // scan line while materialising
    float glow = smoothstep(0.045, 0.0, cut - vUv.y) * (1.0 - step(0.995, uReveal));
    col = mix(col, uAccent + 0.4, glow);

    gl_FragColor = vec4(col, c.a);
    #include <colorspace_fragment>
  }
`

export function buildCutout({ map, depth }: Art) {
  const img = map.image as { width: number; height: number }
  const h = (HEIGHT * img.height) / (img.height - PAD * 2)
  const w = (h * img.width) / img.height
  const geo = new THREE.PlaneGeometry(w, h, 72, 180)
  geo.translate(0, h / 2 - (PAD / img.height) * h, 0)

  const uniforms = {
    uMap: { value: map },
    uDepth: { value: depth },
    uTexel: { value: new THREE.Vector2(3 / img.width, 3 / img.height) },
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2() },
    uReveal: { value: 0 },
    uAccent: { value: new THREE.Color('#1d2bff') },
  }
  const material = new THREE.ShaderMaterial({ uniforms, vertexShader: vertex, fragmentShader: fragment, transparent: true })
  material.shadowSide = THREE.DoubleSide

  const root = new THREE.Mesh(geo, material)
  root.castShadow = true
  // the shadow is the silhouette, not the rectangle
  root.customDepthMaterial = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking, map, alphaTest: 0.5 })

  function update(dt: number, time: number, reveal: number) {
    const k = 1 - Math.exp(-6 * dt)
    uniforms.uTime.value = time
    uniforms.uMouse.value.x += (state.mx - uniforms.uMouse.value.x) * k
    uniforms.uMouse.value.y += (state.my - uniforms.uMouse.value.y) * k
    uniforms.uReveal.value = reveal
    root.visible = reveal > 0.002
  }
  return { root, update, height: HEIGHT }
}
