import { Vector3 } from 'three';
import type { Group } from 'three';

const waiting = new Vector3(3.6, 0.03, 2.0);
const waitingCentre = new Vector3(3.6, 1.43, 2.0);
const slotFront = new Vector3(2.07, 2.97, 2.15);
const slotCentre = new Vector3(2.07, 2.97, 1.75);
const facing = Math.atan2(7, 11);
const centre = new Vector3();
const pivotOffset = new Vector3();
const smooth = (t: number) => t * t * (3 - 2 * t);

export type CoinieJump = 'default' | 'somersault' | 'backflip';

/** Start with the familiar jump, then shuffle the moves without adjacent repeats. */
export function createCoinieJumps(random = Math.random) {
  let bag: CoinieJump[] = [];
  let previous: CoinieJump | undefined;
  return () => {
    if (!bag.length) {
      bag = ['default', 'somersault', 'backflip'];
      for (let i = bag.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        [bag[i], bag[j]] = [bag[j], bag[i]];
      }
      if (!previous) {
        const index = bag.indexOf('default');
        [bag[index], bag[bag.length - 1]] = [bag[bag.length - 1], bag[index]];
      } else if (bag[bag.length - 1] === previous) {
        [bag[0], bag[bag.length - 1]] = [bag[bag.length - 1], bag[0]];
      }
    }
    previous = bag.pop()!;
    return previous;
  };
}

export function poseCoinieJump(
  hero: Group,
  progress: number,
  reducedMotion: boolean,
  move: CoinieJump = 'default',
) {
  hero.rotation.set(0, facing, 0);
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
    centre.y += Math.sin(t * Math.PI) * (move === 'default' ? 1.2 : 1.8);
    scale = 1 - t * 0.3;
    const turn = Math.max(0, (t - 0.4) / 0.6);
    hero.rotation.y = facing + (Math.PI / 2 - facing) * smooth(turn);
    hero.rotation.z = Math.sin(t * Math.PI) * -0.18;
    if (move !== 'default') {
      hero.rotation.z +=
        (move === 'somersault' ? 1 : -1) * Math.PI * 2 * smooth(t);
    }
  } else {
    const t = (progress - 0.82) / 0.18;
    centre.lerpVectors(slotFront, slotCentre, smooth(t));
    scale = 0.7 * (1 - smooth(t)) + 0.03 * smooth(t);
    hero.rotation.y = Math.PI / 2;
    hero.rotation.z = 0;
  }
  hero.scale.setScalar(scale);
  hero.position.copy(centre);
  // Rotate around the coin's centre, keeping the body on the jump arc.
  pivotOffset.set(0, 1.4 * scale, 0).applyQuaternion(hero.quaternion);
  hero.position.sub(pivotOffset);
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
