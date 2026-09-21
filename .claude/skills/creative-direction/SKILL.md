---
name: creative-direction
description: The locked creative concept for this portfolio — which of three visual languages this site speaks, and the rule that you commit to one rather than blending them. Load FIRST, before any design or implementation work, and whenever a change would introduce a new font, a new aesthetic register, a second accent, or a section that does not match the rest of the site. Also load when the user says the site looks generic, templated, or AI-generated.
---

# Creative direction

**Scope:** what this site *is*. The concept, not the values (that is
[visual-design](../visual-design/SKILL.md)) and not the layout
(that is [frontend-design](../frontend-design/SKILL.md)).

Claude, left alone, converges on a recognizable average: centered hero, three
feature cards, a gradient, Inter, rounded corners, fade-up on scroll. Every one
of those choices is individually defensible, which is exactly why the average is
so stable. The only reliable escape is to commit to a specific concept up front
and refuse choices that fall outside it.

## The rule

**One direction. Not a blend.** A site that borrows the typography of one
concept, the color of another, and the motion of a third reads as indecisive —
and indecisive is what "AI-generated" actually looks like. When a proposed
change does not fit the locked direction, the answer is to reject the change,
not to widen the direction.

## Locked: Direction D — Navy / Teal Developer

> Reference the user chose: v4.brittanychiang.com. Deep navy stage, one teal
> accent, monospace numbering and labels, a bold geometric sans for the name and
> tagline. A field of slowly drifting particles behind the hero and a single
> wireframe sphere on the right with a MacBook inside — the user's "developer look". Fixed header with a hexagon mark
> ("FZ"), numbered nav, outlined Resume button. Side rails: socials left, email
> vertical right. Sections reveal on scroll. **Dark is the default**; light is a
> designed alternate reached by the toggle.

| Dimension | Commitment |
|---|---|
| Register | Dark-first, navy not black. Light theme exists and is reviewed. |
| Type | Source Serif 4 (display, 700) over Archivo (body, 500) — the claude.com register the user chose — plus JetBrains Mono for numbering, labels, buttons. Heavy: 2px borders, bold buttons. |
| Color | Navy stage `#0a192f`, slate text, one teal accent `#64ffda`. Accent tint at 10% for fills. No second hue. |
| Layout | Centered ~1000px content column; fixed header; fixed side rails from `lg`. |
| Depth | Layered navy surfaces (`bg` → `surface` → `surface-raised`), subtle shadow on the scrolled header. |
| Motion | Staggered fade-up on hero and nav at load; sections fade-up once on scroll; header hides on scroll down. Particles drift; the object rotates slowly and follows the pointer. |
| 3D | Particle field + one wireframe icosahedron in the hero canvas, with a stylised MacBook (primitives + canvas-drawn code screen, no external model) inside it. Nothing elsewhere. |
| Voice | Plain and specific. |

### Alternatives (not in use)

- **Direction B — Editorial Light.** Cream stage, Instrument Serif display, armillary 3D object. Built first, rejected by the user as "too basic".

Documented so the choice is visible as a choice. **Switching directions means
rewriting the tokens in [visual-design](../visual-design/SKILL.md) and this
section together — never adopting one element in isolation.**

- **Direction A — Cinematic Editorial.** The same typography on a near-black
  stage, one warm light source, dark-canonical. Was the initial lock; replaced
  by B because light is the required default.
- **Direction C — Experimental.** Dark canvas that *is* the page, WebGL
  typography, shader distortion, custom cursor, scroll drives transformation
  rather than translation. Highest risk, highest ceiling, worst accessibility
  story — requires a full non-WebGL parallel route.

## Before writing code

If no concept decision has been recorded for the work at hand, establish it
before implementing. State, in a few lines: the concept, the type pairing, the
color logic, the layout logic, the motion logic, and the 3D role. Confirm it
matches Direction D above. Then build.

Do not produce code and creative direction in the same breath — the code will
drift to the average while you are thinking about something else.

## Rejection list

These are rejected because they belong to no direction — they are what happens
when there is no direction:

- A hero that is a centered `<h1>` + subtitle + two buttons on a gradient.
- "Skills" as a grid of logo tiles or percentage bars.
- Sections that are each a full-width band with a centered heading above a
  three-card row.
- Decorative blobs, floating shapes, or grain overlays used as texture with no
  relationship to the concept.
- Any element present because portfolios usually have one, rather than because
  this portfolio needs it. A section with nothing real in it gets deleted, not
  filled with placeholder copy.
- Mixing a serif display with a second display face, or introducing a third
  family for "variety."

## The test

Screenshot any section. Remove the text. Ask: **could this be any other
portfolio?** If yes, the direction has not been applied — it has only been
agreed to.
