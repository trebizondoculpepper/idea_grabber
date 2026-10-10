import { Vector3 } from 'three';
import type { PerspectiveCamera } from 'three';
import type { createScene } from '../scene/create-scene';
import { createCoinieLines } from '../game/coinie-lines';

export function bindCoinieSpeech(
  canvas: HTMLCanvasElement,
  camera: PerspectiveCamera,
  world: ReturnType<typeof createScene>,
) {
  const bubble = document.querySelector<HTMLElement>('#coinie-speech')!;
  const nextLine = createCoinieLines();
  const anchor = new Vector3();
  let spokenGeneration = -1;
  let remaining = 0;
  let utterance = 0;
  return {
    get busy() {
      return remaining > 0;
    },
    say(text: string) {
      bubble.textContent = text;
      remaining = 8;
      utterance++;
      bubble.hidden = false;
    },
    // The mouth moves for about as long as the line takes to say.
    get talking() {
      const talkTime = Math.min(
        8 - 1,
        0.6 + (bubble.textContent?.length ?? 0) * 0.055,
      );
      return !bubble.hidden && 8 - remaining < talkTime;
    },
    get speechKey() {
      return bubble.hidden ? undefined : utterance;
    },
    update(delta: number) {
      const onstage =
        world.coiniePhase === 'ready' ||
        (world.coiniePhase === 'walking' && world.coinieProgress >= 0.55);
      if (onstage && spokenGeneration !== world.coinieGeneration) {
        spokenGeneration = world.coinieGeneration;
        utterance++;
        bubble.textContent = nextLine();
        remaining = 8;
      }
      remaining = Math.max(0, remaining - delta);
      bubble.hidden =
        remaining === 0 || !['ready', 'walking'].includes(world.coiniePhase);
      if (bubble.hidden) return;
      world.coinie.localToWorld(anchor.set(0, 2.5, 0));
      anchor.project(camera);
      const bounds = canvas.getBoundingClientRect();
      const x = (anchor.x + 1) * 0.5 * bounds.width;
      const y = (1 - anchor.y) * 0.5 * bounds.height;
      const left = Math.max(
        12,
        Math.min(
          x - bubble.offsetWidth * 0.45,
          bounds.width - bubble.offsetWidth - 12,
        ),
      );
      bubble.style.left = `${left}px`;
      bubble.style.top = `${Math.max(12, bounds.width <= 600 ? y + 36 : y - bubble.offsetHeight - 24)}px`;
      bubble.style.setProperty(
        '--tail-left',
        `${Math.max(24, Math.min(x - left, bubble.offsetWidth - 24))}px`,
      );
    },
    dispose() {
      bubble.hidden = true;
      bubble.replaceChildren();
    },
  };
}
