import type { Object3D } from 'three';
import { palette } from './scene-kit';
import type { SceneKit } from './scene-kit';

export function createEnvironment(parent: Object3D, kit: SceneKit) {
  const environment = kit.group(parent, 'Environment');
  const floor = kit.panel(
    environment,
    'CheckerboardFloor',
    [40, 40],
    [0, -0.03, 0],
    kit.textured('checker-floor', 18, 18),
  );
  floor.rotation.x = -Math.PI / 2;
  kit.panel(
    environment,
    'ArcadeBackdrop',
    [100, 24],
    [0, 11.5, -8],
    kit.textured('backdrop', 25, 6),
  );
  kit.box(
    environment,
    'WallSkirting',
    [44, 0.28, 0.25],
    [0, 0.12, -7.9],
    palette.teal,
  );
  // Simple neighbouring silhouettes keep the scene an arcade, without elaborate props.
  for (const [index, x] of [-7.8, 7.8].entries()) {
    const neighbour = kit.group(
      environment,
      `BackgroundCabinet${index + 1}`,
      x,
      0,
      -5.2,
    );
    neighbour.rotation.y = index === 0 ? 0.15 : -0.15;
    kit.box(
      neighbour,
      'Cabinet',
      [2.7, 4.6, 1.65],
      [0, 2.4, 0],
      palette.purple,
      true,
    );
    kit.box(
      neighbour,
      'TopTrim',
      [2.92, 0.18, 1.9],
      [0, 4.78, 0],
      palette.pink,
    );
    kit.box(
      neighbour,
      'ScreenFrame',
      [2.28, 2.3, 0.15],
      [0, 3.14, 0.87],
      palette.ink,
    );
    kit.panel(
      neighbour,
      'ScreenGraphic',
      [1.98, 1.96],
      [0, 3.15, 0.96],
      kit.textured('backdrop'),
    );
    kit.box(
      neighbour,
      'Console',
      [2.76, 0.22, 0.74],
      [0, 1.75, 1.03],
      palette.teal,
      true,
    );
    kit.box(
      neighbour,
      'Marquee',
      [2.65, 0.47, 0.1],
      [0, 4.46, 0.95],
      palette.yellow,
    );
    kit.panel(
      neighbour,
      'MarqueeStars',
      [2.44, 0.38],
      [0, 4.46, 1.02],
      kit.textured('backdrop', 2, 1),
    );
  }
  return environment;
}
