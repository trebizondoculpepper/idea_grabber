import type { CoiniePhase } from '../game/coinie-cycle';

export type CameraShot =
  | 'default'
  | 'machine'
  | 'claw'
  | 'bulbee'
  | 'coinie'
  | 'feature'
  | 'dutch'
  | 'passerby';
const shots: Exclude<CameraShot, 'default'>[] = [
  'machine',
  'claw',
  'bulbee',
  'coinie',
  'feature',
  'dutch',
];

const grabShots: Partial<Record<CoiniePhase, CameraShot>> = {
  jumping: 'coinie',
  lowering: 'machine',
  grabbing: 'claw',
  lifting: 'claw',
  carrying: 'dutch',
  dropping: 'machine',
  ejecting: 'feature',
  rolling: 'feature',
};

/** Phase-timed grab shots take priority over occasional idle cutaways. */
export function createCameraDirector(random = Math.random) {
  let wait = 24 + random() * 12;
  let sequence: CameraShot[] = [];
  let remaining = 0;
  let grabbing = false;
  return {
    update(
      delta: number,
      reducedMotion: boolean,
      ready: boolean,
      phase: CoiniePhase = 'ready',
      hasPasserBy = false,
    ): CameraShot {
      const grabShot = grabShots[phase];
      if (!reducedMotion && grabShot) {
        if (!grabbing) wait = 24 + random() * 12;
        grabbing = true;
        sequence = [];
        remaining = 0;
        return grabShot;
      }
      grabbing = false;
      if (reducedMotion || !ready) {
        if (sequence.length) wait = 24 + random() * 12;
        sequence = [];
        remaining = 0;
        return 'default';
      }
      if (sequence.length) {
        // A walker can leave the foreground before its scheduled shot ends.
        const lostTarget = sequence[0] === 'passerby' && !hasPasserBy;
        sequence = sequence.filter(
          (shot) => shot !== 'passerby' || hasPasserBy,
        );
        if (lostTarget) remaining = 2.8;
        remaining -= delta;
        while (remaining <= 0 && sequence.length) {
          sequence.shift();
          remaining += 2.8;
        }
        if (!sequence.length) {
          wait = 24 + random() * 12;
          return 'default';
        }
        return sequence[0];
      }
      wait -= delta;
      if (wait > 0) return 'default';
      const choices = [...shots];
      if (hasPasserBy) choices.push('passerby');
      sequence = Array.from(
        { length: 2 + Math.floor(random() * 2) },
        () => choices.splice(Math.floor(random() * choices.length), 1)[0],
      );
      remaining = 2.8;
      return sequence[0];
    },
  };
}
