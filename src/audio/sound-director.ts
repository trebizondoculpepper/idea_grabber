import type { CoiniePhase } from '../game/coinie-cycle';

export type SoundCue =
  | 'coin'
  | 'jump'
  | 'puff'
  | 'grip'
  | 'release'
  | 'drop'
  | 'eject'
  | 'plop'
  | 'rack'
  | 'step'
  | 'click'
  | 'coinie'
  | 'bulbee'
  | 'motor'
  | 'rolling'
  | 'hum';
export type Voice = 'coinie' | 'bulbee';
export interface SoundSnapshot {
  phase: CoiniePhase;
  progress: number;
  landings: number;
  coinieSpeech: number | undefined;
  bulbeeSpeech: number | undefined;
  coinieTalking?: boolean;
  bulbeeTalking?: boolean;
  reducedMotion: boolean;
}
export interface SoundFrame {
  shots: SoundCue[];
  loops: SoundCue[];
  stopVoices: Voice[];
}

// Read animation state, never wall-clock timers: pause and reduced motion stay in sync.
export function createSoundDirector() {
  let previous: SoundSnapshot | undefined;
  let wasAudible = false;
  const voices = {
    coinie: { remaining: 0, untilNext: 0 },
    bulbee: { remaining: 0, untilNext: 0 },
  };
  return {
    hush() {
      for (const voice of Object.values(voices)) voice.remaining = 0;
    },
    update(state: SoundSnapshot, delta: number, audible: boolean): SoundFrame {
      const frame: SoundFrame = { shots: [], loops: [], stopVoices: [] };
      const changed = previous !== undefined && previous.phase !== state.phase;
      const shot = (cue: SoundCue) => {
        if (audible) frame.shots.push(cue);
      };
      const crossed = (at: number) =>
        previous !== undefined &&
        state.progress >= at &&
        (previous.phase !== state.phase || previous.progress < at);

      if (changed) {
        if (state.phase === 'jumping') shot('jump');
        if (state.phase === 'lowering') {
          shot('coin');
          shot('puff');
        }
        if (state.phase === 'dropping') shot('release');
        if (state.phase === 'ejecting') shot('eject');
      }
      if (state.phase === 'grabbing' && crossed(0.75)) shot('grip');
      if (state.phase === 'dropping' && crossed(0.65)) shot('drop');
      if (state.phase === 'ejecting' && crossed(0.3)) shot('plop');
      if (previous && state.landings > previous.landings) shot('rack');
      if (state.phase === 'walking' && !state.reducedMotion)
        for (const at of [0.2, 0.5, 0.8]) if (crossed(at)) shot('step');

      for (const voice of ['coinie', 'bulbee'] as const) {
        const key = voice === 'coinie' ? 'coinieSpeech' : 'bulbeeSpeech';
        const talking =
          state[voice === 'coinie' ? 'coinieTalking' : 'bulbeeTalking'];
        const burst = voices[voice];
        // Catch a live entrance line after audio unlocks, without replaying old bubbles.
        const resumedSpeech = audible && !wasAudible && talking === true;
        if (
          state[key] === undefined ||
          talking === false ||
          state[key] !== previous?.[key] ||
          resumedSpeech
        ) {
          frame.stopVoices.push(voice);
          burst.remaining =
            state[key] !== undefined && audible && talking !== false ? 8 : 0;
          burst.untilNext = 0;
        }
        if (!audible) burst.remaining = 0;
        burst.untilNext -= Math.max(0, delta);
        if (burst.remaining > 0 && burst.untilNext <= 0) {
          shot(voice);
          burst.remaining -= 1;
          burst.untilNext = voice === 'coinie' ? 0.18 : 0.25;
        }
      }
      if (audible) {
        frame.loops.push('hum');
        if (
          ['lowering', 'lifting', 'carrying', 'returning'].includes(state.phase)
        )
          frame.loops.push('motor');
        if (['rolling', 'ejecting'].includes(state.phase))
          frame.loops.push('rolling');
      }
      previous = { ...state };
      wasAudible = audible;
      return frame;
    },
  };
}
