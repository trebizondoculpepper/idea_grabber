# Mission Specification: Arcade world and two heroes

**Mission Branch**: `feat/arcade-world`
**Created**: 2026-10-10
**Status**: Confirmed
**Input**: User requested starting the next mission to generate the scene and two heroes after confirming the scene graph and identical balls.

## Intent Summary

A viewer opening Idea Grabber sees a cheerful low-poly arcade cabinet with original paper-cutout heroes Bulbee and Coinie. A tiny slow camera arc reveals restrained PS1 polygon instability. All capsules look alike. This is a visual demo, without gameplay or camera controls. The actor, trigger, outcome and boundaries were explicitly confirmed in the conversation before creation.

## User Scenarios & Testing

### User Story 1 - See the arcade world (Priority: P1)

As a viewer, I open the demo and see the machine and its two heroes clearly, in the approved colourful cartoon composition.

**Independent Test**: Open the demo and identify the cabinet, title, claw, capsule pit, coin slot, chute, rack, Bulbee and Coinie.

**Acceptance Scenarios**:
1. Given the page loads, the scene shows all listed elements with the title exactly “Idea Grabber”.
2. Given any point in the slow camera arc, both heroes and the five rack positions remain in frame.
3. Given identical capsules, each has the same faceted form and surface artwork.

### User Story 2 - Enjoy moving-edge PS1 graphics (Priority: P2)

As a viewer, I watch a slow automatic camera arc reveal polygon wobble while the composition remains nearly still.

**Independent Test**: Observe the demo for one camera cycle and measure its frame rate.

**Acceptance Scenarios**:
1. Normal motion follows approximately 11.25 degrees total over a 48-second cycle with no camera controls.
2. Reduced motion stops camera and celebratory idle movement and disables wobble.
3. Hiding and restoring the tab resumes without a large animation jump.

### Edge Cases

- Narrow portrait screens fit the entire machine and two heroes through framing changes.
- Missing WebGL reports the existing readable error.
- Repeated hot reloads dispose scene resources without retaining duplicate animation loops.

## Requirements

### Functional Requirements

| ID | Title | User Story | Priority | Status |
|---|---|---|---|---|
| FR-001 | Machine composition | Viewer sees cabinet, marquee, coin slot, claw assembly, capsule pit, chute and five-position rack. | High | Open |
| FR-002 | Heroes | Viewer sees original smiling paper-cutout Bulbee and Coinie with hands and feet. | High | Open |
| FR-003 | Identical capsules | Every capsule uses the same appearance and low-poly form. | High | Open |
| FR-004 | Arcade setting | Viewer sees bold acid-yellow, hot-pink, turquoise and purple art, graphic backdrop and wonky checkerboard floor. | High | Open |
| FR-005 | Automatic camera | Viewer sees a slow 11.25-degree total camera drift and restrained PS1 wobble. | High | Open |
| FR-006 | Named assemblies | Machine assemblies, individual capsules and heroes are independently identifiable for future animation. | Medium | Open |
| FR-007 | Responsive lifecycle | Viewer can resize and restore the tab without losing the composition or causing animation jumps. | High | Open |

### Non-Functional Requirements

| ID | Title | Requirement | Category | Priority | Status |
|---|---|---|---|---|---|
| NFR-001 | Frame rate | Average visible-tab frame rate is at least 30 fps across a 10-second steady-state sample in current desktop Chrome and Safari on this Mac. | Performance | High | Open |
| NFR-002 | Framing | Full machine and both heroes are visible at 1280×800 desktop and 390×844 portrait viewports. | Usability | High | Open |
| NFR-003 | Runtime health | No shader errors or missing runtime assets during browser verification. | Reliability | High | Open |

### Constraints

| ID | Title | Constraint | Category | Priority | Status |
|---|---|---|---|---|---|
| C-001 | Visual-only | No insertion, aiming, reveal, random assignment, discard, camera controls or settings panel. | Scope | High | Open |
| C-002 | Original art | Use original editable artwork inspired by paper cartoons and the approved screenshot. | Art | High | Open |
| C-003 | Existing foundation | Preserve the browser toolchain and tested PS1 rendering foundation. | Technical | High | Open |
| C-004 | Future variants | Identical current capsules remain separate objects so future appearances can differ. | Scope | Medium | Open |

### Key Entities

- Machine: the cabinet and named assemblies.
- Capsule: an independently identifiable decorative faceted ball with a shared current appearance.
- Hero: Bulbee or Coinie, an original paper-cutout character with limb pivots.
- Environment: floor and simple arcade backdrop.

## Success Criteria

- SC-001: All machine assemblies and both heroes can be identified in the scene.
- SC-002: Five rack positions are visible and every capsule looks alike.
- SC-003: A 10-second steady-state sample averages at least 30 fps in the tested desktop browsers.
- SC-004: The scene keeps machine and heroes in frame at the two required viewports.

## Assumptions

Rack positions can contain five decorative capsules to demonstrate composition, without implying playable state. Idle poses and small periodic movement are visual polish only. Unicode emoji catalogue is future planning and does not change current capsule appearance.
