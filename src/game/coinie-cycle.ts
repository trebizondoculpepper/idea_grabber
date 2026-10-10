export type CoiniePhase = 'ready' | 'jumping' | 'walking';

// One accepted click owns the entire jump/replacement cycle. No timers or queue.
export function createCoinieCycle() {
  let phase: CoiniePhase = 'ready';
  let elapsed = 0;
  let generation = 0;
  let progress = 0;
  return {
    get phase() {
      return phase;
    },
    get generation() {
      return generation;
    },
    get progress() {
      return progress;
    },
    start() {
      if (phase !== 'ready') return false;
      phase = 'jumping';
      elapsed = 0;
      progress = 0;
      return true;
    },
    advance(delta: number, reducedMotion = false) {
      if (!Number.isFinite(delta) || delta < 0) return;
      elapsed += delta;
      while (phase !== 'ready') {
        const duration = reducedMotion ? 0.2 : phase === 'jumping' ? 1.25 : 1.8;
        if (elapsed < duration) {
          progress = elapsed / duration;
          return;
        }
        elapsed -= duration;
        if (phase === 'jumping') {
          generation += 1;
          phase = 'walking';
        } else {
          phase = 'ready';
          elapsed = 0;
          progress = 0;
        }
      }
    },
  };
}
