import './style.css'
import * as THREE from 'three'
import { createCameraRig } from './scene/camera.js'
import { createWorld } from './scene/world.js'
import { createWhale } from './scene/whale.js'
import { createLayers } from './scene/layers.js'
import { createMasterTimeline } from './timeline.js'
import { createAnnotations } from './overlay/annotations.js'
import { createParticles } from './overlay/particles.js'
import { createTerminal } from './overlay/terminal.js'
import { DOCKERFILE_TEXT } from './dockerfile.js'
import { mdi } from './icons.js'
import { shouldUseFallback, renderFallback } from './fallback.js'

document.getElementById('recap-code').textContent = DOCKERFILE_TEXT
const hint = document.getElementById('scroll-hint')
if (hint) hint.innerHTML = mdi('mdiChevronDown', 28, '#38f5c9')

const canvas = document.getElementById('stage')
const gl = canvas.getContext('webgl2') || canvas.getContext('webgl')
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

if (shouldUseFallback({ gl, reducedMotion })) {
  document.body.dataset.mode = 'fallback'
  document.getElementById('scenes').style.display = 'none'
  renderFallback(document.getElementById('app'))
} else {
  document.body.dataset.mode = 'webgl'
  const { camera, lookTarget } = createCameraRig()
  const world = createWorld(canvas, camera)
  const whale = createWhale()
  world.scene.add(whale.object)
  const layers = createLayers()
  world.scene.add(layers.object)
  const clock = new THREE.Clock()

  const master = createMasterTimeline({
    camera, lookTarget, whale, layers, bloom: world.bloom,
    scrollEl: document.documentElement,
  })

  const annotations = createAnnotations({
    svgRoot: document.getElementById('svg-overlay'),
    slabs: layers.slabs, camera, renderer: world.renderer,
  })

  const particles = createParticles(document.getElementById('particles'))
  const terminal = createTerminal(document.getElementById('terminal'))

  let last = 0
  function frame() {
    requestAnimationFrame(frame)
    const elapsed = clock.getElapsedTime()
    const delta = elapsed - last; last = elapsed
    const sp = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight || 1)
    camera.lookAt(lookTarget)
    whale.update(elapsed)
    // Finale: once the Docker logo is revealed (its containers scaled in), spin
    // the whole whale as a continuous 360° turntable; otherwise keep it forward.
    const revealed = sp > 0.6 && whale.containers.scale.x > 0.9
    whale.object.rotation.y = revealed ? whale.object.rotation.y + delta * 0.5 : 0
    annotations.update()
    particles.update(elapsed)
    terminal.setProgress(sp <= 0.85 ? 0 : (sp - 0.85) / 0.15)
    world.composer.render()
  }
  frame()

  // expose for later tasks / debugging
  window.__scene = { THREE, camera, lookTarget, world, clock, whale, layers, master, annotations }
}
