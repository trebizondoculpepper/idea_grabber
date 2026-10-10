import { expect, it } from 'vitest';
import { ratPose } from './create-rat';

it('scurries along the back wall, pauses, then returns', () => {
  expect(ratPose(0, false).x).toBe(-16);
  expect(ratPose(5, false).x).toBe(-2.5);
  expect(ratPose(10, false)).toMatchObject({ x: 11, moving: false });
  expect(ratPose(11, false).x).toBe(11);
  expect(ratPose(17, false)).toMatchObject({
    x: -2.5,
    facing: Math.PI,
    moving: true,
  });
  expect(ratPose(23, false)).toMatchObject({ x: -16, moving: false });
  expect(ratPose(24, false)).toEqual(ratPose(0, false));
});

it('holds the rat still when reduced motion is enabled', () => {
  expect(ratPose(0, true)).toEqual(ratPose(100, true));
  expect(ratPose(0, true).moving).toBe(false);
});
