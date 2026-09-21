---
name: responsive-design
description: Breakpoint compositions for this portfolio — mobile, tablet and desktop treated as three designed layouts rather than one layout with media queries, plus what the 3D scene and motion degrade to on each. Load BEFORE writing layout CSS, grid or flex structure, any responsive class, or any breakpoint-conditional behavior, and when checking a page at other viewport sizes.
---

# Responsive design

**Scope:** how composition changes across viewports. Values from
[visual-design](../visual-design/SKILL.md), composition principles from
[frontend-design](../frontend-design/SKILL.md).

Do not build a desktop layout and add media queries to rescue it. Each
breakpoint is its own composition of the same content — the hierarchy is
constant, the arrangement is designed per size.

## Breakpoints

Tailwind defaults, used deliberately:

| Name | Min width | Composition |
|---|---|---|
| (base) | 0 | Mobile. Single column, one idea per screen. |
| `md` | 768px | Tablet. Two columns become available; asymmetry begins. |
| `lg` | 1024px | Desktop. Full editorial grid. |
| `xl` | 1280px | Container maxes at 1280px; gutters absorb the rest. |

Three designed compositions: base, `md`, `lg`. `sm` and `2xl` are not used —
five breakpoints means none of them got real attention.

## Per-breakpoint composition

### Mobile (base)

Not a squeezed desktop. The constraint is genuine and should shape the design.

- Single column. Container gutter `24px`, no horizontal scroll ever.
- `text-hero` clamps down to ~`3.5rem`. Display type stays *big* — shrinking it
  to 32px throws away the concept. Let long words break or reflow.
- Section rhythm drops to `128px`.
- Asymmetry mostly resolves to full-bleed with intentional bottom spacing.
- Project cards stack full-width. Vary card *height* to keep rhythm rather than
  shipping an identical stack.
- Nav collapses to a real button + panel (see
  [interaction-design](../interaction-design/SKILL.md)).
- Tap targets ≥44px, ≥8px apart.
- The sum of all `padding` never exceeds ~15% of viewport width.

### Tablet (`md`)

The breakpoint most often skipped, and it shows.

- Two columns where content genuinely pairs; **not** a 2-up grid of everything.
- Asymmetric splits are available: 7/5, 8/4. Use them — equal halves read as a
  default.
- Gutter `48px`.
- Check both orientations. Landscape tablet is close to small desktop; portrait
  is not.

### Desktop (`lg`+)

- Full editorial grid — 12 columns, and content is allowed to occupy unequal,
  off-center spans with empty columns left empty.
- Container `1280px`, centered, with real gutters.
- Line length still capped at `68ch` regardless of available width. Full-width
  body text is the fastest way to look unconsidered.
- This is where scroll-linked motion and the full 3D scene live.

## Degradation matrix

What each system does at each size. Decide once, write it here, implement it.

| System | Mobile | Tablet | Desktop |
|---|---|---|---|
| 3D scene | Poster image, or stripped scene: `dpr={1}`, no shadows, no postprocessing, static camera | Reduced scene: `dpr=[1,1.5]`, no postprocessing | Full scene |
| Scroll-linked motion | Off | Off | On (max 2 beats) |
| Hero choreography | On (transform/opacity only) | On | On |
| Custom cursor | Off (`pointer: coarse`) | Off | Optional |
| Hover previews | Off — static poster | Off | On, hover-intent |
| Images | Smallest `sizes` candidate | Mid | Full |

Mobile is a **worse device on a worse network**, not just a narrower one.
Budget accordingly — see [performance](../performance/SKILL.md) and
[3d-web](../3d-web/SKILL.md).

## Techniques

- Prefer intrinsic responsiveness over breakpoints: `clamp()` for type and
  spacing, `grid-template-columns: repeat(auto-fit, minmax(280px, 1fr))`,
  `flex-wrap`. Fewer breakpoints, fewer places to break.
- Use container queries (`@container`) for components reused at different
  widths — a card should respond to its container, not the viewport.
- `min-h-dvh`, not `min-h-screen`/`100vh` — `vh` is wrong on mobile browsers
  with a dynamic toolbar and causes a visible jump on scroll.
- Respect safe areas on notched devices: `env(safe-area-inset-*)` for anything
  fixed to an edge.
- `sizes` on every `next/image` — without it the browser downloads the
  desktop-width image on a phone.
- Test `(pointer: coarse)` and `(hover: none)`, not just width. A touch laptop
  is wide *and* coarse.

## Verification

Do not rely on the responsive toolbar alone:

1. DevTools at 360, 390, 768, 1024, 1440. No horizontal scroll at any width.
2. Drag the viewport slowly from 320px to 1600px. Watch for a width where
   something collides, overflows, or leaves an orphan.
3. Zoom to 200% and 400% at desktop width — this is also an
   [accessibility](../accessibility/SKILL.md) requirement and it surfaces the
   same bugs.
4. Rotate to landscape on a phone-sized viewport. A `100dvh` hero in landscape
   is a common failure.
5. Load on a real phone if one is available. Simulated touch misses momentum
   scrolling, tap delay, and font rendering differences.
