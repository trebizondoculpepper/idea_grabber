import { AmbientLight, Color, DirectionalLight, Scene } from 'three';
import { createSceneKit } from './scene-kit';
import { createEnvironment } from './create-environment';
import { createMachine } from './create-machine';
import { createHero } from './create-hero';
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
  createMachine(scene, kit);
  const bulbee = createHero(scene, kit, 'Bulbee', -3.55, 2.5);
  let coinie = createHero(scene, kit, 'Coinie', 3.6, 2.0);
  const cycle = createCoinieCycle();
  let generation = cycle.generation;
  return {
    scene,
    get coinie() {
      return coinie.hero;
    },
    get coiniePhase() {
      return cycle.phase;
    },
    get coinieGeneration() {
      return cycle.generation;
    },
    activateCoinie: cycle.start,
    update(elapsed: number, delta = 0, reducedMotion = false) {
      cycle.advance(delta, reducedMotion);
      if (generation !== cycle.generation) {
        scene.remove(coinie.hero);
        coinie = createHero(scene, kit, 'Coinie', 3.6, 2.0);
        generation = cycle.generation;
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
