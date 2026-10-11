import { PerspectiveCamera, Vector2, Vector3, WebGLRenderer } from 'three';
import { createCameraDirector } from './camera-director';
import { bindSocialShare } from '../ui/social-share';
import { createScene } from '../scene/create-scene';
import { ps1Uniforms } from './ps1-material';
import { bindCoinieSpeech } from '../ui/coinie-speech';
import { bindBulbeeSpeech } from '../ui/bulbee-speech';
import { bindCoinieInput } from '../input/coinie-input';
import { bindSound } from '../audio/bind-sound';
import { createRackHumour } from '../game/rack-humour';
import { createMusicDance } from '../scene/music-dance';

// Magnify the original 40-degree view by 7% while retaining its position.
const defaultFov =
  (Math.atan(Math.tan((20 * Math.PI) / 180) / 1.07) * 360) / Math.PI;

export function startScene(canvas: HTMLCanvasElement) {
  const renderer = new WebGLRenderer({ canvas, antialias: false });
  renderer.setPixelRatio(1);
  const camera = new PerspectiveCamera(defaultFov, 1, 0.1, 100);
  camera.position.set(7, 6, 11);
  camera.lookAt(0, 2.85, 0);
  const world = createScene();
  if (import.meta.env.DEV) {
    const names: string[] = [];
    world.scene.traverse((object) => {
      if (object.name) names.push(object.name);
    });
    canvas.dataset.sceneGraph = JSON.stringify(names);
  }
  const input = bindCoinieInput(canvas, camera, world);
  const speech = bindBulbeeSpeech(canvas, camera, world);
  const coinieSpeech = bindCoinieSpeech(canvas, camera, world);
  const sound = bindSound();
  const humour = createRackHumour();
  const dance = createMusicDance(world.scene);
  const cameraDirector = createCameraDirector();
  const shotTarget = new Vector3();
  const share = bindSocialShare(
    () => {
      const size = renderer.getSize(new Vector2());
      const position = camera.position.clone();
      const quaternion = camera.quaternion.clone();
      const aspect = camera.aspect;
      const fov = camera.fov;
      const resolution = ps1Uniforms.resolution.value.clone();
      const snapshot = document.createElement('canvas');
      snapshot.width = 1200;
      snapshot.height = 900;
      try {
        renderer.setSize(1200, 900, false);
        ps1Uniforms.resolution.value.set(1200, 900);
        camera.aspect = 4 / 3;
        camera.fov = defaultFov;
        camera.position.set(7, 6, 11);
        camera.lookAt(0, 2.85, 0);
        camera.updateProjectionMatrix();
        renderer.render(world.scene, camera);
        snapshot.getContext('2d')!.drawImage(canvas, 0, 0);
      } finally {
        camera.position.copy(position);
        camera.quaternion.copy(quaternion);
        camera.aspect = aspect;
        camera.fov = fov;
        camera.updateProjectionMatrix();
        ps1Uniforms.resolution.value.copy(resolution);
        renderer.setSize(size.x, size.y, false);
        renderer.render(world.scene, camera);
      }
      return snapshot;
    },
    () => world.ingredients,
    () => world.canInsertCoinie && world.trayCount > 0,
  );
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let elapsed = 0;
  let lastTime: number | undefined;
  let sampleStart: number | undefined;
  let frames = 0;
  let renderMilliseconds = 0;
  let longSampleStart: number | undefined;
  let longSampleFrames = 0;
  const showPerformanceTitle = new URLSearchParams(location.search).has('perf');
  const reportPerformance =
    import.meta.env.DEV || new URLSearchParams(location.search).has('perf');

  const resize = () => {
    const { width, height } = canvas.getBoundingClientRect();
    if (width === 0 || height === 0) return;
    // Keep the scene within a 640 × 480 pixel budget; CSS enlarges it without smoothing.
    const scale = Math.min(640 / width, 480 / height, 1);
    const renderWidth = Math.max(1, Math.round(width * scale));
    const renderHeight = Math.max(1, Math.round(height * scale));
    renderer.setSize(renderWidth, renderHeight, false);
    ps1Uniforms.resolution.value.set(renderWidth, renderHeight);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.render(world.scene, camera);
  };
  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  resize();

  const resetTime = () => {
    lastTime = undefined;
    sampleStart = undefined;
    frames = 0;
    renderMilliseconds = 0;
    longSampleStart = undefined;
    longSampleFrames = 0;
  };
  document.addEventListener('visibilitychange', resetTime);
  renderer.setAnimationLoop((time) => {
    if (document.hidden) return;
    const delta =
      lastTime === undefined ? 0 : Math.min((time - lastTime) / 1000, 0.1);
    lastTime = time;
    if (!reducedMotion.matches) elapsed += delta;
    // 11.25 degrees total across a slow 48-second back-and-forth arc.
    const angle =
      Math.atan2(7, 11) +
      (Math.sin((elapsed * Math.PI * 2) / 48) * Math.PI) / 32;
    const radius = Math.hypot(7, 11) * Math.max(1, 1.25 / camera.aspect);
    camera.position.set(
      Math.sin(angle) * radius,
      2.85 + radius * 0.24,
      Math.cos(angle) * radius,
    );
    camera.lookAt(0, 2.85, 0);
    camera.fov = defaultFov;
    ps1Uniforms.snapPixels.value = reducedMotion.matches ? 0 : 1;
    dance.restore();
    world.setTalking(speech.talking, coinieSpeech.talking);
    world.update(elapsed, delta, reducedMotion.matches);
    const music = sound.musicTiming;
    dance.update(
      music.beats,
      music.playing && !sound.diagnostics.muted && !reducedMotion.matches,
      world.coiniePhase === 'ready'
        ? [world.bulbee, world.coinie]
        : [world.bulbee],
    );
    world.scene.updateMatrixWorld();
    const shot = cameraDirector.update(
      delta,
      reducedMotion.matches,
      world.canInsertCoinie,
      world.coiniePhase,
      world.passerBy !== undefined,
    );
    const framing = Math.max(1, 1 / camera.aspect);
    if (shot !== 'default') {
      if (shot === 'passerby' && world.passerBy) {
        world.passerBy.getWorldPosition(shotTarget);
        shotTarget.y += 1.2;
        // Keep the camera in place and pan its gaze with the passing character.
        camera.position.set(3 * framing, 3.2 * framing, 14 * framing);
        camera.fov = 36;
      } else if (shot === 'claw') {
        world.scene.getObjectByName('Claw')!.getWorldPosition(shotTarget);
        shotTarget.y -= 0.4;
        camera.position
          .copy(shotTarget)
          .add(new Vector3(1.6, 0.8, 2.8).multiplyScalar(framing));
        camera.fov = 34;
      } else if (shot === 'bulbee' || shot === 'coinie') {
        const hero = shot === 'bulbee' ? world.bulbee : world.coinie;
        if (shot === 'coinie')
          hero.getObjectByName('Body')!.getWorldPosition(shotTarget);
        else {
          hero.getWorldPosition(shotTarget);
          shotTarget.y += 1.4;
        }
        camera.position
          .copy(shotTarget)
          .add(new Vector3(2, 0.6, 4.2).multiplyScalar(framing));
        camera.fov = 36;
      } else if (shot === 'feature') {
        if (
          world.trayCount > 0 ||
          world.coiniePhase === 'rolling' ||
          world.coiniePhase === 'ejecting'
        )
          shotTarget.set(0, 0.9, 1.97);
        else world.coinSlot.getWorldPosition(shotTarget);
        camera.position
          .copy(shotTarget)
          .add(new Vector3(3.2, 2.2, 4.5).multiplyScalar(framing));
        camera.fov = 34;
      } else if (shot === 'machine') {
        shotTarget.set(0, 3, 0);
        camera.position.set(5.2 * framing, 4.6 * framing, 8 * framing);
        camera.fov = 38;
      } else {
        camera.fov = 40;
        shotTarget.set(0, 2.85, 0);
      }
      camera.lookAt(shotTarget);
      if (shot === 'dutch') camera.rotateZ(0.12);
    }
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();
    if (import.meta.env.DEV) {
      canvas.dataset.cameraShot = shot;
      canvas.dataset.coinieJump = world.coinieJump;
    }
    share.update();
    input.update();
    speech.update(delta);
    coinieSpeech.update(delta, speech.talking);
    const joke = humour.update(
      delta,
      world.ingredients,
      world.coiniePhase === 'ready' &&
        world.canInsertCoinie &&
        !speech.busy &&
        !coinieSpeech.busy,
    );
    if (joke) {
      if (joke.speaker === 'bulbee') speech.say(joke.text);
      else coinieSpeech.say(joke.text);
    }
    sound.update(
      {
        phase: world.coiniePhase,
        progress: world.coinieProgress,
        landings: world.landings,
        coinieSpeech: coinieSpeech.speechKey,
        bulbeeSpeech: speech.speechKey,
        coinieTalking: coinieSpeech.talking,
        bulbeeTalking: speech.talking,
        reducedMotion: reducedMotion.matches,
      },
      delta,
    );
    if (import.meta.env.DEV)
      canvas.dataset.audio = JSON.stringify(sound.diagnostics);
    const renderStart = performance.now();
    renderer.render(world.scene, camera);
    if (reportPerformance) {
      renderMilliseconds += performance.now() - renderStart;
      frames += 1;
      longSampleFrames += 1;
      longSampleStart ??= time;
      if (time - longSampleStart >= 10000) {
        canvas.dataset.fps10 = (
          ((longSampleFrames - 1) * 1000) /
          (time - longSampleStart)
        ).toFixed(1);
        longSampleStart = time;
        longSampleFrames = 0;
      }
      sampleStart ??= time;
      if (time - sampleStart >= 2000) {
        canvas.dataset.fps = (
          ((frames - 1) * 1000) /
          (time - sampleStart)
        ).toFixed(1);
        canvas.dataset.renderMs = (renderMilliseconds / frames).toFixed(2);
        canvas.dataset.drawCalls = String(renderer.info.render.calls);
        canvas.dataset.triangles = String(renderer.info.render.triangles);
        if (showPerformanceTitle) {
          document.title = `Idea Grabber · ${canvas.dataset.fps} fps · 10s: ${canvas.dataset.fps10 ?? 'warming up'} · ${renderer.info.render.calls} draws`;
        }
        sampleStart = time;
        frames = 0;
        renderMilliseconds = 0;
      }
    }
  });

  return () => {
    renderer.setAnimationLoop(null);
    observer.disconnect();
    document.removeEventListener('visibilitychange', resetTime);
    input.dispose();
    speech.dispose();
    coinieSpeech.dispose();
    sound.dispose();
    share.dispose();
    world.dispose();
    renderer.dispose();
  };
}
