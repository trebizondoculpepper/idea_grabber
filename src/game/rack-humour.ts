export type WordIngredient = {
  id: string;
  words: {
    verbs: readonly string[];
    nouns: readonly string[];
    adjectives: readonly string[];
  };
};
const openings = [
  "I can't wait to",
  'It would be wild if we could',
  'Do you think we could',
  'Hear me out: what if we could',
];

export function createRackSentence(
  ingredients: readonly WordIngredient[],
  random = Math.random,
) {
  const pick = <T>(items: readonly T[]) =>
    items[Math.floor(random() * items.length)];
  const pairs = ingredients.flatMap((verb) =>
    ingredients
      .filter(
        (noun) =>
          noun.id !== verb.id &&
          verb.words.verbs.length &&
          noun.words.nouns.length,
      )
      .map((noun) => ({ verb, noun })),
  );
  if (!pairs.length) return undefined;
  const { verb, noun } = pick(pairs);
  const adjectiveSources = ingredients.filter(
    (item) =>
      item.id !== verb.id &&
      item.id !== noun.id &&
      item.words.adjectives.length,
  );
  const adjective =
    adjectiveSources.length && random() < 0.45
      ? pick(adjectiveSources)
      : undefined;
  const opening = pick(openings);
  const phrase = [
    adjective ? pick(adjective.words.adjectives) : '',
    pick(noun.words.nouns),
  ]
    .filter(Boolean)
    .join(' ');
  const text = `${opening} ${pick(verb.words.verbs)} the ${phrase}${opening.startsWith('Do you') ? '?' : '!'}`;
  return {
    text,
    sourceIds: [verb.id, noun.id, ...(adjective ? [adjective.id] : [])],
  };
}

/** Wait for a quiet moment; always compose from the rack at the moment of speaking. */
export function createRackHumour(random = Math.random) {
  let remaining = 18 + random() * 12;
  let previous = '';
  return {
    update(
      delta: number,
      ingredients: readonly WordIngredient[],
      canSpeak: boolean,
    ) {
      if (!canSpeak) return undefined;
      remaining -= delta;
      if (remaining > 0) return undefined;
      remaining = 18 + random() * 12;
      for (let attempt = 0; attempt < 6; attempt++) {
        const line = createRackSentence(ingredients, random);
        if (!line || line.text === previous) continue;
        previous = line.text;
        return {
          ...line,
          speaker: random() < 0.5 ? ('bulbee' as const) : ('coinie' as const),
        };
      }
      return undefined;
    },
  };
}
