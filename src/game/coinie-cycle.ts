export const phaseDurations = {
  jumping: 1.25,
  lowering: 1.4,
  grabbing: 0.45,
  lifting: 1.4,
  carrying: 1.5,
  dropping: 0.7,
  rolling: 3.2,
  returning: 1.3,
  walking: 1.8,
};
export type CoiniePhase = 'ready' | keyof typeof phaseDurations;
const phases = Object.keys(phaseDurations) as (keyof typeof phaseDurations)[];

// One accepted click owns the entire machine cycle; no input queue or timers.
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
      if (phase === 'ready') return;
      elapsed += delta;
      while (phase !== 'ready') {
        const duration = reducedMotion ? 0.2 : phaseDurations[phase];
        if (elapsed < duration) {
          progress = elapsed / duration;
          return;
        }
        elapsed -= duration;
        if (phase === 'jumping') generation += 1;
        const next: CoiniePhase | undefined =
          phase === 'walking' ? undefined : phases[phases.indexOf(phase) + 1];
        phase = next ?? 'ready';
        if (phase === 'ready') elapsed = 0;
        progress = 0;
      }
    },
  };
}
