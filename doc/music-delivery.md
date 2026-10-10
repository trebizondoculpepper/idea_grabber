# Music delivery proposal

The generation brief is [prompts/music-generation.md](prompts/music-generation.md). It requests twenty 20–40 second chiptune renditions, each covering one famous game theme, drawing on the 1980s–1990s range represented by OutRun, Zelda and Frogger. Shuffled playback of these separate renditions creates the medley.

Use MP3 at 192 kbps stereo for the initial web release. Keep lossless WAV masters outside `public/` for editing and later re-encoding. A 30-second MP3 is about 720 KB; twenty average-length tracks total roughly 14.4 MB, excluding metadata. Load the current track and preload the next rather than downloading the entire bank at startup. Opus can be a later smaller alternative, with a supported container and MP3 fallback if needed. Browser codec/container support matters separately from the musical style. [MDN audio codec guide](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/Audio_codecs)

Files in `public/audio/bgm/` will be served as static assets. Resolve the manifest and tracks using Vite's deployed base URL. The proposed manifest identifies tracks and gives measured duration, tempo, source game/theme and filenames. Files in `assets/audio-masters/bgm/` are editing sources and are not copied into the public build.

The future BGM player should:

1. Unlock sound through a player gesture, such as the first Coinie click or a dedicated sound button. Coinie's automatic entrance cannot reliably unlock audible autoplay. Handle a rejected play request gracefully. [MDN autoplay guide](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay)
2. Shuffle a bag of twenty tracks, playing each once before refilling it; avoid repeating the last track at the start of the next bag.
3. Use two reusable HTML audio elements, one playing and one preparing the next track. Route them through Web Audio gain nodes to crossfade over about 0.75 seconds. A media element can feed Web Audio for processing. [MDN MediaElementAudioSourceNode](https://developer.mozilla.org/en-US/docs/Web/API/MediaElementAudioSourceNode)
4. Advance by musical snippet, independently of the claw cycle. A BGM change should not restart when Coinie is clicked or when a ball lands.
5. Provide mute and music volume, remembering the preference. Keep a separate sound-effects bus so future voices and machine sounds can be balanced independently.
6. Pause in a hidden tab and resume its current track on return. If a file fails to load, skip it and continue; avoid an endless retry loop if the whole bank is unavailable.

MP3 is compressed delivery audio. WAV is an editing master. MIDI describes notes and instruments and would need a synthesiser to become audible; it is optional source material, not the recommended initial playback format. Chiptune describes the sound and arrangement, not a requirement to export low-rate or low-bit-depth audio.

This is a delivery proposal and generation handoff. The music player and audio files have not yet been implemented/generated.
