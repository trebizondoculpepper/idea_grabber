import { Mesh, SphereGeometry } from 'three';
import type { Object3D } from 'three';
import type { SceneKit } from './scene-kit';

export function ratPose(elapsed: number, reducedMotion: boolean) {
  const time = reducedMotion ? 5 : ((elapsed % 24) + 24) % 24;
  const returning = time >= 12;
  const legTime = returning ? time - 12 : time;
  const progress = Math.min(legTime / 10, 1);
  // Ease into each dash and brake before sniffing at the end of the wall.
  const travel = progress * progress * (3 - 2 * progress);
  return {
    x: returning ? 11 - travel * 27 : -16 + travel * 27,
    facing: returning ? Math.PI : 0,
    moving: !reducedMotion && legTime < 10,
  };
}

export function createRat(parent: Object3D, kit: SceneKit) {
  const rat = kit.group(parent, 'SkirtingBoardRat', -16, 0, -7.48);
  const sphere = kit.ownGeometry(new SphereGeometry(1, 8, 6));
  function oval(
    name: string,
    size: [number, number, number],
    position: [number, number, number],
    color: string,
  ) {
    const mesh = new Mesh(sphere, kit.material(color));
    mesh.name = name;
    mesh.scale.set(...size);
    mesh.position.set(...position);
    rat.add(mesh);
    return mesh;
  }
  const body = oval('RatBody', [0.44, 0.24, 0.22], [0, 0.28, 0], '#827b8d');
  oval('RatHead', [0.24, 0.2, 0.19], [0.38, 0.28, 0], '#91889b');
  oval('RatSnout', [0.16, 0.09, 0.11], [0.57, 0.23, 0], '#91889b');
  oval('RatNose', [0.045, 0.045, 0.05], [0.71, 0.23, 0], '#e9a1b0');
  for (const side of [-1, 1]) {
    oval('RatEar', [0.105, 0.125, 0.045], [0.3, 0.46, side * 0.14], '#dc9cae');
    oval('RatEye', [0.035, 0.04, 0.025], [0.48, 0.34, side * 0.16], '#171023');
  }
  const paws = [-0.26, 0.28].flatMap((x) =>
    [-1, 1].map((side) =>
      oval('RatPaw', [0.11, 0.045, 0.075], [x, 0.055, side * 0.18], '#dc9cae'),
    ),
  );
  const tail = kit.group(rat, 'RatTail', -0.38, 0.13, 0);
  for (let i = 0; i < 4; i++) {
    const piece = kit.box(
      tail,
      'TailSegment',
      [0.2, 0.035 - i * 0.005, 0.035 - i * 0.005],
      [-0.1 - i * 0.18, 0, Math.sin(i * 0.7) * 0.09],
      '#dc9cae',
    );
    piece.rotation.y = -Math.cos(i * 0.7) * 0.25;
  }
  function update(elapsed: number, reducedMotion: boolean) {
    const pose = ratPose(elapsed, reducedMotion);
    rat.position.x = pose.x;
    rat.rotation.y = pose.facing;
    const scurry = pose.moving ? Math.sin(elapsed * 26) : 0;
    body.position.y = 0.28 + Math.abs(scurry) * 0.025;
    paws.forEach((paw, index) => {
      paw.position.y =
        0.055 + Math.max(0, scurry * (index % 2 ? -1 : 1)) * 0.045;
    });
    tail.rotation.y = reducedMotion
      ? 0
      : Math.sin(elapsed * (pose.moving ? 9 : 2)) * 0.12;
  }
  update(0, false);
  return { rat, update };
}
