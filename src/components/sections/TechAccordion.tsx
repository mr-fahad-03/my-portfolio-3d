"use client";

import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { techGroups, technologies, type TechGroup } from "@/content/site";
import { cn } from "@/lib/cn";
import { TechIcon, techColor } from "./TechIcon";

const AUTO_MS = 5000;

const blurb: Record<TechGroup, string> = {
  "Front end": "What people see and touch — component UIs, routing, state and styling.",
  "Back end": "APIs and services behind them — runtimes, frameworks, contracts and auth.",
  Data: "Where it's stored — relational and document databases and the layers that talk to them.",
  Infrastructure: "How it ships — containers, cloud, deploys and CI/CD.",
};

/**
 * One category open at a time; its technologies unfold beneath it and pop in
 * one by one. While the section is on screen and untouched, it steps through
 * the categories every few seconds; any click, hover or focus stops that.
 */
export function TechAccordion() {
  const [open, setOpen] = useState<TechGroup>(techGroups[0]);
  const [auto, setAuto] = useState(true);
  const [inView, setInView] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const baseId = useId();

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!auto || !inView || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setInterval(() => setOpen((g) => techGroups[(techGroups.indexOf(g) + 1) % techGroups.length]), AUTO_MS);
    return () => window.clearInterval(t);
  }, [auto, inView, open]);

  const stop = () => setAuto(false);

  return (
    <div ref={root} className="divide-y divide-border border-y border-border" onPointerEnter={stop} onFocusCapture={stop}>
      {techGroups.map((g, gi) => {
        const items = technologies.filter((t) => t.group === g);
        const isOpen = g === open;
        const panelId = `${baseId}-${gi}`;
        return (
          <section key={g} aria-labelledby={`${panelId}-h`}>
            <h3 id={`${panelId}-h`}>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => { stop(); setOpen(g); }}
                className={cn("group flex w-full items-center gap-5 py-6 text-left transition-colors md:gap-8", isOpen ? "text-text" : "text-text-muted hover:text-text")}
              >
                <span className={cn("font-mono text-mono font-medium transition-colors", isOpen ? "text-accent" : "text-text-faint group-hover:text-accent")}>{String(gi + 1).padStart(2, "0")}</span>
                <span className="font-display text-display font-bold leading-none">{g}</span>
                <span className="ml-auto font-mono text-mono text-text-muted">{items.length}</span>
                {/* plus that turns into a minus when open */}
                <span aria-hidden="true" className="relative ml-4 size-5 shrink-0">
                  <span className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 bg-current" />
                  <span className={cn("absolute inset-y-0 left-1/2 w-0.5 -translate-x-1/2 bg-current transition-transform duration-base ease-out", isOpen ? "scale-y-0" : "scale-y-100")} />
                </span>
              </button>
            </h3>

            {/* grid-rows 0fr → 1fr gives a real height animation without measuring */}
            <div id={panelId} role="region" aria-labelledby={`${panelId}-h`} className={cn("grid transition-[grid-template-rows] duration-slow ease-out", isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
              <div className="overflow-hidden">
                <p className="max-w-[40rem] pb-6 text-body text-text-muted">{blurb[g]}</p>
                <ul key={isOpen ? "open" : "closed"} className="tech-grid grid grid-cols-2 gap-3 pb-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5" data-shown={isOpen}>
                  {items.map((t, i) => (
                    <li key={t.name} className="tech-card group/card" style={{ "--i": i, "--brand": techColor(t.icon) } as CSSProperties}>
                      <div
                        tabIndex={isOpen ? 0 : -1}
                        className={cn(
                          "flex h-full flex-col items-start gap-4 rounded-md border border-border bg-surface p-4",
                          "transition-[transform,border-color,box-shadow] duration-base ease-out",
                          "hover:-translate-y-1.5 hover:border-(--brand) hover:shadow-[0_18px_40px_-18px_var(--brand)] focus-visible:-translate-y-1.5 focus-visible:border-(--brand)",
                        )}
                      >
                        <span className="flex size-11 items-center justify-center rounded-sm bg-surface-raised text-(--brand) transition-transform duration-base group-hover/card:scale-110">
                          <TechIcon name={t.icon} className="size-6" />
                        </span>
                        <span>
                          <span className="block font-sans text-body font-bold leading-tight text-text">{t.name}</span>
                          <span className="mt-1 block font-mono text-label text-text-muted">{t.role}</span>
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
