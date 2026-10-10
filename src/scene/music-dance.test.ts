import { expect, it } from 'vitest';
import { Group } from 'three';
import { beatPose, createMusicDance } from './music-dance';

it('bounces once per beat and alternates sway across two beats', () => {
  expect(beatPose(0, true).bounce).toBe(0);
  expect(beatPose(0.5, true).bounce).toBe(1);
  expect(beatPose(1, true).bounce).toBe(0);
  expect(beatPose(0.5, true).sway).toBe(1);
  expect(beatPose(1.5, true).sway).toBe(-1);
  expect(beatPose(null, true)).toEqual(beatPose(1, false));
});

it('restores gameplay transforms without accumulating dance or changing cabinet placement', () => {
  const scene = new Group();
  const cabinet = new Group();
  cabinet.name = 'ArcadeCabinet:test';
  cabinet.position.set(4, 2, 6);
  cabinet.rotation.y = 0.75;
  scene.add(cabinet);
  const dance = createMusicDance(scene);
  for (let i = 0; i < 10; i++) {
    dance.update(0.5, true, []);
    expect(cabinet.position.y).toBeGreaterThan(2);
    dance.restore();
    expect(cabinet.position.toArray()).toEqual([4, 2, 6]);
    expect(cabinet.scale.toArray()).toEqual([1, 1, 1]);
    expect(cabinet.rotation.y).toBe(0.75);
  }
  dance.update(0.5, false, []);
  expect(cabinet.position.y).toBe(2);
});
