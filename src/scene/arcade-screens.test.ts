import { expect, it } from 'vitest';
import { Group, Mesh, MeshBasicMaterial } from 'three';
import { arcadeScreenFrame, createArcadeScreens } from './arcade-screens';

it('staggers cabinets, cycles all screens and holds still for reduced motion', () => {
  expect(arcadeScreenFrame(6, 0, false)).toBe(0);
  expect(arcadeScreenFrame(6, 1, false)).toBe(1);
  expect(
    [0, 7, 14, 21].map((time) => arcadeScreenFrame(time, 0, false)),
  ).toEqual([0, 1, 2, 0]);
  expect(arcadeScreenFrame(100, 3, true)).toBe(0);
});

it('changes only screen materials, reusing the preloaded artwork', () => {
  const environment = new Group();
  const screen = new Mesh();
  screen.name = 'ScreenGraphic';
  const materials = Array.from({ length: 3 }, () => new MeshBasicMaterial());
  screen.userData.screenMaterials = materials;
  environment.add(screen);
  const screens = createArcadeScreens(environment);
  screens.update(14, false);
  expect(screen.material).toBe(materials[2]);
  screens.update(15, true);
  expect(screen.material).toBe(materials[0]);
  materials.forEach((material) => material.dispose());
  screen.geometry.dispose();
});
