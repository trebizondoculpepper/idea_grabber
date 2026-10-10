import { PerspectiveCamera, WebGLRenderer } from 'three';
import { createScene } from '../scene/create-scene';
import { ps1Uniforms } from './ps1-material';
import { bindCoinieSpeech } from '../ui/coinie-speech';
import { bindBulbeeSpeech } from '../ui/bulbee-speech';
import { bindCoinieInput } from '../input/coinie-input';
import { bindSound } from '../audio/bind-sound';
import { createMusicDance } from '../scene/music-dance';

export function startScene(canvas: HTMLCanvasElement) {
  const renderer = new WebGLRenderer({ canvas, antialias: false });
  renderer.setPixelRatio(1);
  const camera = new PerspectiveCamera(40, 1, 0.1, 100);
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
  const dance = createMusicDance(world.scene);
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
    ps1Uniforms.snapPixels.value = reducedMotion.matches ? 0 : 1;
    dance.restore();
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
    camera.updateMatrixWorld();
    input.update();
    speech.update(delta);
    coinieSpeech.update(delta);
    sound.update(
      {
        phase: world.coiniePhase,
        progress: world.coinieProgress,
        landings: world.landings,
        coinieSpeech: coinieSpeech.speechKey,
        bulbeeSpeech: speech.speechKey,
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
    world.dispose();
    renderer.dispose();
  };
}
