import { BoxGeometry, Color, Mesh, MeshBasicMaterial, PointLight } from 'three';
import type { Object3D } from 'three';

const hues = ['#ff38a8', '#20dccc', '#ffdf20', '#a070ff'].map(
  (hex) => new Color(hex),
);

function hueAt(position: number, target: Color) {
  const index = Math.floor(position) % hues.length;
  return target.lerpColors(
    hues[index],
    hues[(index + 1) % hues.length],
    position - Math.floor(position),
  );
}

/** Coloured lights chasing around inside the claw cabinet, with visible bulbs. */
export function createMachineLighting(machine: Object3D) {
  const lights = [
    { x: -1.9, y: 4.6, z: 0.9, offset: 0 },
    { x: -0.4, y: 3.1, z: 1.1, offset: 1.33 },
    { x: 1.1, y: 4.6, z: 0.9, offset: 2.67 },
  ].map(({ x, y, z, offset }, index) => {
    const light = new PointLight(hues[index], 14, 6, 1.4);
    light.name = `CabinetLight${index + 1}`;
    light.position.set(x, y, z);
    machine.add(light);
    return { light, offset };
  });
  const bulbGeometry = new BoxGeometry(0.2, 0.14, 0.12);
  // Two columns of bulbs run up the inside of the front posts, framing the window.
  const bulbs = Array.from({ length: 14 }, (_, index) => {
    const bulb = new Mesh(bulbGeometry, new MeshBasicMaterial());
    bulb.name = `CabinetBulb${index + 1}`;
    const column = index < 7 ? 0 : 1;
    const row = index % 7;
    bulb.position.set(column ? 1.28 : -2.36, 1.95 + row * 0.52, 1.5);
    machine.add(bulb);
    return bulb;
  });
  function update(elapsed: number, reducedMotion: boolean) {
    const time = reducedMotion ? 0 : elapsed * 0.6;
    for (const { light, offset } of lights) {
      hueAt(time + offset, light.color);
      light.intensity = reducedMotion
        ? 6
        : 5 + Math.sin(elapsed * 3 + offset * 2) * 1.5;
    }
    bulbs.forEach((bulb, index) => {
      hueAt(
        time * 2 + (index % 7) * 0.5,
        (bulb.material as MeshBasicMaterial).color,
      );
    });
  }
  update(0, false);
  return {
    update,
    dispose() {
      lights.forEach(({ light }) => machine.remove(light));
      bulbs.forEach((bulb) => {
        machine.remove(bulb);
        (bulb.material as MeshBasicMaterial).dispose();
      });
      bulbGeometry.dispose();
    },
  };
}
