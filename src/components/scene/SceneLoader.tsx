"use client";

import dynamic from "next/dynamic";
import { Component, useEffect, useRef, useState, type ReactNode } from "react";
import { useSceneTier } from "./hooks/useSceneTier";
import { cn } from "@/lib/cn";

const Scene = dynamic(() => import("./Scene"), { ssr: false, loading: () => null });

/**
 * Catches renderer failures. Logs them (a silent blank canvas is worse than a
 * console error) and retries once after a beat — Fast Refresh can otherwise
 * leave a boundary stuck in its failed state until a full reload.
 */
class SceneBoundary extends Component<{ onError: () => void; children: ReactNode }, { failed: boolean; retries: number }> {
  state = { failed: false, retries: 0 };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: unknown) {
    console.error("[scene] render failed:", error);
    if (this.state.retries < 1) {
      window.setTimeout(() => this.setState((s) => ({ failed: false, retries: s.retries + 1 })), 1500);
    } else {
      this.props.onError();
    }
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/**
 * Decorative background canvas. Fetches three.js after idle on desktop and
 * on first interaction on touch; renders nothing for reduced-motion / no WebGL.
 */
export function SceneLoader({ className }: { className?: string }) {
  const tier = useSceneTier();
  const [mounted, setMounted] = useState(false);
  const [ready, setReady] = useState(false);
  const [lost, setLost] = useState(false);
  const [inView, setInView] = useState(true);
  const [tabVisible, setTabVisible] = useState(true);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (tier === "poster") return;
    if (tier === "full") {
      const w = window as Window & {
        requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
        cancelIdleCallback?: (id: number) => void;
      };
      if (w.requestIdleCallback) {
        const id = w.requestIdleCallback(() => setMounted(true), { timeout: 1500 });
        return () => w.cancelIdleCallback?.(id);
      }
      const id = window.setTimeout(() => setMounted(true), 200);
      return () => window.clearTimeout(id);
    }
    // lite: first interaction, or 3.5 s — whichever comes first — so the scene
    // still appears for a visitor who just looks without touching.
    const events = ["pointerdown", "touchstart", "scroll", "keydown"] as const;
    const arm = () => {
      setMounted(true);
      window.clearTimeout(timer);
      events.forEach((e) => window.removeEventListener(e, arm));
    };
    const timer = window.setTimeout(arm, 3500);
    events.forEach((e) => window.addEventListener(e, arm, { passive: true, once: true }));
    return () => {
      window.clearTimeout(timer);
      events.forEach((e) => window.removeEventListener(e, arm));
    };
  }, [tier]);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin: "80px" });
    io.observe(el);
    const onVis = () => setTabVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  const show = mounted && !lost && tier !== "poster";

  return (
    <div
      ref={box}
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 transition-opacity duration-slow ease-out motion-reduce:transition-none",
        ready && !lost ? "opacity-100" : "opacity-0",
        className,
      )}
    >
      {show && (
        <SceneBoundary onError={() => setLost(true)}>
          <Scene tier={tier} active={inView && tabVisible} onReady={() => setReady(true)} onContextLost={() => setLost(true)} />
        </SceneBoundary>
      )}
    </div>
  );
}
