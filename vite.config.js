import { defineConfig } from 'vite'

// base: './' → relative asset paths so the built dist/ works when served
// from the nginx web root inside the container.
export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
  },
})
