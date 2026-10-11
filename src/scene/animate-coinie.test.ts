import { expect, it } from 'vitest';
import { Group, Vector3 } from 'three';
import {
  createCoinieJumps,
  poseCoinieJump,
  type CoinieJump,
} from './animate-coinie';

function actor() {
  const hero = new Group();
  const body = new Group();
  body.position.y = 1.4;
  hero.add(body);
  return { hero, body };
}

it('uses all three moves, starts with the default, and avoids consecutive repeats', () => {
  const next = createCoinieJumps(() => 0);
  expect(next()).toBe('default');
  const remaining = [next(), next()];
  expect(new Set(remaining)).toEqual(new Set(['somersault', 'backflip']));
  let previous = remaining[1];
  for (let bag = 0; bag < 10; bag++) {
    const heard = new Set<CoinieJump>();
    for (let i = 0; i < 3; i++) {
      const move = next();
      expect(move).not.toBe(previous);
      heard.add(move);
      previous = move;
    }
    expect(heard.size).toBe(3);
  }
});

it('spins in opposite directions around the body centre and lands every move in the slot', () => {
  const front = actor();
  const back = actor();
  poseCoinieJump(front.hero, 0.325, false, 'somersault');
  poseCoinieJump(back.hero, 0.325, false, 'backflip');
  expect(front.hero.rotation.z).toBeGreaterThan(0);
  expect(back.hero.rotation.z).toBeLessThan(0);
  const frontCentre = front.body.getWorldPosition(new Vector3());
  const backCentre = back.body.getWorldPosition(new Vector3());
  expect(frontCentre.distanceTo(backCentre)).toBeLessThan(1e-10);
  for (const move of ['default', 'somersault', 'backflip'] as const) {
    poseCoinieJump(front.hero, 1, false, move);
    expect(
      front.body
        .getWorldPosition(new Vector3())
        .distanceTo(new Vector3(2.07, 2.97, 1.75)),
    ).toBeLessThan(1e-10);
    expect(front.hero.rotation.z).toBe(0);
    poseCoinieJump(front.hero, 0.05, false, move);
    expect(front.hero.rotation.z).toBe(0);
  }
});

it('uses the same stationary fade for all moves with reduced motion', () => {
  const { hero } = actor();
  for (const move of ['default', 'somersault', 'backflip'] as const) {
    poseCoinieJump(hero, 0.5, false, move);
    poseCoinieJump(hero, 0.5, true, move);
    expect(hero.rotation.z).toBe(0);
    expect(hero.position.toArray()).toEqual([3.6, 0.03, 2]);
    expect(hero.scale.x).toBeCloseTo(0.525);
  }
});
