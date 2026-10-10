import { Raycaster, Vector2 } from 'three';
import type { PerspectiveCamera } from 'three';
import type { createScene } from '../scene/create-scene';

export function bindCoinieInput(
  canvas: HTMLCanvasElement,
  camera: PerspectiveCamera,
  world: ReturnType<typeof createScene>,
) {
  const raycaster = new Raycaster();
  const pointer = new Vector2();
  const button = document.querySelector<HTMLButtonElement>('#insert-coinie');
  const announcement = document.querySelector<HTMLElement>('#coinie-status');
  let lastPhase = world.coiniePhase;
  let lastPointer: { x: number; y: number } | undefined;

  function hitCoinie(x: number, y: number) {
    if (!world.canInsertCoinie) return false;
    const bounds = canvas.getBoundingClientRect();
    if (bounds.width === 0 || bounds.height === 0) return false;
    pointer.set(
      ((x - bounds.left) / bounds.width) * 2 - 1,
      (-(y - bounds.top) / bounds.height) * 2 + 1,
    );
    raycaster.setFromCamera(pointer, camera);
    return raycaster.intersectObject(world.coinie, true).length > 0;
  }
  const insert = () => {
    world.activateCoinie();
  };
  const click = (event: MouseEvent) => {
    if (event.button === 0 && hitCoinie(event.clientX, event.clientY)) insert();
  };
  const move = (event: PointerEvent) => {
    lastPointer = { x: event.clientX, y: event.clientY };
  };
  const leave = () => {
    lastPointer = undefined;
    canvas.style.cursor = '';
  };
  canvas.addEventListener('click', click);
  canvas.addEventListener('pointermove', move);
  canvas.addEventListener('pointerleave', leave);
  button?.addEventListener('click', insert);

  return {
    update() {
      canvas.dataset.coinieState = world.coiniePhase;
      canvas.dataset.trayCount = String(world.trayCount);
      canvas.dataset.coinieGeneration = String(world.coinieGeneration);
      if (button) button.disabled = !world.canInsertCoinie;
      if (lastPointer)
        canvas.style.cursor = hitCoinie(lastPointer.x, lastPointer.y)
          ? 'pointer'
          : '';
      if (lastPhase !== world.coiniePhase) {
        if (announcement)
          announcement.textContent =
            world.coiniePhase === 'jumping'
              ? 'Coinie is jumping into the coin slot.'
              : world.coiniePhase === 'walking'
                ? 'A new Coinie is walking in from the right.'
                : world.coiniePhase !== 'ready'
                  ? `The claw machine is ${world.coiniePhase}.`
                  : world.canInsertCoinie
                    ? 'Coinie is ready. Click him to insert another coin.'
                    : 'The ball tray is full.';
        lastPhase = world.coiniePhase;
      }
    },
    dispose() {
      canvas.removeEventListener('click', click);
      canvas.removeEventListener('pointermove', move);
      canvas.removeEventListener('pointerleave', leave);
      button?.removeEventListener('click', insert);
      canvas.style.cursor = '';
    },
  };
}
