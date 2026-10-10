import { afterEach, expect, it, vi } from 'vitest';
import { createSoundPlayer } from './sound-player';

function audioEnvironment(failingFile = '') {
  const nodes: {
    start: ReturnType<typeof vi.fn>;
    stop: ReturnType<typeof vi.fn>;
  }[] = [];
  const instances: FakeContext[] = [];
  class FakeContext {
    state = 'suspended';
    destination = {};
    constructor() {
      instances.push(this);
    }
    resume = vi.fn(async () => {
      this.state = 'running';
    });
    suspend = vi.fn(async () => {
      this.state = 'suspended';
    });
    close = vi.fn(async () => {
      this.state = 'closed';
    });
    decodeAudioData = vi.fn(async () => ({}));
    createGain() {
      return { gain: { value: 0 }, connect: vi.fn(), disconnect: vi.fn() };
    }
    createBufferSource() {
      const node = {
        start: vi.fn(),
        stop: vi.fn(),
        disconnect: vi.fn(),
        connect: vi.fn((gain) => gain),
        onended: null,
      };
      nodes.push(node);
      return node;
    }
  }
  vi.stubGlobal('AudioContext', FakeContext);
  vi.stubGlobal(
    'fetch',
    vi.fn(async (url: string) => ({
      ok: !failingFile || !url.includes(failingFile),
      arrayBuffer: async () => new ArrayBuffer(8),
    })),
  );
  return { nodes, instances };
}

afterEach(() => vi.unstubAllGlobals());

it('waits for a gesture and does not create duplicate loops on repeated frames', async () => {
  const { nodes, instances } = audioEnvironment();
  const player = createSoundPlayer();
  expect(instances).toHaveLength(0);
  expect(player.audible).toBe(false);
  await player.unlock();
  player.setLoops(['motor', 'rolling']);
  player.setLoops(['motor', 'rolling']);
  expect(nodes).toHaveLength(2);
  player.setLoops(['motor']);
  expect(nodes[1].stop).toHaveBeenCalledOnce();
  player.setLoops([]);
  expect(nodes[0].stop).toHaveBeenCalledOnce();
  player.dispose();
});

it('mute, backgrounding and disposal stop active audio and release the context', async () => {
  const { nodes, instances } = audioEnvironment();
  const player = createSoundPlayer();
  await player.unlock();
  player.play('coinie');
  player.setLoops(['motor']);
  player.setMuted(true);
  expect(nodes.every((node) => node.stop.mock.calls.length === 1)).toBe(true);
  player.play('rack');
  expect(nodes).toHaveLength(2);
  player.setMuted(false);
  player.setLoops(['rolling']);
  player.pause();
  expect(nodes[2].stop).toHaveBeenCalledOnce();
  await player.unlock();
  player.play('bulbee');
  player.stopVoice('bulbee');
  expect(nodes[3].stop).toHaveBeenCalledOnce();
  player.dispose();
  await player.unlock();
  expect(instances).toHaveLength(1);
  expect(instances[0].close).toHaveBeenCalledOnce();
  expect(player.audible).toBe(false);
});

it('continues playing other cues when a clip download fails', async () => {
  const { nodes } = audioEnvironment('motor.mp3');
  const player = createSoundPlayer();
  await player.unlock();
  player.setLoops(['motor']);
  player.play('rack');
  expect(nodes).toHaveLength(1);
  player.dispose();
});

it('remains silent when Web Audio is unavailable', async () => {
  audioEnvironment();
  vi.stubGlobal('AudioContext', undefined);
  const player = createSoundPlayer();
  await expect(player.unlock()).resolves.toBeUndefined();
  expect(player.audible).toBe(false);
  player.play('coin');
  player.dispose();
});
