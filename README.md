# docker-scrollytelling

A single-page, scroll-driven 3D explainer of a multi-stage Dockerfile — built
with Vite, Three.js, anime.js v4, SVG, and Canvas 2D. Scroll to build the image
layer by layer; falls back to a static blueprint without WebGL or with
reduced-motion.

## Run
```bash
npm install
npm run dev      # http://localhost:5173
```

## Test
```bash
npm test         # unit (vitest)
npm run test:e2e # smoke (playwright)
```
