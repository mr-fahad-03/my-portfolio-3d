---
name: 3d-web
description: Three.js and React Three Fiber conventions for this portfolio — scene setup, drei, GLTF/GLB, HDR environments, lighting, postprocessing, shaders, camera and scroll and pointer interaction, the hard frame budget, lazy-loading so the canvas never blocks first paint, and mandatory mobile and reduced-motion fallbacks. Load BEFORE touching anything involving Three.js, R3F, drei, WebGL, GLSL, a canvas, a 3D model, or a shader.
---

# 3D on the web

**Scope:** everything inside the canvas. Its role in the page composition is
[frontend-design](../frontend-design/SKILL.md); its size cost is
[performance](../performance/SKILL.md).

3D is why a visitor remembers this site and why they leave before it loads.
Both are true.

## 3D is not impressive. Intentional 3D is.

Before adding a scene, state what it does for the visitor. Acceptable answers:
it *is* the hero subject; it demonstrates a skill the portfolio claims; it
makes something otherwise abstract legible. Unacceptable: "portfolios have 3D."

Per Direction A there is **one hero object, lit like a product photograph**.

Prefer: a single interactive hero object · slow deliberate camera movement ·
real depth from lighting and occlusion · one scroll-linked beat · subtle
pointer parallax.

Avoid: 3D in multiple sections · particle systems as decoration · floating
geometric shapes with no meaning · anything that competes with the headline for
attention · scenes that only work on a desktop GPU.

## Stack

- `three`, `@react-three/fiber` v9 (React 19), `@react-three/drei` v10
- `@react-three/postprocessing` **only** with a named justified effect; it is a
  second render pass and the first thing to cut.
- GSAP only if a timeline is genuinely needed — otherwise `useFrame` + lerp.
  One animation library ships, not two; coordinate with
  [motion-design](../motion-design/SKILL.md).
- Models: `.glb`, Draco or Meshopt compressed, via `useGLTF`.

Import named members from the package root so drei tree-shakes. Never
`import * as drei`.

## Hard budget

If a change breaks one of these, the change is wrong, not the budget.

| Metric | Limit | Check |
|---|---|---|
| Draw calls | ≤ 60 | `r3f-perf` overlay, or `gl.info.render.calls` |
| Triangles | ≤ 150k | `gl.info.render.triangles` |
| Texture resolution | ≤ 1024² (one 2048² hero texture max) | file inspection |
| Texture format | KTX2/Basis, or WebP. Never PNG for color maps. | |
| HDR environment | ≤ 1k resolution, `.hdr` compressed, or use a drei preset | |
| Total 3D payload | ≤ 1.5 MB gzipped | `du -h` on assets |
| Real lights | ≤ 2 + env map. Baked > dynamic, always. | |
| Shadow maps | ≤ 1 at 1024², or none — prefer a baked contact shadow | |
| Postprocessing passes | ≤ 1, desktop only | |
| Frame time (mid-tier mobile) | ≤ 16.7ms; degrade before dropping under 30fps | |

`<AdaptiveDpr pixelated />` and `<AdaptiveEvents />` in every scene.
`dpr={[1, 2]}` always clamped — uncapped DPR murders retina mobile.

Instance or merge (`<Merged>`, `InstancedMesh`) anything appearing more than
~5 times. It is the largest draw-call win available.

## Lighting and environment

- `<Environment preset="..." />` or a compressed `.hdr` gives most of the
  realism for one texture fetch. Start there before adding lights.
- Add at most one key light for direction and one rim/fill. Three-point
  lighting in real time is usually a budget mistake.
- `ACESFilmicToneMapping` and correct color space (`THREE.SRGBColorSpace` on
  color textures) — without it everything looks flat and washed.
- Contact shadow plane (`<ContactShadows />`) reads better and costs less than
  a real shadow map.
- Scene colors derive from the [visual-design](../visual-design/SKILL.md)
  tokens, converted once. The canvas is the only place a gradient is allowed,
  and it still uses the palette.

## Shaders

Only when a standard material cannot do it. A custom shader is a maintenance
cost and a compile cost.

- `shaderMaterial` from drei, or `onBeforeCompile` to patch a standard material
  — patching keeps lighting and tone mapping for free.
- GLSL lives in `src/components/scene/shaders/` as `.glsl` files or template
  literals. Keep vertex and fragment adjacent and commented.
