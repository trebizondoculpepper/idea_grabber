import { expect, it } from 'vitest';
import { coinieLines, createCoinieLines } from './coinie-lines';
it('uses all twenty pitches without repeats and never repeats across bag boundaries', () => {
  const next = createCoinieLines(() => 0.5);
  expect(coinieLines).toHaveLength(20);
  let previous = '';
  for (let bag = 0; bag < 10; bag++) {
    const heard = new Set<string>();
    for (let i = 0; i < 20; i++) {
      const line = next();
      expect(line).not.toBe(previous);
      heard.add(line);
      previous = line;
    }
    expect(heard.size).toBe(20);
  }
});
