---
name: visual-design
description: The token layer for this portfolio — the exact color values, type scale, font families, spacing rhythm, radii and elevation, plus composition principles (hierarchy, negative space, scale contrast, alignment). Load BEFORE writing or editing any CSS, Tailwind class, globals.css, theme config, or component style; before choosing any color, font, size or spacing value; and whenever asked to "make it look better."
---

# Visual design

**Scope:** the *values*. Concept is [creative-direction](../creative-direction/SKILL.md);
page and section composition is [frontend-design](../frontend-design/SKILL.md).

If a value is not in this file, do not invent one — add it here first, then use
it. Ad-hoc hex codes and one-off spacing are the main cause of drift.

## Typography

Serving Direction D, with the type register the user pointed at on claude.com
(moderate-contrast serif headlines over a clean grotesque). Three families:

| Role | Family | Weights | Use |
|---|---|---|---|
| Display | **Source Serif 4** (`next/font/google`, variable, italic) | 700 | the name, tagline, section headings |
| Sans | **Archivo** (variable) | 500 body · 600/700 emphasis | body, UI |
| Mono | **JetBrains Mono** | 400, 500, 700 | nav numbers, eyebrows, buttons, labels, dates |

The user asked for text to read "bold" and borders to read heavy: body runs at
500, buttons/wordmark at 700 with **2px** accent borders.

Loaded via `next/font/google` only, subset `latin`, `display: swap`.

| Token | Size | Line height | Tracking | Use |
|---|---|---|---|---|
| `text-hero` | `clamp(2.5rem, 6.5vw, 4.25rem)` | 1.05 | -0.015em | the name and the tagline, display 700 |
| `text-tagline` | `clamp(1.375rem, 3vw, 2.125rem)` | 1.2 | -0.01em | the rotating tagline — smaller than the name so the longest phrase fits 2 lines; the block reserves 2 lines (3 on mobile) |
| `text-display` | `clamp(1.875rem, 4vw, 2.25rem)` | 1.2 | -0.01em | section headings ("01. About Me"), display 700 |
| `text-h3` | `1.375rem` | 1.3 | 0 | card / job titles, weight 600 |
| `text-lede` | `1.25rem` | 1.6 | 0 | hero paragraph |
| `text-body` | `1.125rem` | 1.65 | 0 | default — the reference runs large |
| `text-sm` | `0.875rem` | 1.5 | 0 | secondary |
| `text-mono` | `0.8125rem` | 1.6 | 0 | mono labels, nav, buttons |
| `text-label` | `0.75rem` | 1.4 | 0.05em | tiny mono eyebrows |

## Color

Dark is canonical. Light is a designed alternate.

### Dark (canonical)

| Token | Hex | Use |
|---|---|---|
| `--bg` | `#0a192f` | navy stage |
| `--surface` | `#112240` | cards, header when scrolled, mobile drawer |
| `--surface-raised` | `#233554` | hover fills, 3D object body |
| `--border` | `#233554` | hairlines |
| `--border-strong` | `#3a4d70` | inputs |
| `--text-bright` | `#e6f1ff` | the name |
| `--text` | `#ccd6f6` | headings, links |
| `--text-muted` | `#8892b0` | body, tagline |
| `--text-faint` | `#495670` | rails, dividers — not for text |
| `--accent` | `#64ffda` | teal: numbers, eyebrow, buttons, hover |
| `--accent-hover` | `#7dffe1` | |
| `--accent-subtle` | `rgb(100 255 218 / 0.1)` | button hover fill, tags |

### Light

| Token | Hex |
|---|---|
| `--bg` | `#f4f7fb` |
| `--surface` | `#ffffff` |
| `--surface-raised` | `#e6edf7` |
| `--border` | `#d5deeb` |
| `--border-strong` | `#b3c0d6` |
| `--text-bright` | `#0a192f` |
| `--text` | `#1b2a4a` |
| `--text-muted` | `#4a5878` |
| `--text-faint` | `#97a3bd` |
| `--accent` | `#0e8f79` |
| `--accent-hover` | `#0a7a67` |
| `--accent-subtle` | `rgb(14 143 121 / 0.1)` |

Declared in `src/app/globals.css`: dark on `:root`, light on `:root[data-theme="light"]`.
Default is dark; the toggle persists to `localStorage`; a `<head>` script applies it before paint.
Tokens map into Tailwind via `@theme inline`. **One accent.**

## Spacing

4px base. Allowed steps only:

`4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 192, 256`

Tailwind: `1, 2, 3, 4, 6, 8, 12, 16, 24, 32, 48, 64`. Anything else (`p-5`,
`gap-7`, `mt-[38px]`) is a bug.

Section rhythm is generous — emptiness is the concept, not wasted space:
`128px` mobile, `192px` desktop between major sections. Heading to body: `24px`.
Between cards: `24px`. Container max `1280px`, gutter `24px` / `48px` from `md`.

## Radii and elevation

`--radius-sm 4px` · `--radius-md 8px` · `--radius-lg 16px` · `--radius-full 9999px`

Restraint: this direction favors sharp, print-like edges. Most surfaces use `sm` or nothing at
all. `lg` is for media and the canvas wrapper. Pill-shaped buttons are out of
register — buttons use `md`.

Elevation is **border + background shift first**. Two shadows exist:

- `--shadow-sm`: `0 1px 2px rgb(0 0 0 / 0.05), 0 1px 1px rgb(0 0 0 / 0.03)`
- `--shadow-lg`: `0 12px 32px rgb(0 0 0 / 0.10), 0 2px 8px rgb(0 0 0 / 0.06)`

Dark overrides: `0 1px 2px rgb(0 0 0 / 0.30)` and `0 16px 48px rgb(0 0 0 / 0.45)`.
In dark mode shadows barely read — separate layers with `--border-strong`
instead of deepening the shadow further.

## Composition

Before writing a component, decide these four, in this order:

1. **Hierarchy** — what is the one thing read first? Everything else is
   subordinate, and subordination is expressed through *size and weight*, not
   color. If three elements compete, two are wrong.
2. **Negative space** — where is the deliberate emptiness? Editorial layout
   means unequal columns and empty regions that carry weight. Filling the
   viewport edge to edge is the templated instinct.
3. **Scale contrast** — the ratio between largest and smallest text on screen
   should be dramatic (roughly 8:1 in a hero). Timid scale contrast is what
   makes a layout feel flat.
4. **Alignment** — every element aligns to something. Asymmetric is not random:
   an off-center element sits on a grid line, not wherever it landed.

Rhythm and balance follow from those. Optical alignment beats mathematical —
large display type usually needs a negative left inset to *look* flush.

## Banned

- Purple/blue gradient heroes (`#667eea → #764ba2` and every cousin).
- Gradient text (`bg-clip-text` on a headline).
- Glassmorphism / `backdrop-blur` frosted cards — also a real mobile GPU cost.
- Emoji as iconography. Icons: lucide-react, stroke 1.5, sizes 16/20/24.
- Text shadows, glows, neon borders, grain overlays.
- Skill grids with percentage bars.
- Raw hex in components. Gate:
  `grep -rnE '#[0-9a-fA-F]{3,8}' src --include='*.tsx'` returns nothing.
- Tailwind arbitrary values for anything the tokens already cover.
- More than one accent hue.

## When asked to "make it look better"

The answer is almost always: increase scale contrast, remove a competing
element, tighten spacing onto the scale, increase whitespace between sections.
Almost never: add color, add a gradient, add an effect.
