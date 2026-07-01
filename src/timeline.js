import { createTimeline, onScroll } from 'animejs'
import { CAMERA_KEYS } from './scene/camera.js'

const D = 1000 // total timeline units; scroll 0..1 maps to 0..D

export function createMasterTimeline({ camera, lookTarget, whale, layers, scrollEl }) {
  const tl = createTimeline({ autoplay: false, defaults: { ease: 'linear' } })

  // --- camera path: chain absolute-positioned tweens across the whole scroll ---
  for (let i = 1; i < CAMERA_KEYS.length; i++) {
    const k = CAMERA_KEYS[i]
    const start = CAMERA_KEYS[i - 1].at * D
    const dur = (k.at - CAMERA_KEYS[i - 1].at) * D
    tl.add(camera.position, { x: k.pos[0], y: k.pos[1], z: k.pos[2], duration: dur }, start)
    tl.add(lookTarget, { x: k.look[0], y: k.look[1], z: k.look[2], duration: dur }, start)
  }

  // --- Act I (8%..45%): build-stage slabs drop in + fade, staggered ---
  const build = layers.slabs.filter((s) => s.data.stage === 'build')
  build.forEach((s, i) => {
    const at = (0.08 + (i / build.length) * 0.34) * D
    const dur = 0.05 * D
    tl.add(s.mesh.position, { y: s.home.y, duration: dur, ease: 'outBack' }, at)
    tl.add(s.mesh.material, { opacity: 0.9, duration: dur }, at)
    tl.add(s.edges.material, { opacity: 1, duration: dur }, at)
  })

  // --- Multi-stage cut (45%..58%): dim + drop away the build stack ---
  build.forEach((s) => {
    tl.add(s.mesh.material, { opacity: 0.12, duration: 0.08 * D }, 0.46 * D)
    tl.add(s.edges.material, { opacity: 0.15, duration: 0.08 * D }, 0.46 * D)
    tl.add(s.mesh.position, { x: -9, duration: 0.1 * D, ease: 'inQuad' }, 0.48 * D)
  })

  // --- Runtime stage (52%..72%): slabs appear from y=0 upward, small stack ---
  const runtime = layers.slabs.filter((s) => s.data.stage === 'runtime')
  runtime.forEach((s, i) => {
    // restack runtime slabs near origin (independent of build home)
    const targetY = i * 0.68
    s.home.set(0, targetY, 0)
    s.mesh.position.set(0, targetY + 5, 0)
    const at = (0.54 + (i / runtime.length) * 0.16) * D
    const dur = 0.05 * D
    tl.add(s.mesh.position, { y: targetY, duration: dur, ease: 'outBack' }, at)
    tl.add(s.mesh.material, { opacity: 0.92, duration: dur }, at)
    tl.add(s.edges.material, { opacity: 1, duration: dur }, at)
  })

  // --- Exploded cutaway (72%..85%): spread runtime slabs apart, then reassemble ---
  runtime.forEach((s, i) => {
    const spread = (i - (runtime.length - 1) / 2) * 1.9
    tl.add(s.mesh.position, { y: s.home.y + spread + 2, duration: 0.06 * D, ease: 'outQuad' }, 0.73 * D)
    tl.add(s.mesh.position, { y: s.home.y, duration: 0.05 * D, ease: 'inOutQuad' }, 0.80 * D)
  })

  // --- Run (88%..100%): whale sails off to the right carrying the stack ---
  tl.add(whale.object.position, { x: 10, duration: 0.12 * D, ease: 'inQuad' }, 0.88 * D)
  tl.add(layers.object.position, { x: 10, duration: 0.12 * D, ease: 'inQuad' }, 0.88 * D)

  // --- link to scroll ---
  onScroll({ target: scrollEl, sync: 0.15, enter: 'top top', leave: 'bottom bottom' }).link(tl)

  return tl
}
