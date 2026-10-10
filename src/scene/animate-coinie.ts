import { Vector3 } from 'three';
import type { Group } from 'three';

const waiting = new Vector3(3.6, 0.03, 2.0);
const waitingCentre = new Vector3(3.6, 1.43, 2.0);
const slotFront = new Vector3(2.07, 2.97, 2.15);
const slotCentre = new Vector3(2.07, 2.97, 1.75);
const facing = Math.atan2(7, 11);
const centre = new Vector3();
const smooth = (t: number) => t * t * (3 - 2 * t);

export function poseCoinieJump(
  hero: Group,
  progress: number,
  reducedMotion: boolean,
) {
  if (reducedMotion) {
    hero.scale.setScalar(1 - progress * 0.95);
    hero.position.copy(waiting);
    return;
  }
  if (progress < 0.16) {
    const crouch = Math.sin((progress / 0.16) * Math.PI);
    hero.position.copy(waiting);
    hero.scale.set(1 + crouch * 0.12, 1 - crouch * 0.2, 1);
    return;
  }
  let scale: number;
  if (progress < 0.82) {
    const t = (progress - 0.16) / 0.66;
    centre.lerpVectors(waitingCentre, slotFront, smooth(t));
    centre.y += Math.sin(t * Math.PI) * 1.2;
    scale = 1 - t * 0.3;
    const turn = Math.max(0, (t - 0.4) / 0.6);
    hero.rotation.y = facing + (Math.PI / 2 - facing) * smooth(turn);
    hero.rotation.z = Math.sin(t * Math.PI) * -0.18;
  } else {
    const t = (progress - 0.82) / 0.18;
    centre.lerpVectors(slotFront, slotCentre, smooth(t));
    scale = 0.7 * (1 - smooth(t)) + 0.03 * smooth(t);
    hero.rotation.y = Math.PI / 2;
    hero.rotation.z = 0;
  }
  hero.scale.setScalar(scale);
  hero.position.copy(centre);
  hero.position.y -= 1.4 * scale;
}

export function poseCoinieWalk(
  hero: Group,
  progress: number,
  reducedMotion: boolean,
) {
  hero.scale.setScalar(1);
  hero.rotation.set(0, facing, 0);
  hero.position.copy(waiting);
  if (reducedMotion) return;
  hero.position.x += 7 * (1 - smooth(progress));
  hero.position.y += Math.abs(Math.sin(progress * Math.PI * 10)) * 0.065;
}

export function resetCoiniePose(hero: Group) {
  hero.position.copy(waiting);
  hero.scale.setScalar(1);
  hero.rotation.set(0, facing, 0);
}
