import { describe, expect, it } from 'vitest';
import { Group, Mesh } from 'three';
import { createMachineAnimation } from './animate-machine';
import { phaseDurations } from '../game/coinie-cycle';
import type { CoiniePhase } from '../game/coinie-cycle';

it('starts ready for collection with no delivered balls', () => {
  const machine = new Group();
  const assembly = new Group();
  assembly.position.y = 5.4;
  machine.add(assembly);
  const claw = new Group();
  const cable = new Group();
  assembly.add(claw, cable);
  const animation = createMachineAnimation({
    machine,
    assembly,
    claw,
    cable,
    pitBalls: [],
    rack: new Group(),
    recycle: () => {},
  });
  expect(animation.delivered).toBe(0);
  expect(animation.full).toBe(false);
});

describe('capsule collection', () => {
  it('moves one real pit ball per cycle, preserves earlier tray balls and fills five places', () => {
    const machine = new Group();
    const assembly = new Group();
    assembly.position.y = 5.4;
    machine.add(assembly);
    const claw = new Group();
    const cable = new Group();
    assembly.add(claw, cable);
    const pit = new Group();
    pit.name = 'CapsulePit';
    machine.add(pit);
    const pitBalls = Array.from({ length: 6 }, (_, i) => {
      const ball = new Mesh();
      ball.userData.ingredient = {
        id: `ingredient-${i}`,
        label: `Ingredient ${i}`,
        emoji: '🎮',
      };
      ball.position.set(0, i === 5 ? 0.2 : 2 + i * 0.2, 0);
      pit.add(ball);
      return ball;
    });
    const recycled: Mesh[] = [];
    const animation = createMachineAnimation({
      machine,
      assembly,
      claw,
      cable,
      pitBalls,
      rack: new Group(),
      recycle: (ball) => recycled.push(ball),
    });
    for (let cycle = 0; cycle < 5; cycle++) {
      for (const phase of Object.keys(phaseDurations).filter(
        (phase) => phase !== 'ejecting',
      ) as CoiniePhase[]) {
        animation.update(phase, 0);
        animation.update(phase, 0.5);
        animation.update(phase, 1);
      }
      animation.update('ready', 0);
      expect(animation.delivered).toBe(cycle + 1);
      expect(pit.children).toHaveLength(5 - cycle);
      expect(pitBalls[4 - cycle].position.x).toBeCloseTo(1.12 - cycle * 0.77);
      expect(claw.getWorldPosition(claw.position.clone()).y).toBeCloseTo(4.75);
    }
    expect(animation.full).toBe(true);
    const oldest = pitBalls[4];
    const sixth = pitBalls[5];
    for (const phase of Object.keys(phaseDurations) as CoiniePhase[]) {
      animation.update(phase, 0);
      if (phase === 'rolling') animation.update(phase, 0.1);
      else animation.update(phase, 0.5);
      if (phase === 'ejecting') {
        expect(oldest.position.z).toBeGreaterThan(3);
        expect(animation.delivered).toBe(4);
      }
      if (phase === 'rolling') {
        expect(recycled).toEqual([oldest]);
        expect(oldest.parent).toBe(pit);
        expect(oldest.position.y).toBeGreaterThan(2.8);
      }
      animation.update(phase, 1);
    }
    expect(animation.delivered).toBe(5);
    expect(oldest.parent).toBe(pit);
    expect(oldest.position.y).toBeCloseTo(2.8);
    expect(animation.landings).toBe(6);
    expect(animation.ingredients.map((ingredient) => ingredient.id)).toEqual([
      'ingredient-5',
      'ingredient-0',
      'ingredient-1',
      'ingredient-2',
      'ingredient-3',
    ]);
    expect(sixth.position.x).toBeCloseTo(-1.96);
    expect(pitBalls[3].position.x).toBeCloseTo(1.12);
    for (let cycle = 0; cycle < 30; cycle++) {
      for (const phase of Object.keys(phaseDurations) as CoiniePhase[]) {
        animation.update(phase, 0);
        animation.update(phase, 1);
      }
      expect(animation.delivered).toBe(5);
      expect(pit.children).toHaveLength(1);
      expect(
        machine.children.filter((child) => child instanceof Mesh),
      ).toHaveLength(5);
    }
    expect(pitBalls.map((ball) => ball.position.x)).toEqual(
      expect.arrayContaining([1.12]),
    );
  });
});

it('throws a clicked tray ball forwards, packs the rest in and recycles it into the pit', () => {
  const machine = new Group();
  const assembly = new Group();
  assembly.position.y = 5.4;
  machine.add(assembly);
  const claw = new Group();
  const cable = new Group();
  assembly.add(claw, cable);
  const pit = new Group();
  pit.name = 'CapsulePit';
  machine.add(pit);
  const pitBalls = Array.from({ length: 4 }, (_, i) => {
    const ball = new Mesh();
    ball.userData.ingredient = { id: `ingredient-${i}` };
    ball.position.set(0, 1 + i * 0.2, 0);
    pit.add(ball);
    return ball;
  });
  const recycled: Mesh[] = [];
  const animation = createMachineAnimation({
    machine,
    assembly,
    claw,
    cable,
    pitBalls,
    rack: new Group(),
    recycle: (ball) => recycled.push(ball),
  });
  for (let cycle = 0; cycle < 3; cycle++) {
    for (const phase of Object.keys(phaseDurations).filter(
      (phase) => phase !== 'ejecting',
    ) as CoiniePhase[]) {
      animation.update(phase, 0);
      animation.update(phase, 1);
    }
    animation.update('ready', 0);
  }
  const [first, middle, last] = animation.trayBalls;
  expect(animation.discard(middle)).toBe(true);
  expect(animation.busy).toBe(true);
  expect(animation.discard(first)).toBe(false);
  animation.update('ready', 0, 0.3);
  expect(middle.position.z).toBeGreaterThan(1.97);
  for (let step = 0; step < 40; step++) animation.update('ready', 0, 0.1);
  expect(animation.busy).toBe(false);
  expect(animation.trayBalls).toEqual([first, last]);
  expect(first.position.x).toBeCloseTo(1.12);
  expect(last.position.x).toBeCloseTo(0.35);
  expect(recycled).toEqual([middle]);
  expect(middle.parent).toBe(pit);
  expect(middle.position.y).toBeCloseTo(1.4);
});
