import { describe, expect, it } from 'vitest';
import { createCoinieCycle, phaseDurations } from './coinie-cycle';

describe('Coinie machine cycle', () => {
  it('finishes every machine and ball movement before the replacement enters', () => {
    const cycle = createCoinieCycle();
    expect(cycle.start(true)).toBe(true);
    for (const [phase, duration] of Object.entries(phaseDurations)) {
      expect(cycle.phase).toBe(phase);
      for (let i = 0; i < 20; i++) expect(cycle.start()).toBe(false);
      cycle.advance(duration);
    }
    expect(cycle.phase).toBe('ready');
    expect(cycle.generation).toBe(1);
    expect(cycle.start(true)).toBe(true);
    cycle.advance(20);
    expect(cycle.phase).toBe('ready');
    expect(cycle.generation).toBe(2);
  });
  it('gives the same result with small frames or one long frame', () => {
    const small = createCoinieCycle();
    const long = createCoinieCycle();
    small.start();
    long.start();
    for (let i = 0; i < 1800; i++) small.advance(0.01);
    long.advance(18);
    expect(small.phase).toBe(long.phase);
    expect(small.generation).toBe(long.generation);
    expect(long.phase).toBe('ready');
  });
  it('pauses on zero delta and completes the full reduced-motion sequence', () => {
    const cycle = createCoinieCycle();
    cycle.start();
    cycle.advance(0.5);
    const progress = cycle.progress;
    cycle.advance(0);
    expect(cycle.progress).toBe(progress);
    cycle.advance(2, true);
    expect(cycle.phase).toBe('ready');
    expect(cycle.generation).toBe(1);
  });
});

it('skips tray ejection until the tray is full', () => {
  const cycle = createCoinieCycle();
  cycle.start();
  cycle.advance(
    phaseDurations.jumping +
      phaseDurations.lowering +
      phaseDurations.grabbing +
      phaseDurations.lifting +
      phaseDurations.carrying +
      phaseDurations.dropping +
      0.01,
  );
  expect(cycle.phase).toBe('rolling');
});

it('starts with an offstage entrance without inserting a coin or running the machine', () => {
  const cycle = createCoinieCycle(true);
  expect(cycle.phase).toBe('walking');
  expect(cycle.start()).toBe(false);
  cycle.advance(0.9);
  expect(cycle.progress).toBeCloseTo(0.5);
  cycle.advance(0.9);
  expect(cycle.phase).toBe('ready');
  expect(cycle.generation).toBe(0);
  expect(cycle.start()).toBe(true);
});
