import { expect, it } from 'vitest';
import { createMarqueeFlicker } from './marquee-flicker';

it('waits between faults, dims only briefly and returns to full brightness', () => {
  const flicker = createMarqueeFlicker(() => 0);
  expect(flicker.update(21, false)).toBe(1);
  expect(flicker.starts).toBe(0);
  expect(flicker.update(1, false)).toBe(0.22);
  expect(flicker.starts).toBe(1);
  expect(flicker.update(0.2, false)).toBe(1);
  expect(flicker.update(0.6, false)).toBe(0.35);
  expect(flicker.update(1.6, false)).toBe(1);
  expect(flicker.update(21, false)).toBe(1);
  expect(flicker.update(1, false)).toBe(0.22);
  expect(flicker.starts).toBe(2);
});

it('holds steady under reduced motion and restarts the wait when it is disabled', () => {
  const flicker = createMarqueeFlicker(() => 0);
  flicker.update(22, false);
  expect(flicker.update(100, true)).toBe(1);
  expect(flicker.starts).toBe(1);
  expect(flicker.update(21, false)).toBe(1);
});
