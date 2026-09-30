import { defineConfig } from 'vite'

// GitHub Pages serves the site under /<repo>/. Only the Actions build uses that
// base. `vite preview` resolves the config as `serve`, so a command-based base
// served the assets at / while index.html pointed at /<repo>/ (broken page).
// Local build, preview, dev, and e2e stay at /.
export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? '/devops-bootcamp-app/' : '/',
  server: { host: '0.0.0.0', port: 5173 },
  test: {
    environment: 'jsdom',
    include: ['tests/**/*.test.js'],
  },
})
