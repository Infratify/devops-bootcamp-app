import * as THREE from 'three'
import { LAYERS } from '../dockerfile.js'

const SLAB_W = 5, SLAB_D = 3.2, SLAB_H = 0.5, GAP = 0.18

export function createLayers() {
  const object = new THREE.Group()
  const slabs = []

  LAYERS.forEach((data, i) => {
    const isRuntime = data.stage === 'runtime'
    const mat = new THREE.MeshStandardMaterial({
      color: isRuntime ? '#0e4d5a' : '#0b2a3a',
      emissive: '#0a5a6b', emissiveIntensity: 0.3,
      transparent: true, opacity: 0, metalness: 0.1, roughness: 0.6,
    })
    const geo = new THREE.BoxGeometry(SLAB_W, SLAB_H, SLAB_D)
    const mesh = new THREE.Mesh(geo, mat)

    const edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(geo),
      new THREE.LineBasicMaterial({ color: '#38f5c9', transparent: true, opacity: 0 }),
    )
    mesh.add(edges)

    const home = new THREE.Vector3(0, i * (SLAB_H + GAP), 0)
    mesh.position.copy(home).setY(home.y + 6) // start above; timeline drops it in
    object.add(mesh)

    slabs.push({ id: data.id, data, mesh, edges, home: home.clone() })
  })

  return { object, slabs }
}
