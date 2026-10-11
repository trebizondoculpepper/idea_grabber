import { expect, it } from 'vitest';
import { createCameraDirector } from './camera-director';
import { createCoinieCycle, phaseDurations } from '../game/coinie-cycle';

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

it('cuts with the grab animation, including ejection, then restores the playable view', () => {
  for (const fullRack of [false, true]) {
    const camera = createCameraDirector(() => 0);
    const cycle = createCoinieCycle();
    // An action interrupts an idle cutaway immediately.
    expect(camera.update(24, false, true)).toBe('machine');
    cycle.start(fullRack);
    const expected = {
      jumping: 'coinie',
      lowering: 'machine',
      grabbing: 'claw',
      lifting: 'claw',
      carrying: 'dutch',
      dropping: 'machine',
      ejecting: 'feature',
      rolling: 'feature',
      returning: 'default',
      walking: 'default',
    };
    while (cycle.phase !== 'ready') {
      const phase = cycle.phase;
      expect(camera.update(0, false, false, phase)).toBe(expected[phase]);
      cycle.advance(phaseDurations[phase]);
    }
    expect(camera.update(0, false, true, cycle.phase)).toBe('default');
    expect(camera.update(23, false, true)).toBe('default');
  }
});

it('keeps grab animations in the default view when reduced motion is enabled', () => {
  const camera = createCameraDirector(() => 0);
  expect(camera.update(1, false, false, 'grabbing')).toBe('claw');
  expect(camera.update(1, true, false, 'lifting')).toBe('default');
  expect(camera.update(1, true, false, 'rolling')).toBe('default');
});

it('offers an idle passer-by pan only while a walker is available', () => {
  const camera = createCameraDirector(() => 0.999);
  expect(camera.update(36, false, true, 'ready', true)).toBe('passerby');
  expect(camera.update(1, false, true, 'ready', true)).toBe('passerby');
  expect(camera.update(0, false, true, 'ready', false)).not.toBe('passerby');
  const empty = createCameraDirector(() => 0.999);
  expect(empty.update(36, false, true)).not.toBe('passerby');
});

it('interrupts a passer-by pan for a grab or reduced motion', () => {
  const camera = createCameraDirector(() => 0.999);
  expect(camera.update(36, false, true, 'ready', true)).toBe('passerby');
  expect(camera.update(0, false, false, 'grabbing', true)).toBe('claw');
  expect(camera.update(0, true, true, 'ready', true)).toBe('default');
});
