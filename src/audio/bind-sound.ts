import { createSoundDirector } from './sound-director';
import type { SoundSnapshot } from './sound-director';
import { createSoundPlayer } from './sound-player';
import { createMusicPlayer } from './music-player';

export function bindSound() {
  const player = createSoundPlayer();
  const director = createSoundDirector();
  const music = createMusicPlayer();
  const transport = document.querySelector<HTMLButtonElement>('#music-toggle');
  const next = document.querySelector<HTMLButtonElement>('#music-next');
  const toggleMusic = () => {
    music.toggle();
    refreshMusic();
  };
  const nextMusic = () => {
    music.next();
    refreshMusic();
  };
  function refreshMusic() {
    const state = music.timing;
    transport?.setAttribute(
      'aria-label',
      state.playing ? 'Stop music' : 'Play music',
    );
    transport?.setAttribute(
      'title',
      `${state.playing ? 'Stop' : 'Play'} music: ${state.track.title}`,
    );
    transport?.setAttribute('data-playing', String(state.playing));
    transport?.setAttribute('data-wanted', String(state.wanted));
    transport?.setAttribute('data-track', state.track.id);
    transport?.setAttribute('data-bpm', String(state.bpm ?? 'unknown'));
  }
  transport?.addEventListener('click', toggleMusic);
  next?.addEventListener('click', nextMusic);
  const button = document.querySelector<HTMLButtonElement>('#mute-sound');
  try {
    player.setMuted(localStorage.getItem('idea-grabber-muted') === 'true');
  } catch {
    /* Storage can be disabled; the control still works. */
  }
  function refreshButton() {
    if (!button) return;
    button.textContent = player.muted ? 'Unmute sound' : 'Mute sound';
    button.setAttribute('aria-pressed', String(player.muted));
  }
  music.setMuted(player.muted);
  music.setHidden(document.hidden);
  refreshButton();
  refreshMusic();
  let interacted = false;
  const unlock = (event: Event) => {
    interacted = true;
    void player.unlock();
    if (!(
      event.target instanceof Element &&
      event.target.closest('#music-toggle, #music-next')
    ))
      void music.resume();
  };
  const toggle = () => {
    director.hush();
    player.setMuted(!player.muted);
    music.setMuted(player.muted);
    try {
      localStorage.setItem('idea-grabber-muted', String(player.muted));
    } catch {
      /* Storage can be disabled. */
    }
    refreshButton();
    player.play('click');
  };
  const visibility = () => {
    director.hush();
    music.setHidden(document.hidden);
    if (document.hidden) player.pause();
    else if (interacted) void player.unlock();
  };
  const uiClick = (event: MouseEvent) => {
    if (
      event.target instanceof Element &&
      event.target.closest('button:not(#mute-sound):not(:disabled)')
    )
      player.play('click');
  };
  document.addEventListener('pointerdown', unlock, true);
  document.addEventListener('keydown', unlock, true);
  document.addEventListener('click', uiClick);
  document.addEventListener('visibilitychange', visibility);
  button?.addEventListener('click', toggle);
  return {
    get diagnostics() {
      return {
        music: music.timing,
        audible: player.audible,
        muted: player.muted,
        loadedClips: player.loadedClips,
        activeCues: player.activeCues,
      };
    },
    get musicTiming() {
      return music.timing;
    },
    update(state: SoundSnapshot, delta: number) {
      refreshMusic();
      const frame = director.update(
        state,
        delta,
        player.audible && !document.hidden,
      );
      for (const voice of frame.stopVoices) player.stopVoice(voice);
      for (const cue of frame.shots) player.play(cue);
      player.setLoops(frame.loops);
    },
    dispose() {
      document.removeEventListener('pointerdown', unlock, true);
      document.removeEventListener('keydown', unlock, true);
      document.removeEventListener('click', uiClick);
      document.removeEventListener('visibilitychange', visibility);
      button?.removeEventListener('click', toggle);
      transport?.removeEventListener('click', toggleMusic);
      next?.removeEventListener('click', nextMusic);
      music.dispose();
      player.dispose();
    },
  };
}
