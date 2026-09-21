"use client";

import { useSyncExternalStore } from "react";
import { useMediaQuery } from "./useMediaQuery";

export type SceneTier = "poster" | "lite" | "full";

/**
 * API presence only. Creating a real context here would initialise the GPU
 * (or SwiftShader) during hydration — seconds of main-thread work in some
 * environments — and leak one of the browser's ~16 WebGL contexts. A context
 * that genuinely fails to create is caught by SceneLoader's error boundary.
 */
function hasWebGL(): boolean {
  return "WebGL2RenderingContext" in window || "WebGLRenderingContext" in window;
}

const noopSubscribe = () => () => {};

/**
 * Decides what the hero renders. See .claude/skills/3d-web › Fallbacks and
 * responsive-design › Degradation matrix.
 *
 *  poster — reduced motion, no WebGL, or before hydration
 *  lite   — touch / narrow / low memory: dpr 1, no shadows, no pointer parallax
 *  full   — everything
 */
export function useSceneTier(): SceneTier {
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const coarse = useMediaQuery("(pointer: coarse)");
  const narrow = useMediaQuery("(max-width: 767px)");
  const webgl = useSyncExternalStore(noopSubscribe, hasWebGL, () => null);

  if (webgl === null || reduced || !webgl) return "poster";

  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  if (coarse || narrow || (memory !== undefined && memory <= 4)) return "lite";

  return "full";
}
