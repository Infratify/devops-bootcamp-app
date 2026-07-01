import * as THREE from 'three'
import { mdiPath } from '../icons.js'

const SVGNS = 'http://www.w3.org/2000/svg'
const FONT = 15, CHIP_H = 27, PAD = 9, ICON = 17, GAP = 7, MIN_GAP = 36

// Blueprint annotations: each visible layer slab gets a labelled chip parked in
// a right-hand gutter (never over the busy 3D), joined to the slab by a leader
// line. Chips are de-collided vertically so stacked layers don't overlap.
export function createAnnotations({ svgRoot, slabs, camera, renderer }) {
  const groups = slabs.map((s) => {
    const g = document.createElementNS(SVGNS, 'g')

    const line = document.createElementNS(SVGNS, 'line')
    line.setAttribute('stroke', '#38f5c9')
    line.setAttribute('stroke-width', '1.6')
    line.setAttribute('stroke-dasharray', '4 3')
    line.setAttribute('opacity', '0.8')

    const rect = document.createElementNS(SVGNS, 'rect')
    rect.setAttribute('height', CHIP_H)
    rect.setAttribute('rx', '6')
    rect.setAttribute('fill', '#050a12')
    rect.setAttribute('fill-opacity', '0.82')
    rect.setAttribute('stroke', '#1c6b78')
    rect.setAttribute('stroke-width', '1')

    const icon = document.createElementNS(SVGNS, 'svg')
    icon.setAttribute('width', ICON)
    icon.setAttribute('height', ICON)
    icon.setAttribute('viewBox', '0 0 24 24')
    const ipath = document.createElementNS(SVGNS, 'path')
    ipath.setAttribute('fill', '#38f5c9')
    ipath.setAttribute('d', mdiPath(s.data.icon))
    icon.append(ipath)

    const text = document.createElementNS(SVGNS, 'text')
    text.setAttribute('fill', '#d6fff5')
    text.setAttribute('font-family', 'ui-monospace, monospace')
    text.setAttribute('font-size', FONT)
    text.setAttribute('dominant-baseline', 'middle')
    text.textContent = `${s.data.instruction} ${s.data.args}`

    g.append(line, rect, icon, text)
    svgRoot.append(g)

    const tw = text.getComputedTextLength() || text.textContent.length * FONT * 0.6
    const chipW = PAD + ICON + GAP + tw + PAD
    return { s, g, line, rect, icon, text, chipW, sx: 0, sy: 0, cy: 0 }
  })

  const v = new THREE.Vector3()
  function update() {
    const w = renderer.domElement.clientWidth
    const h = renderer.domElement.clientHeight
    const maxChipW = Math.max(...groups.map((o) => o.chipW))
    const gutterX = w - maxChipW - 28

    // Which labels are visible, and where their slab projects on screen.
    const vis = []
    for (const o of groups) {
      const on = o.s.labelOn.v > 0.5
      o.g.style.display = on ? '' : 'none'
      if (!on) continue
      o.s.mesh.getWorldPosition(v).project(camera)
      o.sx = (v.x * 0.5 + 0.5) * w
      o.sy = (-v.y * 0.5 + 0.5) * h
      vis.push(o)
    }

    // De-collide: sort by projected y, enforce a minimum vertical gap.
    vis.sort((a, b) => a.sy - b.sy)
    let prevY = -Infinity
    for (const o of vis) {
      o.cy = o.sy < prevY + MIN_GAP ? prevY + MIN_GAP : o.sy
      prevY = o.cy
    }

    for (const o of vis) {
      const cy = o.cy
      o.rect.setAttribute('x', gutterX)
      o.rect.setAttribute('y', cy - CHIP_H / 2)
      o.rect.setAttribute('width', o.chipW)
      o.icon.setAttribute('x', gutterX + PAD)
      o.icon.setAttribute('y', cy - ICON / 2)
      o.text.setAttribute('x', gutterX + PAD + ICON + GAP)
      o.text.setAttribute('y', cy)
      o.line.setAttribute('x1', o.sx)
      o.line.setAttribute('y1', o.sy)
      o.line.setAttribute('x2', gutterX - 4)
      o.line.setAttribute('y2', cy)
    }
  }

  return { update }
}
