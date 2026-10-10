import type { Group, Mesh } from 'three';
import type { SceneKit } from './scene-kit';

type Eye = {
  x: number;
  y: number;
  rx: number;
  ry: number;
  tilt: number;
  pupil: { x: number; y: number; rx: number; ry: number };
};
export type FaceSpec = {
  eyes: [Eye, Eye];
  mouth: { x: number; y: number; width: number; height: number };
};

// Coordinates are measured from the original illustrations, in body-panel units.
export const faces: Record<'Bulbee' | 'Coinie', FaceSpec> = {
  Bulbee: {
    eyes: [
      {
        x: -0.232,
        y: 0.427,
        rx: 0.199,
        ry: 0.275,
        tilt: 17,
        pupil: { x: 0.071, y: -0.028, rx: 0.09, ry: 0.152 },
      },
      {
        x: 0.204,
        y: 0.488,
        rx: 0.204,
        ry: 0.261,
        tilt: 13,
        pupil: { x: 0.062, y: -0.019, rx: 0.09, ry: 0.142 },
      },
    ],
    mouth: { x: 0.014, y: -0.166, width: 0.796, height: 0.607 },
  },
  Coinie: {
    eyes: [
      {
        x: -0.312,
        y: 0.297,
        rx: 0.186,
        ry: 0.261,
        tilt: 17,
        pupil: { x: 0.06, y: -0.03, rx: 0.085, ry: 0.141 },
      },
      {
        x: 0.121,
        y: 0.362,
        rx: 0.191,
        ry: 0.241,
        tilt: 17,
        pupil: { x: 0.06, y: -0.025, rx: 0.085, ry: 0.131 },
      },
    ],
    mouth: { x: -0.04, y: -0.337, width: 0.8, height: 0.609 },
  },
};

const talkShapes = ['open', 'mid', 'oo', 'closed', 'grin', 'open', 'mid'];

/**
 * Paper-cut face layers floating just in front of the body: eyes that glance
 * and blink independently, and a mouth that flaps through shapes while talking.
 */
export function createFace(
  body: Group,
  kit: SceneKit,
  spec: FaceSpec,
  random = Math.random,
) {
  const face = kit.group(body, 'Face');
  const eyes = spec.eyes.map((eye, index) => {
    const socket = kit.group(face, `Eye${index + 1}`, eye.x, eye.y, 0.02);
    socket.rotation.z = (-eye.tilt * Math.PI) / 180;
    kit.panel(
      socket,
      'EyeWhite',
      [eye.rx * 2, eye.ry * 2],
      [0, 0, 0],
      kit.textured('face/eye-white', 1, 1, true),
    );
    const pupil = kit.panel(
      socket,
      'Pupil',
      [eye.pupil.rx * 2, eye.pupil.ry * 2],
      [eye.pupil.x, eye.pupil.y, 0.015],
      kit.textured('face/pupil', 1, 1, true),
    );
    return {
      socket,
      pupil,
      home: eye.pupil,
      range: [eye.rx - eye.pupil.rx - 0.03, eye.ry - eye.pupil.ry - 0.03],
      gaze: [eye.pupil.x, eye.pupil.y],
      target: [0.6, -0.2],
      glance: 0.5 + random() * 1.5,
      blink: -1,
    };
  });
  const mouth = kit.panel(
    face,
    'Mouth',
    [spec.mouth.width, spec.mouth.height],
    [spec.mouth.x, spec.mouth.y, 0.025],
    kit.textured('face/mouth-grin', 1, 1, true),
  ) as Mesh;
  let shape = 'grin';
  let flap = 0;
  let nextBlink = 1.5 + random() * 3;
  let last: number | undefined;

  function setShape(next: string) {
    if (next === shape) return;
    shape = next;
    mouth.material = kit.textured(`face/mouth-${shape}`, 1, 1, true);
  }

  return {
    get mouthShape() {
      return shape;
    },
    update(elapsed: number, talking: boolean, reducedMotion: boolean) {
      const delta = last === undefined ? 0 : Math.max(0, elapsed - last);
      last = elapsed;
      if (reducedMotion) {
        setShape('grin');
        return;
      }
      // Each eye glances on its own timer; often both follow the same new look.
      for (const eye of eyes) {
        eye.glance -= delta;
        if (eye.glance <= 0) {
          const target = [random() * 2 - 1, random() * 2 - 1];
          const shared = random() < 0.6;
          for (const other of shared ? eyes : [eye]) {
            other.target = target;
            other.glance = 0.4 + random() * 1.8;
          }
        }
        const goalX = eye.home.x * 0.3 + eye.target[0] * eye.range[0];
        const goalY = eye.home.y * 0.3 + eye.target[1] * eye.range[1];
        const snap = Math.min(1, delta * 18);
        eye.gaze[0] += (goalX - eye.gaze[0]) * snap;
        eye.gaze[1] += (goalY - eye.gaze[1]) * snap;
        eye.pupil.position.x = eye.gaze[0];
        eye.pupil.position.y = eye.gaze[1];
      }
      // Blink together, with the occasional one-eyed wink.
      nextBlink -= delta;
      if (nextBlink <= 0) {
        const wink = random() < 0.15;
        const which = Math.floor(random() * 2);
        eyes.forEach((eye, index) => {
          if (!wink || index === which) eye.blink = 0;
        });
        nextBlink = 2 + random() * 3.5;
      }
      for (const eye of eyes) {
        if (eye.blink < 0) continue;
        eye.blink += delta;
        eye.socket.scale.y =
          eye.blink >= 0.16
            ? 1
            : 1 - 0.9 * Math.sin((eye.blink / 0.16) * Math.PI);
        if (eye.blink >= 0.16) eye.blink = -1;
      }
      if (talking) {
        flap -= delta;
        if (flap <= 0) {
          const choices = talkShapes.filter((candidate) => candidate !== shape);
          setShape(choices[Math.floor(random() * choices.length)]);
          flap = 0.07 + random() * 0.07;
        }
      } else setShape('grin');
      // The face layers drift slightly against the body, like stacked paper.
      face.position.x = Math.sin(elapsed * 0.8) * 0.025;
      face.position.y = Math.sin(elapsed * 1.1) * 0.012;
    },
  };
}
