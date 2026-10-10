# Sound integration plan

User override: perform work on `main`; no branch/worktree creation. Music and full credits-page UI are excluded.

IC-01: Keep sound selection/lifecycle separate from scene geometry. A pure director translates current phase/progress, rack landings and speech keys into contact cues, loop targets and bounded voice bursts. Rendering passes state after updating animation and speech.

IC-02: A Web Audio player prefetches compact MP3 clips, creates/resumes its context on interaction, decodes independently, alternates variants, tracks nodes and stops loops/voices on mute, backgrounding and disposal. Binding owns event listeners and the persistent mute control. Missing audio is nonfatal.

IC-03: Rebuild chosen clips reproducibly from downloaded sources with ffmpeg. Keep the complete library outside public assets. Include a source/edit manifest and licences in shipped assets and update the resource register. Existing movement thresholds: drop 0.65, grip 0.75, ejection contact 0.3, rack contact on landing count change.

Validation: pure timing/lifecycle tests, mocked backend tests, typecheck, lint/build, clip decoding checks and Chrome smoke test. Listen and refine the mix based on user feedback. No new gameplay interactions.
