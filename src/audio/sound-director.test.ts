import { expect, it } from 'vitest';
import { createSoundDirector } from './sound-director';
import type { SoundSnapshot } from './sound-director';

const ready: SoundSnapshot = {
  phase: 'ready',
  progress: 0,
  landings: 0,
  coinieSpeech: undefined,
  bulbeeSpeech: undefined,
  reducedMotion: false,
};

it('plays contacts once and runs loops only while their objects move', () => {
  const sound = createSoundDirector();
  sound.update(ready, 0, true);
  expect(
    sound.update({ ...ready, phase: 'lowering' }, 0.1, true).shots,
  ).toEqual(['coin', 'puff']);
  expect(
    sound.update({ ...ready, phase: 'lowering', progress: 0.5 }, 0.1, true)
      .loops,
  ).toContain('motor');
  const drop = { ...ready, phase: 'dropping' as const, progress: 0.7 };
  expect(sound.update(drop, 0.1, true).shots).toEqual(['release', 'drop']);
  expect(sound.update(drop, 0.1, true).shots).toEqual([]);
  expect(
    sound.update({ ...ready, phase: 'rolling' }, 0.1, true).loops,
  ).toContain('rolling');
  const landed = { ...ready, phase: 'returning' as const, landings: 1 };
  expect(sound.update(landed, 0.1, true).shots).toEqual(['rack']);
  expect(sound.update(landed, 0.1, true).shots).toEqual([]);
  expect(sound.update(ready, 0.1, true).loops).toEqual(['hum']);
});

it('times overflow at the tray lip and omits it during ordinary rolling', () => {
  const sound = createSoundDirector();
  sound.update(ready, 0, true);
  expect(sound.update({ ...ready, phase: 'rolling' }, 0.1, true).shots).toEqual(
    [],
  );
  expect(
    sound.update({ ...ready, phase: 'ejecting', progress: 0 }, 0.1, true).shots,
  ).toEqual(['eject']);
  expect(
    sound.update({ ...ready, phase: 'ejecting', progress: 0.35 }, 0.1, true)
      .shots,
  ).toEqual(['plop']);
});

it('does not replay muted or pre-unlock speech when audio becomes available', () => {
  const sound = createSoundDirector();
  const speaking = { ...ready, coinieSpeech: 0 };
  sound.update(speaking, 0.1, false);
  expect(sound.update(speaking, 0.1, true).shots).toEqual([]);
  expect(
    sound.update({ ...speaking, coinieSpeech: 1 }, 0.1, true).shots,
  ).toEqual(['coinie']);
  sound.update({ ...speaking, coinieSpeech: 1 }, 0.1, false);
  expect(
    sound.update({ ...speaking, coinieSpeech: 1 }, 0.5, true).shots,
  ).toEqual([]);
});

it('uses finite speech bursts and stops immediately when a bubble hides', () => {
  const sound = createSoundDirector();
  sound.update(ready, 0, true);
  const speaking = { ...ready, bulbeeSpeech: 1 };
  let count = 0;
  for (let i = 0; i < 60; i++)
    count += sound.update(speaking, 0.1, true).shots.length;
  expect(count).toBe(8);
  expect(sound.update(ready, 0.1, true).stopVoices).toContain('bulbee');
  expect(sound.update(ready, 0.5, true).shots).toEqual([]);
});

it('starts Coinie entrance Animalese when audio unlocks during his first line', () => {
  const sound = createSoundDirector();
  const speaking = { ...ready, coinieSpeech: 1, coinieTalking: true };
  expect(sound.update(speaking, 0.1, false).shots).toEqual([]);
  expect(sound.update(speaking, 0.1, true).shots).toEqual(['coinie']);
  expect(sound.update(speaking, 0.01, true).shots).toEqual([]);
  const finished = { ...speaking, coinieTalking: false };
  expect(sound.update(finished, 0.2, true).stopVoices).toContain('coinie');
  sound.update(finished, 0.1, false);
  expect(sound.update(finished, 0.1, true).shots).toEqual([]);
});

it('handles reduced motion contacts and suppresses animated footsteps', () => {
  const sound = createSoundDirector();
  const reduced = { ...ready, reducedMotion: true };
  sound.update(reduced, 0, true);
  expect(
    sound.update({ ...reduced, phase: 'walking', progress: 0.9 }, 0.1, true)
      .shots,
  ).toEqual([]);
  expect(
    sound.update({ ...reduced, phase: 'grabbing', progress: 0.9 }, 0.1, true)
      .shots,
  ).toEqual(['grip']);
  sound.hush();
  expect(sound.update(reduced, 0.1, false).loops).toEqual([]);
});
