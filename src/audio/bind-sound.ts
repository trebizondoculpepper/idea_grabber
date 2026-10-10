import { createSoundDirector } from './sound-director';
import type { SoundSnapshot } from './sound-director';
import { createSoundPlayer } from './sound-player';

export function bindSound() {
  const player = createSoundPlayer();
  const director = createSoundDirector();
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
  refreshButton();
  let interacted = false;
  const unlock = () => {
    interacted = true;
    void player.unlock();
  };
  const toggle = () => {
    director.hush();
    player.setMuted(!player.muted);
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
        audible: player.audible,
        muted: player.muted,
        loadedClips: player.loadedClips,
        activeCues: player.activeCues,
      };
    },
    update(state: SoundSnapshot, delta: number) {
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
      player.dispose();
    },
  };
}
