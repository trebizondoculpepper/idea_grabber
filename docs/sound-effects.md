# Sound effects shortlist

Researched 2026-10-10. Source packs have now been downloaded into `assets/audio/sources/`; individual cues have not yet been auditioned or integrated. The original shortlist below is CC0; the additional Talking Synthesizer alternative is CC BY 4.0 and requires credit. Keep the original licence alongside any downloaded files.

## Sources

- [Signature Sounds: Character Voices SFX](https://signaturesounds.squarespace.com/store/p/character-voices-sfx): free WAV pack of expressive nonverbal character sounds; listed size 213 MB. First candidate for Coinie and Bulbee chatter.
- [Kenney: Casino Audio](https://kenney.nl/assets/casino-audio): 50 foley sounds involving cards, dice and chips. Candidate material for a coin clink and small hard-object rattles; audition before choosing individual files.
- [JuandreSound: Marble Roll](https://freesound.org/people/JuandreSound/sounds/490913/): 62.655-second recording of marbles rolling on tile. Trim suitable passages for capsule rolling. Original download requires a Freesound login.
- [Kenney: Impact Sounds](https://kenney.nl/assets/impact-sounds): 130 impact/foley sounds. Candidate material for claw clicks, capsule landing, rack contacts and ejection impacts.
- [Kenney: Interface Sounds](https://kenney.nl/assets/interface-sounds): 100 interface sounds. Candidate material for buttons and small confirmation cues.

## Cue plan

| Cue | Proposed sound | Priority |
| --- | --- | --- |
| Coinie speech | Short, eager gibberish syllables; brighter and faster than Bulbee | Essential |
| Bulbee speech | Warm, round gibberish syllables with a deliberate rhythm | Essential |
| Coin insertion | Metallic clink, slot click, tiny confirmation ding | Essential |
| Capsule rolling | Hollow plastic rattle with occasional light contacts | Essential |
| Capsule joins rack | Single satisfying clack at the actual contact | Essential |
| Oldest capsule ejected | Quick whoosh followed by a descending plop | Essential |
| Claw movement | Quiet toy motor loop for lowering, lifting, carrying and returning | Essential |
| Claw closes/releases | Small mechanical clicks | Essential |
| Capsule drops into chute | Hollow thunk before the rolling sound | Essential |
| Capsule reveal | Plastic pop and short sparkle | Essential when reveal is implemented |
| Manual discard | Light flick/pop, distinct from automatic overflow | Essential when discard is implemented |
| Coinie entrance | Sparse tiny footsteps | Optional |
| Coinie jump / slot smoke | Springy boing and brief puff | Optional |
| UI interaction | Gentle click for buttons/settings | Optional |
| Cabinet idle | Very quiet electrical hum | Optional; omit if music already fills the scene |

## Direction and playback

Aim for a cheerful toy arcade: tactile plastic, small metal parts and restrained cartoon accents. Avoid a loud casino payout on every turn.

Build each character voice from a small bank of short syllables. Play brief phrases when speech appears, pause between bursts, and stop when the bubble disappears. Do not loop chatter for the entire lifetime of a bubble. Give the characters different timbres as well as different pitches.

Use several variants for frequent impacts and chatter. Keep voice and interaction cues above the motor/rolling bed, and soften music while characters speak. Motor and rolling loops should follow the actual animation and stop immediately when it ends, including reduced-motion transitions. Start browser audio after the first user gesture and respect mute throughout.

Next asset step: audition the packs, select individual source files, trim/layer the cues, export browser-ready copies, and record each original filename and licence. Downloaded material is available locally; playback is not yet wired into the game.


## Downloaded alternatives and additions

- Kenney Casino Audio, Impact Sounds, Interface Sounds and [Sci-fi Sounds](https://kenney.nl/assets/sci-fi-sounds): original packs with original licence files. Sci-fi engine textures are candidate material for motor and cabinet hum.
- [Steampunk Fantasy Voices by xathien](https://opengameart.org/content/steampunk-fantasy-voices): CC0 character recordings, downloaded directly. These are reactions/caricature voices; audition and chop suitable syllables rather than assuming every clip fits dialogue.
- [Talking Synthesizer by tcarisland](https://opengameart.org/content/talking-synthesizer): a more directly relevant wobbly gibberish alternative, under **CC BY 4.0**. Credit the creator, link the source and licence, and state any edits when shipping.
- JuandreSound Marble Roll: public HQ MP3 preview downloaded; the original file remains behind Freesound login.
- Signature Sounds Character Voices: not downloaded; its delivery uses checkout. The voice alternatives above are directly downloadable.

Each source folder contains source URLs and licence information. Open `assets/audio/audition.html` to browse the local collection and play clips. The collection is kept outside `public/`, so the full source library does not ship with the browser game.
