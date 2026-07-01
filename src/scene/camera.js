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
