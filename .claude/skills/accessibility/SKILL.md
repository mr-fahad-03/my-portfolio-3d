---
name: accessibility
description: Accessibility requirements for this portfolio — keyboard operation and focus management, prefers-reduced-motion (mandatory the moment 3D or animation exists), contrast ratios, semantic structure, and the manual checks that verify them. Load BEFORE writing any interactive element, form, nav, modal, icon button, 3D scene, page transition, or animation, and before declaring any UI work done.
---

# Accessibility

**Scope:** whether everyone can use it. Element behavior and states are
[interaction-design](../interaction-design/SKILL.md); motion rationing is
[motion-design](../motion-design/SKILL.md).

Lighthouse Accessibility must be **100**, and that score is the floor, not the
goal — it catches maybe 30% of real problems. The rest is below.

This matters twice over here: a portfolio is reviewed by engineers, and an
inaccessible portfolio is a visible statement about how you build.

## Keyboard

Every interactive element is reachable and operable by keyboard. Test by
unplugging the mouse and doing the full tour: nav → hero CTA → each project →
contact → footer. If you cannot complete a task, it is broken.

- **Use real elements.** `<button>` for actions, `<a href>` for navigation.
  A `<div onClick>` is not focusable, not announced, and does not respond to
  Enter/Space. Never add `role="button"` + `tabIndex` to a div when a `<button>`
  exists.
- **Never remove the focus indicator.** `outline: none` without a replacement
  is banned. The indicator:

  ```css
  :focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
    border-radius: var(--radius-sm);
  }
  ```

  It must be visible against **both** themes and against whatever it sits on —
  check the accent against dark surfaces specifically.
- **Tab order follows visual order.** No positive `tabIndex` values, ever.
  If CSS reorders content (`flex-direction: row-reverse`, `order`), the DOM
  order changes instead.
- **Skip link** to `#main` as the first focusable element, visible on focus.
- **Focus is managed** on route change (move to `<h1>` or the main landmark;
  required by the page-transition system in
  [motion-design](../motion-design/SKILL.md))
  and on dialog open (into the dialog) / close (back to the trigger). Dialogs
  trap focus and close on `Escape`. Prefer the native `<dialog>` element.
- **Nothing is hover-only.** Any information or control revealed on hover is
  also revealed on focus. A project card whose links appear on hover is
  unreachable by keyboard.
- The 3D canvas is not a tab stop unless it is interactive; if it is,
  `tabIndex={0}` plus an `aria-label` describing it, plus keyboard controls,
  plus a non-3D route to the same information.

## prefers-reduced-motion

**Mandatory the moment this site has 3D or any animation.** Not a progressive
enhancement — a correctness requirement. Unguarded parallax and continuous
motion cause nausea, dizziness, and migraine in people with vestibular
disorders.

Three places it must be handled:

```css
/* 1. Global CSS kill switch */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

```tsx
// 2. JS animation (framer-motion)
const reduced = useReducedMotion()
<motion.div animate={reduced ? {} : { y: 0 }} />

// 3. The 3D scene — poster image, no canvas at all
if (reduced) return <ScenePoster />
```

The CSS kill switch alone is not enough: it does not stop `requestAnimationFrame`
loops, `useFrame`, autoplaying video, or scroll-driven JS. Each of those needs
its own guard.

Verify by toggling **macOS → Settings → Accessibility → Display → Reduce
motion**, or DevTools → Rendering → *Emulate CSS prefers-reduced-motion*.
Reload and confirm: nothing moves, and the page still looks finished.

## Contrast

Against the actual background the text sits on, in **both** themes. Verify with
DevTools' contrast checker or the Lighthouse audit — do not eyeball it.

| Content | Minimum |
|---|---|
| Body text, and any text under 18.66px / under 24px bold | 4.5:1 |
| Large text (≥ 24px, or ≥ 18.66px bold) | 3:1 |
| Icons, form borders, focus indicators, other non-text UI | 3:1 |
| Disabled controls | exempt, but make the state obvious another way |

The [visual-design](../visual-design/SKILL.md) tokens are chosen to pass, but a
new combination is not automatically safe — `--text-muted` on
`--surface-raised` needs checking, and `--text-faint` fails body
text by design (it is for decorative use only).

**Color is never the only signal.** Error states get an icon and text, not just
red. Links in body copy are underlined, not just accent-colored.

Text over the 3D scene or any image needs a solid or scrim-backed container —
contrast against a moving background is unmeasurable and therefore failing.

## Structure and semantics

- **One `<h1>` per page.** Headings descend without skipping (`h1 → h2 → h3`).
  Heading level is meaning; size is `class`. Never pick a heading tag for size.
- **Landmarks:** `<header>`, `<nav>`, `<main id="main">`, `<footer>`. One
  `<main>`. Multiple `<nav>`s get distinct `aria-label`s.
- **Every image has `alt`.** Descriptive when it carries meaning, `alt=""` when
  decorative. The scene poster's alt describes what the 3D scene shows.
- **Icon-only buttons need an accessible name** — `aria-label`, or visually
  hidden text. An icon alone announces as "button".
- **Link text stands alone.** "Read more" x5 is useless in a link list; use
  "Read more about <project>" or a visually hidden suffix.
- **Forms:** every input has a real `<label>` (placeholder is not a label).
  Errors are tied with `aria-describedby` and announced via a live region.
  `<fieldset>` + `<legend>` for groups.
- **`lang="en"`** on `<html>` (Next sets this in the root layout — keep it).
- **ARIA is a last resort.** Correct HTML first. Wrong ARIA is worse than none.
- Respect `prefers-contrast: more` and never disable zoom
  (`user-scalable=no` and `maximum-scale` are banned).

## Verification

```bash
npx @axe-core/cli http://localhost:3000        # automated pass
npx lighthouse http://localhost:3000 --only-categories=accessibility --preset=desktop
```

Manual, every time UI changes — automated tools find roughly a third of issues:

1. Tab through the whole page. Is focus always visible, and in visual order?
2. Toggle reduce-motion. Does everything stop, and does the page still work?
3. Toggle dark mode. Check contrast again — this is where it usually breaks.
4. Zoom to 200% and to 400%. No horizontal scroll, no clipped content.
5. Read it with VoiceOver (`Cmd+F5`) — at least the nav, hero, and one project.
6. Disable CSS (or check the DOM outline). Does the content still make sense
   in order?

If any check fails, say which one. Do not report UI work as done without
running at least checks 1–4.
