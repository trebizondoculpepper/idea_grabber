import type { Group, Object3D } from 'three';
import { palette } from './scene-kit';
import type { SceneKit } from './scene-kit';

// Body size, hip height and shoulder placement for each paper cut-out.
const cast = [
  { art: 'space-invader', size: [1.85, 1.4], hip: 0.62, shoulder: [0.95, 1.2] },
  { art: 'joy-stick', size: [0.95, 2.4], hip: 0.62, shoulder: [0.3, 1.75] },
  { art: 'hot-dog', size: [1.1, 2.2], hip: 0.62, shoulder: [0.52, 1.6] },
  { art: 'pizza-slice', size: [1.75, 2.2], hip: 0.62, shoulder: [0.68, 2.0] },
  { art: 'pretzel', size: [1.9, 1.85], hip: 0.62, shoulder: [0.84, 1.6] },
  { art: 'eight-ball', size: [1.85, 1.85], hip: 0.62, shoulder: [0.91, 1.6] },
  { art: 'milkshake', size: [1.25, 2.4], hip: 0.62, shoulder: [0.54, 1.65] },
] as const;

const view = Math.atan2(7, 11);
// A straight lane across the floor in front of everyone, diagonal on screen.
const lane = 5.6;
const start = -17;
const length = 24;
const speed = 2;

/** Arcade-themed passers-by who occasionally stroll across the foreground. */
export function createPassersBy(
  parent: Object3D,
  kit: SceneKit,
  random = Math.random,
) {
  const walkers = cast.map(({ art, size, hip, shoulder }) => {
    const walker = kit.group(parent, `PasserBy:${art}`);
    walker.visible = false;
    const figure = kit.group(walker, 'Figure');
    kit.panel(
      figure,
      'Body',
      [size[0], size[1]],
      [0, hip + size[1] / 2 - 0.08, 0],
      kit.textured(`passers-by/${art}`, 1, 1, true),
    );
    const arms: Group[] = [];
    for (const side of [-1, 1]) {
      const arm = kit.group(
        figure,
        'Arm',
        side * shoulder[0],
        shoulder[1],
        -0.02,
      );
      kit.panel(
        arm,
        'HandAndArm',
        [0.36, 0.72],
        [0, -0.3, 0],
        kit.textured('hero-arm', 1, 1, true),
      );
      arms.push(arm);
    }
    const legs: Group[] = [];
    for (const side of [-1, 1]) {
      const leg = kit.group(figure, 'Leg', side * 0.26, hip, -0.04);
      kit.box(leg, 'RubberLeg', [0.09, 0.42, 0.05], [0, -0.17, 0], palette.ink);
      const shoe = kit.panel(
        leg,
        'Shoe',
        [0.56, 0.38],
        [side * 0.05, -0.38, 0.05],
        kit.textured('hero-foot', 1, 1, true),
      );
      if (side > 0) shoe.scale.x *= -1;
      legs.push(leg);
    }
    return { walker, figure, arms, legs };
  });
  let active:
    { index: number; direction: number; travelled: number } | undefined;
  let wait = 3 + random() * 5;

  function hide() {
    walkers.forEach(({ walker }) => (walker.visible = false));
    active = undefined;
  }

  return {
    get walking() {
      return active ? cast[active.index].art : undefined;
    },
    get cameraTarget() {
      if (!active) return undefined;
      const walker = walkers[active.index].walker;
      return walker.visible && Math.abs(walker.position.x) <= 6
        ? walker
        : undefined;
    },
    update(delta: number, reducedMotion = false) {
      if (reducedMotion) {
        hide();
        return;
      }
      if (!active) {
        wait -= delta;
        if (wait > 0) return;
        active = {
          index: Math.floor(random() * walkers.length),
          direction: random() < 0.5 ? 1 : -1,
          travelled: 0,
        };
      }
      active.travelled += delta * speed;
      const { walker, figure, arms, legs } = walkers[active.index];
      if (active.travelled > length) {
        walker.visible = false;
        active = undefined;
        wait = 8 + random() * 12;
        return;
      }
      walker.visible = true;
      walker.position.set(
        active.direction > 0
          ? start + active.travelled
          : start + length - active.travelled,
        0.03,
        lane,
      );
      walker.rotation.y = view;
      walker.scale.x = active.direction;
      const stride = active.travelled * 2.4;
      figure.position.y = Math.abs(Math.sin(stride)) * 0.08;
      figure.rotation.z = Math.sin(stride) * 0.04;
      legs.forEach((leg, index) => {
        leg.rotation.z = Math.sin(stride) * (index ? -0.4 : 0.4);
      });
      arms.forEach((arm, index) => {
        arm.rotation.z = (index ? 0.5 : -0.5) + Math.sin(stride) * 0.3;
      });
    },
  };
}
