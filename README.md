# bootcamp-app

A small **DevOps Bootcamp demo dashboard** — a real frontend app (Vite + a few
libraries: Chart.js, date-fns, lodash, anime.js, canvas-confetti) used across the
bootcamp to practise **building, containerising, pushing and deploying** a real
application (not a static page).

Unlike a plain `index.html`, this app has a **build step**: many libraries are
installed and bundled into static files. That is what makes a **multi-stage
Docker build** worth it — the heavy build tools stay in the build stage, and the
final image ships only the built result.

## Run locally (needs Node)

```bash
npm ci
npm run dev      # http://localhost:5173
```

## Build the static site

```bash
npm run build    # → dist/
```

## Containerise

Single-stage (naive — ships the whole toolbox, ~1.7 GB):

```bash
docker build -f Dockerfile.single -t app:besar .
```

Multi-stage (ships only the built files on nginx, ~90 MB):

```bash
docker build -t app:kecil .        # uses Dockerfile
docker run -d -p 8080:80 app:kecil # http://localhost:8080
docker images app                  # compare the sizes
```

Used in: Docker 2 (build + multi-stage), Docker 3 (push to ECR), CI/CD (build +
push pipeline), and as a reference for the final project.
