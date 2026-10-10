import manifest from '../../public/audio/bgm/manifest.json';

export type MusicTrack = (typeof manifest.tracks)[number];

/** Timing is in song seconds; BPM is delivery metadata, not an estimated beat grid. */
export function createMusicPlayer(
  audio: HTMLAudioElement = new Audio(),
  tracks: readonly MusicTrack[] = manifest.tracks,
  random: () => number = Math.random,
) {
  let index = Math.floor(random() * tracks.length);
  let wanted = true;
  let hidden = false;
  let disposed = false;
  let pending = false;
  let revision = 0;
  audio.preload = 'metadata';
  audio.volume = 0.3;
  function select() {
    revision++;
    pending = false;
    audio.src = `${import.meta.env.BASE_URL}audio/bgm/${tracks[index].file}`;
  }
  async function resume() {
    if (!wanted || hidden || disposed || pending || !audio.paused) return;
    pending = true;
    const attempt = revision;
    try {
      await audio.play();
    } catch {
      // Autoplay may require a gesture. A later interaction retries it.
    } finally {
      if (attempt === revision) {
        pending = false;
        if (!wanted || hidden || disposed) audio.pause();
      }
    }
  }
  function next() {
    audio.pause();
    if (tracks.length > 1)
      index =
        (index + 1 + Math.floor(random() * (tracks.length - 1))) %
        tracks.length;
    select();
    void resume();
  }
  audio.addEventListener('ended', next);
  select();
  void resume();
  return {
    get timing() {
      const track = tracks[index];
      return {
        track,
        bpm: track.bpm,
        seconds: audio.currentTime,
        beats: track.bpm === null ? null : (audio.currentTime * track.bpm) / 60,
        playing: !audio.paused && !hidden && wanted,
        wanted,
      };
    },
    resume,
    next,
    toggle() {
      wanted = !wanted || (audio.paused && !hidden);
      if (wanted) void resume();
      else {
        audio.pause();
        audio.currentTime = 0;
      }
    },
    setMuted(muted: boolean) {
      audio.muted = muted;
    },
    setHidden(value: boolean) {
      hidden = value;
      if (hidden) audio.pause();
      else void resume();
    },
    dispose() {
      disposed = true;
      audio.pause();
      audio.removeEventListener('ended', next);
      audio.removeAttribute('src');
      audio.load();
    },
  };
}
