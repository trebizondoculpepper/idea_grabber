import { createBulbeeLine, type Ingredient } from './bulbee-line';
import type { CoiniePhase } from './coinie-cycle';
import type { WordIngredient } from './rack-humour';

export type ReplyIngredient = Ingredient & { words?: WordIngredient['words'] };

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

export const publishers = [
  'Sierra On-Line',
  'MicroProse',
  'LucasArts',
  'Bullfrog',
  'Psygnosis',
  'EA',
  'Ubisoft',
  'Sega',
  'THQ',
  'Bethesda',
];
// Deliberately independent of genre: an implausible commission is part of the joke.

type ReplyWords = {
  combo: string;
  publisher: string;
  year: number;
  adjective?: string;
  noun?: string;
  verb?: string;
};

/** Pluralise the noun at the end of a rack phrase, including mass nouns. */
export function pluraliseRackNoun(noun: string) {
  const quantities: Record<string, string> = {
    code: 'lines of code',
    loot: 'pieces of loot',
    soup: 'bowls of soup',
    scenery: 'pieces of scenery',
    treasure: 'pieces of treasure',
    wilderness: 'patches of wilderness',
  };
  if (quantities[noun]) return quantities[noun];
  const irregular: Record<string, string> = {
    person: 'people',
    child: 'children',
    man: 'men',
    woman: 'women',
    mouse: 'mice',
    foot: 'feet',
    tooth: 'teeth',
    goose: 'geese',
    knife: 'knives',
    life: 'lives',
    hero: 'heroes',
    fish: 'fish',
    sheep: 'sheep',
    deer: 'deer',
    aircraft: 'aircraft',
    dice: 'dice',
    species: 'species',
    series: 'series',
    police: 'police',
  };
  return noun.replace(/\S+$/, (word) => {
    if (irregular[word]) return irregular[word];
    if (/[^aeiou]y$/.test(word)) return `${word.slice(0, -1)}ies`;
    if (/(s|x|z|ch|sh)$/.test(word)) return `${word}es`;
    return `${word}s`;
  });
}

// Fictional industry banter. Word slots are filled only from the current rack.
export const industryReplies: ((words: ReplyWords) => string | undefined)[] = [
  ({ noun }) =>
    noun
      ? `Nothing in EA's road-map has this many ${pluraliseRackNoun(noun)}.`
      : undefined,
  ({ publisher, adjective }) =>
    adjective
      ? `${publisher} would kill for a game this ${adjective}.`
      : undefined,
  ({ publisher, noun }) =>
    noun ? `${publisher} would sell the ${noun} separately as DLC.` : undefined,
  ({ publisher, verb, noun }) =>
    verb && noun
      ? `${publisher}'s E3 demo would let you ${verb} the ${noun}. The actual game? We'll see.`
      : undefined,
  ({ combo, year, adjective }) =>
    adjective
      ? `Peter Molyneux already pitched a ${combo} in ${year}. Apparently it was infinitely ${adjective}.`
      : undefined,
  ({ publisher, adjective }) =>
    adjective
      ? `${publisher} would call it "the most ${adjective} experience of a generation". Again.`
      : undefined,
  ({ noun }) =>
    noun
      ? `The Kickstarter stretch goal is adding the ${noun}. The base goal is a logo.`
      : undefined,
  ({ verb, noun }) =>
    verb && noun
      ? `We can ${verb} the ${noun} in Early Access. Making it work is on the roadmap.`
      : undefined,
  ({ publisher, noun }) =>
    noun
      ? `${publisher}'s deluxe edition includes a gold ${noun}. Gameplay sold separately.`
      : undefined,
  ({ adjective }) =>
    adjective
      ? `It's ${adjective}, so obviously it needs a battle pass.`
      : undefined,
  ({ noun }) =>
    noun
      ? `The day-one patch fixes the ${noun}. The day-two patch puts it back.`
      : undefined,
  ({ publisher, verb, noun }) =>
    verb && noun
      ? `${publisher} would let you ${verb} the ${noun}, but only with an always-online account.`
      : undefined,
  ({ adjective }) =>
    adjective
      ? `Announce the remaster now. This time it'll be even more ${adjective}.`
      : undefined,
  ({ publisher, noun }) =>
    noun
      ? `${publisher} wants six hundred map icons. All of them point to the ${noun}.`
      : undefined,
  ({ verb, noun }) =>
    verb && noun
      ? `Can we ${verb} the ${noun} in the trailer and quietly cut it before launch?`
      : undefined,
  ({ publisher, adjective }) =>
    adjective
      ? `${publisher} would call it ${adjective}. The shareholders would call it recurring revenue.`
      : undefined,
  ({ noun }) =>
    noun
      ? `The sequel needs a bigger ${noun} and exactly the same problems.`
      : undefined,
  ({ publisher }) => `Meh, that sounds like something ${publisher} would do.`,
  ({ combo, year }) =>
    `Peter Molyneux already pitched a ${combo} in ${year}. The trees were meant to remember your name.`,
  () => 'Valve could make two of those. Three might be pushing it.',
  () => 'Call it a spiritual successor. Nobody can afford the actual licence.',
];

