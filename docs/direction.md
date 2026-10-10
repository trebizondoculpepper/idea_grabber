# Agreed direction

The first mission is project foundation. The next mission is a visual demo of the cabinet, Bulbie, Coinie, capsules, chute, rack and arcade environment. Gameplay comes later.

Use `references/approved-cabinet.png` for composition and colour. The principal stylistic reference is PS1 PaRappa the Rapper: original flat illustrated cutout characters in a chunky low-poly 3D world. Use acid yellow, hot pink, turquoise and deep purple, thick outlines, exaggerated expressions and graphic textures.

The visual demo camera will drift very slowly back and forth across approximately 11.25 degrees total (1/32 of a full orbit), centred on the three-quarter composition. No camera controls, settings panel or gameplay UI in that demo.

PS1 rendering should include low-resolution rendering, nearest-neighbour textures and restrained screen-space vertex snapping. Evaluate subtle dithering/reduced colour precision and optional affine-style texture warping. Keep the machine and mascots legible.

The original build brief describes the later playable version. Its gameplay settings and controls are outside the visual demo scope.

The next interaction lets players click Coinie: he jumps into the slot, then a fresh Coinie walks in from the right. Further clicks are ignored until the replacement arrives.

The machine cycle now starts with an empty output tray. Coin insertion triggers claw descent, grab, lift, travel right, release into a hidden chute, and a slow capsule roll from the bottom left to the right. The claw parks before the replacement Coinie enters. Each cycle transfers one existing pit ball into the tray.
