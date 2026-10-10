import { expect, it } from 'vitest';
import catalogue from '../../docs/ingredient-catalogue.json';
import { capsuleColours, createCapsuleAppearances } from './capsule-appearance';

it('gives the initial 25 balls distinct catalogue glyphs and a 16-colour palette', () => {
  const appearances = createCapsuleAppearances(25);
  expect(new Set(appearances.map((ball) => ball.ingredient.emoji)).size).toBe(
    25,
  );
  expect(capsuleColours).toHaveLength(16);
  appearances.forEach((ball) => {
    expect(catalogue).toContainEqual(ball.ingredient);
    expect(capsuleColours).toContain(ball.colour);
  });
});

it('chooses colours independently after shuffling icons', () => {
  const count = new Set(catalogue.map((entry) => entry.emoji)).size;
  function generator(colourSample: number) {
    let calls = 0;
    return () => (++calls < count ? 0.5 : colourSample);
  }
  const first = createCapsuleAppearances(25, generator(0));
  const second = createCapsuleAppearances(25, generator(0.999));
  expect(first.map((ball) => ball.ingredient)).toEqual(
    second.map((ball) => ball.ingredient),
  );
  expect(new Set(first.map((ball) => ball.colour))).toEqual(
    new Set([capsuleColours[0]]),
  );
  expect(new Set(second.map((ball) => ball.colour))).toEqual(
    new Set([capsuleColours[15]]),
  );
});
