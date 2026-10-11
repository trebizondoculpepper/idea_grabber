import { createBulbeeLine, type Ingredient } from './bulbee-line';
import type { CoiniePhase } from './coinie-cycle';

const reactions: Record<string, string> = {
  platformer: "That's so 1990s.",
  'precision-platformer': 'My thumbs are already filing a complaint.',
  shooter: 'Finally, a problem I can solve by missing repeatedly.',
  'first-person': 'Great. Now I have to witness my mistakes up close.',
  'third-person': 'At least I can watch myself make bad decisions.',
  'extraction-shooter': 'Can we extract the development budget too?',
  gardening: "I'll start digging. You find the bugs.",
  fishing: "Sounds like we're angling for a hit.",
  racing: 'Does the budget cover brakes?',
  chess: "I'll need six months to think about my first move.",
  poker: "I'm all in. Which, admittedly, is one coin.",
  'deck-building': 'Finally, a use for all my terrible hands.',
  roguelike: 'So we fail, start again, and call it a feature?',
  rhythm: 'My timing is excellent. Just in a different time zone.',
  music: "I'll handle the coin percussion.",
  'cooking-game': 'Are we cooking, or is the computer just overheating?',
  detective: 'My first suspect is the tutorial.',
  programming: 'A game about work? Bold monetisation strategy.',
  mathematics: 'I was told there would be no homework.',
  survival: 'Can we start with surviving the tutorial?',
  tycoon: "I'm ready to turn one coin into slightly less than one coin.",
  'business-management': 'Can I delegate playing it?',
  'colony-sim': 'One tiny colony, one enormous spreadsheet.',
  'tower-defence': 'Nobody gets past me. Except everyone with legs.',
  'virtual-reality': 'Finally, somewhere to hide from actual reality.',
};
const fallback = [
  'That sounds suspiciously like a hit. Or a very expensive mistake.',
  "That's either genius or three tutorials in a trench coat.",
  "I'm sold. Although technically I'm the currency.",
  'Can we put that on the box before we figure out how it works?',
];

// Fictional industry banter, not a history of games that were actually released.
export const industryReplies = [
  () =>
    'Meh, that sounds like something MicroProse would do.',
  (combo: string, year: number) =>
    `Peter Molyneux already pitched a ${combo} in ${year}. The trees were meant to remember your name.`,
  () => 'Ubisoft would add six hundred map icons and a tower to climb.',
  () => 'EA would sell the nouns separately in the season pass.',
  () => 'Valve could make two of those. Three might be pushing it.',
  () => 'Great. Now announce the remaster before we release the original.',
  () => 'Can we call it a live service and switch it off before lunch?',
  () => 'The Kickstarter stretch goal is finishing the game.',
  () => 'Put it in Early Access. That makes the bugs a roadmap.',
  () => 'The deluxe edition comes with the other half of the tutorial.',
  () => 'A publisher just asked if we can make it a battle royale instead.',
  () => 'Perfect. We can charge extra for horse armour, even without horses.',
  () => 'The sequel can have a bigger map and exactly the same problems.',
  () => 'Can we put a battle pass on the pause menu?',
  () => 'Call it a spiritual successor. Nobody can afford the actual licence.',
  () => 'Bethesda could put a bucket on it and let us steal the tutorial.',
  () =>
    'The launch trailer needs more gameplay from a completely different game.',
  () => 'It needs a fishing minigame. Even the fishing game.',
  () => 'We can fix it in the day-one patch. Day one of which year, though?',
  () => 'Give it a pixel-art trailer and call it a lost childhood memory.',
];

/** Echo Bulbee's whole idea, then react to the newest ingredient. */
export function createCoinieReply(ingredients: Ingredient[], landing: number) {
  if (!ingredients.length) return undefined;
  const names = createBulbeeLine(ingredients, landing).names.join(' ');
  const idea = `${names.charAt(0).toUpperCase()}${names.slice(1)} game`;
  const reaction =
    reactions[ingredients[0].id] ?? fallback[(landing - 1) % fallback.length];
  // Keep a genre-specific reply every fourth turn and rotate the satire pool.
  const turn = Math.max(0, landing - 1);
  const satireIndex = turn - Math.floor(turn / 4) - 1;
  const reply =
    turn % 4 === 0
      ? reaction
      : industryReplies[satireIndex % industryReplies.length](
          names,
          1989 + ((landing * 7) % 30),
        );
  return `${idea}? ${reply}`;
}

/** Reply once per landing, after Bulbee finishes and Coinie is back on stage. */
export function createCoinieReplyCue() {
  let landing = 0;
  let pending: string | undefined;
  let pause = 0.35;
  return {
    get pending() {
      return pending !== undefined;
    },
    update(
      delta: number,
      state: {
        landings: number;
        ingredients: Ingredient[];
        phase: CoiniePhase;
        progress: number;
        bulbeeTalking: boolean;
      },
    ) {
      if (state.landings !== landing) {
        landing = state.landings;
        pending = createCoinieReply(state.ingredients, landing);
        pause = 0.35;
      }
      if (state.phase === 'jumping') pending = undefined;
      if (!pending) return undefined;
      const onstage =
        state.phase === 'ready' ||
        (state.phase === 'walking' && state.progress >= 0.55);
      if (state.bulbeeTalking || !onstage) {
        pause = 0.35;
        return undefined;
      }
      pause -= delta;
      if (pause > 0) return undefined;
      const reply = pending;
      pending = undefined;
      return reply;
    },
  };
}
