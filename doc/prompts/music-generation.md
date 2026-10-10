# Idea Grabber — soundtrack generation prompt

You are creating the soundtrack for Idea Grabber, a goofy, hyper-coloured browser arcade game. A cartoon lightbulb called Bulbee and an enthusiastic coin called Coinie stand beside a claw machine that grabs colourful balls representing game ingredients. The visual style mixes flat paper characters, chunky low-poly geometry and glitchy PS1 graphics. The soundtrack should make this ridiculous arcade feel alive.

## Deliverable

Produce a bank of **20 separate instrumental music snippets**, each **20–40 seconds**, aiming for about 30 seconds. The game will play them in shuffled order with short crossfades. Together they should feel like a montage of memorable classic game melodies, performed as goofy chiptune cover versions and miniature mashups.

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

Each row is a miniature cover/mashup brief. The named sources are the melodic reference targets; arrange them with a playful chiptune house sound. Within 20–40 seconds, use a hook, a contrasting twist and a satisfying exit. Two clear ideas are generally enough: do not cram every reference into every track.

| Filename stem                   | Reference melodies / direction                                                                                                       |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `bgm-01-neon-roadtrip`          | OutRun cruising theme into a jaunty Super Mario Bros. flourish; sun-soaked FM chords and silly bouncing bass.                        |
| `bgm-02-pocket-quest`           | The Legend of Zelda adventure theme with a Frogger-style hopping arcade interlude; tiny heroic fanfare.                              |
| `bgm-03-frog-in-a-ferrari`      | Frogger arcade melody into an OutRun racing groove; comic stop-start percussion and quick lane-changing arpeggios.                   |
| `bgm-04-plumber-on-a-mission`   | Super Mario Bros. overworld and underground motifs; cheerful lead handing off to a comically sneaky bass line.                       |
| `bgm-05-blue-blur-boogie`       | Sonic the Hedgehog platforming melodies with an OutRun-flavoured FM accompaniment; fast, elastic and funky.                          |
| `bgm-06-falling-block-party`    | Tetris's familiar falling-block melody remade as a chip polka, with a Dr. Mario puzzle-pop turn.                                     |
| `bgm-07-banana-brass-band`      | Donkey Kong Country jungle-flavoured melody and Donkey Kong arcade rhythm; rubbery bass and miniature brass.                         |
| `bgm-08-pink-puff-parade`       | Kirby platforming melody and Yoshi's Island-flavoured playful counterpoint; toy-box march and squeaky chip lead.                     |
| `bgm-09-robot-lunch-break`      | Mega Man stage-theme energy with a Metroid-flavoured mysterious detour; robot funk that becomes cheerful again.                      |
| `bgm-10-tiny-castle-big-drama`  | Castlevania melody into a Ghosts 'n Goblins-style comic spooky march; dramatic arpeggios and cartoon menace.                         |
| `bgm-11-pac-picnic`             | Pac-Man arcade motifs expanded into a musical hook, with a Frogger-like jaunty response; minimal bleeps becoming a big dance.        |
| `bgm-12-space-snack-attack`     | Space Invaders rhythmic pulse with Galaga arcade fanfare motifs; build a melodic chip groove around the simple source material.      |
| `bgm-13-turbo-kart-confetti`    | Super Mario Kart racing melodies with Sonic-style momentum; noisy chip drums and ridiculous victory flourishes.                      |
| `bgm-14-eight-bit-knockout`     | Street Fighter II stage-theme melody with Punch-Out!!-style comic boxing energy; bright FM stabs and bounce.                         |
| `bgm-15-bomberman-disco`        | Bomberman melody with Bubble Bobble's cheerful arcade flavour; bubbly bass, pulse leads and tiny disco breaks.                       |
| `bgm-16-monster-pocket-money`   | Pokémon adventure/battle melody with a Zelda-style quest response; eager, curious and heroic on a tiny budget.                       |
| `bgm-17-fantasy-fanfare-fumble` | Final Fantasy victory/adventure motifs turned into a goofy marching chip band; grand entrance, comic stumble, triumphant recovery.   |
| `bgm-18-lemming-lemonade`       | Lemmings-style puzzle melody with a Tetris-flavoured chip-waltz detour; busy little workers and cheerful chaos.                      |
| `bgm-19-pirate-pixel-shuffle`   | Monkey Island pirate-theme melody arranged with chip instruments and an OutRun-flavoured groove; swashbuckling beach-party nonsense. |
| `bgm-20-arcade-curtain-call`    | A final compact mashup of OutRun, Zelda and Frogger hooks; a joyful miniature arcade finale that can hand off to any other track.    |

If a particular source melody is unavailable to your tool, preserve the track brief and report the substitution in the manifest. Keep the twenty filenames stable.

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
      "references": ["OutRun", "Super Mario Bros."],
      "masterFile": "bgm-01-neon-roadtrip.wav",
      "notes": "Describe the actual arrangement and any substitutions."
    }
  ]
}
```

The example numbers illustrate the schema. Fill all 20 entries with the actual measured durations and tempo; use `null` for BPM if there is no single stable tempo. Filenames are relative to their respective directories. The game will resolve each MP3 against the manifest's directory, respecting its deployed base URL.

## Completion check

Listen to every delivered track. Confirm all 20 MP3s decode, last 20–40 seconds, have distinct arrangements, have tidy starts/ends, and sound consistent in loudness. Confirm matching masters and an accurate manifest exist at the absolute paths above.

Deliver audio files, not merely descriptions of the proposed music. If your environment cannot write into this checkout, provide a bundle with these exact filenames and explain where to extract the browser files and masters. Finish with a concise inventory and any unresolved export limitations.
