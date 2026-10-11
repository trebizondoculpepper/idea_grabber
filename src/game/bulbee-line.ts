export type Ingredient = { id: string; label: string; emoji: string };
const openings = [
  "Oh boy, we're making a",
  "Hot dang, we're making a",
  "Whoop de do, it's gonna be a",
  "Holy moly, we're cooking up a",
  "Yowza, it's gonna be a",
];
export function createBulbeeLine(ingredients: Ingredient[], landing: number) {
  const names = ingredients.map((ingredient) =>
    ingredient.id === 'platformer'
      ? 'platform'
      : ingredient.id === 'deck-building'
        ? 'deck-building'
        : ingredient.label.toLowerCase().replace(/\s+(game|play)$/, ''),
  );
  const opening = openings[(landing - 1) % openings.length];
  const article = /^[aeiou]/i.test(names[0] ?? '') ? 'an' : 'a';
  return { opening: opening.replace(/a$/, article), names, ending: ' game!' };
}
