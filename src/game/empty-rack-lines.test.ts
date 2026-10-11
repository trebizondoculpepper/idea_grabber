import { expect, it } from 'vitest';
import { createEmptyRackLines, emptyRackLines } from './empty-rack-lines';

it('uses all complaints before repeating and fills random game references', () => {
  const next = createEmptyRackLines(() => 0);
  const lines = Array.from({ length: emptyRackLines.length }, () => next());
  expect(new Set(lines).size).toBe(emptyRackLines.length);
  expect(lines.some((line) => line.includes('Minecraft'))).toBe(true);
  expect(lines.some((line) => line.includes('{game}'))).toBe(false);
  expect(next()).not.toBe(lines.at(-1));
});
