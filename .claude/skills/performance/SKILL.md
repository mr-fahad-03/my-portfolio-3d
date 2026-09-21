---
name: performance
description: Hard performance numbers for this portfolio — Lighthouse thresholds, Core Web Vitals targets, JS bundle ceilings, image and font rules, 3D and animation cost, and the commands that verify them. Load BEFORE adding a dependency, importing a library, adding an image or font, changing next.config, or shipping any change; and again before declaring any work done.
---

# Performance

**Scope:** cost and its verification. Scene-internal budgets (draw calls,
triangles) live in [3d-web](../3d-web/SKILL.md); per-breakpoint degradation in
[responsive-design](../responsive-design/SKILL.md).

A 3D portfolio that takes six seconds to load costs more interviews than it
wins. The numbers below are pass/fail, not aspirational. A change that breaks
one of them is not finished.

## Targets

Measured on **mobile**, Lighthouse simulated throttling (Slow 4G, 4x CPU
slowdown), production build, cold cache.

| Metric | Budget | Fail |
|---|---|---|
| Lighthouse Performance | ≥ 95 | < 90 |
| Lighthouse Accessibility | 100 | < 100 |
| Lighthouse Best Practices | ≥ 95 | < 95 |
| Lighthouse SEO | 100 | < 100 |
| LCP | ≤ 1.8s | > 2.5s |
| CLS | ≤ 0.02 | > 0.1 |
| INP | ≤ 150ms | > 200ms |
| TBT | ≤ 150ms | > 300ms |
| TTFB | ≤ 400ms | > 800ms |

Desktop numbers are not a substitute. Mobile is the measurement.

## Size ceilings

Measured floors on this stack (Next 16 + React 19 + three + R3F), so the
budgets are honest rather than aspirational:

| Asset | Budget | Note |
|---|---|---|
| Framework floor in initial JS (React DOM + Next runtime) | ~160 KB gz | not ours to cut; measured 159 KB |
| **Our** code in the initial bundle | **≤ 25 KB gz** | measured 16 KB; this is the number to watch |
| Initial JS total (first load, gzipped, per route) | ≤ 185 KB | |
| The 3D chunk (async, never in initial) | ≤ 240 KB gz | three + R3F reconciler alone are ~230 KB; drei was removed for 1 KB, so do not chase this further |
| Total JS including async chunks | ≤ 420 KB | |
| Animation library in initial bundle | 0 preferred; ≤ 1 (framer-motion **or** GSAP, never both) | hero choreography is CSS |
| CSS | ≤ 20 KB |
| Fonts | ≤ 2 families, ≤ 4 files, ≤ 100 KB total, `woff2` only |
| Any single image | ≤ 200 KB |
| 3D models + textures | ≤ 1.5 MB (see [3d-web](../3d-web/SKILL.md)) |
| Total page weight, first view | ≤ 2.5 MB |

Next 16 no longer prints a First Load JS column in `next build` output, so
measure the built chunks directly — see **Verification** below. Classify what
you find: framework chunks (React DOM, Next runtime) are a fixed floor; only
the chunks containing our markers (component names, copy) are actionable.

## Rules

**Dependencies.** Before installing anything, check its cost on bundlephobia
and state the number. A dependency under 5 KB that saves real work is fine; a
30 KB date library for one `toLocaleDateString` is not. Prefer the platform.
Specifically banned from the initial bundle: moment, lodash (use
`lodash-es` named imports or write the function), axios (use `fetch`),
full icon packs (import individual icons), and any UI kit imported wholesale.

**Server Components by default.** `'use client'` is opt-in, per leaf component,
and it is a cost — everything below it ships to the browser. If a file has
`'use client'` at the top and 200 lines of static markup underneath, split it.

**Images.** `next/image` always, with explicit `width`/`height` or `fill` in a
sized box — no unsized images, ever, because that is where CLS comes from.
AVIF with WebP fallback (`formats: ['image/avif', 'image/webp']` in
`next.config.ts`). `priority` on the LCP image only — at most one per page.
Everything else lazy. Source images are resized before they enter `public/`;
a 4000px JPEG does not belong in the repo.

**Fonts.** `next/font/local` or `next/font/google` only — these self-host and
inline the `@font-face`, avoiding a render-blocking request to a third party.
`display: 'swap'`. Subset to `latin`. Preload only the face used above the fold.

**Third-party scripts.** Default: none. Analytics, if any, is a single
lightweight script loaded with `next/script` `strategy="afterInteractive"`.
No tag managers, no chat widgets, no embedded social feeds. Each one is an
uncontrolled third party on your critical path.

**No layout shift.** Everything that loads late — images, the 3D canvas,
embeds, fonts — occupies its final dimensions from the first paint.

## Rendering cost

Bundle size is not the whole story — a small bundle that janks still fails.

- **Animate `transform`/`opacity` only.** Anything else triggers layout or
  paint every frame. Enforced in
  [motion-design](../motion-design/SKILL.md).
- No layout reads (`offsetTop`, `getBoundingClientRect`) inside scroll or
  `useFrame` handlers — that is a forced synchronous reflow per frame.
- Never `setState` in an animation loop. Mutate refs.
- Memoize expensive children under an animating parent; an unmemoized subtree
  re-renders 60 times a second.
- Pause everything offscreen and on hidden tabs: 3D `frameloop`, video,
  `IntersectionObserver`-gated animation.
- Dispose Three.js resources on unmount or GPU memory leaks across routes.
- **Never create a WebGL context to probe support.** `canvas.getContext("webgl")`
  during hydration initialises the GPU or SwiftShader — measured at 4.9 s TBT
  in Lighthouse — and burns one of ~16 contexts. Check API presence
  (`"WebGL2RenderingContext" in window`) and catch real failures with an
  error boundary around the canvas.
- On touch/narrow tiers, fetch the 3D chunk on first interaction, not on idle:
  a cold mobile load then costs only the poster.
- Check the Performance panel with 4x CPU throttling: no long task over 50ms
  during scroll, and a green FPS bar through the hero.

## Verification

Run before saying a change is done:

```bash
npm run build

# Total gzipped JS shipped from /_next/static (the ceiling is 350 KB):
find .next/static/chunks -name '*.js' -exec gzip -c {} \; | wc -c

# Per-chunk, largest first — spot the one that grew:
find .next/static/chunks -name '*.js' -print0 \
  | xargs -0 -I{} sh -c 'printf "%8s  %s\n" "$(gzip -c "{}" | wc -c)" "{}"' \
  | sort -rn | head -20

# What a route actually loads (authoritative): DevTools Network tab,
# filter to JS, disable cache, reload, read the transferred total.

npx --yes @next/bundle-analyzer   # or ANALYZE=1, once wired into next.config.ts
npx --yes unlighthouse --site http://localhost:3000   # or lighthouse, mobile preset
```

For per-route attribution, the Network tab is the ground truth in Next 16 —
load the route cold and read the transferred JS total. `--experimental-analyze`
exists but is Turbopack-only and still rough.

Manual checks that automated tools miss:

- Throttle to Slow 4G + 4x CPU in DevTools and load the site once. Is the hero
  readable in under two seconds?
- Confirm `three` is **not** in the main entry chunk.
- Check the Coverage tab: unused JS on first load should be under ~30%.
- Load on a real mid-tier phone if one is available. Simulated throttling is
  optimistic about CPU.

Report actual numbers when you finish, not "should be fast". If a budget is
exceeded and you could not fix it, say which one and by how much.
