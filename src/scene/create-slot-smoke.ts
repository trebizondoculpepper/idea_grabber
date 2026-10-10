import type { Object3D } from 'three';
import type { SceneKit } from './scene-kit';

export function createSlotSmoke(parent: Object3D, kit: SceneKit) {
  const root = kit.group(parent, 'CoinSlotSmoke', 2.07, 2.97, 2.12);
  root.visible = false;
  const surface = kit.textured('smoke-puff', 1, 1, true);
  surface.transparent = true;
  surface.depthWrite = false;
  const puffs = Array.from({ length: 7 }, (_, i) => {
    const puff = kit.panel(
      root,
      `SmokePuff${i + 1}`,
      [1, 1],
      [0, 0, 0],
      surface,
    );
    puff.rotation.set(
      ((i % 3) - 1) * 0.18,
      0.56 + ((i % 3) - 1) * 0.35,
      i * 0.9,
    );
    return puff;
  });
  let age = 1;
  let duration = 0.85;
  return {
    burst(reducedMotion: boolean) {
      age = 0;
      duration = reducedMotion ? 0.25 : 0.85;
      root.visible = true;
    },
    update(delta: number, reducedMotion: boolean) {
      if (!root.visible) return;
      age += delta;
      const progress = Math.min(age / duration, 1);
      root.visible = progress < 1;
      surface.opacity = 1 - progress * progress;
      puffs.forEach((puff, i) => {
        const angle = (i / puffs.length) * Math.PI * 2;
        const spread = reducedMotion ? 0.22 : 0.1 + progress * 0.85;
        puff.position.set(
          Math.cos(angle) * spread,
          Math.sin(angle) * spread + progress * 0.25,
          (i % 3) * 0.08,
        );
        const size = (0.4 + progress * 0.45) * (i % 2 ? 0.85 : 1);
        puff.scale.set(size, size, 1);
      });
    },
  };
}
