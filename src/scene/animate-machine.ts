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
  const tray: Mesh[] = [];
  let landings = 0;
  const homes = new Map(
    pitBalls.map((candidate) => [
      candidate,
      {
        parent: candidate.parent!,
        position: candidate.position.clone(),
        quaternion: candidate.quaternion.clone(),
      },
    ]),
  );
  let outgoing: Mesh | undefined;
  const shiftStarts = new Map<Mesh, number>();
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
      // Keep the inner finger edges outside the capsule radius, rather than crushing through it.
      finger.scale.x = 1.5 - closed * 0.25;
    });
  }
  head.copy(rest);
  poseHead(0);
  return {
    get landings() {
      return landings;
    },
    get ingredients() {
      return tray.map((ball) => ball.userData.ingredient).reverse();
    },
    get delivered() {
      return tray.length;
    },
    get full() {
      return tray.length >= 5;
    },
    update(phase: CoiniePhase, progress: number) {
      const t = smooth(progress);
      if (phase === 'ejecting' && lastPhase !== phase) {
        outgoing = tray.shift();
        shiftStarts.clear();
        tray.forEach((candidate) =>
          shiftStarts.set(candidate, candidate.position.x),
        );
      }
      if (phase === 'ejecting') {
        tray.forEach((candidate) => {
          const start = shiftStarts.get(candidate)!;
          const nextX = start + 0.77 * t;
          candidate.rotation.z -= (nextX - candidate.position.x) / 0.43;
          candidate.position.x = nextX;
        });
        if (outgoing) {
          // Roll off the tray lip, clear the cabinet, then travel stage forwards.
          if (progress < 0.3) {
            const u = smooth(progress / 0.3);
            outgoing.position.set(
              1.12 + u * 0.4,
              0.83 - u * 0.37,
              1.97 + u * 0.95,
            );
          } else {
            const u = smooth((progress - 0.3) / 0.7);
            outgoing.position.set(
              1.52 + u * 4,
              0.46,
              2.92 + u * 23 + u ** 8 * 100,
            );
          }
          outgoing.rotation.x = progress * 24;
          outgoing.rotation.z = -progress * 6;
        }
      }
      if (phase === 'rolling' && outgoing) {
        tray.forEach((candidate) => {
          const end = shiftStarts.get(candidate)! + 0.77;
          candidate.rotation.z -= (end - candidate.position.x) / 0.43;
          candidate.position.x = end;
        });
        const home = homes.get(outgoing)!;
        home.parent.add(outgoing);
        outgoing.position.copy(home.position);
        outgoing.quaternion.copy(home.quaternion);
        outgoing.visible = true;
        outgoing = undefined;
      }
      if (phase === 'lowering' && lastPhase !== phase) {
        ball = pitBalls
          .filter((candidate) => candidate.parent?.name === 'CapsulePit')
          .sort((a, b) => b.position.y - a.position.y)[0];
        if (ball) {
          machine.updateMatrixWorld(true);
          ball.getWorldPosition(pickup);
          machine.worldToLocal(pickup);
          pickup.y += 0.78;
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
      if (phase === 'dropping' || phase === 'ejecting' || phase === 'rolling')
        head.copy(drop);
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
          ball.position.y -= 0.78;
        }
        if (phase === 'dropping') {
          ball.position.set(
            drop.x,
            drop.y - 0.78 - progress * progress * 3,
            drop.z,
          );
          ball.visible = progress < 0.65;
        }
        if (phase === 'rolling') {
          ball.visible = true;
          const start = -2.55;
          const end = 1.12 - tray.length * 0.77;
          const x = start + (end - start) * t;
          ball.position.set(x, 0.83, 1.97);
          ball.rotation.z = -(x - start) / 0.43;
        }
        if (phase === 'returning' && lastPhase === 'rolling') {
          ball.position.set(1.12 - tray.length * 0.77, 0.83, 1.97);
          tray.push(ball);
          landings += 1;
          ball = undefined;
        }
      }
      lastPhase = phase;
    },
  };
}
