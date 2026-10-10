import { Vector3 } from 'three';
import type { Mesh } from 'three';
import type { createMachine } from './create-machine';
import type { CoiniePhase } from '../game/coinie-cycle';
const smooth = (t: number) => t * t * (3 - 2 * t);

export function createMachineAnimation(
  parts: ReturnType<typeof createMachine>,
) {
  const { machine, assembly, claw, cable, pitBalls } = parts;
  const rest = new Vector3(-0.45, 4.75, 0.5);
  const pickup = new Vector3();
  const drop = new Vector3(1.05, 4.75, -0.7);
  const head = new Vector3();
  let ball: Mesh | undefined;
  let delivered = 0;
  let lastPhase: CoiniePhase = 'ready';
  const fingers = claw.children.filter((child) =>
    child.name.startsWith('Finger'),
  );
  function poseHead(closed: number) {
    assembly.position.x = head.x;
    assembly.position.z = head.z;
    claw.position.y = head.y - assembly.position.y;
    cable.scale.y = (assembly.position.y - head.y) / 1.08;
    fingers.forEach((finger) => {
      finger.scale.x = 1 - closed * 0.32;
    });
  }
  head.copy(rest);
  poseHead(0);
  return {
    get delivered() {
      return delivered;
    },
    get full() {
      return delivered >= 5;
    },
    update(phase: CoiniePhase, progress: number) {
      const t = smooth(progress);
      if (phase === 'lowering' && lastPhase !== phase) {
        ball = pitBalls
          .filter((candidate) => candidate.parent?.name === 'CapsulePit')
          .sort((a, b) => b.position.y - a.position.y)[0];
        if (ball) {
          machine.updateMatrixWorld(true);
          ball.getWorldPosition(pickup);
          machine.worldToLocal(pickup);
          pickup.y += 0.68;
          machine.attach(ball);
        }
      }
      if (phase === 'lowering') head.lerpVectors(rest, pickup, t);
      if (phase === 'grabbing') head.copy(pickup);
      if (phase === 'lifting') {
        head.copy(pickup);
        head.y += (rest.y - pickup.y) * t;
      }
      if (phase === 'carrying') {
        head.lerpVectors(new Vector3(pickup.x, rest.y, pickup.z), drop, t);
      }
      if (phase === 'dropping' || phase === 'rolling') head.copy(drop);
      if (phase === 'returning') head.lerpVectors(drop, rest, t);
      if (phase === 'ready' || phase === 'walking' || phase === 'jumping')
        head.copy(rest);
      const closed =
        phase === 'grabbing'
          ? t
          : ['lifting', 'carrying'].includes(phase)
            ? 1
            : phase === 'dropping'
              ? 1 - t
              : 0;
      poseHead(closed);
      if (ball) {
        if (['grabbing', 'lifting', 'carrying'].includes(phase)) {
          ball.position.copy(head);
          ball.position.y -= 0.68;
        }
        if (phase === 'dropping') {
          ball.position.set(
            drop.x,
            drop.y - 0.68 - progress * progress * 3,
            drop.z,
          );
          ball.visible = progress < 0.65;
        }
        if (phase === 'rolling') {
          ball.visible = true;
          const start = -2.55;
          const end = 1.12 - delivered * 0.77;
          const x = start + (end - start) * t;
          ball.position.set(x, 0.83, 1.97);
          ball.rotation.z = -(x - start) / 0.43;
        }
        if (phase === 'returning' && lastPhase === 'rolling') {
          ball.position.set(1.12 - delivered * 0.77, 0.83, 1.97);
          delivered += 1;
          ball = undefined;
        }
      }
      lastPhase = phase;
    },
  };
}
