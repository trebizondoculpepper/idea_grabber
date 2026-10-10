import { PerspectiveCamera, WebGLRenderer } from 'three';
import { createScene } from '../scene/create-scene';
import { ps1Uniforms } from './ps1-material';

export function startScene(canvas: HTMLCanvasElement) {
  const renderer = new WebGLRenderer({ canvas, antialias: false });
  renderer.setPixelRatio(1);
  const camera = new PerspectiveCamera(40, 1, 0.1, 250);
  camera.position.set(4, 3, 6);
  camera.lookAt(0, 1, 0);
  const world = createScene();
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let elapsed = 0;
  let lastTime: number | undefined;
  let sampleStart: number | undefined;
  let frames = 0;
  let renderMilliseconds = 0;
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
      Math.atan2(4, 6) +
      (Math.sin((elapsed * Math.PI * 2) / 48) * Math.PI) / 32;
    const radius = Math.hypot(4, 6);
    camera.position.set(Math.sin(angle) * radius, 3, Math.cos(angle) * radius);
    camera.lookAt(0, 1, 0);
    ps1Uniforms.snapPixels.value = reducedMotion.matches ? 0 : 1;
    world.update(elapsed);
    const renderStart = performance.now();
    renderer.render(world.scene, camera);
    if (reportPerformance) {
      renderMilliseconds += performance.now() - renderStart;
      frames += 1;
      sampleStart ??= time;
      if (time - sampleStart >= 2000) {
        canvas.dataset.fps = (
          ((frames - 1) * 1000) /
          (time - sampleStart)
        ).toFixed(1);
        canvas.dataset.renderMs = (renderMilliseconds / frames).toFixed(2);
        canvas.dataset.drawCalls = String(renderer.info.render.calls);
        canvas.dataset.triangles = String(renderer.info.render.triangles);
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
    world.dispose();
    renderer.dispose();
  };
}