- Uniforms updated in `useFrame` by mutating `material.uniforms.x.value` —
  never via React state.
- Keep fragment shaders cheap: they run per pixel, so a loop or a `pow` in the
  fragment stage is multiplied by millions. Noise functions belong in the
  vertex stage or a baked texture where possible.
- Every shader needs a fallback material for the stripped mobile scene.

## Interaction

- **Pointer parallax:** lerp the camera or object by a fraction of normalized
  pointer position. Damp it (`lerp(current, target, 1 - Math.pow(0.001, dt))`)
  so it never snaps. Disabled on `pointer: coarse`.
- **Scroll:** at most one scroll-linked beat, counting against the
  [motion-design](../motion-design/SKILL.md) budget. Drive camera or rotation
  from a scroll progress value; never re-mount on scroll.
- **Raycasting:** `<AdaptiveEvents />` plus `raycast={meshBounds}` on simple
  meshes. Pointer events over a full-screen canvas are a real CPU cost.
- If the canvas is interactive it needs a keyboard path and an `aria-label`,
  and the same information must exist outside the canvas. See
  [accessibility](../accessibility/SKILL.md).

## The canvas never blocks first paint

Hero text, nav, and the primary CTA render and are readable before any
Three.js is parsed. Non-negotiable.

```tsx
// src/components/scene/SceneLoader.tsx
'use client'
import dynamic from 'next/dynamic'

const Scene = dynamic(() => import('./Scene'), {
  ssr: false,                      // WebGL cannot server-render
  loading: () => <ScenePoster />,  // static image, same box, zero CLS
})
```

1. `ssr: false` on every 3D import — Three touches `window` at module scope.
2. The wrapper reserves final dimensions up front. Mounting the canvas causes
   **zero layout shift**.
3. `<ScenePoster />` is a real `next/image` of the scene. It is the permanent
   view for reduced-motion, low-end, and no-WebGL visitors, so it must look
   finished on its own.
4. Mount when needed: `IntersectionObserver` if below the fold,
   `requestIdleCallback` if above.
5. `<Suspense>` wraps asset loading *inside* the canvas. `useGLTF.preload()`
   only after first paint, never at module scope.

## Fallbacks — all three mandatory

A scene ships only when all three are implemented and manually checked.

| Condition | Behavior |
|---|---|
| `prefers-reduced-motion: reduce` | Poster image. No canvas. Not slower motion — none. |
| `pointer: coarse` / `deviceMemory <= 4` | Poster, or stripped scene: `dpr={1}`, no shadows, no postprocessing, no shaders, static camera. Write which in the component header. |
| WebGL unavailable or context lost | Poster. Handle `onCreated` failure and `webglcontextlost` — never white-screen. |

Also pause rendering when the tab is hidden and when the canvas leaves the
viewport (`frameloop="demand"` + `invalidate()`, or toggle to `"never"`). A
scene at 60fps in a background tab drains battery, and that is exactly the
detail an interviewer notices.

## Conventions

- **One `<Canvas>` per page.** Browsers cap WebGL contexts at ~8–16 and
  silently drop the oldest.
- Layout: `src/components/scene/` — `Scene.tsx` (canvas, camera, lights, env),
  one file per mesh/group, `scene/hooks/`, `scene/shaders/`.
- Camera, lights, and env are configured in `Scene.tsx` only. Child meshes
  never reach up and mutate the camera.
- Animate with `delta` in `useFrame`, never a fixed per-frame increment — fixed
  increments run at different speeds on 60Hz vs 120Hz displays.
- **Never `setState` in `useFrame`.** Mutate refs, or you re-render React 60
  times a second.
- R3F disposes declarative objects. Anything created imperatively
  (`new THREE.Texture`, `new THREE.BufferGeometry`, render targets) is disposed
  in a `useEffect` cleanup or it leaks GPU memory across route changes.

## Verification

```bash
npm run build
# three must NOT be in the main entry chunk:
find .next/static/chunks -name '*.js' -print0 \
  | xargs -0 grep -l "THREE" 2>/dev/null
```

The 3D code lands in its own async chunk. If `three` is in the initial bundle
the dynamic import is broken — fix that before anything else. Then check the
`r3f-perf` overlay against the budget table, on a throttled CPU.
