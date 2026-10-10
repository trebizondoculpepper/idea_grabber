# Scene research

Audience: implementers and reviewers of this visual demo.

- Use named Three.js Groups for the machine, assemblies and heroes so later gameplay can animate them independently. Evidence: Three.js Group documentation https://threejs.org/docs/pages/Group.html .
- Procedural low-poly cabinet and shared capsule geometry/material keep the scene small. Original editable SVG cutouts fit the approved vector direction and existing asset pipeline.
- Alpha-tested double-sided textured planes preserve cutout silhouettes without heavy glass or sorted translucent characters. Evidence: https://threejs.org/docs/pages/Material.html .
- Reuse the measured ~59.5 fps PS1 shader prototype; maintain one-pixel partial snapping and the 640×480 pixel budget.
- User confirmations define visual-only scope, identical balls, names Bulbee/Coinie and 11.25-degree camera arc. Screenshot: docs/references/approved-cabinet.png.

Risks: silhouettes may overlap the machine at the camera arc extremes; verify desktop and portrait framing. Shader compilation and alpha edges need browser inspection. No unresolved product questions.
