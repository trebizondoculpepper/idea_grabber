import catalogue from '../../docs/ingredient-catalogue.json';

// Decorative colours are sampled independently of ingredient identity.
export const capsuleColours = [
  '#ffdf20',
  '#ff38a8',
  '#20dccc',
  '#7842ef',
  '#ff7138',
  '#69e649',
  '#398aff',
  '#ff545e',
  '#b4ef38',
  '#fd89cd',
  '#39c3ff',
  '#be68f4',
  '#ffb52e',
  '#56edb2',
  '#ee48e7',
  '#a8a0ff',
] as const;

export function createCapsuleAppearances(count: number, random = Math.random) {
  // Some genres share an emoji. Use one entry per glyph so the initial balls
  // remain visually distinct while still drawing from the approved catalogue.
  const icons = catalogue.filter(
    (entry, index) =>
      catalogue.findIndex((candidate) => candidate.emoji === entry.emoji) ===
      index,
  );
  for (let i = icons.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [icons[i], icons[j]] = [icons[j], icons[i]];
  }
  return Array.from({ length: count }, (_, index) => ({
    ingredient: icons[index % icons.length],
    colour: capsuleColours[Math.floor(random() * capsuleColours.length)],
  }));
}
