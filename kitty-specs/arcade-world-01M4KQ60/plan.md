# Implementation plan: Arcade world

## Technical context

Existing TypeScript, Vite and Three.js WebGLRenderer. Build procedural geometry and original SVG paper characters, with shared low-poly capsules. Keep shader snapping, dithering and low-resolution rendering.

## Implementation concerns

### IC-01 — Named composition

`src/scene/` factories build Environment and IdeaGrabberMachine as named Groups; machine assemblies have useful origins. Capsule meshes share resources and have unique names. Floor/background reuse and refine SVG assets.

### IC-02 — Two heroes

Original SVG body and limb textures on alpha-tested double-sided planes under hero/pivot Groups. Faces are large and expressive; grouped pivots support modest idle poses now and future animation. Draw hero textures with flat unlit materials and PS1 snapping.

### IC-03 — Integration and verification

Compose resources with one disposal owner, retain time-based lifecycle and tiny camera arc, adapt camera distance to narrow viewports. Scene replaces prototype header with an unobtrusive visual-demo page. Measure at least 30 fps in desktop Chrome and Safari; check portrait view and reduced motion.

## Validation

Run typecheck/lint/build/format. Browser screenshots verify visual contract, named scene structure is exposed via dev canvas metadata, no runtime shader errors. Measure steady-state frame rates over 10 seconds after shader warmup. No fabricated gameplay tests for this visual-only change.

## Risks and boundaries

Cutout characters must face the fixed three-quarter camera and not occlude controls. Rack is decorative, not game state. No controls, ingredients, AI calls or physics. Catalogue is a separately requested planning artifact.
