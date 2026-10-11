import { expect, it } from 'vitest';
import catalogue from '../../docs/ingredient-catalogue.json';
import { createGameMashup } from './game-mashup';
import { createCoinieReply } from './coinie-reply';

it('gives every genre at least two unique, non-empty examples', () => {
  for (const genre of catalogue) {
    expect(genre.examples.length, genre.id).toBeGreaterThanOrEqual(2);
    expect(new Set(genre.examples).size, genre.id).toBe(genre.examples.length);
    expect(
      genre.examples.every((name) => name && name === name.trim()),
      genre.id,
    ).toBe(true);
  }
});

it('compares examples from the current rack and skips insufficient sources', () => {
  const rack = [
    { id: 'platformer', examples: ['Doki Doki Panic'] },
    { id: 'police', examples: ['Police Quest'] },
  ];
  expect(createGameMashup(rack, () => 0)).toBe(
    "Yes, it's basically Police Quest, but with the mechanics of Doki Doki Panic.",
  );
  expect(
    createCoinieReply(
      rack.map((item) => ({ ...item, label: item.id, emoji: '?' })),
      3,
      () => 0,
    ),
  ).toContain('Police Quest');
  expect(createGameMashup([rack[0]], () => 0)).toBeUndefined();
  expect(createGameMashup([rack[0], rack[0]], () => 0)).toBeUndefined();
  expect(
    createGameMashup(
      [
        { id: 'a', examples: ['Same game'] },
        { id: 'b', examples: ['Same game'] },
      ],
      () => 0,
    ),
  ).toBeUndefined();
});

it('can combine three distinct rack examples without using off-rack games', () => {
  const rack = [
    { id: 'a', examples: ['First'] },
    { id: 'b', examples: ['Second'] },
    { id: 'c', examples: ['Third'] },
  ];
  expect(createGameMashup(rack, () => 0)).toBe(
    "It's Second mashed up with Third and First.",
  );
});
