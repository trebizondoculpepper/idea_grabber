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
      ball.position.set(0, i === 5 ? 0.2 : 2 + i * 0.2, 0);
      pit.add(ball);
      return ball;
    });
    const animation = createMachineAnimation({
      machine,
      assembly,
      claw,
      cable,
      pitBalls,
      rack: new Group(),
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
      animation.update(phase, 0.5);
      if (phase === 'ejecting') {
        expect(oldest.position.z).toBeGreaterThan(3);
        expect(animation.delivered).toBe(4);
      }
      animation.update(phase, 1);
    }
    expect(animation.delivered).toBe(5);
    expect(oldest.parent).toBe(pit);
    expect(oldest.position.y).toBeCloseTo(2.8);
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
