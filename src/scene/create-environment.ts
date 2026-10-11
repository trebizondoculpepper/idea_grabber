import { CylinderGeometry, Mesh, SphereGeometry } from 'three';
import type { Object3D } from 'three';
import { palette } from './scene-kit';
import type { SceneKit } from './scene-kit';

export function createEnvironment(
  parent: Object3D,
  kit: SceneKit,
  random = Math.random,
) {
  const environment = kit.group(parent, 'Environment');
  const floor = kit.panel(
    environment,
    'CheckerboardFloor',
    [100, 60],
    [0, -0.03, 0],
    kit.textured('checker-floor', 45, 27),
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
    [100, 0.28, 0.25],
    [0, 0.12, -7.9],
    palette.teal,
  );
  // A random selection of parody coin-op neighbours fills the floor spots on every visit.
  const cabinets = [
    { art: 'silver-axe', body: '#c41f3a' },
    { art: 'lbert', body: palette.purple },
    { art: 'vlogger', body: '#bf2746' },
    { art: 'invoicers', body: '#1d4fa8' },
    { art: 'snackman', body: '#398aff' },
    { art: 'bonkey-kung', body: '#ff545e' },
    { art: 'hasteroids', body: '#2a2240' },
    { art: 'mortgage-kombat', body: '#ffb52e' },
  ];
  const spots = [
    { x: -10.6, z: 0.2, turn: 0.75 },
    { x: -12.8, z: -6.4, turn: 0.25 },
    { x: -8.6, z: -2.8, turn: 0.6 },
    { x: 3.9, z: -6.6, turn: -0.1 },
    { x: 7.0, z: -0.8, turn: -0.55 },
    { x: 7.6, z: -6.2, turn: -0.2 },
  ];
  for (let i = cabinets.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [cabinets[i], cabinets[j]] = [cabinets[j], cabinets[i]];
  }
  const placed = spots.map((spot, index) => ({
    ...cabinets[index],
    ...spot,
  }));
  const joystickShaft = kit.ownGeometry(
    new CylinderGeometry(0.045, 0.045, 0.28, 6),
  );
  const joystickGrip = kit.ownGeometry(new SphereGeometry(0.15, 8, 6));
  for (const { art, x, z, turn, body } of placed) {
    const neighbour = kit.group(environment, `ArcadeCabinet:${art}`, x, 0, z);
    neighbour.rotation.y = turn;
    kit.box(neighbour, 'Cabinet', [2.7, 4.6, 1.65], [0, 2.4, 0], body, true);
    kit.box(neighbour, 'TopTrim', [2.92, 0.18, 1.9], [0, 4.78, 0], palette.ink);
    kit.box(
      neighbour,
      'ScreenFrame',
      [2.28, 2.3, 0.15],
      [0, 3.14, 0.87],
      palette.ink,
    );
    const screen = kit.panel(
      neighbour,
      'ScreenGraphic',
      [1.98, 1.96],
      [0, 3.15, 0.96],
      kit.textured(`arcade/${art}-screen`),
    );
    screen.userData.screenMaterials = [
      screen.material,
      kit.textured(`arcade/${art}-screen-2`),
      kit.textured(`arcade/${art}-scores`),
    ];
    kit.box(
      neighbour,
      'Console',
      [2.76, 0.22, 0.74],
      [0, 1.75, 1.03],
      palette.ink,
      true,
    );
    const joystick = kit.group(neighbour, 'Joystick', -0.58, 1.86, 1.15);
    kit.box(
      joystick,
      'JoystickMount',
      [0.3, 0.06, 0.3],
      [0, 0.03, 0],
      palette.silver,
    );
    const shaft = new Mesh(joystickShaft, kit.material(palette.silver));
    shaft.name = 'JoystickShaft';
    shaft.position.y = 0.2;
    joystick.add(shaft);
    const grip = new Mesh(joystickGrip, kit.material(palette.pink));
    grip.name = 'JoystickGrip';
    grip.position.y = 0.37;
    joystick.add(grip);
    kit.box(
      neighbour,
      'Marquee',
      [2.65, 0.47, 0.1],
      [0, 4.46, 0.95],
      palette.ink,
    );
    kit.panel(
      neighbour,
      'MarqueeTitle',
      [2.6, 0.46],
      [0, 4.46, 1.02],
      kit.textured(`arcade/${art}-marquee`),
    );
  }
  // Four hooks on the back wall each show a randomly chosen poster per visit.
  const posters = [
    'pizza-mascot',
    'free-refills',
    'todays-special',
    'ten-thousand-tickets',
    'prize-counter',
    'ticket-muncher',
    'birthday-parties',
    'token-tuesday',
    'employee-of-the-month',
    'no-running',
    'dont-climb-in',
    'dont-feed-the-claw',
    'high-scores',
    'top-grabber',
  ];
  for (let i = posters.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [posters[i], posters[j]] = [posters[j], posters[i]];
  }
  const hooks = [
    [-17.5, 6.5],
    [-11.5, 6.5],
    [4.8, 6.5],
    [8.8, 6.3],
  ];
  hooks.forEach(([x, y], index) => {
    const poster = posters[index];
    const hung = kit.group(environment, `Poster:${poster}`, x, y, -7.9);
    hung.rotation.z = (random() - 0.5) * 0.12;
    kit.box(hung, 'Frame', [2.75, 3.5, 0.08], [0, 0, 0], palette.ink);
    kit.panel(
      hung,
      'Print',
      [2.5, 3.25],
      [0, 0, 0.05],
      kit.textured(`posters/${poster}`),
    );
  });
  // Seedy-arcade litter, scattered differently on every visit.
  const rubbish: [string, number][] = [
    ['cigarette-butt', 0.4],
    ['pizza-slice', 0.9],
    ['pizza-crust', 0.7],
    ['squashed-can', 0.75],
    ['crushed-cup', 0.85],
    ['soda-puddle', 1.5],
    ['chewing-gum', 0.35],
    ['ticket-strip', 1.2],
    ['lost-token', 0.32],
    ['popcorn', 0.7],
    ['sweet-wrapper', 0.6],
    ['banana-peel', 0.8],
    ['crumpled-receipt', 0.7],
    ['ice-cream-cone', 0.9],
  ];
  const extras = [
    'cigarette-butt',
    'cigarette-butt',
    'cigarette-butt',
    'pizza-crust',
    'popcorn',
    'chewing-gum',
  ];
  const scattered = [
    ...rubbish,
    ...extras.map((name) => rubbish.find(([candidate]) => candidate === name)!),
  ];
  scattered.forEach(([name, size], index) => {
    // Sample in the camera's view of the floor so the mess lands on screen.
    const view = Math.atan2(7, 11);
    let x: number;
    let z: number;
    do {
      const depth = -4.5 + random() * 8;
      const across = (random() - 0.5) * (13 - depth) * 0.95;
      x = Math.sin(view) * depth + Math.cos(view) * across;
      z = Math.cos(view) * depth - Math.sin(view) * across;
    } while (Math.abs(x) < 3.1 && z > -1.9 && z < 2.1);
    const piece = kit.panel(
      environment,
      `Litter:${name}`,
      [size * 1.6, size * 1.6],
      [x, 0.005 + index * 0.001, z],
      kit.textured(`litter/${name}`, 1, 1, true),
    );
    piece.rotation.set(-Math.PI / 2, 0, random() * Math.PI * 2);
  });
  return environment;
}
