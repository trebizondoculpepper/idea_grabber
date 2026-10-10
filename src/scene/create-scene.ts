import {
  AmbientLight,
  DirectionalLight,
  Color,
  IcosahedronGeometry,
  Mesh,
  PlaneGeometry,
  Scene,
  TextureLoader,
  NearestFilter,
  RepeatWrapping,
  SRGBColorSpace,
} from 'three';
import { createPs1Material } from '../rendering/ps1-material';

export function createScene() {
  const scene = new Scene();
  scene.background = new Color('#361477');
  scene.add(new AmbientLight(0xffffff, 1.8));
  const light = new DirectionalLight(0xffffff, 2.5);
  light.position.set(3, 5, 4);
  scene.add(light);

  const loader = new TextureLoader();
  const texture = (name: string, repeat: number) => {
    const map = loader.load(`${import.meta.env.BASE_URL}assets/${name}.svg`);
    map.colorSpace = SRGBColorSpace;
    map.magFilter = NearestFilter;
    map.minFilter = NearestFilter;
    map.generateMipmaps = false;
    map.wrapS = map.wrapT = RepeatWrapping;
    map.repeat.set(repeat, repeat);
    return map;
  };
  const capsuleMap = texture('capsule', 1);
  const floorMap = texture('stage', 12);
  const backdropMap = texture('backdrop', 6);
  const capsule = new Mesh(
    new IcosahedronGeometry(0.9, 0),
    createPs1Material({ map: capsuleMap }),
  );
  capsule.position.y = 1.25;
  scene.add(capsule);

  const floor = new Mesh(
    new PlaneGeometry(24, 24, 12, 12),
    createPs1Material({ map: floorMap }),
  );
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);
  const backdrop = new Mesh(
    new PlaneGeometry(24, 12, 12, 6),
    createPs1Material({ map: backdropMap }),
  );
  backdrop.position.set(0, 6, -6);
  scene.add(backdrop);

  return {
    scene,
    update(elapsed: number) {
      capsule.rotation.y = elapsed * 0.12;
    },
    dispose() {
      for (const mesh of [capsule, floor, backdrop]) {
        mesh.geometry.dispose();
        mesh.material.dispose();
      }
      for (const map of [capsuleMap, floorMap, backdropMap]) map.dispose();
    },
  };
}
