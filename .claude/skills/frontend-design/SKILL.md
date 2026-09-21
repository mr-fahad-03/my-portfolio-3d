---
name: frontend-design
description: How pages and sections are composed and built in this portfolio — section architecture, the hero, project presentation, component discipline, content rules, and the anti-generic build checklist. Load BEFORE creating or restructuring any page, route, section, or layout component, and before adding a new section to an existing page. The main implementation skill for UI work.
---

# Frontend design

**Scope:** page and section *composition and implementation*. Values are
[visual-design](../visual-design/SKILL.md); concept is
[creative-direction](../creative-direction/SKILL.md); behavior is
[interaction-design](../interaction-design/SKILL.md).

This is a premium developer/creative portfolio. It is judged by engineers and
designers who have seen a thousand of them, in about four seconds.

## Sections: only what earns its place

A portfolio needs: a hero, the work, enough about you to establish credibility,
and a way to make contact. Everything else is optional and most of it is
padding.

Ship a section only when there is **real content** for it. An empty "Testimonials"
section with two invented quotes is worse than no section. If content does not
exist yet, the section does not exist yet.

Specifically reconsidered every time:
- *Skills* — usually better absorbed into project descriptions, where a
  technology appears next to evidence you used it. A standalone list of logos
  says nothing.
- *Blog* — only if there are posts and they are current.
- *Stats* ("50+ projects", "5 years experience") — only if true and unusual.
- *Services/pricing* — only if actually freelancing.

## The hero

The strongest visual moment on the site and the only place spectacle is
budgeted. It must do three things within four seconds: say who you are, show
you can build, and give one obvious next action.

Structure for Direction A:

- Oversized `text-hero` display type, off-center, tight leading, allowed to
  overflow the grid or bleed past the container edge.
- The 3D object as a lit subject, not a background. See
  [3d-web](../3d-web/SKILL.md).
- A short, specific line of body copy. Real information — what you build and
  for whom. Not "passionate developer crafting delightful experiences."
- One primary action. Not two buttons of equal weight.
- Text is readable before any WebGL parses, and readable if it never parses.

**No centered `<h1>` + subtitle + two buttons on a gradient.** That is the
average this site exists to beat.

No typewriter effect, no rotating job titles, no scroll-down arrow bouncing.

## Project presentation

The work is why anyone is here, so it gets the most design attention and the
most real content.

- Prefer **asymmetric, varied** project layouts over a uniform card grid.
  Alternating image side, differing widths, one featured project at larger
  scale — variation signals editorial control. A 3×2 grid of identical cards is
  the templated default.
- Each project shows: what it is, what problem it solved, what you built, the
  stack, and a link to live and/or source. A screenshot with a one-line caption
  is not a case study.
- Images are real screenshots of real work. No laptop mockups floating at an
  angle, no generic dashboard stock imagery.
- Three excellent projects beat eight filler ones. Cut ruthlessly.

## Component discipline

- **Server Components by default.** `'use client'` is opt-in per leaf, and it is
  a cost — everything below it ships to the browser. A file with `'use client'`
  and 200 lines of static markup underneath gets split.
- Build the section first, extract a component when the *third* use appears.
  Premature abstraction produces a component library nobody needed and makes
  every section look identical — which is itself the templated tell.
- One responsibility per component. A `<Card>` that takes 14 props is several
  components.
- Layout primitives (`<Container>`, `<Section>`) are fine and encouraged; they
  enforce the spacing rhythm from [visual-design](../visual-design/SKILL.md).
- Semantic HTML from the start, not retrofitted:
  `<header> <nav> <main id="main"> <section> <article> <footer>`. See
  [accessibility](../accessibility/SKILL.md).
- Co-locate: `src/components/<section>/` holds that section's parts. Shared
  primitives in `src/components/ui/`. 3D in `src/components/scene/`.
- No UI kit imported wholesale. No component library that brings its own design
  language — it will fight Direction A and win.

## Content rules

Design and copy fail together. Placeholder text hides bad layout.

- Never lorem ipsum. Write real copy, or write `TODO(content):` and say so.
- Specific beats enthusiastic. "Built the payments integration handling 40k
  transactions/month" over "passionate about building scalable solutions."
- No third-person bio. No "Hi, I'm X 👋".
- Dates, roles, and stack are concrete and current.

## Anti-generic checklist

Run before calling a page done. Each must be answerable:

1. Is there exactly one clear focal point above the fold?
2. Is the scale contrast dramatic, or does everything hover near 16–32px?
3. Is there deliberate empty space, or is the viewport filled edge to edge?
4. Does any section repeat another section's structure? If two sections share a
   shape, one should change.
5. Are the corners, shadows, and borders consistent with the token set, or did
   a `rounded-2xl shadow-xl` slip in?
6. Is every card in a grid identical? Break the uniformity or justify it.
7. Remove all text from a screenshot — could this be any other portfolio?
8. Is there a single raw hex value or off-scale spacing in the diff?
9. Does the page work with JS disabled, at least for reading?
10. Is anything on the page there only because portfolios usually have it?

Cross-check the finished page against
[responsive-design](../responsive-design/SKILL.md),
[accessibility](../accessibility/SKILL.md), and
[performance](../performance/SKILL.md) before reporting done. Then run
[design-review](../design-review/SKILL.md).
