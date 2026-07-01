import './style.css'
import * as THREE from 'three'
import { createCameraRig } from './scene/camera.js'
import { createWorld } from './scene/world.js'
import { createWhale } from './scene/whale.js'
import { createLayers } from './scene/layers.js'

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

  function frame() {
    requestAnimationFrame(frame)
    camera.lookAt(lookTarget)
    whale.update(clock.getElapsedTime())
    world.composer.render()
  }
  frame()

  // expose for later tasks / debugging
  window.__scene = { THREE, camera, lookTarget, world, clock, whale, layers }
}
