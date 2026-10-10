import { expect, it } from 'vitest';
import { Group, PointLight } from 'three';
import { createMachineLighting } from './machine-lighting';

it('chases coloured lights through the cabinet and holds still for reduced motion', () => {
  const machine = new Group();
  const lighting = createMachineLighting(machine);
  const lights = machine.children.filter(
    (child): child is PointLight => child instanceof PointLight,
  );
  expect(lights).toHaveLength(3);
  expect(
    machine.children.filter((child) => child.name.startsWith('CabinetBulb')),
  ).toHaveLength(14);
  const start = lights[0].color.getHex();
  lighting.update(1.2, false);
  expect(lights[0].color.getHex()).not.toBe(start);
  lighting.update(1.2, true);
  const still = lights[0].color.getHex();
  lighting.update(5, true);
  expect(lights[0].color.getHex()).toBe(still);
  lighting.dispose();
  expect(machine.children).toHaveLength(0);
});
