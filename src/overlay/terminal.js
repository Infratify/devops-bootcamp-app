const CMD = '$ docker run -p 8080:80 devops-bootcamp'
const OK = 'container started on http://localhost:8080'

export function createTerminal(canvas) {
  const ctx = canvas.getContext('2d')
  let w, h
  function resize() { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight }
  resize()
  window.addEventListener('resize', resize)

  function setProgress(p) {
    ctx.clearRect(0, 0, w, h)
    if (p <= 0) return
    const panelH = 150, pad = 24
    const y0 = h - panelH - 30, x0 = 40, pw = Math.min(560, w - 80)

    ctx.globalAlpha = 0.92; ctx.fillStyle = '#050a12'
    ctx.fillRect(x0, y0, pw, panelH)
    ctx.strokeStyle = '#16606b'; ctx.strokeRect(x0, y0, pw, panelH)
    ctx.globalAlpha = 1
    ctx.font = '14px ui-monospace, monospace'

    // type the command over the first 60% of p
    const typed = Math.floor(Math.min(1, p / 0.6) * CMD.length)
    ctx.fillStyle = '#a5f3fc'
    ctx.fillText(CMD.slice(0, typed) + (p < 0.6 ? '_' : ''), x0 + pad, y0 + 44)

    if (p >= 0.6) {
      ctx.fillStyle = '#38f5c9'
      ctx.fillText('OK ' + OK, x0 + pad, y0 + 78)
    }
    if (p >= 0.8) {
      const t = (p - 0.8) / 0.2
      ctx.fillStyle = '#fbbf24'
      ctx.fillText('80', x0 + pad, y0 + 116)
      const ax = x0 + pad + 40, aw = 90 * t
      ctx.strokeStyle = '#fbbf24'
      ctx.beginPath(); ctx.moveTo(ax, y0 + 111); ctx.lineTo(ax + aw, y0 + 111); ctx.stroke()
      if (t > 0.9) ctx.fillText('8080', ax + 96, y0 + 116)
    }
  }

  return { setProgress, resize }
}
