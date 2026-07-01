import * as mdiIcons from '@mdi/js'

export function mdi(name, size = 18, color = '#7dd3fc') {
  const path = mdiIcons[name]
  if (!path) throw new Error(`Unknown MDI icon: ${name}`)
  return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" aria-hidden="true">
    <path fill="${color}" d="${path}"/></svg>`
}
