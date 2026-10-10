import { expect, it } from 'vitest';
import { Scene, SpotLight } from 'three';
import { createArcadeLighting } from './arcade-lighting';

it('sweeps spotlights gently and freezes their gaze for reduced motion', () => {
  const scene = new Scene();
  const lighting = createArcadeLighting(scene);
  const spot = scene.getObjectByName('DiscoSpot:#ff4aa9') as SpotLight;
  const initial = spot.target.position.clone();
  lighting.update(10, false);
  expect(spot.target.position.equals(initial)).toBe(false);
  lighting.update(10, true);
  expect(spot.target.position.equals(initial)).toBe(true);
  lighting.update(100, true);
  expect(spot.target.position.equals(initial)).toBe(true);
  lighting.dispose();
  expect(scene.children).toHaveLength(0);
});
