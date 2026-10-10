# Idea Grabber

A browser claw-machine game with bold cartoon art and PS1 rendering. This scaffold establishes the toolchain and a minimal animated Three.js scene; gameplay and the visual demo follow in later missions.

## Run locally

Use Node.js 22.13.x, 24.x, or 26+ and npm (the scaffold was verified with Node 26.10.0 / npm 11.19.1).

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:5173. No backend, API keys, or external services are required during play.

## Checks and production build

```sh
npm run typecheck
npm run lint
npm run format:check
npm test
npm run build
npm run preview
```

The build produces static files in `dist/`. Preview serves them at http://127.0.0.1:4173. `npm run format` formats source files. Dependencies are pinned and `package-lock.json` records the reproducible install. Vitest is configured through its defaults; there are no game logic tests yet, and the test command permits an empty suite until game logic is implemented.

## Layout

- `src/main.ts`: entry point, error reporting and hot-reload cleanup.
- `src/scene/`: world geometry and animation.
- `src/rendering/`: renderer, camera and lifecycle; future PS1 shaders belong here.
- `src/styles/`: HTML styling.
- `public/assets/`: runtime artwork and audio, served locally.
- `docs/`: build brief, reference image and agreed direction.
- `.kittify/`: Spec Kitty project configuration; future missions live in `kitty-specs/`.

Input, game state and UI modules will be added as needed. Scene motion is time-based, pauses while the tab is hidden, and honours reduced motion. Resize handling and hot-reload disposal are included.

## Repository

Remote: https://github.com/trebizondoculpepper/idea_grabber.git

The Spec Kitty configuration was moved from `my-project/` to this root. The original Python starter files were preserved outside the repository in `../idea_grabber-python-starter/`; the existing local virtual environment and IDE settings are ignored.

## PS1 rendering prototype

The current scene uses original editable 128 × 128 SVG textures for the capsule, checkerboard floor and patterned backdrop. Textures use nearest-neighbour filtering without mipmaps. The canvas renders within a 640 × 480 pixel budget and scales with CSS pixelation while HTML text stays sharp.

`src/rendering/ps1-material.ts` extends the standard material shader to blend projected vertices 35% toward a one-pixel grid while preserving depth and clip w. This keeps polygon instability visible without making slow motion appear to run at a low frame rate. A subtle 2 × 2 ordered dither reduces colour to 32 levels per channel. The camera drifts over an 11.25-degree total arc every 48 seconds; there are no camera controls. Reduced motion disables vertex snapping and stops animation. Affine texture warping is not implemented in this prototype.

### Frame-rate diagnostics

In development (or production with `?perf`), inspect the canvas `data-fps`, `data-render-ms`, `data-draw-calls` and `data-triangles` attributes in browser developer tools. Samples cover two seconds and reset when tab visibility changes. Render milliseconds measure CPU submission time, not GPU completion. No diagnostic controls or overlays are added to the demo.
