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

const canvas = document.getElementById('stage')
const gl = canvas.getContext('webgl2') || canvas.getContext('webgl')

if (!gl) {
  document.body.dataset.mode = 'fallback'
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
    camera, lookTarget, whale, layers, scrollEl: document.documentElement,
  })

  const annotations = createAnnotations({
    svgRoot: document.getElementById('svg-overlay'),
    slabs: layers.slabs, camera, renderer: world.renderer,
  })

  const particles = createParticles(document.getElementById('particles'))
  const terminal = createTerminal(document.getElementById('terminal'))

  function frame() {
    requestAnimationFrame(frame)
    const elapsed = clock.getElapsedTime()
    camera.lookAt(lookTarget)
    whale.update(elapsed)
    annotations.update()
    particles.update(elapsed)
    const sp = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight || 1)
    terminal.setProgress(sp <= 0.85 ? 0 : (sp - 0.85) / 0.15)
    world.composer.render()
  }
  frame()

  // expose for later tasks / debugging
  window.__scene = { THREE, camera, lookTarget, world, clock, whale, layers, master, annotations }
}