/** Shuffle eligible choices without repeating at a bag boundary. */
function createBag<T>(random: () => number) {
  let bag: T[] = [];
  let previous: T | undefined;
  return (choices: readonly T[]) => {
    bag = bag.filter((choice) => choices.includes(choice));
    if (!bag.length) {
      bag = [...choices];
      for (let i = bag.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        [bag[i], bag[j]] = [bag[j], bag[i]];
      }
      if (bag.length > 1 && bag[bag.length - 1] === previous)
        [bag[0], bag[bag.length - 1]] = [bag[bag.length - 1], bag[0]];
    }
    previous = bag.pop()!;
    return previous;
  };
}

/** Keep variety across announcements, while drawing vocabulary only from the rack. */
export function createCoinieReplies(random = Math.random) {
  const nextPublisher = createBag<string>(random);
  const nextTemplate = createBag<number>(random);
  const pick = (values: readonly string[]) =>
    values.length ? values[Math.floor(random() * values.length)] : undefined;
  return (ingredients: ReplyIngredient[], landing: number) => {
    if (!ingredients.length) return undefined;
    const names = createBulbeeLine(ingredients, landing).names.join(' ');
    const idea = `${names.charAt(0).toUpperCase()}${names.slice(1)} game`;
    const turn = Math.max(0, landing - 1);
    if (turn % 4 === 0) {
      const reaction =
        reactions[ingredients[0].id] ??
        fallback[Math.floor(turn / 4) % fallback.length];
      return `${idea}? ${reaction}`;
    }
    const words: ReplyWords = {
      combo: names,
      publisher: nextPublisher(publishers),
      year: 1985 + Math.floor(random() * 31),
      adjective: pick(
        ingredients.flatMap((item) => item.words?.adjectives ?? []),
      ),
      noun: pick(ingredients.flatMap((item) => item.words?.nouns ?? [])),
      verb: pick(ingredients.flatMap((item) => item.words?.verbs ?? [])),
    };
    const eligible = industryReplies.flatMap((reply, index) =>
      reply(words) === undefined ? [] : [index],
    );
    return `${idea}? ${industryReplies[nextTemplate(eligible)](words)}`;
  };
}

export function createCoinieReply(
  ingredients: ReplyIngredient[],
  landing: number,
  random = Math.random,
) {
  return createCoinieReplies(random)(ingredients, landing);
}

/** Reply once per landing, after Bulbee finishes and Coinie is back on stage. */
export function createCoinieReplyCue(random = Math.random) {
  const nextReply = createCoinieReplies(random);
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
        ingredients: ReplyIngredient[];
        phase: CoiniePhase;
        progress: number;
        bulbeeTalking: boolean;
      },
    ) {
      if (state.landings !== landing) {
        landing = state.landings;
        pending = nextReply(state.ingredients, landing);
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
