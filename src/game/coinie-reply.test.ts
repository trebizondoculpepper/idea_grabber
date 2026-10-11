import { expect, it } from 'vitest';
import {
  createCoinieReply,
  createCoinieReplyCue,
  createCoinieReplies,
  industryReplies,
  publishers,
  pluraliseRackNoun,
} from './coinie-reply';
import { createBulbeeLine } from './bulbee-line';

const platform = { id: 'platformer', label: 'Platformer', emoji: '🎯' };
const gardening = { id: 'gardening', label: 'Gardening', emoji: '🌱' };
const state = {
  landings: 1,
  ingredients: [platform],
  phase: 'ready' as const,
  progress: 0,
  bulbeeTalking: false,
};

it('responds to the platform idea with the requested nostalgic joke', () => {
  expect(createBulbeeLine([platform], 2).names).toEqual(['platform']);
  expect(createCoinieReply([platform], 1)).toBe(
    "Platform game? That's so 1990s.",
  );
});

it('echoes the whole mashup and reacts to the newest genre', () => {
  expect(createCoinieReply([gardening, platform], 1)).toBe(
    "Gardening platform game? I'll start digging. You find the bugs.",
  );
  expect(
    createCoinieReply([{ ...gardening, id: 'future-genre' }], 1),
  ).toContain('Gardening game?');
  expect(createCoinieReply([], 1)).toBeUndefined();
});

it('fills industry jokes with vocabulary from the current rack and varies publishers', () => {
  const rack = [
    {
      ...gardening,
      words: { verbs: ['water'], nouns: ['garden'], adjectives: ['leafy'] },
    },
    {
      ...platform,
      words: { verbs: ['jump over'], nouns: ['ledge'], adjectives: ['bouncy'] },
    },
  ];
  const next = createCoinieReplies(() => 0);
  expect(next(rack, 2)).toBe(
    "Gardening platform game? Nothing in EA's road-map has this many gardens.",
  );
  const heard: string[] = [];
  for (let landing = 3; heard.length < industryReplies.length - 1; landing++) {
    const reply = next(rack, landing)!;
    if ((landing - 1) % 4 !== 0) heard.push(reply);
    else expect(reply).toContain("I'll start digging.");
  }
  expect(new Set(heard).size).toBe(heard.length);
  expect(heard.some((line) => line.includes('water the garden'))).toBe(true);
  expect(heard.some((line) => line.includes('infinitely leafy'))).toBe(true);
  expect(
    heard.some((line) => line.includes('would kill for a game this leafy')),
  ).toBe(true);
  expect(
    publishers.filter((name) => heard.some((line) => line.includes(name)))
      .length,
  ).toBeGreaterThan(2);
  const changed = [
    {
      ...platform,
      words: { verbs: ['photograph'], nouns: ['moon'], adjectives: ['lunar'] },
    },
  ];
  for (let landing = 31; landing < 60; landing++) {
    const line = next(changed, landing)!;
    expect(line).not.toMatch(/leafy|bouncy|garden|ledge|water|jump over/);
  }
});

it('pluralises rack nouns and phrases for the EA roadmap joke', () => {
  for (const [noun, plural] of [
    ['deck', 'decks'],
    ['spy', 'spies'],
    ['boss', 'bosses'],
    ['hero', 'heroes'],
    ['child', 'children'],
    ['disco ball', 'disco balls'],
    ['police station', 'police stations'],
    ['fish', 'fish'],
    ['dice', 'dice'],
    ['aircraft', 'aircraft'],
    ['code', 'lines of code'],
    ['loot', 'pieces of loot'],
  ])
    expect(pluraliseRackNoun(noun)).toBe(plural);
});

it('omits word-dependent templates when vocabulary is missing and randomises the first satire', () => {
  const first = createCoinieReply([platform], 2, () => 0)!;
  const other = createCoinieReply([platform], 2, () => 0.99)!;
  expect(first).not.toBe(other);
  for (const line of [first, other]) {
    expect(line).toMatch(/^Platform game\? /);
    expect(line).not.toMatch(/undefined|null/);
  }
});

it('allows unlikely publisher and genre pairings instead of matching their real catalogues', () => {
  const next = createCoinieReplies(() => 0);
  const rack = [
    {
      id: 'dating-sim',
      label: 'Dating simulation',
      emoji: '💌',
      words: { verbs: ['woo'], nouns: ['date'], adjectives: ['romantic'] },
    },
  ];
  const lines = Array.from({ length: 160 }, (_, index) =>
    next(rack, index + 1)!,
  );
  expect(
    lines.some((line) => /MicroProse/.test(line) && /romantic|date/.test(line)),
  ).toBe(true);
});

it('waits for Bulbee, pauses briefly, and replies only once per landing', () => {
  const cue = createCoinieReplyCue(() => 0);
  expect(cue.update(5, { ...state, bulbeeTalking: true })).toBeUndefined();
  expect(cue.pending).toBe(true);
  expect(cue.update(0.2, state)).toBeUndefined();
  expect(cue.update(0.2, state)).toBe(createCoinieReply([platform], 1));
  expect(cue.pending).toBe(false);
  expect(cue.update(20, state)).toBeUndefined();
});

it('waits for Coinie to walk back and cancels a stale reply if another cycle starts', () => {
  const cue = createCoinieReplyCue();
  expect(cue.update(5, { ...state, phase: 'returning' })).toBeUndefined();
  expect(
    cue.update(5, { ...state, phase: 'walking', progress: 0.5 }),
  ).toBeUndefined();
  expect(
    cue.update(0.4, { ...state, phase: 'walking', progress: 0.6 }),
  ).toBeDefined();
  cue.update(0, { ...state, landings: 2 });
  expect(cue.pending).toBe(true);
  cue.update(0.1, { ...state, landings: 2, phase: 'jumping' });
  expect(cue.pending).toBe(false);
  expect(cue.update(10, { ...state, landings: 2 })).toBeUndefined();
});

it('uses the latest announcement if a newer landing arrives before the reply', () => {
  const cue = createCoinieReplyCue(() => 0);
  cue.update(1, { ...state, bulbeeTalking: true });
  const next = { ...state, landings: 2, ingredients: [gardening, platform] };
  expect(cue.update(0.4, next)).toBe(
    createCoinieReply(next.ingredients, 2, () => 0),
  );
});
