import { expect, it, vi } from 'vitest';
import { createMusicPlayer } from './music-player';
import manifest from '../../public/audio/bgm/manifest.json';

function fixture(blocked = false) {
  const events = new Map<string, () => void>();
  const audio = {
    paused: true,
    currentTime: 0,
    src: '',
    muted: false,
    play: vi.fn(async () => {
      if (blocked) throw new Error('Gesture required');
      audio.paused = false;
    }),
    pause: vi.fn(() => {
      audio.paused = true;
    }),
    addEventListener: vi.fn((name: string, cb: () => void) =>
      events.set(name, cb),
    ),
    removeEventListener: vi.fn(),
    removeAttribute: vi.fn(),
    load: vi.fn(),
  };
  return {
    audio,
    events,
    player: createMusicPlayer(
      audio as unknown as HTMLAudioElement,
      manifest.tracks,
      () => 0.5,
    ),
  };
}

it('starts a random track and exposes its delivered BPM and song-relative beat timing', async () => {
  const { player, audio } = fixture();
  await Promise.resolve();
  expect(player.timing.track).toEqual(manifest.tracks[20]);
  audio.currentTime = 10;
  expect(player.timing.beats).toBe((10 * manifest.tracks[20].bpm!) / 60);
  expect(player.timing.playing).toBe(true);
});

it('stays stopped through gestures, visibility changes, and skips, then plays the selected song', async () => {
  const { player, audio } = fixture();
  await Promise.resolve();
  player.toggle();
  expect(audio.currentTime).toBe(0);
  const previous = player.timing.track.id;
  player.next();
  player.setHidden(true);
  player.setHidden(false);
  await player.resume();
  expect(player.timing.track.id).not.toBe(previous);
  expect(audio.play).toHaveBeenCalledTimes(1);
  player.toggle();
  await Promise.resolve();
  expect(player.timing.playing).toBe(true);
});

it('retries blocked autoplay on interaction and advances after a song ends', async () => {
  const { player, audio, events } = fixture(true);
  await Promise.resolve();
  await player.resume();
  expect(audio.play).toHaveBeenCalledTimes(2);
  const previous = player.timing.track.id;
  events.get('ended')!();
  expect(player.timing.track.id).not.toBe(previous);
  player.setMuted(true);
  expect(audio.muted).toBe(true);
  player.dispose();
  expect(audio.removeEventListener).toHaveBeenCalledWith(
    'ended',
    expect.any(Function),
  );
});

it('retains unknown BPM without inventing beat timing', () => {
  const { audio } = fixture();
  const tracks = manifest.tracks.filter((track) => track.bpm === null);
  const player = createMusicPlayer(
    audio as unknown as HTMLAudioElement,
    tracks,
    () => 0,
  );
  expect(player.timing.bpm).toBeNull();
  expect(player.timing.beats).toBeNull();
});
