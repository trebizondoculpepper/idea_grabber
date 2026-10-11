import { expect, it } from 'vitest';
import catalogue from '../../docs/ingredient-catalogue.json';
import { createRackHumour, createRackSentence } from './rack-humour';
const genre = (id: string) => catalogue.find((item) => item.id === id)!;

it('gives every genre curated words which stay attached to its ball identity', () => {
  for (const item of catalogue) {
    expect(item.words.nouns.length, item.id).toBeGreaterThan(0);
    for (const words of Object.values(item.words)) {
      expect(
        words.every((word) => word.length > 0 && word === word.trim()),
        item.id,
      ).toBe(true);
      expect(new Set(words).size, item.id).toBe(words.length);
    }
  }
  expect(genre('extraction-shooter').words.verbs).toContain('extract');
  expect(genre('gardening').words.nouns).toContain('garden');
  expect(genre('space-sim').words.adjectives).toContain('space');
});

it('makes the requested extraction/gardening mashup from two different rack genres', () => {
  expect(
    createRackSentence(
      [genre('extraction-shooter'), genre('gardening')],
      () => 0,
    ),
  ).toEqual({
    text: "I can't wait to extract the garden!",
    sourceIds: ['extraction-shooter', 'gardening'],
  });
  expect(createRackSentence([], () => 0)).toBeUndefined();
  expect(createRackSentence([genre('gardening')], () => 0)).toBeUndefined();
});

it('can add an adjective from a third rack genre, without reaching outside the rack', () => {
  const words = { verbs: [], nouns: [], adjectives: [] };
  const rack = [
    { id: 'photography', words: { ...words, verbs: ['photograph'] } },
    { id: 'architecture', words: { ...words, nouns: ['architecture'] } },
    { id: 'space', words: { ...words, adjectives: ['space'] } },
  ];
  expect(createRackSentence(rack, () => 0)).toEqual({
    text: "I can't wait to photograph the space architecture!",
    sourceIds: ['photography', 'architecture', 'space'],
  });
});

it('waits for quiet time, uses current rack contents and avoids immediate repeat lines', () => {
  const humour = createRackHumour(() => 0);
  const rack = [genre('extraction-shooter'), genre('gardening')];
  expect(humour.update(100, rack, false)).toBeUndefined();
  expect(humour.update(17, rack, true)).toBeUndefined();
  expect(humour.update(1, rack, true)?.text).toBe(
    "I can't wait to extract the garden!",
  );
  expect(humour.update(18, rack, true)).toBeUndefined();
  expect(
    humour.update(18, [genre('cooking-game'), genre('chess')], true)?.text,
  ).toBe("I can't wait to cook the king!");
  expect(humour.update(18, [], true)?.sourceIds).toEqual([]);
});

it('alternates empty-rack complaints between both characters without interrupting speech', () => {
  const humour = createRackHumour(() => 0);
  expect(humour.update(17, [], true)).toBeUndefined();
  const first = humour.update(1, [], true)!;
  expect(first.speaker).toBe('bulbee');
  expect(first.sourceIds).toEqual([]);
  expect(humour.update(100, [], false)).toBeUndefined();
  expect(humour.update(17, [], true)).toBeUndefined();
  const second = humour.update(1, [], true)!;
  expect(second.speaker).toBe('coinie');
  expect(second.text).not.toBe(first.text);
});

it('stops empty-rack complaints as soon as a ball is present and waits after the last is removed', () => {
  const humour = createRackHumour(() => 0);
  humour.update(17, [], true);
  expect(humour.update(1, [genre('gardening')], true)).toBeUndefined();
  expect(humour.update(18, [genre('gardening')], true)).toBeUndefined();
  expect(humour.update(1, [], true)).toBeUndefined();
  expect(humour.update(17, [], true)?.sourceIds).toEqual([]);
});
