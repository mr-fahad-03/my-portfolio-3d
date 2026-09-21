@AGENTS.md

# myportfolio

A premium personal portfolio: Next.js 16 (App Router) + TypeScript + Tailwind
v4, with a React Three Fiber hero scene. Creative direction is locked to
**Direction D — Navy / Teal Developer** (reference: v4.brittanychiang.com; dark
default with a persisted light toggle, Manrope + JetBrains Mono, particle field +
wireframe object in the hero). Built step by step at the user's request. See the
creative-direction skill.

## Project skills — read before you write

Ten skills in `.claude/skills/` hold the standing decisions for this repo. They
are what "correct" means here. Load the relevant one *before* writing code.

| Skill | Owns | Load before |
|---|---|---|
| [creative-direction](.claude/skills/creative-direction/SKILL.md) | the concept | any design work; anything that would add a font, hue, or aesthetic register |
| [visual-design](.claude/skills/visual-design/SKILL.md) | the values — color, type, spacing, radii | any CSS, Tailwind class, or "make it look better" |
| [frontend-design](.claude/skills/frontend-design/SKILL.md) | page & section composition, components, content | creating or restructuring any page or section |
| [interaction-design](.claude/skills/interaction-design/SKILL.md) | element states and behavior | any button, link, card, nav, form, cursor |
| [motion-design](.claude/skills/motion-design/SKILL.md) | the motion budget, timing, transitions | any animation, scroll effect, page transition |
| [responsive-design](.claude/skills/responsive-design/SKILL.md) | per-breakpoint composition, degradation | any layout CSS or breakpoint work |
| [3d-web](.claude/skills/3d-web/SKILL.md) | everything inside the canvas | Three.js, R3F, drei, shaders, `.glb` |
| [performance](.claude/skills/performance/SKILL.md) | budgets and verification | adding a dependency, image, or font; before "done" |
| [accessibility](.claude/skills/accessibility/SKILL.md) | keyboard, reduced-motion, contrast, semantics | any interactive element; before "done" |
| [design-review](.claude/skills/design-review/SKILL.md) | audit and **fix** | a page is complete; anything looks generic |

Shortest version of all ten: **one locked direction, tokens only (no raw hex),
the spacing scale only, dramatic type contrast, a motion budget of one hero
choreography and two scroll beats per page, the 3D canvas never blocks first
paint, keyboard and reduced-motion always work, mobile Lighthouse ≥95 with
initial JS under 120 KB — then review and fix before shipping.**

## Workflow

Do not build the site in one pass. Work in phases, loading the named skills:

1. **Direction** — `creative-direction` + `visual-design`. Confirm the concept,
   type, color, layout, motion and 3D logic. No code yet.
2. **Architecture** — `frontend-design` + `performance`. Routes, layout
   primitives, font loading, token CSS. Only the components the direction needs.
3. **Hero** — `frontend-design` + `3d-web` + `motion-design`. The strongest
   moment on the site, built first and finished.
4. **Sections** — `frontend-design` + `interaction-design` +
   `responsive-design`. Work, about, contact. Only sections with real content.
5. **Motion pass** — `motion-design`. One coherent system across the site,
   within budget. Remove anything over.
6. **Performance pass** — `performance` + `3d-web`. Measure, report numbers.
7. **Review** — `design-review`. Critique as a senior creative director and
   engineer; fix what is found.

## Commands

```bash
npm run dev     # dev server
npm run build   # production build (measure chunks — see performance skill)
npm run lint
```
