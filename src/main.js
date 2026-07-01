import './style.css'

const canvas = document.getElementById('stage')
const ctx = canvas.getContext('webgl2') || canvas.getContext('webgl')
// Placeholder boot — real wiring added in later tasks.
document.body.dataset.booted = ctx ? 'webgl' : 'nowebgl'
console.log('[boot]', document.body.dataset.booted)
