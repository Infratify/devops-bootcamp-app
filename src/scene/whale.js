import * as THREE from 'three'

// Stylized whale from primitives: capsule body, tail fin, two side fins.
// Dark navy body + emissive; cyan wireframe accents; bloom does the glow.
export function createWhale() {
  const object = new THREE.Group()
  const body = new THREE.Group()
  object.add(body)

  const bodyMat = new THREE.MeshStandardMaterial({
    color: '#0b2a3a', emissive: '#0a4a5a', emissiveIntensity: 0.45,
    metalness: 0.2, roughness: 0.55,
  })
  const accentMat = new THREE.LineBasicMaterial({ color: '#38f5c9', transparent: true, opacity: 0.9 })

  const hull = new THREE.Mesh(new THREE.CapsuleGeometry(1.2, 2.6, 8, 20), bodyMat)
  hull.rotation.z = Math.PI / 2
  hull.scale.set(1, 1, 0.8)
  body.add(hull)

  const accent = new THREE.LineSegments(new THREE.WireframeGeometry(hull.geometry), accentMat)
  accent.rotation.copy(hull.rotation)
  accent.scale.copy(hull.scale)
  body.add(accent)

  // tail fin
  const tail = new THREE.Mesh(new THREE.ConeGeometry(0.9, 1.2, 4), bodyMat)
  tail.position.set(-2.4, 0, 0)
  tail.rotation.z = Math.PI / 2
  tail.scale.set(1, 1, 0.3)
  body.add(tail)

  // eye
  const eye = new THREE.Mesh(
    new THREE.SphereGeometry(0.12, 12, 12),
    new THREE.MeshBasicMaterial({ color: '#38f5c9' }),
  )
  eye.position.set(1.7, 0.45, 0.55)
  body.add(eye)

  function update(elapsed) {
    body.position.y = Math.sin(elapsed * 1.2) * 0.18
    body.rotation.z = Math.sin(elapsed * 0.8) * 0.03
  }

  return { object, update }
}
