import * as THREE from 'three'

export function createCameraRig() {
  const camera = new THREE.PerspectiveCamera(
    50, window.innerWidth / window.innerHeight, 0.1, 200,
  )
  camera.position.set(0, 2, 14)
  const lookTarget = new THREE.Vector3(0, 1, 0)
  camera.lookAt(lookTarget)
  return { camera, lookTarget }
}

// Camera poses per beat (0..1 scroll). Timeline interpolates between these.
export const CAMERA_KEYS = [
  { at: 0.00, pos: [0, 2, 14], look: [0, 1, 0] },   // hero
  { at: 0.30, pos: [6, 3, 12], look: [0, 2, 0] },   // build stacking (orbit)
  { at: 0.52, pos: [-5, 3, 12], look: [0, 2.5, 0] },// multi-stage cut
  { at: 0.70, pos: [4, 2, 11], look: [0, 2, 0] },   // artifact travels
  { at: 0.82, pos: [0, 2, 16], look: [0, 2, 0] },   // exploded pull-back
  { at: 0.92, pos: [0, 1.5, 13], look: [0, 1, 0] }, // run
  { at: 1.00, pos: [0, 1.5, 13], look: [0, 1, 0] }, // recap
]
