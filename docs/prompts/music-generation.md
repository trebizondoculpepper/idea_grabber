# Idea Grabber — soundtrack generation prompt

You are creating the soundtrack for Idea Grabber, a goofy, hyper-coloured browser arcade game. A cartoon lightbulb called Bulbee and an enthusiastic coin called Coinie stand beside a claw machine that grabs colourful balls representing game ingredients. The visual style mixes flat paper characters, chunky low-poly geometry and glitchy PS1 graphics. The soundtrack should make this ridiculous arcade feel alive.

## Deliverable

Produce a bank of **20 separate instrumental music snippets**, each **20–40 seconds**, aiming for about 30 seconds. The game will play them in shuffled order with short crossfades. **Each snippet is a goofy chiptune rendition of exactly one famous game theme.** The random sequence of separate snippets creates the medley during playback. Keep each file focused on its single source melody throughout.

The reference era is broadly the **1980s and 1990s**, encompassing the user's examples: **OutRun, The Legend of Zelda and Frogger**. Use recognisable melodic hooks, freshly performed with synthesised chip instruments. Give each track a clear musical identity; the bank should have variety while sounding like one eccentric house band.

## Musical direction

- Joyful, cheeky, bouncy and slightly ridiculous. Think tiny arcade band with too much sugar.
- Square-wave leads, triangle-wave bass, pulse arpeggios, crunchy noise drums, FM keyboard/brass colours and occasional deliberately cheap synth flourishes.
- Melodic humour: octave jumps, slide whistles, brief wrong-note feints that resolve, tiny breakdowns, exaggerated fills and unexpected but musical transitions.
- Keep the cover melodies audible and memorable beneath the playful arrangement.
- Mix arcade, NES, Game Boy, Mega Drive and SNES flavours freely. Bright chip timbres should remain comfortable over extended listening.
- Include racing grooves, heroic adventure fanfares, hopping arcade marches, puzzle waltzes, spooky-comic tunes, funky platforming and jaunty victory music.
- Mostly energetic tempos around 110–165 BPM, with a few relaxed tracks around 85–110 BPM. These are creative guides, not hard constraints.
- Instrumental throughout. The game characters already have dialogue; leave room for their future voices and machine sound effects.

## Twenty track briefs and filenames

Each row specifies one source theme and one rendition. Build the 20–40 second arrangement around that melody, with playful variations, fills and a tidy ending. The shared chip-instrument palette makes the separately shuffled tracks sound like one eccentric house band.

| Filename stem                   | Single source theme                                  | Arrangement direction                                                                     |
| ------------------------------- | ---------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `bgm-01-neon-roadtrip`          | OutRun — Magical Sound Shower                        | Sun-soaked FM chords and silly bouncing bass.                                             |
| `bgm-02-pocket-quest`           | The Legend of Zelda — overworld theme                | A tiny heroic fanfare with cheeky pulse arpeggios.                                        |
| `bgm-03-frog-hop-jamboree`      | Frogger — one recognisable arcade-stage melody       | Comic stop-start percussion and hopping bass. Identify the chosen melody in the manifest. |
| `bgm-04-plumber-on-a-mission`   | Super Mario Bros. — overworld theme                  | A cheerful square-wave lead and comically springy bass.                                   |
| `bgm-05-blue-blur-boogie`       | Sonic the Hedgehog — Green Hill Zone                 | Fast, elastic FM funk.                                                                    |
| `bgm-06-falling-block-party`    | Tetris — Type A theme                                | The familiar falling-block tune as a tiny chip polka.                                     |
| `bgm-07-banana-brass-band`      | Donkey Kong Country — Jungle Hijinxs theme           | Rubbery bass and miniature synth brass.                                                   |
| `bgm-08-pink-puff-parade`       | Kirby's Dream Land — Green Greens                    | A toy-box march and squeaky chip lead.                                                    |
| `bgm-09-robot-lunch-break`      | Mega Man 2 — Dr. Wily stage theme                    | An enthusiastic robot band with exaggerated chip drum fills.                              |
| `bgm-10-tiny-castle-big-drama`  | Castlevania — Vampire Killer                         | Dramatic arpeggios and cartoon menace.                                                    |
| `bgm-11-bubble-pop-picnic`      | Bubble Bobble — main theme                           | A bubbly pulse lead and cheerful miniature disco accompaniment.                           |
| `bgm-12-space-snack-attack`     | Metroid — Brinstar theme                             | A mysterious space tune performed by a surprisingly bouncy chip band.                     |
| `bgm-13-turbo-kart-confetti`    | Super Mario Kart — Mario Circuit theme               | Noisy chip drums and ridiculous racing flourishes.                                        |
| `bgm-14-eight-bit-knockout`     | Street Fighter II — Guile's theme                    | Bright FM stabs and an overenthusiastic tiny rhythm section.                              |
| `bgm-15-doctor-pixel-disco`     | Dr. Mario — Fever theme                              | Puzzle-pop melody with cheeky bass and compact disco breaks.                              |
| `bgm-16-monster-pocket-money`   | Pokémon Red/Blue — main title theme                  | Eager, curious and heroic on a tiny budget.                                               |
| `bgm-17-fantasy-fanfare-fumble` | Final Fantasy — victory fanfare                      | Develop the single fanfare into a 20–40 second goofy chip-band rendition with variations. |
| `bgm-18-yoshi-toybox`           | Super Mario World 2: Yoshi's Island — athletic theme | A jaunty toy-instrument parade with bright chip percussion.                               |
| `bgm-19-pirate-pixel-shuffle`   | The Secret of Monkey Island — main theme             | Swashbuckling chip-instrument beach-party nonsense.                                       |
| `bgm-20-duck-disco-finale`      | DuckTales — The Moon theme                           | A joyful miniature space-disco rendition with sparkling arpeggios.                        |

