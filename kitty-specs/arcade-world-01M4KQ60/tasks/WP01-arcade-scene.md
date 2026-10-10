---
work_package_id: WP01
title: Arcade composition and heroes
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
- C-001
- C-002
- C-003
- C-004
planning_base_branch: feat/arcade-world
merge_target_branch: feat/arcade-world
branch_strategy: Planning artifacts for this mission were generated on feat/arcade-world. During /spec-kitty.implement this WP may branch from a dependency-specific base, but completed changes must merge back into feat/arcade-world unless the human explicitly redirects the landing branch.
subtasks:
- T001
- T002
- T003
- T004
- T005
history: []
agent_profile: frontend-freddy
authoritative_surface: src/scene/
create_intent: []
execution_mode: code_change
owned_files:
- src/scene/**
- src/rendering/**
- src/styles/**
- public/assets/**
- index.html
- README.md
- docs/**
role: implementer
tags: []
tracker_refs: []
---

## ⚡ Do This First: Load Agent Profile

Load frontend-freddy via `spec-kitty agent profile show frontend-freddy`; apply its implementation boundaries.

## Objective

Deliver the confirmed visual demo. Read spec.md, plan.md and approved screenshot. Do not implement gameplay.

### T001 — Scene construction resources

Introduce a small scene builder for shared geometries/materials/textures and one disposal owner. Named Groups expose transform pivots. Preserve time-based update/disposal interface used by startScene.

### T002 — Machine and environment

Build yellow/pink/turquoise low-poly cabinet, illustrated marquee reading Idea Grabber, coin-slot panel, overhead carriage/cable/claw, visible capsule pit, chute and five-position output rack. Floor/backdrop stay graphic and original; glass is implied by reflection marks only.

### T003 — Identical balls

Share one low-poly capsule geometry and material across pit and rack. Individual meshes have unique names. Arrange deterministically without physics. No ingredient assignment or variants.

### T004 — Heroes

Create original editable SVG cutout bodies, hands and feet for Bulbee and Coinie. Put limbs on named pivots. Make expressive smiles and exaggerated eyes. Heroes flank the cabinet without obscuring controls; idle movement is restrained and respects reduced motion.

### T005 — Integrate and verify

Preserve PS1 snapping/dithering and small automatic camera arc. Fit required desktop and portrait views. Run lint/typecheck/build/format and inspect Chrome/Safari. Record real frame rate samples, screenshots, scene graph and runtime-error observations. Update README and include independently requested emoji catalogue. No camera controls or gameplay UI.

## Review criteria

All FR/NFR/constraints satisfied with real browser evidence. Resources disposed after hot reload. Capsule appearances identical. No network services at play time. No unreadable billboard title. At least 30 fps steady-state in tested browsers; state any concrete browser limitation honestly.
