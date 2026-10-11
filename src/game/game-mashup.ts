type ExampleIngredient = { id: string; examples?: readonly string[] };
export const mashingPhrases = [
  'mashed up',
  'crossed',
  'welded together',
  'thrown in a blender',
  'duct-taped together',
  'awkwardly spliced',
];

/** Draw references from distinct rack items, avoiding duplicate game titles. */
export function createGameMashup(
  ingredients: readonly ExampleIngredient[],
  random = Math.random,
) {
  const sources = ingredients.filter(
    (item, index) =>
      item.examples?.length &&
      ingredients.findIndex((other) => other.id === item.id) === index,
  );
  for (let i = sources.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [sources[i], sources[j]] = [sources[j], sources[i]];
  }
  const games: string[] = [];
  const wanted = sources.length >= 3 && random() < 0.6 ? 3 : 2;
  for (const source of sources) {
    const choices = source.examples!.filter((game) => !games.includes(game));
    if (!choices.length) continue;
    games.push(choices[Math.floor(random() * choices.length)]);
    if (games.length === wanted) break;
  }
  if (games.length < 2) return undefined;
  if (games.length === 2 && random() < 0.5)
    return `Yes, it's basically ${games[0]}, but with the mechanics of ${games[1]}.`;
  const mash = mashingPhrases[Math.floor(random() * mashingPhrases.length)];
  return `It's ${games[0]} ${mash} with ${games[1]}${games[2] ? ` and ${games[2]}` : ''}.`;
}
