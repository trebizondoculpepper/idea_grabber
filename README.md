# Idea Grabber

**[Play Idea Grabber live](https://idea-grabber.fly.dev/)**

A browser claw-machine game with bold cartoon art and PS1 rendering. The current demo contains the cabinet, claw, chute, five-position rack, faceted capsules with distinct catalogue icons and independently random colours, and the paper-cutout heroes Bulbee and Coinie. The tray starts empty. Click Coinie to make him jump into the slot: the claw collects a capsule, carries it right and drops it through a hidden chute. The capsule emerges at the bottom left and rolls slowly right. After the capsule settles and the claw parks, a new Coinie walks in from the right.

## Credits and resources

Play at [idea-grabber.fly.dev](https://idea-grabber.fly.dev/). The bottom-right GitHub icon links here for source code and credits.

### Engine and interface

- [Three.js](https://threejs.org/) by the three.js authors — MIT. [Full licence notice](public/licenses/three.txt).
- [GitHub Octicons](https://github.com/primer/octicons) by GitHub — MIT. The GitHub mark links to this repository. [Full licence notice](public/licenses/octicons.txt).

### Sound effects

| Resource                                                                             | Creator      | Licence                                                   | Use                                                    |
| ------------------------------------------------------------------------------------ | ------------ | --------------------------------------------------------- | ------------------------------------------------------ |
| [Casino Audio](https://kenney.nl/assets/casino-audio)                                | Kenney       | [CC0](https://creativecommons.org/publicdomain/zero/1.0/) | Coin insertion and capsules landing in the rack        |
| [Impact Sounds](https://kenney.nl/assets/impact-sounds)                              | Kenney       | [CC0](https://creativecommons.org/publicdomain/zero/1.0/) | Footsteps and capsule impacts                          |
| [Interface Sounds](https://kenney.nl/assets/interface-sounds)                        | Kenney       | [CC0](https://creativecommons.org/publicdomain/zero/1.0/) | Clicks, claw grip/release, jumping, smoke and ejection |
| [Sci Fi Sounds](https://kenney.nl/assets/sci-fi-sounds)                              | Kenney       | [CC0](https://creativecommons.org/publicdomain/zero/1.0/) | Claw motor and cabinet hum                             |
| [Marble Roll](https://freesound.org/people/JuandreSound/sounds/490913/) (HQ preview) | JuandreSound | [CC0](https://creativecommons.org/publicdomain/zero/1.0/) | Rolling capsules                                       |
| [Talking Synthesizer](https://opengameart.org/content/talking-synthesizer)           | tcarisland   | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) | Coinie and Bulbee speech                               |

**Talking Synthesizer attribution:** Talking Synthesizer by tcarisland, licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Modified for Coinie and Bulbee using short excerpts, different pitch and speed, mono conversion, fades and MP3 encoding. [Original resource](https://opengameart.org/content/talking-synthesizer), [exact source excerpts and processing](public/audio/sfx/sources.json), and [preserved licence notices](public/audio/sfx/licenses/).

Other effects were excerpted, converted and encoded for browser playback; see the same processing manifest for details. Downloaded audition candidates are recorded in [the resource register](docs/resource-credits.json) and are not included in the game credits unless used.

### Music and artwork

- **Background music:** 40 tracks delivered by the music-generation LLM. [Track titles, tempo and inspiration references](public/audio/bgm/manifest.json), [generation brief](docs/prompts/music-generation.md), and [original masters](assets/audio-masters/bgm/). The generator/provider and licence were not recorded in the delivery; their provenance and usage terms remain to be documented. Inspiration references are not claims of endorsement or licences to those games' music.
- **Game artwork and models:** project-created SVG artwork and procedural Three.js models in [public/assets](public/assets/) and [src/scene](src/scene/), including Coinie, Bulbee, the grabber, parody arcade cabinets, posters, floor litter, rat and passers-by. Artwork uses Unicode emoji rendered by the player's platform fonts.
- **Social preview:** generated with OpenAI imagegen using the project artwork as reference. [Image](public/social/idea-grabber-preview.jpg) and [generation prompt/provenance](docs/social-preview.md).

Background arcade cabinets each have three attract-mode screens: the original gameplay view, a second stage and a themed high-score table. They change at staggered 7–10 second intervals and hold still with reduced motion. The project-created SVG variants can be regenerated with `python3 scripts/generate-arcade-screens.py`.

### Rack wordplay

Each genre in [the catalogue](docs/ingredient-catalogue.json) has a `words` object containing `verbs`, `nouns` and `adjectives`. These curated word sets travel with the capsule's ingredient, including recycled balls. Use base-form verbs that can take an object (such as `extract`, `shoot`, or `dance with`), bare noun phrases (such as `garden`), and adjectives that work before a noun (such as `space`). Empty arrays are allowed where a part of speech does not fit.

After 18–30 seconds of quiet time, Coinie or Bulbee may combine a verb and noun from different genres currently on the rack, optionally adding an adjective from a third. For example: “I can't wait to extract the garden!” Existing entrance and capsule announcements take priority. The feature uses fixed templates and random choices locally; it makes no AI requests.

### Sharing and camera shots

After a capsule lands and Coinie returns, **Share idea** prepares a square PNG of the scene with both characters, the machine and a readable speech bubble. The preview includes a caption, device sharing, an X/Twitter draft link, Instagram sharing or image download, and a copy-caption button. The **Save image + X draft** button downloads the screenshot and opens a text/link draft; attach the saved PNG using X’s image button. The **X app: share screenshot…** button opens the device share menu with this captured PNG and the idea caption; select X if installed and offered. Installed apps can receive the PNG through the [Web Share API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Share_API) where file sharing is supported; download and copy remain available otherwise. Images are composed locally and are not uploaded by the game.

While the machine is idle, the camera occasionally cuts through two or three short shots: machine close-up, claw detail, either character, a rack/coin-slot feature, a Dutch angle, or a pan following a passer-by through the foreground. The passer-by shot is available only while a walker is in view and ends if they leave. A coin cycle replaces these idle shots with cuts timed to the animation: Coinie's jump, the lowering claw, a claw-and-ball close-up during the grab and lift, a Dutch angle while carrying, and the rack as balls roll in or eject. The camera returns to the default view as the claw returns home. Reduced motion holds the default camera. Share screenshots always use the default framing.

### Development tools

The project uses [Vite](https://vite.dev/) (MIT), [TypeScript](https://www.typescriptlang.org/) (Apache-2.0), [Vitest](https://vitest.dev/) (MIT), [ESLint](https://eslint.org/) (MIT), [Prettier](https://prettier.io/) (MIT), [Node.js](https://nodejs.org/), and [Spec Kitty](https://github.com/Priivacy-ai/spec-kitty) for mission tracking. Dependency versions and transitive packages are recorded in [package.json](package.json) and [package-lock.json](package-lock.json); each package retains its own licence. The public game is hosted on [Fly.io](https://fly.io/).

## Hosting and costs

The live site uses one shared-CPU Fly machine with 256 MB of RAM in London. [fly.toml](fly.toml) enables automatic stopping and starting with zero machines kept running; deployments use `--ha=false` to avoid creating a second machine. [Fly checks for idle capacity every few minutes](https://docs.fly.io/launch/autostop-autostart), and the next request wakes the machine, so the first visit after an idle period may take a little longer. There is no built-in eight-hour idle timer; keeping the existing shorter idle period saves more compute time.

Stopped machines incur no CPU or RAM charges, although [root filesystem storage and outbound traffic still have costs](https://docs.fly.io/about/pricing). Browser caching and gzip reduce repeat asset transfers: fingerprinted bundles are cached for a year, artwork for an hour, and audio is revalidated so unchanged recordings need not be downloaded again. Original WAV masters remain in the repository but are excluded from deployment uploads; the game serves MP3s.

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

Groups provide pivots for animation. Every ball is independently addressable; sharing geometry/material does not couple transforms. The tray fills from right to left, with five spaces. Once full, the oldest ball rolls off the right end and stage forwards out of view; the other four shift right before the next ball enters from the left. Offstage balls recycle into the pit, keeping the FIFO running indefinitely. Coinie's click cycle ignores further clicks until the machine finishes and his replacement finishes walking in. Keyboard users can Tab to the Insert Coinie button and press Enter. Reduced motion uses brief transitions instead of the jump and walk. There are no camera controls. The title is drawn on the machine, with an HTML heading and canvas description for accessibility. In development, the canvas `data-scene-graph` lists named objects.

`docs/ingredient-catalogue.json` contains 120 future ingredients with Unicode emoji suggestions; current balls remain identical.

## Verification

The expanded scene was verified in Chrome and Safari using the production preview (`npm run build` then `npm run preview`). Both browsers measured 59.9 fps across a ten-second visible-tab sample on this Mac; Chrome reported 169 draw calls and 3,246 triangles, with about 1.49 ms CPU render-submission time. These measurements are specific to this machine and scene. Desktop 1280 × 800 and portrait 390 × 844 screenshots are in `docs/references/arcade-world-*.png`. Independent source review found no blocking issues.

Safari rendered the production preview correctly; its development-server page showed unstyled HTML without starting the scene, so production preview is the verified Safari route. This development-server limitation remains to investigate separately.

Bulbee announces the current game idea in a speech bubble whenever a capsule settles in the rack. Newest ingredients come first, each name is emphasised, and only the current FIFO contents are included. The bubble follows Bulbee as the camera drifts and stays visible for ten seconds. Coinie waits until Bulbee finishes speaking and he is back on stage, then echoes the idea. His replies shuffle through twenty-one fictional industry jokes, drawing adjectives, nouns and verbs from the current rack and varying publisher references across the session. Nouns are pluralised for lines such as the EA roadmap joke. There is a genre-specific reaction every fourth turn (for example, “Platform game? That's so 1990s.”). Other genres get fallback jokes; all dialogue is generated locally from curated text.

Coinie starts offstage and walks in before the first click is enabled. Each entrance gets one of twenty enthusiastic stock pitches in a yellow speech bubble. A shuffled bag exhausts all twenty before repeating, with no consecutive duplicate. His bubble follows him, stays for eight seconds, and hides when he is inserted.

The foreground passer-by cast includes a space invader, joystick, hot dog, pizza slice, pretzel, eight-ball bouncer and milkshake greaser. Their original SVG artwork lives in `public/assets/passers-by/`. Each can be followed by the idle camera pan; reduced motion hides the walkers.

Coinie starts with his original slot jump, then shuffles between the default, a forward somersault and a backflip, without repeating consecutive moves. Flips pivot around the coin body; the action camera follows its centre. Reduced motion uses the same stationary fade for every move. The claw star gently pulses through yellow, pink, cyan and purple, holding yellow under reduced motion.

The Vlogger cabinet replaces Bogger with an influencer studio, YouTube-style live viewer and viral upload counters, and a top-creators attract screen. Its three screens use the existing staggered arcade-screen cycle.
