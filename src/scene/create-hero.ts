import type { Group, Object3D } from 'three';
import type { SceneKit } from './scene-kit';
import { palette } from './scene-kit';

export function createHero(
  parent: Object3D,
  kit: SceneKit,
  name: 'Bulbee' | 'Coinie',
  x: number,
  z: number,
) {
  const hero = kit.group(parent, name, x, 0.03, z);
  // Paper characters are real flat planes, facing the centre of the camera arc.
  hero.rotation.y = Math.atan2(7, 11);
  const bulb = name === 'Bulbee';
  const body = kit.group(hero, 'Body', 0, bulb ? 1.62 : 1.4, 0);
  kit.panel(
    body,
    'IllustratedBody',
    bulb ? [1.82, 2.43] : [1.93, 1.93],
    [0, 0, 0],
    kit.textured(bulb ? 'bulbee-body' : 'coinie-body', 1, 1, true),
  );
  const leftArm = kit.group(hero, 'LeftArm', -0.62, bulb ? 1.24 : 1.23, -0.02);
  const rightArm = kit.group(hero, 'RightArm', 0.64, bulb ? 1.36 : 1.3, -0.02);
  for (const arm of [leftArm, rightArm]) {
    kit.panel(
      arm,
      'HandAndArm',
      [0.43, 0.86],
      [0, -0.37, 0],
      kit.textured('hero-arm', 1, 1, true),
    );
  }
  leftArm.rotation.z = bulb ? -1.0 : -2.3;
  rightArm.rotation.z = bulb ? 2.2 : 1.1;
  const legs: Group[] = [];
  for (const [side, x] of [
    ['Left', -0.38],
    ['Right', 0.38],
  ] as const) {
    const leg = kit.group(hero, `${side}Leg`, x, 0.55, -0.04);
    legs.push(leg);
    kit.box(leg, 'RubberLeg', [0.1, 0.45, 0.06], [0, -0.15, 0], palette.ink);
    const foot = kit.group(
      leg,
      'Foot',
      side === 'Left' ? -0.06 : 0.06,
      -0.4,
      0.05,
    );
    const shoe = kit.panel(
      foot,
      'Shoe',
      [0.66, 0.44],
      [0, 0.08, 0],
      kit.textured('hero-foot', 1, 1, true),
    );
    if (side === 'Right') shoe.scale.x *= -1;
  }
  return {
    hero,
    update(elapsed: number, walkingProgress?: number) {
      body.rotation.z = Math.sin(elapsed * 1.15 + (bulb ? 0 : 1)) * 0.035;
      const step =
        walkingProgress === undefined
          ? 0
          : Math.sin(walkingProgress * Math.PI * 10);
      legs.forEach((leg, index) => {
        leg.rotation.z = step * (index === 0 ? 0.25 : -0.25);
      });
      leftArm.rotation.z =
        walkingProgress === undefined
          ? bulb
            ? -1.0
            : -2.3
          : -0.6 + step * 0.16;
      rightArm.rotation.z =
        walkingProgress === undefined
          ? (bulb ? 2.2 : 1.1) + Math.sin(elapsed * 1.3) * 0.09
          : 0.6 - step * 0.16;
    },
  };
}
