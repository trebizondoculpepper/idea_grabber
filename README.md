# Idea Grabber

A browser claw-machine game with bold cartoon art and PS1 rendering. The current demo contains the cabinet, claw, chute, five-position rack, identical faceted capsules, and the paper-cutout heroes Bulbee and Coinie. Click Coinie to make him jump into the slot; a new Coinie walks in from the right.

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
- `src/scene/`: named machine/environment/hero factories, shared scene resources and idle animation.
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

The scene uses original editable SVG artwork for the cabinet, marquee, floor, backdrop and paper-cutout hero bodies, hands and feet. All capsules share one faceted geometry and turquoise material with the same star decal. Textures use nearest-neighbour filtering without mipmaps. The canvas renders within a 640 × 480 pixel budget and scales with CSS pixelation while HTML text stays sharp.

`src/rendering/ps1-material.ts` extends the standard material shader to blend projected vertices 35% toward a one-pixel grid while preserving depth and clip w. This keeps polygon instability visible without making slow motion appear to run at a low frame rate. A subtle 2 × 2 ordered dither reduces colour to 32 levels per channel. The camera drifts over an 11.25-degree total arc every 48 seconds; there are no camera controls. Reduced motion disables vertex snapping and stops ambient animation; Coinie uses brief transitions. Affine texture warping is not implemented in this prototype.

### Frame-rate diagnostics

In development (or production with `?perf`), inspect the canvas `data-fps`, `data-fps10`, `data-render-ms`, `data-draw-calls` and `data-triangles` attributes in browser developer tools. Samples cover two seconds, with a separate ten-second average, and reset when tab visibility changes. With `?perf`, the browser title also reports these values for native Safari verification. Render milliseconds measure CPU submission time, not GPU completion. No diagnostic controls or overlays are added to the demo.

## Scene graph

```text
ArcadeScene
├── Environment
│   ├── CheckerboardFloor
│   ├── ArcadeBackdrop
│   └── BackgroundCabinet1 / BackgroundCabinet2
├── IdeaGrabberMachine
│   ├── Cabinet
│   ├── Marquee
│   ├── CoinSlot
│   ├── ClawAssembly
│   │   ├── Carriage
│   │   ├── Cable
│   │   └── Claw → Finger1 / Finger2 / Finger3
│   ├── CapsulePit → PitCapsule1 … PitCapsule25
│   ├── OutputRack → CapsulePosition1 … CapsulePosition5
│   └── Chute
├── Bulbee → Body / LeftArm / RightArm / LeftLeg / RightLeg
└── Coinie → Body / LeftArm / RightArm / LeftLeg / RightLeg
```

Groups provide pivots for animation. Every ball is independently addressable; sharing geometry/material does not couple transforms. Rack contents are decorative. Coinie's click cycle ignores further clicks until his replacement finishes walking in. Keyboard users can Tab to the Insert Coinie button and press Enter. Reduced motion uses brief transitions instead of the jump and walk. There are no camera controls. The title is drawn on the machine, with an HTML heading and canvas description for accessibility. In development, the canvas `data-scene-graph` lists named objects.

`docs/ingredient-catalogue.json` contains 120 future ingredients with Unicode emoji suggestions; current balls remain identical.

## Verification

The expanded scene was verified in Chrome and Safari using the production preview (`npm run build` then `npm run preview`). Both browsers measured 59.9 fps across a ten-second visible-tab sample on this Mac; Chrome reported 169 draw calls and 3,246 triangles, with about 1.49 ms CPU render-submission time. These measurements are specific to this machine and scene. Desktop 1280 × 800 and portrait 390 × 844 screenshots are in `docs/references/arcade-world-*.png`. Independent source review found no blocking issues.

Safari rendered the production preview correctly; its development-server page showed unstyled HTML without starting the scene, so production preview is the verified Safari route. This development-server limitation remains to investigate separately.
