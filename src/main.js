import './style.css'
import { Chart, registerables } from 'chart.js'
import { format } from 'date-fns'
import { shuffle, sumBy } from 'lodash-es'
import anime from 'animejs'
import confetti from 'canvas-confetti'

Chart.register(...registerables)

// --- live clock (date-fns) ---
const clock = document.getElementById('clock')
function tick() {
  clock.textContent = format(new Date(), "eeee, d MMM yyyy — HH:mm:ss")
}
tick()
setInterval(tick, 1000)

// --- metric cards (lodash) ---
const metrics = [
  { label: 'Builds', value: 128 },
  { label: 'Images', value: 34 },
  { label: 'Deploys', value: 57 },
  { label: 'Uptime %', value: 99 },
]
const cards = document.getElementById('cards')
for (const m of metrics) {
  const el = document.createElement('div')
  el.className = 'card'
  el.innerHTML = `<span class="v">${m.value}</span><span class="l">${m.label}</span>`
  cards.appendChild(el)
}
document.getElementById('subtitle').textContent =
  `Container Dashboard — ${sumBy(metrics, 'value')} events tracked`

// --- animate the cards in (animejs) ---
anime({
  targets: '.card',
  translateY: [24, 0],
  opacity: [0, 1],
  delay: anime.stagger(120),
  easing: 'easeOutQuad',
})

// --- chart (chart.js) ---
const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
new Chart(document.getElementById('chart'), {
  type: 'bar',
  data: {
    labels,
    datasets: [
      {
        label: 'Deployments / day',
        data: shuffle([12, 19, 9, 14, 22, 6, 17]),
        backgroundColor: '#38bdf8',
        borderRadius: 6,
      },
    ],
  },
  options: {
    responsive: true,
    plugins: { legend: { labels: { color: '#e2e8f0' } } },
    scales: {
      x: { ticks: { color: '#94a3b8' }, grid: { color: '#1e293b' } },
      y: { ticks: { color: '#94a3b8' }, grid: { color: '#1e293b' } },
    },
  },
})

// --- celebrate (canvas-confetti) ---
document.getElementById('celebrate').addEventListener('click', () => {
  confetti({ particleCount: 120, spread: 70, origin: { y: 0.7 } })
})

// --- build stamp ---
document.getElementById('built').textContent =
  `Built ${format(new Date(), 'yyyy-MM-dd HH:mm')}`
