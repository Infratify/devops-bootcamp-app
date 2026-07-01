# devops-bootcamp-app

A small demo web app — a **DevOps dashboard** built with Vite (Chart.js, date-fns,
lodash, anime.js, canvas-confetti).

This is the **developer's app**. It has no Dockerfile — that's *your* job as DevOps:
take this app and containerise it so it runs the same on any machine.

## Requirements

- Node.js 20+
- npm

## Runbook — run it the manual way

```bash
npm install     # download every library the app needs
npm run dev     # start the app → http://localhost:5173
```

## Build the static site

```bash
npm run build     # bundle everything into dist/
npm run preview   # serve the built site → http://localhost:8080
```

The app runs — but you just installed all those libraries by hand, and you'd repeat
that on every machine. Next: wrap it in a Dockerfile so it builds once and runs
anywhere.
