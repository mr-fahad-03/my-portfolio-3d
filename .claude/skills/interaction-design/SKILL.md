---
name: interaction-design
description: How interactive elements behave in this portfolio — buttons, links, cards, navigation, cursor, form controls, and project previews. Covers states, affordance, hit targets, and feedback. Load BEFORE building or changing any button, link, nav, card, input, menu, or hover behavior. Timing values for these come from motion-design.
---

# Interaction design

**Scope:** what an element *does* when touched, and what it looks like in each
state. Timing and easing come from
[motion-design](../motion-design/SKILL.md); colors from
[visual-design](../visual-design/SKILL.md).

Interaction quality is where a portfolio quietly proves competence. A button
with no press state, a card whose whole surface looks clickable but isn't, a
nav that jumps on hover — each is small and each is noticed.

## Every interactive element has five states

Not three. Ship all five or it is unfinished:

| State | Requirement |
|---|---|
| Rest | The default. Must already read as interactive — affordance does not wait for hover. |
| Hover | Pointer devices only. Subtle: color shift, border, ≤2px lift. |
| Focus-visible | **Never** suppressed. `outline: 2px solid var(--accent); outline-offset: 2px`. Visible in both themes. |
| Active/press | Immediate, `scale(0.98)` or a value shift. Confirms the tap landed before any navigation. |
| Disabled / loading | Obvious without relying on color alone. Loading keeps its original width — no layout jump. |

**Hover is not an affordance.** Touch has no hover, and roughly half the
traffic is touch. If an element only looks clickable on hover, it is broken on
mobile. Never hide information or controls behind hover — reveal on focus too.

## Hit targets

- Minimum **44×44px** for anything tappable, including icon-only buttons.
- Extend the target with padding or a pseudo-element, not by enlarging the
  visual. A 20px icon gets a 44px invisible target around it.
- Adjacent targets need ≥8px separation.
- Inline text links are exempt from 44px but get generous line-height.

## Buttons

- Exactly one primary action per view. If two buttons have equal visual weight,
  the hierarchy is wrong.
- Three variants, no more: `primary` (ink fill — `--text` on `--bg`; the accent is reserved for the 3D object and links), `secondary` (border only),
  `ghost` (text + hover background). A fourth means a decision was avoided.
- `--radius-md`. Not pills — out of register for this direction.
- Label is a verb phrase describing the outcome: "View case study", not
  "Click here" or "Learn more".
- Real `<button>` for actions, real `<a href>` for navigation. A `<div onClick>`
  is not focusable and does not respond to Enter/Space. See
  [accessibility](../accessibility/SKILL.md).

## Links

- Links in body copy are **underlined**, not accent-colored only — color alone
  is not a sufficient signal.
- `text-underline-offset: 0.2em`, `text-decoration-thickness: 1px`. Hover
  thickens or shifts to `--accent`.
- Navigation and UI links may drop the underline since position gives context.
- External links get a small indicator and `rel="noopener noreferrer"`.
- Link text stands alone — five "Read more" links in a row are useless out of
  context. Use "Read more about <project>" or a visually hidden suffix.

## Cards and project previews

- **The whole card is one link, or nothing is.** Mixed models — a clickable
  card containing separately clickable tags — produce nested interactive
  elements, which is invalid and unusable by keyboard. Pattern: one `<a>`
  covering the card via a pseudo-element, with any secondary links raised above
  it in stacking order and given their own accessible names.
- Rest state reads as interactive: a visible border, real structure.
- Hover: border to `--border-strong`, background to `--surface-raised`,
  `translateY(-2px)`. The image inside may scale to `1.02` *within* an
  `overflow: hidden` frame so the layout never shifts.
- Never animate the card's own dimensions.
- If there is a live preview (video/3D), it loads on hover-intent (~120ms
  delay) — never eagerly, never on touch. Static poster is the default state.

## Navigation

- Visible on every page. If it collapses on mobile, the trigger is a real
  `<button>` with `aria-expanded`, the panel closes on `Escape`, on outside
  click, and on route change, and focus is trapped while open and returned to
  the trigger on close.
- Current page is marked with `aria-current="page"` **and** a visible
  indicator that is not color alone.
- A sticky header shrinks at most once, at one threshold, with hysteresis so it
  cannot flicker at the boundary. Or it does not stick at all — often the
  better choice for this direction.
- No mega-menus. No hover-opened dropdowns (unreachable on touch); click to
  open.

## Cursor

A custom cursor is **optional and high-risk**. It is only permitted under these
conditions, all of them:

- `(pointer: fine)` only — never on touch.
- Disabled under `prefers-reduced-motion`.
- The native cursor's information is preserved: text still shows an I-beam,
  disabled still shows `not-allowed`, links still read as clickable.
- Follows with `transform: translate3d()` in a rAF loop, never `top`/`left`.
- Degrades to the system cursor if anything fails.

If those cannot all be met, use the system cursor. A laggy custom cursor is
worse than none, and a custom cursor that hides state is a real usability bug.

## Forms

- Real `<label>` for every input. A placeholder is not a label — it vanishes on
  input and fails contrast.
- Validate on blur and on submit, not on every keystroke.
- Errors: inline, next to the field, tied with `aria-describedby`, announced
  via a live region, with an icon and text rather than red alone.
- Submit shows a loading state, disables double-submit, and reports success or
  failure in text. A contact form that silently does nothing is worse than a
  mailto link.
- Correct `type`, `inputmode`, and `autocomplete` on every field.

## Feedback timing

- Under 100ms: no indicator needed.
- 100ms–1s: local spinner or state on the control itself.
- Over 1s: progress indication and a description of what is happening.
- Every async action ends in a visible success or failure. Silence is a bug.
