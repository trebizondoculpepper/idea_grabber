import { Scene } from 'three';
import { createArcadeLighting } from './arcade-lighting';
import type { Mesh } from 'three';
import { createSceneKit } from './scene-kit';
import { createEnvironment } from './create-environment';
import { createArcadeScreens } from './arcade-screens';
import { createRat } from './create-rat';
import { createMachineAnimation } from './animate-machine';
import { createMachine } from './create-machine';
import { createMachineLighting } from './machine-lighting';
import { createPassersBy } from './passers-by';
import { createHero } from './create-hero';
import { createSlotSmoke } from './create-slot-smoke';
import { createCoinieCycle } from '../game/coinie-cycle';
import {
  poseCoinieJump,
  poseCoinieWalk,
  resetCoiniePose,
  createCoinieJumps,
  type CoinieJump,
} from './animate-coinie';

export function createScene() {
  const scene = new Scene();
  scene.name = 'ArcadeScene';
  const lighting = createArcadeLighting(scene);
  const kit = createSceneKit();
  const environment = createEnvironment(scene, kit);
  const rat = createRat(environment, kit);
  const screens = createArcadeScreens(environment);
  const parts = createMachine(scene, kit);
  const machine = createMachineAnimation(parts);
  const cabinetLights = createMachineLighting(parts.machine);
  const passersBy = createPassersBy(scene, kit);
  const bulbee = createHero(scene, kit, 'Bulbee', -3.55, 2.5);
  let coinie = createHero(scene, kit, 'Coinie', 3.6, 2.0);
  const cycle = createCoinieCycle(true);
  poseCoinieWalk(coinie.hero, 0, false);
  const smoke = createSlotSmoke(scene, kit);
  const talking = { bulbee: false, coinie: false };
  let generation = cycle.generation;
  let replacement = 0;
  const nextJump = createCoinieJumps();
  let jump: CoinieJump = 'default';
  return {
    scene,
    bulbee: bulbee.hero,
    get landings() {
      return machine.landings;
    },
    get marqueeFlickers() {
      return cabinetLights.marqueeFlickers;
    },
    get ingredients() {
      return machine.ingredients;
    },
    get coinie() {
      return coinie.hero;
    },
    get passerBy() {
      return passersBy.cameraTarget;
    },
    get coinieProgress() {
      return cycle.progress;
    },
    get coinieJump() {
      return jump;
    },
    get coiniePhase() {
      return cycle.phase;
    },
    get coinieGeneration() {
      return cycle.generation;
    },
    get trayCount() {
      return machine.delivered;
    },
    get canInsertCoinie() {
      return cycle.phase === 'ready' && !machine.busy;
    },
    coinSlot: parts.coinSlot,
    get trayBalls() {
      return machine.trayBalls;
    },
    discardBall(ball: Mesh) {
      return machine.discard(ball);
    },
    setTalking(bulbeeTalking: boolean, coinieTalking: boolean) {
      talking.bulbee = bulbeeTalking;
      talking.coinie = coinieTalking;
    },
    activateCoinie() {
      if (machine.busy) return false;
      const accepted = cycle.start(machine.full);
      if (accepted) jump = nextJump();
      return accepted;
    },
    update(elapsed: number, delta = 0, reducedMotion = false) {
      screens.update(elapsed, reducedMotion);
      rat.update(elapsed, reducedMotion);
      lighting.update(elapsed, reducedMotion);
      cabinetLights.update(elapsed, reducedMotion);
      passersBy.update(delta, reducedMotion);
      parts.insertCoinLit.visible =
        cycle.phase === 'ready' &&
        !machine.busy &&
        (reducedMotion || Math.floor(elapsed * 2.5) % 2 === 0);
      smoke.update(delta, reducedMotion);
      cycle.advance(delta, reducedMotion);
      if (generation !== cycle.generation) {
        smoke.burst(reducedMotion);
        smoke.update(0, reducedMotion);
        scene.remove(coinie.hero);
        coinie.hero.visible = false;
        generation = cycle.generation;
      }
      machine.update(cycle.phase, cycle.progress, delta);
      parts.setRackCount(machine.delivered);
      if (cycle.phase === 'walking' && replacement !== generation) {
        coinie = createHero(scene, kit, 'Coinie', 3.6, 2.0);
        replacement = generation;
      }
      bulbee.update(elapsed, undefined, talking.bulbee, reducedMotion);
      coinie.update(
        elapsed,
        cycle.phase === 'walking' && !reducedMotion
          ? cycle.progress
          : undefined,
        talking.coinie,
        reducedMotion,
      );
      if (cycle.phase === 'jumping')
        poseCoinieJump(coinie.hero, cycle.progress, reducedMotion, jump);
      else if (cycle.phase === 'walking')
        poseCoinieWalk(coinie.hero, cycle.progress, reducedMotion);
      else resetCoiniePose(coinie.hero);
    },
    dispose() {
      lighting.dispose();
      cabinetLights.dispose();
      kit.dispose();
    },
  };
}
