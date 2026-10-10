import { PerspectiveCamera, WebGLRenderer } from 'three';
import { createScene } from '../scene/create-scene';

export function startScene(canvas: HTMLCanvasElement) {
  const renderer = new WebGLRenderer({ canvas, antialias: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  const camera = new PerspectiveCamera(40, 1, 0.1, 250);
  camera.position.set(4, 3, 6);
  camera.lookAt(0, 1, 0);
  const world = createScene();
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let elapsed = 0;
  let lastTime: number | undefined;

  const resize = () => {
    const { width, height } = canvas.getBoundingClientRect();
    if (width === 0 || height === 0) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.render(world.scene, camera);
  };
  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  resize();

  const resetTime = () => {
    lastTime = undefined;
  };
  document.addEventListener('visibilitychange', resetTime);
  renderer.setAnimationLoop((time) => {
    if (document.hidden) return;
    const delta =
      lastTime === undefined ? 0 : Math.min((time - lastTime) / 1000, 0.1);
    lastTime = time;
    if (!reducedMotion.matches) elapsed += delta;
    world.update(elapsed);
    renderer.render(world.scene, camera);
  });

  return () => {
    renderer.setAnimationLoop(null);
    observer.disconnect();
    document.removeEventListener('visibilitychange', resetTime);
    world.dispose();
    renderer.dispose();
  };
}
