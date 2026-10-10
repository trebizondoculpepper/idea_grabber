# Mission Specification: Synchronised sound effects

**Mission branch / merge target**: `main` (explicit user override of original `feat/arcade-world` target)  
**Created**: 2026-10-10  
**Status**: Implemented; ready for review  
**Input**: Integrate downloaded sound effects as the machines and characters move. Forget about music. Merge everything, switch to main and start.

## User Scenarios & Testing

### User Story 1 — Hear the machine and balls (Priority: P1)

A player inserts Coinie and hears sounds corresponding to visible machine and capsule actions.

**Independent test**: Run a normal turn and a turn with a full rack.

**Acceptance scenarios**:

1. Given sound is available and unmuted, when Coinie enters the slot, the claw moves/closes/releases and the capsule drops, corresponding cues sound once at those actions.
2. Given a capsule is rolling, when it settles on the rack, rolling stops and a single rack contact sounds.
3. Given the rack is full, when the oldest capsule leaves, ejection and landing cues follow its movement; ordinary turns do not produce an ejection cue.
4. Given reduced motion is enabled, when a turn runs faster, sounds follow the shorter movement rather than continuing for the original duration.

### User Story 2 — Hear the characters (Priority: P1)

A player sees a character speak and hears a brief, recognisable gibberish voice.

**Independent test**: Trigger each character's next line.

**Acceptance scenarios**:

1. Given a new speech bubble, when it appears, the character produces a finite burst of varied syllables; Coinie and Bulbee have distinct timbres/rhythms.
2. Given a speech bubble hides or changes, when that occurs, the old voice stops.
3. Given speech occurred before audio unlock or while muted, when audio becomes available, stale speech is not replayed.

### User Story 3 — Control sound (Priority: P1)

A player can mute sound, leave the tab and return without stuck loops.

**Independent test**: Toggle mute during movement, reload and background the tab.

**Acceptance scenarios**:

1. Given active audio, when mute is enabled, all sounds stop and the control reflects the new state; the preference survives reload where storage is available.
2. Given the tab becomes hidden or the scene is disposed, when that happens, audio stops and resources are cleaned up.
3. Given a clip fails to load or browser audio is unavailable, when the game runs, gameplay continues.

### Edge cases

- Repeated render updates must not duplicate contacts or restart loops.
- A rapid interaction while audio is loading must not queue stale sounds for later replay.
- Reduced-motion walking must not emit footsteps for motion that is not shown.
- Reveal and manual discard are absent from the current game; do not create those interactions merely to add their sounds.
- Storage denial must not break the mute control.

## Requirements

### Functional Requirements

| ID     | Title            | Requirement                                                                                                               | Priority | Status      |
| ------ | ---------------- | ------------------------------------------------------------------------------------------------------------------------- | -------- | ----------- |
| FR-001 | Machine cues     | Play coin/slot, claw motor, grip/release and chute contact cues corresponding to current movement.                        | High     | Implemented |
| FR-002 | Capsule cues     | Play rolling, one rack arrival contact, and overflow-only ejection/contact cues.                                          | High     | Implemented |
| FR-003 | Character speech | Give both characters distinct finite gibberish bursts for new speech; stop on hiding/replacement.                         | High     | Implemented |
| FR-004 | Supporting cues  | Add Coinie jump, slot puff, walking footsteps and quiet UI feedback; optional low cabinet hum.                            | Medium   | Implemented |
| FR-005 | Mute             | Provide a visible keyboard-accessible mute control and persist its preference when storage is available.                  | High     | Implemented |
| FR-006 | Audio lifecycle  | Unlock via interaction; stop audio on backgrounding/disposal; avoid replaying stale speech and resume only current loops. | High     | Implemented |
| FR-007 | Source records   | Record selected original files, output files, edits, creators and licences; ship required credit/notice text.             | High     | Implemented |

### Non-Functional Requirements

| ID      | Title             | Requirement                                                                                                              | Category    | Priority | Status   |
| ------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------ | ----------- | -------- | -------- |
| NFR-001 | Synchronisation   | Trigger contacts within one displayed animation update of their landmark; emit no duplicate contact for unchanged state. | Timing      | High     | Verified |
| NFR-002 | Bounded playback  | Maintain at most one loop per cue; each new speech burst contains at most eight syllables.                               | Reliability | High     | Verified |
| NFR-003 | Download size     | Selected MP3 effects total less than 250 KB; do not ship the full source library.                                        | Performance | Medium   | Verified |
| NFR-004 | Failure tolerance | One failed audio clip or unavailable audio subsystem does not stop a game turn.                                          | Reliability | High     | Verified |

### Constraints

| ID    | Title                | Constraint                                                                                           | Category | Priority | Status    |
| ----- | -------------------- | ---------------------------------------------------------------------------------------------------- | -------- | -------- | --------- |
| C-001 | Music excluded       | This mission does not produce or integrate music.                                                    | Scope    | High     | Satisfied |
| C-002 | Existing behaviour   | Preserve current game, rack and character behaviour; audio observes their state.                     | Scope    | High     | Satisfied |
| C-003 | Shared main          | Work directly on main as explicitly requested; preserve other contributors' work.                    | Delivery | High     | Satisfied |
| C-004 | Resource permissions | Use the downloaded licensed material and preserve the required attribution/notices for chosen clips. | Assets   | High     | Satisfied |

### Key Entities

- Sound cue: audible response associated with a movement, contact or speech event.
- Speech burst: finite sequence associated with one character line.
- Resource record: provenance, licence, original files, output files and edits for selected material.

## Success Criteria

- SC-001: Normal and overflowing turns produce the appropriate cues without duplicates.
- SC-002: Both characters have recognisably different chatter and hidden bubbles produce no ongoing speech.
- SC-003: Mute stops all active audio and no movement loop remains after its movement ends.
- SC-004: Every shipped clip has provenance and applicable attribution; selected MP3 files stay below 250 KB.

## Assumptions

Reduced motion shortens phase timings; audio reads current animation state. The full credits page is a separate mission; this mission ships credit text and updates its register. Initial speech before the first user gesture remains silent. Final subjective mix tuning may follow listening feedback.
