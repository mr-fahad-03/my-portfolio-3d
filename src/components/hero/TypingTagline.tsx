"use client";

import { useEffect, useState } from "react";
import { useMediaQuery } from "@/components/scene/hooks/useMediaQuery";

type Props = { phrases: readonly string[]; className?: string };

const TYPE_MS = 55;
const DELETE_MS = 28;
const HOLD_MS = 5500;
const GAP_MS = 500;

/**
 * Types each phrase, holds ~5.5 s, deletes, moves on. The full first phrase is
 * server-rendered so the line is readable before hydration and for crawlers.
 * Under reduced motion it swaps phrases without typing. aria-live is off:
 * a screen reader gets the static first phrase only.
 */
export function TypingTagline({ phrases, className }: Props) {
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [index, setIndex] = useState(0);
  const [shown, setShown] = useState(phrases[0]);
  const [phase, setPhase] = useState<"idle" | "typing" | "holding" | "deleting">("idle");

  useEffect(() => {
    if (phrases.length < 2) return;
    const target = phrases[index];
    let t: number;

    if (reduced) {
      // No typing: the rendered text is derived from `index` below.
      t = window.setTimeout(() => setIndex((i) => (i + 1) % phrases.length), HOLD_MS + 1500);
      return () => window.clearTimeout(t);
    }

    if (phase === "idle") {
      t = window.setTimeout(() => setPhase("holding"), HOLD_MS);
    } else if (phase === "holding") {
      t = window.setTimeout(() => setPhase("deleting"), 0);
    } else if (phase === "deleting") {
      if (shown.length > 0) t = window.setTimeout(() => setShown((s) => s.slice(0, -1)), DELETE_MS);
      else {
        t = window.setTimeout(() => {
          setIndex((i) => (i + 1) % phrases.length);
          setPhase("typing");
        }, GAP_MS);
      }
    } else {
      if (shown.length < target.length) t = window.setTimeout(() => setShown(target.slice(0, shown.length + 1)), TYPE_MS);
      else t = window.setTimeout(() => setPhase("deleting"), HOLD_MS);
    }
    return () => window.clearTimeout(t);
  }, [phase, shown, index, phrases, reduced]);

  const text = reduced ? phrases[index] : shown;

  return (
    <span className={className}>
      <span className="sr-only">{phrases[0]}</span>
      <span aria-hidden="true">
        {text}
        {!reduced && <span className="caret" aria-hidden="true" />}
      </span>
    </span>
  );
}
