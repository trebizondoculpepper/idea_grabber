import { describe, expect, it } from 'vitest';
import { createCoinieCycle } from './coinie-cycle';

describe('Coinie insertion cycle', () => {
  it('accepts one click and creates exactly one replacement despite rapid input', () => {
    const cycle = createCoinieCycle();
    expect(cycle.start()).toBe(true);
    for (let i = 0; i < 20; i++) expect(cycle.start()).toBe(false);
    cycle.advance(1.25);
    expect(cycle.phase).toBe('walking');
    expect(cycle.generation).toBe(1);
    expect(cycle.start()).toBe(false);
    cycle.advance(1.8);
    expect(cycle.phase).toBe('ready');
    expect(cycle.generation).toBe(1);
    expect(cycle.start()).toBe(true);
    cycle.advance(10);
    expect(cycle.phase).toBe('ready');
    expect(cycle.generation).toBe(2);
  });

  it('gives the same result with small frames or one long frame', () => {
    const smallFrames = createCoinieCycle();
    const longFrame = createCoinieCycle();
    smallFrames.start();
    longFrame.start();
    for (let i = 0; i < 310; i++) smallFrames.advance(0.01);
    longFrame.advance(3.1);
    expect(smallFrames.phase).toBe(longFrame.phase);
    expect(smallFrames.generation).toBe(longFrame.generation);
    expect(longFrame.generation).toBe(1);
  });

  it('does not advance on a paused frame and still completes under reduced motion', () => {
    const cycle = createCoinieCycle();
    cycle.start();
    cycle.advance(0.5);
    const progress = cycle.progress;
    cycle.advance(0);
    expect(cycle.progress).toBe(progress);
    cycle.advance(0.4, true);
    expect(cycle.phase).toBe('ready');
    expect(cycle.generation).toBe(1);
  });
});
