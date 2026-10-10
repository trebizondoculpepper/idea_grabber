import { AmbientLight, Color, DirectionalLight, Scene } from 'three';
import { createSceneKit } from './scene-kit';
import { createEnvironment } from './create-environment';
import { createMachine } from './create-machine';
import { createHero } from './create-hero';

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
  const coinie = createHero(scene, kit, 'Coinie', 3.6, 2.0);
  return {
    scene,
    update(elapsed: number) {
      bulbee.update(elapsed);
      coinie.update(elapsed);
    },
    dispose: kit.dispose,
  };
}
