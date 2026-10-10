import {
  AmbientLight,
  DirectionalLight,
  Color,
  IcosahedronGeometry,
  Mesh,
  MeshStandardMaterial,
  PlaneGeometry,
  Scene,
} from 'three';

export function createScene() {
  const scene = new Scene();
  scene.background = new Color('#361477');
  scene.add(new AmbientLight(0xffffff, 2));
  const light = new DirectionalLight(0xffffff, 3);
  light.position.set(3, 5, 4);
  scene.add(light);

  const capsule = new Mesh(
    new IcosahedronGeometry(0.9, 0),
    new MeshStandardMaterial({
      color: '#ffdb24',
      flatShading: true,
      roughness: 1,
    }),
  );
  capsule.position.y = 1.25;
  scene.add(capsule);

  const floor = new Mesh(
    new PlaneGeometry(200, 200),
    new MeshStandardMaterial({ color: '#612ab0', roughness: 1 }),
  );
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);

  return {
    scene,
    update(elapsed: number) {
      capsule.rotation.y = elapsed * 0.2;
    },
    dispose() {
      capsule.geometry.dispose();
      capsule.material.dispose();
      floor.geometry.dispose();
      floor.material.dispose();
    },
  };
}
