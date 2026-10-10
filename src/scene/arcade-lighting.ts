import {
  AdditiveBlending,
  AmbientLight,
  CircleGeometry,
  Color,
  DirectionalLight,
  Group,
  InstancedMesh,
  MeshBasicMaterial,
  Object3D,
  SpotLight,
} from 'three';
import type { Scene } from 'three';

/** Offstage dance-floor lighting: slow sweeps and scattered mirror-ball glints. */
export function createArcadeLighting(scene: Scene) {
  scene.background = new Color('#160e2c');
  const rig = new Group();
  rig.name = 'OffstageDiscoLighting';
  scene.add(rig);
  rig.add(new AmbientLight('#9382c7', 0.55));
  const key = new DirectionalLight('#ffe5bf', 1.65);
  key.position.set(3, 7, 5);
  rig.add(key);
  const spots = [
    { color: '#ff4aa9', x: -8, z: 3, phase: 0 },
    { color: '#43d8ff', x: 7, z: -4, phase: 2.1 },
    { color: '#b294ff', x: -2, z: -6, phase: 4.2 },
  ].map(({ color, x, z, phase }) => {
    const light = new SpotLight(color, 180, 32, Math.PI / 7, 0.7, 2);
    light.position.set(x, 10, z);
    light.name = `DiscoSpot:${color}`;
    rig.add(light, light.target);
    return { light, phase };
  });
  // One instanced draw for soft floor glints, rather than dozens of extra lights.
  const geometry = new CircleGeometry(1, 8);
  const material = new MeshBasicMaterial({
    color: '#b9e9ff',
    transparent: true,
    opacity: 0.18,
    blending: AdditiveBlending,
    depthWrite: false,
  });
  const glints = new InstancedMesh(geometry, material, 36);
  glints.name = 'MirrorBallReflections';
  glints.frustumCulled = false;
  rig.add(glints);
  const dot = new Object3D();
  function update(elapsed: number, reducedMotion: boolean) {
    const time = reducedMotion ? 0 : elapsed;
    for (const { light, phase } of spots) {
      light.target.position.set(
        Math.sin(time * 0.17 + phase) * 7,
        1.1,
        Math.cos(time * 0.13 + phase) * 4 - 1,
      );
    }
    for (let i = 0; i < glints.count; i++) {
      const angle = i * 2.39996 + time * 0.045;
      const radius = 3.8 + (i % 9) * 0.75;
      dot.position.set(
        Math.cos(angle) * radius,
        0.032,
        Math.sin(angle) * radius - 1.8,
      );
      dot.rotation.set(-Math.PI / 2, 0, angle);
      const size = 0.06 + (i % 4) * 0.02;
      dot.scale.set(size, size * 1.8, 1);
      dot.updateMatrix();
      glints.setMatrixAt(i, dot.matrix);
    }
    glints.instanceMatrix.needsUpdate = true;
  }
  update(0, false);
  return {
    update,
    dispose() {
      geometry.dispose();
      material.dispose();
      glints.dispose();
      scene.remove(rig);
    },
  };
}
