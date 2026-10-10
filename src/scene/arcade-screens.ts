import type { Material, Mesh, Object3D } from 'three';

export function arcadeScreenFrame(
  elapsed: number,
  index: number,
  reducedMotion: boolean,
) {
  if (reducedMotion) return 0;
  return (
    Math.floor((Math.max(0, elapsed) + index * 2.3) / (7 + index * 0.6)) % 3
  );
}

export function createArcadeScreens(environment: Object3D) {
  const screens: Mesh[] = [];
  environment.traverse((object) => {
    if (object.name === 'ScreenGraphic' && object.userData.screenMaterials)
      screens.push(object as Mesh);
  });
  return {
    update(elapsed: number, reducedMotion: boolean) {
      screens.forEach((screen, index) => {
        const frame = arcadeScreenFrame(elapsed, index, reducedMotion);
        screen.material = (screen.userData.screenMaterials as Material[])[
          frame
        ];
        screen.userData.screenFrame = frame;
      });
    },
  };
}
