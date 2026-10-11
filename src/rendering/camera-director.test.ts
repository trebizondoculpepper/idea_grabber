import { expect, it } from 'vitest';
import { createCameraDirector } from './camera-director';

it('keeps the default view, cuts through distinct shots, then returns home', () => {
  const camera = createCameraDirector(() => 0);
  expect(camera.update(23, false, true)).toBe('default');
  expect(camera.update(1, false, true)).toBe('machine');
  expect(camera.update(2.8, false, true)).toBe('claw');
  expect(camera.update(2.8, false, true)).toBe('default');
  expect(camera.update(23, false, true)).toBe('default');
});

it('cancels cutaways for gameplay and holds the default view for reduced motion', () => {
  const camera = createCameraDirector(() => 0);
  expect(camera.update(24, false, true)).toBe('machine');
  expect(camera.update(1, false, false)).toBe('default');
  expect(camera.update(1, false, true)).toBe('default');
  expect(camera.update(100, true, true)).toBe('default');
});
