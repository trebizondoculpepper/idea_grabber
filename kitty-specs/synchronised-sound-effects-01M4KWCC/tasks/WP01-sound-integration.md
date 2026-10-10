---
work_package_id: WP01
title: Synchronised machine and character audio
dependencies: []
requirement_refs:
- FR-001
- FR-002
- FR-003
- FR-004
- FR-005
- FR-006
- FR-007
- NFR-001
- NFR-002
- NFR-003
- NFR-004
- C-001
- C-002
- C-003
- C-004
planning_base_branch: main
merge_target_branch: main
branch_strategy: Planning artifacts for this mission were generated on main. During /spec-kitty.implement this WP may branch from a dependency-specific base, but completed changes must merge back into main unless the human explicitly redirects the landing branch.
subtasks:
- T001
- T002
- T003
- T004
- T005
history: []
agent_profile: frontend-freddy
authoritative_surface: src/audio/
create_intent: []
execution_mode: code_change
owned_files:
- src/audio/**
- src/rendering/start-scene.ts
- src/ui/coinie-speech.ts
- src/ui/bulbee-speech.ts
- src/styles/main.css
- index.html
- public/audio/sfx/**
- public/licenses/three.txt
- scripts/prepare-sfx.py
- docs/resource-credits.json
- docs/sound-effects.md
- docs/TODO.md
role: implementer
tags: []
tracker_refs: []
---

# WP01 — Synchronised machine and character audio

Read spec.md and plan.md. Scope and checks are recorded in tasks.md. User explicitly requires working on main.

Implementation is complete; formal review is pending. Verify movement landmarks, finite chatter, mute/background/disposal, missing-file tolerance, and shipped notices.
