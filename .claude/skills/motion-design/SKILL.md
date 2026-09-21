---
name: motion-design
description: The motion system for this portfolio — the per-page motion budget, hero entrance choreography, scroll-linked beats, page transitions, timing and easing tokens, and the reduced-motion requirement. Load BEFORE adding any animation, transition, scroll effect, parallax, stagger, page transition, framer-motion or GSAP component, CSS keyframe, or hover timing.
---

# Motion design

**Scope:** *when* things move and *how they are timed*. What an element does
when you touch it is [interaction-design](../interaction-design/SKILL.md).

Motion here is a **budget, not a default**. The goal is a coherent motion
*system* — a few deliberate moments that feel authored — not a site where
everything moves because everything can.

The failure mode this guards against is specific: applying fade-up-on-scroll
uniformly to every section. That single pattern, more than any other, is what
makes a site read as generated. Choreographed motion is the opposite of it, and
the difference is scarcity plus intent.

## The budget

Per page:

| Allowance | Limit |
|---|---|
| Hero entrance choreography | 1, on first load of the landing page only |
| Section reveal on scroll | one fade-up (20px, 300ms) per section, **once**, on the section container only — not per child |
| Scroll-linked moments | **max 2** per page (the hero 3D counts as one) |
| Page/route transition | 1 system, site-wide, ≤ 300ms |
| Interaction feedback | unlimited (hover/focus/press — the user caused it) |
| Layout animation on user action | unlimited (filter, expand, open) |
| Ambient/looping motion | the 3D scene, a real loading indicator, the Technologies logo marquee (pauses on hover, static under reduced motion), and the hero tagline typewriter (user-requested: 9 phrases, ~5.5 s hold, static first phrase for SR and reduced motion) |

If a page wants a third scroll moment, one of the existing two is removed
first. This is what keeps the system readable.

**Still banned outright** — these are not budget items:

- Staggered reveal of list/grid items *on scroll* — except the Technologies
  grid, which the user asked to be "full of animations": cards pop in at 45ms
  steps, once.
- Counter animations ticking numbers from zero.
- Full-screen curtain wipes that add real latency to navigation.
- Animated gradient backgrounds, floating blobs, particle fields behind text.
- Hover effects animating `width`/`height`/`margin`/`padding`/`top`/`left` —
  reflow per frame, and it shifts neighbors.
- `transition: all`. Name the properties.
- Anything over 400ms for UI feedback.

## Hero choreography

The one place stagger is correct, because it is a composed entrance rather than
a scroll side-effect. Runs once, on first load, and never blocks reading.

```
headline     static — painted on the first frame, no entrance (see below)
eyebrow      0ms    → 240ms
lede       200ms    → 360ms
CTA        300ms    → 300ms
3D object  360ms    → 540ms   (poster settles in; canvas crossfades over it later)
```

Rules:
- Total sequence ≤ **900ms**. Past that the visitor is waiting on your website.
- Travel is small: `translateY(12px) → 0`, never 40px. Large travel reads as a
  template preset.
- The headline does **not** animate. It is the LCP element, and Chrome does not
  count an element at `opacity: 0` as painted until its animation ends —
  measured as +0.9 s LCP on mobile. The page arrives with its headline; the
  rest settles in around it, which reads stronger anyway.
- Runs once per session, not on every client-side navigation back to home.

## Scroll-linked moments

Max two per page. A scroll moment is a *designed beat* — something the visitor
notices as intentional — not a reveal applied to a container.

Good candidates for this site:
- The 3D hero object rotating or the camera dollying as the hero scrolls away.
- One featured project image scaling or unmasking as it enters.
- A large display heading tracking slightly against scroll direction.

Implementation:
- `framer-motion`'s `useScroll` + `useTransform`, or GSAP ScrollTrigger if the
  3D scene already pulls in GSAP. Do not ship both libraries.
- Bind to `transform`/`opacity` only.
- Throttle to rAF; never do layout reads inside a scroll handler.
- Disable below `md` — scroll-linked motion on touch is janky and competes with
  momentum scrolling. See [responsive-design](../responsive-design/SKILL.md).

Parallax is permitted **only** as one of these two beats, at low intensity
(≤ 15% differential), never on a full-page background.

## Page transitions

One system, site-wide. A transition must not make navigation feel slower than
it is.

- ≤ 300ms total, and the incoming content starts painting immediately — the
  outgoing view fades under it rather than the incoming waiting for a clear
  screen.
- Cross-fade with a small `translateY`, or a shared-element transition on the
  project image between index and detail. Nothing more elaborate.
- No full-screen colored panel sweeping across.
- Scroll position resets to top on forward navigation and restores on back.
- Focus moves to the new page's `<h1>`. See
  [accessibility](../accessibility/SKILL.md).

## Tokens

```css
--duration-fast:  120ms;  /* hover, focus ring, color shift   */
--duration-base:  200ms;  /* press, small state change        */
--duration-slow:  320ms;  /* layout change, panel, transition */
--duration-hero:  560ms;  /* hero entrance elements only      */

--ease-out:    cubic-bezier(0.22, 1, 0.36, 1);    /* entering, settling */
--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);    /* state to state     */
--ease-in:     cubic-bezier(0.55, 0, 1, 0.45);    /* leaving — rare     */
```

No `linear` except a spinner. No `ease` (the CSS default) — it is mushy. No
bounce, elastic, or overshoot on UI; this direction is composed, not playful.

**Animate `transform` and `opacity` only.** `color`, `background-color`, and
`border-color` are allowed at `--duration-fast` for hover feedback. Nothing
else animates, ever.

## Implementation cost

- CSS transitions for all interaction feedback — zero JS.
- `framer-motion` (`motion/react`) for the hero, layout animation, and scroll
  beats. Import dynamically where the component is below the fold.
- GSAP only if the 3D scene needs its timeline. One animation library in the
  initial bundle, not two. Budget in
  [performance](../performance/SKILL.md).
- If a page pulls in an animation library for a single fade, replace it with
  CSS.

## prefers-reduced-motion

Mandatory, and it means **removed, not reduced**:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

The CSS switch does not stop `requestAnimationFrame`, `useFrame`, scroll-driven
JS, or autoplaying video — each needs its own `useReducedMotion()` guard. The
hero renders in its final state instantly; scroll beats do not bind; the 3D
scene renders its poster. Full requirements in
[accessibility](../accessibility/SKILL.md).

The reduced-motion site must still look **finished**. If removing motion leaves
something invisible, empty, or broken, the motion was load-bearing and the
design is wrong.

## Review question

For each animation: *what does the visitor learn from this movement that they
would not learn from it appearing instantly?* "It looks nice" does not ship.
