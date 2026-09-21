"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

/**
 * Inertial page scrolling (Lenis) on the native window scroll, so scroll
 * events, IntersectionObservers and the header still work unchanged.
 * Anchor links are routed through Lenis; reduced-motion users keep native scroll.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({
      // Lower lerp = more glide. 0.1 was indistinguishable from macOS's own
      // trackpad inertia; 0.065 reads clearly as smooth scrolling.
      lerp: 0.065,
      wheelMultiplier: 0.9,
      smoothWheel: true,
      syncTouch: true, // smooth on phones too — the user wants it site-wide
      touchMultiplier: 1.2,
      autoRaf: true,
      anchors: { offset: -80 }, // clear the fixed header
      prevent: (node) => node.closest("[data-lenis-prevent]") !== null,
    });
    return () => lenis.destroy();
  }, []);
  return null;
}
