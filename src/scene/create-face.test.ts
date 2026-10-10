import { expect, it, vi } from 'vitest';
import { Group } from 'three';
import { createFace, faces } from './create-face';
import { createSceneKit } from './scene-kit';

vi.mock('./scene-kit', async (original) => {
  const actual = await original<typeof import('./scene-kit')>();
  const { MeshBasicMaterial } = await import('three');
  return {
    ...actual,
    createSceneKit: () => {
      const kit = actual.createSceneKit();
      const cache = new Map<string, InstanceType<typeof MeshBasicMaterial>>();
      return {
        ...kit,
        textured: (name: string) => {
          if (!cache.has(name)) cache.set(name, new MeshBasicMaterial());
          return cache.get(name)!;
        },
      };
    },
  };
});

it('flaps through mouth shapes while talking and keeps pupils inside the eyes', () => {
  const body = new Group();
  let seed = 0.1;
  const random = () => (seed = (seed * 9301 + 0.49297) % 1);
  const face = createFace(body, createSceneKit(), faces.Coinie, random);
  const shapes = new Set<string>();
  for (let t = 0; t < 3; t += 1 / 60) {
    face.update(t, true, false);
    shapes.add(face.mouthShape);
  }
  expect(shapes.size).toBeGreaterThanOrEqual(4);
  face.update(3.1, false, false);
  expect(face.mouthShape).toBe('grin');
  const pupils = faces.Coinie.eyes.map((eye, i) => ({
    pupil: body.getObjectByName(`Eye${i + 1}`)!.getObjectByName('Pupil')!,
    eye,
  }));
  for (const { pupil, eye } of pupils) {
    expect(Math.abs(pupil.position.x)).toBeLessThan(eye.rx);
    expect(Math.abs(pupil.position.y)).toBeLessThan(eye.ry);
  }
  face.update(4, true, true);
  expect(face.mouthShape).toBe('grin');
});
