import * as THREE from 'three'

const SVGNS = 'http://www.w3.org/2000/svg'

export function createAnnotations({ svgRoot, slabs, camera, renderer }) {
  const groups = slabs.map((s) => {
    const g = document.createElementNS(SVGNS, 'g')
    const line = document.createElementNS(SVGNS, 'line')
    line.setAttribute('stroke', '#38f5c9')
    line.setAttribute('stroke-width', '1')
    line.setAttribute('stroke-dasharray', '3 3')
    const text = document.createElementNS(SVGNS, 'text')
    text.setAttribute('fill', '#a5f3fc')
    text.setAttribute('font-family', 'ui-monospace, monospace')
    text.setAttribute('font-size', '13')
    text.textContent = `${s.data.instruction} ${s.data.args}`
    g.append(line, text)
    svgRoot.append(g)
    return { s, g, line, text }
  })

  const v = new THREE.Vector3()
  function update() {
    const w = renderer.domElement.clientWidth
    const h = renderer.domElement.clientHeight
    for (const { s, g, line, text } of groups) {
      const visible = s.mesh.material.opacity >= 0.3
      g.style.display = visible ? '' : 'none'
      if (!visible) continue
      s.mesh.getWorldPosition(v).project(camera)
      const x = (v.x * 0.5 + 0.5) * w
      const y = (-v.y * 0.5 + 0.5) * h
      const lx = x + 90 // label offset to the right
      line.setAttribute('x1', x + 40); line.setAttribute('y1', y)
      line.setAttribute('x2', lx - 6); line.setAttribute('y2', y)
      text.setAttribute('x', lx); text.setAttribute('y', y + 4)
    }
  }

  return { update }
}
