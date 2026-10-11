import { expect, it } from 'vitest';
import { gameUrl, shareIdea } from './share-idea';

it('shares current rack genres, a visible line and the canonical game link', () => {
  const line = "I can't wait to extract the garden!";
  const content = shareIdea(
    [
      { id: 'extraction-shooter', label: 'Extraction shooter', emoji: '🚁' },
      { id: 'gardening', label: 'Gardening', emoji: '🌻' },
    ],
    line,
  );
  expect(content.idea).toBe('extraction shooter × gardening game');
  expect(content.bubble).toBe(line);
  expect(content.caption).toContain(gameUrl);
  const url = new URL(content.twitterUrl);
  expect(url.searchParams.get('url')).toBe(gameUrl);
  expect(url.searchParams.get('text')).toContain(content.idea);
});

it('creates a fresh idea bubble when the characters are quiet', () => {
  expect(shareIdea([{ id: 'chess', label: 'Chess', emoji: '♟️' }]).bubble).toBe(
    "We're making a chess game!",
  );
  expect(shareIdea([]).caption).not.toContain('undefined');
});
