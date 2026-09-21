"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

type Props = React.PropsWithChildren<{ className?: string; as?: "div" | "section" | "li" }>;

/** Fades a block up once when it first enters the viewport. One per section, on the container. */
export function Reveal({ children, className, as: Tag = "div" }: Props) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const id = window.setTimeout(() => setShown(true), 0);
      return () => window.clearTimeout(id);
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        // Already scrolled past (fast scroll, deep link) counts as seen.
        if (entry.isIntersecting || entry.boundingClientRect.bottom < 0) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "100000px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    // @ts-expect-error -- ref type differs per tag; both are HTMLElements
    <Tag ref={ref} className={cn("transition-[opacity,transform] duration-slow ease-out motion-reduce:transition-none", shown ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0", className)}>
      {children}
    </Tag>
  );
}