If a particular source melody is unavailable to your tool, choose one other famous game theme for that file and report the substitution in the manifest. Each file must still have exactly one source theme. Keep the twenty filenames stable.

## Arrangement and transition requirements

- Start with music promptly, within roughly 0.1 seconds. Avoid long intros.
- Make the 20–40 second file a complete little musical vignette, not a random cut from a longer unfinished song.
- End on a clean musical boundary with a short tidy release. Leave no long silence or sprawling reverb tail.
- Keep the last 0.75 seconds suitable for a gentle crossfade into an unrelated track. The BGM player will handle that crossfade.
- Maintain consistent perceived volume across the bank. Suggested target: around **−16 LUFS integrated**, true peak **≤ −1 dBTP**. Avoid clipping and tiring high-frequency noise.
- Use light stereo width, with a solid centre and good mono compatibility.
- The retro character comes from the instruments and arrangement; deliver normal high-quality audio rather than degrading the export sample rate.

## Exact output locations

The project root on this machine is:

`/Users/sal/PycharmProjects/idea_grabber`

Write browser-ready files to:

`/Users/sal/PycharmProjects/idea_grabber/public/audio/bgm/`

For each filename stem above, export **`.mp3`, stereo, 48 kHz, 192 kbps**. Example:

`/Users/sal/PycharmProjects/idea_grabber/public/audio/bgm/bgm-01-neon-roadtrip.mp3`

Write lossless editing masters to:

`/Users/sal/PycharmProjects/idea_grabber/assets/audio-masters/bgm/`

For each matching filename stem, export **`.wav`, PCM, stereo, 48 kHz, 24-bit**. If your generation system provides native 44.1 kHz or 16-bit masters, keep that native version and report its actual specification; upsampling does not create extra detail. Web MP3s can also retain native 44.1 kHz when appropriate.

Example master:

`/Users/sal/PycharmProjects/idea_grabber/assets/audio-masters/bgm/bgm-01-neon-roadtrip.wav`

These are separate from the public web directory so lossless masters are not shipped with the game.

Write the completed metadata manifest to:

`/Users/sal/PycharmProjects/idea_grabber/public/audio/bgm/manifest.json`

Manifest schema:

```json
{
  "version": 1,
  "tracks": [
    {
      "id": "bgm-01-neon-roadtrip",
      "title": "Neon Roadtrip",
      "file": "bgm-01-neon-roadtrip.mp3",
      "durationSeconds": 30.0,
      "bpm": 132,
      "sourceGame": "OutRun",
      "sourceTheme": "Magical Sound Shower",
      "masterFile": "bgm-01-neon-roadtrip.wav",
      "notes": "Describe the actual arrangement and any substitutions."
    }
  ]
}
```

The example numbers illustrate the schema. Fill all 20 entries with the actual measured durations and tempo; use `null` for BPM if there is no single stable tempo. Filenames are relative to their respective directories. The game will resolve each MP3 against the manifest's directory, respecting its deployed base URL.

## Completion check

Listen to every delivered track. Confirm all 20 MP3s decode, last 20–40 seconds, each cover exactly one famous game theme, have distinct arrangements, have tidy starts/ends, and sound consistent in loudness. Confirm matching masters and an accurate manifest exist at the absolute paths above.

Deliver audio files, not merely descriptions of the proposed music. If your environment cannot write into this checkout, provide a bundle with these exact filenames and explain where to extract the browser files and masters. Finish with a concise inventory and any unresolved export limitations.
