import { Vector3 } from 'three';
import type { PerspectiveCamera } from 'three';
import type { createScene } from '../scene/create-scene';
import { createBulbeeLine } from '../game/bulbee-line';

export function bindBulbeeSpeech(
  canvas: HTMLCanvasElement,
  camera: PerspectiveCamera,
  world: ReturnType<typeof createScene>,
) {
  const bubble = document.querySelector<HTMLElement>('#bulbee-speech')!;
  const anchor = new Vector3();
  let landing = 0;
  let remaining = 0;
  return {
    update(delta: number) {
      if (landing !== world.landings) {
        landing = world.landings;
        const line = createBulbeeLine(world.ingredients, landing);
        const nodes: Node[] = [document.createTextNode(`${line.opening} `)];
        line.names.forEach((name, index) => {
          if (index) nodes.push(document.createTextNode(' '));
          const emphasis = document.createElement('strong');
          emphasis.textContent = name;
          nodes.push(emphasis);
        });
        nodes.push(document.createTextNode(line.ending));
        bubble.replaceChildren(...nodes);
        remaining = 10;
      }
      remaining = Math.max(0, remaining - delta);
      bubble.hidden = remaining === 0;
      if (bubble.hidden) return;
      world.bulbee.localToWorld(anchor.set(0, 2.7, 0));
      anchor.project(camera);
      const bounds = canvas.getBoundingClientRect();
      const x = (anchor.x + 1) * 0.5 * bounds.width;
      const y = (1 - anchor.y) * 0.5 * bounds.height;
      const left = Math.max(
        12,
        Math.min(
          x - bubble.offsetWidth * 0.55,
          bounds.width - bubble.offsetWidth - 12,
        ),
      );
      bubble.style.left = `${left}px`;
      bubble.style.top = `${Math.max(12, y - bubble.offsetHeight - 24)}px`;
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
