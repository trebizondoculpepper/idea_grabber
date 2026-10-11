import { IcosahedronGeometry, Mesh } from 'three';
import type { Object3D } from 'three';
import {
  createCapsuleAppearances,
  createRecycledAppearance,
} from '../game/capsule-appearance';
import { palette } from './scene-kit';
import type { SceneKit } from './scene-kit';

export function createMachine(parent: Object3D, kit: SceneKit) {
  const machine = kit.group(parent, 'IdeaGrabberMachine');
  const cabinet = kit.group(machine, 'Cabinet');
  kit.box(cabinet, 'Base', [5.4, 1.6, 3.0], [0, 0.9, 0], palette.pink, true);
  kit.box(
    cabinet,
    'BaseLip',
    [5.65, 0.17, 3.2],
    [0, 0.17, 0],
    palette.pink,
    true,
  );
  kit.box(
    cabinet,
    'RearWall',
    [5.15, 4.1, 0.18],
    [0, 3.6, -1.43],
    palette.purple,
  );
  kit.panel(
    cabinet,
    'PitBackdrop',
    [4.65, 3.9],
    [-0.2, 3.6, -1.32],
    kit.textured('backdrop', 2, 2),
  );
  kit.box(
    cabinet,
    'RightSide',
    [0.18, 5.8, 3.0],
    [2.6, 3.1, 0],
    palette.yellow,
    true,
  );
  const sideGraphic = kit.panel(
    cabinet,
    'SideGraphic',
    [2.98, 5.75],
    [2.7, 3.1, 0],
    kit.textured('cabinet-side'),
  );
  sideGraphic.rotation.y = Math.PI / 2;
  for (const x of [-2.55, 1.55]) {
    kit.box(
      cabinet,
      `FrontPost${x < 0 ? 'Left' : 'Right'}`,
      [0.24, 4.1, 0.28],
      [x, 3.6, 1.52],
      palette.yellow,
      true,
    );
    kit.box(
      cabinet,
      `PinkEdge${x < 0 ? 'Left' : 'Right'}`,
      [0.09, 4.1, 0.33],
      [x - 0.13, 3.6, 1.51],
      palette.pink,
    );
  }
  kit.box(
    cabinet,
    'WindowSill',
    [4.3, 0.23, 0.35],
    [-0.5, 1.68, 1.5],
    palette.yellow,
    true,
  );
  kit.box(
    cabinet,
    'Ceiling',
    [5.35, 0.24, 3.1],
    [0, 5.63, 0],
    palette.lavender,
    true,
  );
  kit.box(
    cabinet,
    'RoofTrim',
    [5.65, 0.18, 3.25],
    [0, 6.22, 0],
    palette.pink,
    true,
  );
  const marquee = kit.group(machine, 'Marquee', 0, 5.88, 1.57);
  kit.box(
    marquee,
    'MarqueeFrame',
    [5.7, 1.02, 0.27],
    [0, 0, 0],
    palette.pink,
    true,
  );
  kit.panel(
    marquee,
    'Title',
    [5.4, 0.86],
    [0, 0, 0.15],
    kit.textured('marquee'),
  );

  const coinSlot = kit.group(machine, 'CoinSlot', 2.08, 2.94, 1.59);
  kit.box(
    coinSlot,
    'ControlColumn',
    [0.95, 5.0, 0.24],
    [0, 0, 0],
    palette.yellow,
    true,
  );
  kit.panel(
    coinSlot,
    'InsertCoinGraphic',
    [0.86, 3.75],
    [0, 0.05, 0.13],
    kit.textured('coin-panel'),
  );
  // Share six tiny textures rather than allocating resources as the count changes.
  const rackCountMaterials = Array.from({ length: 6 }, (_, count) =>
    kit.textured(`rack-count-${count}`),
  );
  const rackCount = kit.panel(
    coinSlot,
    'RackCount',
    [(0.86 * 207) / 256, (3.75 * 88) / 512],
    [0, 0.05 + ((256 - 440) * 3.75) / 512, 0.145],
    rackCountMaterials[0],
  );
  // A bright copy of the sign, toggled on and off to flash while a coin can go in.
  const insertCoinLit = kit.panel(
    coinSlot,
    'InsertCoinLit',
    [0.74, 0.88],
    [0, 1.16, 0.14],
    kit.textured('insert-coin-lit'),
  );
  const assembly = kit.group(machine, 'ClawAssembly', -0.45, 5.4, 0.5);
  const carriage = kit.group(assembly, 'Carriage');
  kit.box(carriage, 'Rail', [3.55, 0.12, 0.12], [0, 0.02, 0], palette.ink);
  kit.box(
    carriage,
    'Motor',
    [0.55, 0.25, 0.43],
    [0, -0.15, 0],
    palette.silver,
    true,
  );
  const cable = kit.group(assembly, 'Cable');
  kit.box(
    cable,
    'AngularCable',
    [0.08, 0.75, 0.08],
    [0, -0.64, 0],
    palette.silver,
  );
  for (let i = 0; i < 7; i++) {
    const coil = kit.box(
      cable,
      `Coil${i}`,
      [0.14, 0.09, 0.12],
      [-0.62 + i * 0.05, -0.25 - i * 0.105, -0.06],
      palette.ink,
    );
    coil.rotation.z = i * 0.25;
  }
  const claw = kit.group(assembly, 'Claw', 0, -1.08, 0);
  kit.box(claw, 'Hub', [0.53, 0.4, 0.38], [0, 0, 0], palette.silver, true);
  kit.panel(
    claw,
    'Star',
    [0.37, 0.37],
    [0, 0, 0.21],
    kit.textured('claw-star', 1, 1, true),
  );
  for (const [index, angle] of [
    0,
    (Math.PI * 2) / 3,
    (Math.PI * 4) / 3,
  ].entries()) {
    const finger = kit.group(claw, `Finger${index + 1}`);
    finger.rotation.y = angle;
    const upper = kit.box(
      finger,
      'Upper',
      [0.16, 0.48, 0.2],
      [0.3, -0.26, 0],
      palette.silver,
      true,
    );
    upper.rotation.z = 0.65;
    const lower = kit.box(
      finger,
      'Lower',
      [0.12, 0.45, 0.16],
      [0.46, -0.65, 0],
      palette.silver,
      true,
    );
    lower.rotation.z = -0.2;
    const tip = kit.box(
      finger,
      'Tip',
      [0.1, 0.18, 0.13],
      [0.41, -0.94, 0],
      palette.silver,
    );
    tip.rotation.z = -0.55;
  }

  const capsuleGeometry = kit.ownGeometry(new IcosahedronGeometry(0.43, 1));
  const appearances = createCapsuleAppearances(25);
  let appearanceIndex = 0;
  function capsule(
    parent: Object3D,
    name: string,
    x: number,
    y: number,
    z: number,
  ) {
    const appearance = appearances[appearanceIndex++];
    const ball = new Mesh(capsuleGeometry, kit.material(appearance.colour));
    ball.userData.ingredient = appearance.ingredient;
    ball.userData.colour = appearance.colour;
    ball.name = name;
    ball.position.set(x, y, z);
    ball.rotation.y = Math.atan2(7, 11);
    kit.panel(
      ball,
      'IngredientIcon',
      [0.58, 0.58],
      [0, 0, 0.435],
      kit.emoji(appearance.ingredient.emoji),
    );
    parent.add(ball);
    if (parent.name === 'CapsulePit') pitBalls.push(ball);
    return ball;
  }
  const pit = kit.group(machine, 'CapsulePit', -0.46, 1.88, 0);
  kit.box(pit, 'PitTray', [3.85, 0.14, 2.4], [0, -0.16, 0], palette.purple);
  const pitBalls: Mesh[] = [];
  let ballIndex = 0;
  for (let row = 0; row < 3; row++) {
    for (let column = 0; column < 5; column++) {
      capsule(
        pit,
        `PitCapsule${++ballIndex}`,
        -1.48 + column * 0.74,
        0.26 + (column % 2) * 0.07,
        -0.88 + row * 0.77,
      );
    }
  }
  for (let row = 0; row < 2; row++) {
    for (let column = 0; column < 4; column++) {
      capsule(
        pit,
        `PitCapsule${++ballIndex}`,
        -1.1 + column * 0.74,
        0.94 + (column % 2) * 0.08,
        -0.45 + row * 0.78,
      );
    }
  }
  capsule(pit, `PitCapsule${++ballIndex}`, -0.25, 1.54, -0.38);
  capsule(pit, `PitCapsule${ballIndex + 1}`, 0.55, 1.52, -0.24);

  const rack = kit.group(machine, 'OutputRack', -0.43, 0.86, 1.62);
  kit.box(rack, 'DarkOpening', [3.96, 1.06, 0.08], [0, 0, 0], palette.ink);
  kit.box(
    rack,
    'RackFloor',
    [4.08, 0.16, 0.76],
    [0, -0.51, 0.22],
    palette.yellow,
    true,
  );
  for (const x of [-2.0, 2.0])
    kit.box(
      rack,
      `RackSide${x}`,
      [0.1, 1.12, 0.68],
      [x, 0, 0.18],
      palette.yellow,
    );
  for (let i = 0; i < 5; i++) {
    kit.group(rack, `CapsulePosition${i + 1}`, -1.55 + i * 0.77, -0.01, 0.35);
    // Positions begin empty; collected capsules fill them from the right.
  }
  const chute = kit.group(machine, 'Chute', -2.23, 1.55, 1.72);
  kit.box(chute, 'ChuteBack', [0.53, 1.1, 0.16], [0, 0, 0], palette.lavender);
  kit.box(
    chute,
    'ChuteMouth',
    [0.41, 0.27, 0.02],
    [0, 0.34, 0.09],
    palette.ink,
  );
  const chuteRamp = kit.box(
    chute,
    'AngledRamp',
    [0.53, 0.11, 0.9],
    [0, -0.25, 0.37],
    palette.teal,
    true,
  );
  chuteRamp.rotation.x = 0.5;
  for (const x of [-0.27, 0.27])
    kit.box(
      chute,
      `ChuteRim${x}`,
      [0.07, 0.52, 0.91],
      [x, -0.14, 0.32],
      palette.yellow,
    );

  // Reflection graphics suggest glass without a translucent box obscuring the action.
  const glass = kit.panel(
    cabinet,
    'GlassReflectionMarks',
    [0.73, 2.1],
    [-2.0, 3.95, 1.64],
    kit.textured('glass-marks', 1, 1, true),
  );
  glass.material.transparent = true;
  glass.material.depthWrite = false;
  const rail = carriage.getObjectByName('Rail')!;
  machine.updateMatrixWorld(true);
  machine.attach(rail);
  function recycle(ball: Mesh) {
    const appearance = createRecycledAppearance(
      ball.userData.ingredient,
      pitBalls.map((candidate) => candidate.userData.ingredient),
    );
    ball.material = kit.material(appearance.colour);
    (ball.getObjectByName('IngredientIcon') as Mesh).material = kit.emoji(
      appearance.ingredient.emoji,
    );
    ball.userData.ingredient = appearance.ingredient;
    ball.userData.colour = appearance.colour;
  }
  return {
    machine,
    assembly,
    claw,
    cable,
    pitBalls,
    rack,
    recycle,
    coinSlot,
    insertCoinLit,
    setRackCount(count: number) {
      rackCount.material = rackCountMaterials[count];
    },
  };
}
