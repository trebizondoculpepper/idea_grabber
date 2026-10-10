# Sound-effects mission intake

User request: “Did you get the sound effects? Forget about the music, set up a mission to intrgrate the sound effects as the machines and characters move”.

This records the intake and existing evidence; specification approval is pending.

Sources: `assets/audio/inventory.json`, `assets/audio/sources/`, `docs/sound-effects.md`, and `docs/resource-credits.json`. There are 449 validated local audio files; final cue selection and editing remain to be done.

Proposed cues: distinct Coinie/Bulbee speech bursts, coin insertion, claw motor and grip/release clicks, chute drop, capsule rolling and rack arrival, overflow ejection, Coinie footsteps/jump/smoke, and UI feedback. Reveal and manual discard cues depend on whether those interactions exist when implementation begins. Cabinet hum is optional after balancing the rest of the soundscape.

Behaviour to confirm: cue timing follows animation events and contacts; loops end with movement; dialogue chatter ends when speech hides or changes; repeated updates do not duplicate one-shots; mute, initial browser audio unlock, reduced-motion timing, backgrounding and cleanup are handled. New-game initial speech before audio unlock should not produce a delayed burst of stale speech.

Keep only chosen game-ready clips in shipped assets. Record exact original files, edits, creators and licences in the resource register. CC BY Talking Synthesizer requires attribution if chosen. Preserve required notices for all selected material.

Music and credits-page implementation are outside this mission. No soundtrack production is requested.
