import type { Ingredient } from './bulbee-line';
export const gameUrl = 'https://idea-grabber.fly.dev/';
export function shareIdea(
  ingredients: readonly Ingredient[],
  spokenLine?: string,
) {
  const names = ingredients.map((item) =>
    item.label.toLowerCase().replace(/\s+game$/, ''),
  );
  const idea = names.length
    ? `${names.join(' × ')} game`
    : 'my next terrible, brilliant game';
  const article = /^[aeiou]/i.test(idea) ? 'an' : 'a';
  const bubble = spokenLine?.trim() || `We're making ${article} ${idea}!`;
  const caption = `My stupid idea: ${idea}.\n${bubble}\n${gameUrl}`;
  const params = new URLSearchParams({
    text: `My stupid idea: ${idea}.`.slice(0, 230),
    url: gameUrl,
  });
  return {
    idea,
    bubble,
    caption,
    twitterUrl: `https://twitter.com/intent/tweet?${params}`,
  };
}
