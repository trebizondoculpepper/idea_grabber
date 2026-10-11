import { expect, it, vi } from 'vitest';
import { Group } from 'three';
import { createPassersBy } from './passers-by';
import { createSceneKit } from './scene-kit';

vi.mock('./scene-kit', async (original) => {
  const actual = await original<typeof import('./scene-kit')>();
  const { MeshBasicMaterial } = await import('three');
  return {
    ...actual,
    createSceneKit: () => {
      const kit = actual.createSceneKit();
      return { ...kit, textured: () => new MeshBasicMaterial() };
    },
  };
});

it('sends one passer-by across now and then, and none for reduced motion', () => {
  const parent = new Group();
  const passers = createPassersBy(parent, createSceneKit(), () => 0);
  const visible = () => parent.children.filter((child) => child.visible);
  expect(parent.children).toHaveLength(7);
  expect(visible()).toHaveLength(0);
  passers.update(2.5);
  expect(passers.walking).toBeUndefined();
  passers.update(1.5);
  expect(passers.walking).toBe('space-invader');
  expect(visible()).toHaveLength(1);
  for (let step = 0; step < 150; step++) passers.update(0.1);
  expect(passers.walking).toBeUndefined();
  expect(visible()).toHaveLength(0);
  for (let step = 0; step < 100; step++) passers.update(0.1);
  expect(passers.walking).toBeDefined();
  passers.update(0.1, true);
  expect(passers.walking).toBeUndefined();
  expect(visible()).toHaveLength(0);
});

it('lets each new snack character cross the foreground and become a camera target', () => {
  for (const [index, name] of [
    [4, 'pretzel'],
    [5, 'eight-ball'],
    [6, 'milkshake'],
  ] as const) {
    let draws = 0;
    const parent = new Group();
    const passers = createPassersBy(parent, createSceneKit(), () =>
      draws++ === 1 ? (index + 0.1) / 7 : 0,
    );
    passers.update(4);
    expect(passers.walking).toBe(name);
    expect(passers.cameraTarget).toBeUndefined();
    passers.update(2);
    expect(passers.cameraTarget?.name).toBe(`PasserBy:${name}`);
    expect(parent.children.filter((child) => child.visible)).toHaveLength(1);
    passers.update(0.1, true);
    expect(passers.cameraTarget).toBeUndefined();
  }
});
