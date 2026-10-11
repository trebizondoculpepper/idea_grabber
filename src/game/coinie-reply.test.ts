import { expect, it } from 'vitest';
import {
  createCoinieReply,
  createCoinieReplyCue,
  industryReplies,
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

it('rotates all industry jokes while preserving a genre-specific reply every fourth turn', () => {
  const heard: string[] = [];
  for (let landing = 1; heard.length < industryReplies.length; landing++) {
    const reply = createCoinieReply([gardening, platform], landing)!;
    expect(reply).toMatch(/^Gardening platform game\? /);
    if ((landing - 1) % 4 === 0) {
      expect(reply).toContain("I'll start digging.");
    } else {
      heard.push(reply);
    }
  }
  expect(new Set(heard).size).toBe(industryReplies.length);
  expect(heard[0]).toContain('MicroProse');
  expect(heard[1]).toMatch(
    /Peter Molyneux already pitched a gardening platform in \d{4}/,
  );
  expect(heard[2]).toContain('Ubisoft');
});

it('waits for Bulbee, pauses briefly, and replies only once per landing', () => {
  const cue = createCoinieReplyCue();
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
  const cue = createCoinieReplyCue();
  cue.update(1, { ...state, bulbeeTalking: true });
  const next = { ...state, landings: 2, ingredients: [gardening, platform] };
  expect(cue.update(0.4, next)).toBe(createCoinieReply(next.ingredients, 2));
});
