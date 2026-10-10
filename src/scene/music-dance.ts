import type { Object3D } from 'three';

export function beatPose(beats: number | null, enabled: boolean) {
  if (!enabled || beats === null) return { bounce: 0, squash: 0, sway: 0 };
  const phase = beats * Math.PI * 2;
  return {
    bounce: (1 - Math.cos(phase)) / 2,
    squash: Math.cos(phase),
    sway: Math.sin(beats * Math.PI),
  };
}

/** Restore the gameplay pose before each update; layer dancing on top afterwards. */
export function createMusicDance(scene: Object3D) {
  const cabinets: Object3D[] = [];
  scene.traverse((object) => {
    if (
      object.name === 'IdeaGrabberMachine' ||
      object.name.startsWith('ArcadeCabinet:')
    )
      cabinets.push(object);
  });
  const saved = new Map<
    Object3D,
    { y: number; z: number; scale: Object3D['scale'] }
  >();
  function restore() {
    for (const [object, pose] of saved) {
      object.position.y = pose.y;
      object.rotation.z = pose.z;
      object.scale.copy(pose.scale);
    }
    saved.clear();
  }
  return {
    restore,
    update(
      beats: number | null,
      enabled: boolean,
      heroes: readonly Object3D[],
    ) {
      if (!enabled || beats === null) return;
      for (const object of [...cabinets, ...heroes]) {
        if (!object.visible) continue;
        // A small, stable lead/lag keeps the shared tempo without lockstep motion.
        let seed = 0;
        for (const letter of object.name)
          seed = (seed * 31 + letter.charCodeAt(0)) >>> 0;
        const offset = ((seed % 101) / 100 - 0.5) * 0.24;
        const tempo = object.name === 'IdeaGrabberMachine' ? beats / 4 : beats;
        const pose = beatPose(tempo + offset, enabled);
        saved.set(object, {
          y: object.position.y,
          z: object.rotation.z,
          scale: object.scale.clone(),
        });
        const hero = heroes.includes(object);
        const strength = hero
          ? 1
          : object.name === 'IdeaGrabberMachine'
            ? 0.28
            : 0.09;
        object.position.y += pose.bounce * 0.06 * strength;
        object.rotation.z += pose.sway * 0.04 * strength;
        object.scale.x *= 1 + pose.squash * 0.025 * strength;
        object.scale.y *= 1 - pose.squash * 0.025 * strength;
        if (hero) {
          const left = object.getObjectByName('LeftArm');
          const right = object.getObjectByName('RightArm');
          if (left) left.rotation.z += pose.sway * 0.12;
          if (right) right.rotation.z -= pose.sway * 0.12;
        }
      }
    },
  };
}
