import { AmbientLight, Color, DirectionalLight, Scene } from 'three';
import type { Mesh } from 'three';
import { createSceneKit } from './scene-kit';
import { createEnvironment } from './create-environment';
import { createMachineAnimation } from './animate-machine';
import { createMachine } from './create-machine';
import { createHero } from './create-hero';
import { createSlotSmoke } from './create-slot-smoke';
import { createCoinieCycle } from '../game/coinie-cycle';
import {
  poseCoinieJump,
  poseCoinieWalk,
  resetCoiniePose,
} from './animate-coinie';

export function createScene() {
  const scene = new Scene();
  scene.name = 'ArcadeScene';
  scene.background = new Color('#361477');
  scene.add(new AmbientLight(0xffffff, 1.8));
  const light = new DirectionalLight(0xffffff, 2.5);
  light.position.set(3, 7, 5);
  scene.add(light);
  const kit = createSceneKit();
  createEnvironment(scene, kit);
  const machine = createMachineAnimation(createMachine(scene, kit));
  const bulbee = createHero(scene, kit, 'Bulbee', -3.55, 2.5);
  let coinie = createHero(scene, kit, 'Coinie', 3.6, 2.0);
  const cycle = createCoinieCycle(true);
  poseCoinieWalk(coinie.hero, 0, false);
  const smoke = createSlotSmoke(scene, kit);
  let generation = cycle.generation;
  let replacement = 0;
  return {
    scene,
    bulbee: bulbee.hero,
    get landings() {
      return machine.landings;
    },
    get ingredients() {
      return machine.ingredients;
    },
    get coinie() {
      return coinie.hero;
    },
    get coinieProgress() {
      return cycle.progress;
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
    get trayBalls() {
      return machine.trayBalls;
    },
    discardBall(ball: Mesh) {
      return machine.discard(ball);
    },
    activateCoinie() {
      if (machine.busy) return false;
      return cycle.start(machine.full);
    },
    update(elapsed: number, delta = 0, reducedMotion = false) {
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
      if (cycle.phase === 'walking' && replacement !== generation) {
        coinie = createHero(scene, kit, 'Coinie', 3.6, 2.0);
        replacement = generation;
      }
      bulbee.update(elapsed);
      coinie.update(
        elapsed,
        cycle.phase === 'walking' && !reducedMotion
          ? cycle.progress
          : undefined,
      );
      if (cycle.phase === 'jumping')
        poseCoinieJump(coinie.hero, cycle.progress, reducedMotion);
      else if (cycle.phase === 'walking')
        poseCoinieWalk(coinie.hero, cycle.progress, reducedMotion);
      else resetCoiniePose(coinie.hero);
    },
    dispose: kit.dispose,
  };
}
