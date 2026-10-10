import type { SoundCue, Voice } from './sound-director';

const sounds: Record<SoundCue, { files: string[]; gain: number }> = {
  coin: { files: ['coin'], gain: 0.55 },
  jump: { files: ['jump'], gain: 0.3 },
  puff: { files: ['puff'], gain: 0.18 },
  grip: { files: ['grip'], gain: 0.35 },
  release: { files: ['release'], gain: 0.3 },
  drop: { files: ['drop'], gain: 0.5 },
  eject: { files: ['eject'], gain: 0.35 },
  plop: { files: ['plop'], gain: 0.45 },
  rack: { files: ['rack-1', 'rack-2'], gain: 0.55 },
  step: { files: ['step-1', 'step-2'], gain: 0.15 },
  click: { files: ['click'], gain: 0.25 },
  coinie: {
    files: ['coinie-1', 'coinie-2', 'coinie-3', 'coinie-4'],
    gain: 0.4,
  },
  bulbee: {
    files: ['bulbee-1', 'bulbee-2', 'bulbee-3', 'bulbee-4'],
    gain: 0.4,
  },
  motor: { files: ['motor'], gain: 0.1 },
  rolling: { files: ['rolling'], gain: 0.2 },
  hum: { files: ['hum'], gain: 0.025 },
};

interface PlayingSound {
  source: AudioBufferSourceNode;
  gain: GainNode;
  cue: SoundCue;
}

export function createSoundPlayer() {
  let context: AudioContext | undefined;
  let master: GainNode | undefined;
  let loading: Promise<void> | undefined;
  let disposed = false;
  let muted = false;
  const buffers = new Map<string, AudioBuffer>();
  const playing = new Set<PlayingSound>();
  const loops = new Map<SoundCue, PlayingSound>();
  const variants = new Map<SoundCue, number>();
  const abort = new AbortController();
  // Fetch before the first interaction, but create/resume Web Audio only in a gesture.
  const downloads = Object.values(sounds)
    .flatMap(({ files }) => files)
    .map(async (file) => {
      try {
        const response = await fetch(
          `${import.meta.env.BASE_URL}audio/sfx/${file}.mp3`,
          { signal: abort.signal },
        );
        if (!response.ok) return undefined;
        return { file, bytes: await response.arrayBuffer() };
      } catch {
        return undefined;
      }
    });

  function stop(sound: PlayingSound) {
    if (!playing.delete(sound)) return;
    sound.source.onended = null;
    sound.source.stop();
    sound.source.disconnect();
    sound.gain.disconnect();
  }
  function stopAll() {
    for (const sound of playing) stop(sound);
    loops.clear();
  }
  function start(cue: SoundCue, loop = false) {
    if (!context || !master || muted || disposed || context.state !== 'running')
      return undefined;
    const definition = sounds[cue];
    const index = variants.get(cue) ?? 0;
    const buffer = buffers.get(
      definition.files[index % definition.files.length],
    );
    if (!buffer) return undefined;
    variants.set(cue, index + 1);
    const source = context.createBufferSource();
    const gain = context.createGain();
    source.buffer = buffer;
    source.loop = loop;
    gain.gain.value = definition.gain;
    source.connect(gain).connect(master);
    const sound = { source, gain, cue };
    playing.add(sound);
    source.onended = () => {
      playing.delete(sound);
      source.disconnect();
      gain.disconnect();
    };
    source.start();
    return sound;
  }
  return {
    get loadedClips() {
      return buffers.size;
    },
    get activeCues() {
      return [...playing].map((sound) => sound.cue);
    },
    get audible() {
      return (
        !disposed && !muted && context?.state === 'running' && buffers.size > 0
      );
    },
    get muted() {
      return muted;
    },
    async unlock() {
      if (disposed) return;
      try {
        if (!context) {
          context = new AudioContext();
          master = context.createGain();
          master.gain.value = muted ? 0 : 0.8;
          master.connect(context.destination);
          const decodingContext = context;
          loading = Promise.all(
            downloads.map(async (download) => {
              const data = await download;
              if (!data || disposed) return;
              try {
                const buffer = await decodingContext.decodeAudioData(
                  data.bytes,
                );
                if (!disposed) buffers.set(data.file, buffer);
              } catch {
                /* One bad clip must not disable the game or other sounds. */
              }
            }),
          ).then(() => undefined);
        }
        await context.resume();
        await loading;
      } catch {
        /* Audio is optional when unavailable or blocked by the browser. */
      }
    },
    play(cue: SoundCue) {
      start(cue);
    },
    setLoops(cues: SoundCue[]) {
      for (const [cue, sound] of loops) {
        if (!cues.includes(cue)) {
          stop(sound);
          loops.delete(cue);
        }
      }
      for (const cue of cues) {
        if (!loops.has(cue)) {
          const sound = start(cue, true);
          if (sound) loops.set(cue, sound);
        }
      }
    },
    stopVoice(voice: Voice) {
      for (const sound of playing) if (sound.cue === voice) stop(sound);
    },
    setMuted(value: boolean) {
      muted = value;
      if (master) master.gain.value = muted ? 0 : 0.8;
      if (muted) stopAll();
    },
    pause() {
      stopAll();
      if (context && context.state !== 'closed')
        void context.suspend().catch(() => undefined);
    },
    dispose() {
      disposed = true;
      abort.abort();
      stopAll();
      buffers.clear();
      if (context && context.state !== 'closed')
        void context.close().catch(() => undefined);
    },
  };
}
