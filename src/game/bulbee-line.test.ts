import { expect, it } from 'vitest';
import { createBulbeeLine } from './bulbee-line';
const racing = { id: 'racing', label: 'Racing', emoji: '🏎️' };
const lesbian = { id: 'lesbian', label: 'Lesbian', emoji: '👩‍❤️‍👩' };
const deck = { id: 'deck-building', label: 'Deck building', emoji: '🃏' };
it('builds the requested cumulative lines with each ingredient separately emphasised', () => {
  function text(landing: number, ingredients: (typeof racing)[]) {
    const line = createBulbeeLine(ingredients, landing);
    return `${line.opening} ${line.names.join(' ')}${line.ending}`;
  }
  expect(text(1, [racing])).toBe("Oh boy, we're making a racing game!");
  expect(text(2, [lesbian, racing])).toBe(
    "Hot dang, we're making a lesbian racing game!",
  );
  expect(text(3, [deck, lesbian, racing])).toBe(
    "Whoop de do, it's gonna be a deck-building lesbian racing game!",
  );
});
it('rotates openings indefinitely and handles vowel-leading names', () => {
  expect(
    createBulbeeLine([{ ...racing, label: 'Arcade racing' }], 6).opening,
  ).toBe("Oh boy, we're making an");
});
