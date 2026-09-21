---
name: design-review
description: Critique and then FIX a built page in this portfolio — audit it as a senior creative director and frontend engineer would, find everything generic, templated, inconsistent, excessive or unfinished, and repair it directly. Load when a page or section is complete, before shipping, when the user says something looks off, generic, cheap, unfinished or AI-generated, or when asked to review, critique, audit or polish existing UI.
---

# Design review

**Scope:** judging finished work and repairing it. Run this *after* building,
as the last gate before shipping.

## The rule that makes this useful

**Fix, do not report.** A list of problems handed back to the user is a
deferral. Audit the page, then apply the fixes in the same pass. Only flag
separately what genuinely needs a decision — a missing project write-up, a
choice between two directions, anything requiring content you do not have.

Review with actual severity. "Looks good overall!" from a review pass is a
failed review — there is always something. Be the harshest reader this site
will get, because the alternative is that an interviewer is.

## How to run it

1. Read the page source and the components it composes.
2. Run the app and look at it — mobile width, tablet, desktop, both themes.
   `npm run dev`, then open it. A review from source alone
   misses the things that matter most here.
3. Work the checklist below.
4. Fix everything fixable, in order of severity.
5. Report what changed and what is left, with specifics.

## Checklist

### Does it look generic?

The highest-severity category. Reference
[creative-direction](../creative-direction/SKILL.md).

- Strip the text from a section mentally — could this be any other portfolio?
- Is the hero a centered headline + subtitle + two buttons?
- Do sections share a repeated shape (full-width band → centered heading →
  three cards)? If two sections have the same silhouette, one changes.
- Are all cards in a grid identical in size, shape, and content density?
- Any decorative element — blob, gradient, grain, floating shape — with no
  relationship to the concept?
- Any section present only because portfolios usually have one?
- Is the copy specific, or is it "passionate about crafting delightful
  experiences"?

### Typography

Reference [visual-design](../visual-design/SKILL.md).

- Is the scale contrast dramatic, or does everything sit between 16 and 32px?
- Is the display face doing real work at real size, or timidly scaled down?
- More than three families, or more than ~4 sizes visible in one viewport?
- Did Inter, Roboto, or a system stack slip in anywhere?
- Any line of body copy longer than ~68ch?
- Is large display type optically aligned, or mathematically flush and
  therefore looking indented?

### Spacing and composition

- Any value off the 4px scale? Any `p-5`, `gap-7`, arbitrary bracket?
- Is section rhythm consistent, or does one section have half the breathing
  room of its neighbors?
- Is there deliberate negative space, or is the viewport filled edge to edge?
- Is there one clear focal point above the fold, or three competing?
- Does everything align to something?

### Color and surface

- Any raw hex in a component?
  `grep -rnE '#[0-9a-fA-F]{3,8}' src --include='*.tsx'`
- A second accent hue anywhere?
- Is the light theme as considered as the dark, or an afterthought?
- Consistent radii, or did a `rounded-2xl` appear among `rounded-sm`?
- Shadows from the two-step set, or an ad-hoc `shadow-xl`?

### Motion

Reference [motion-design](../motion-design/SKILL.md).

- Count the scroll-linked moments. More than two on a page?
- Is anything fading up on scroll section by section? Remove it.
- Anything looping with no reason?
- Any animation over 400ms for UI feedback?
- Does anything animate a property other than transform/opacity/color?
- Toggle reduce-motion: does everything stop, and does the page still look
  finished?

### Interaction

Reference [interaction-design](../interaction-design/SKILL.md).

- Does every interactive element have all five states?
- Is anything revealed only on hover?
- Any `<div onClick>`?
- Are hit targets ≥44px on touch?
- Nested interactive elements inside a clickable card?
- Does the contact form report success and failure?

### Responsive

Reference [responsive-design](../responsive-design/SKILL.md).

- Drag from 320px to 1600px. Any collision, overflow, or orphan?
- Does mobile feel designed, or squeezed?
- Was tablet actually considered?
- Any `100vh` that should be `100dvh`?

### Accessibility and performance

Run the real checks rather than eyeballing — see
[accessibility](../accessibility/SKILL.md) and
[performance](../performance/SKILL.md). Lighthouse a11y must be 100 and
performance ≥95 on mobile. Tab through the whole page.

### Finish

- Any placeholder text, lorem ipsum, or `TODO` visible to a user?
- Any broken image, dead link, or 404?
- Is there a favicon, an OG image, and a real `<title>` and meta description?
- Does the page work with JS disabled, at least for reading?
- Is the console clean — no warnings, no hydration errors?

## Severity

Fix in this order:

1. **Broken** — dead links, console errors, keyboard traps, contrast failures,
   layout breaking at some viewport.
2. **Generic** — anything that makes the site look templated. This is a real
   defect here, not a matter of taste.
3. **Inconsistent** — off-scale values, stray radii, a second accent.
4. **Excessive** — motion over budget, sections without content, effects that
   cost more than they return.
5. **Polish** — optical alignment, hover timing, micro-copy.

## Reporting

Say what you changed, concretely: "removed fade-up from four sections, cut the
projects grid from uniform 3×2 to a featured-plus-two layout, replaced two raw
hex values with tokens." Then list what still needs the user: missing content,
decisions, anything you could not verify. Give real Lighthouse numbers, not
"should be fine."
