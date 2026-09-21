"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { experience, type Role } from "@/content/site";
import { cn } from "@/lib/cn";

const MONTHS: Record<string, number> = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
const parse = (s: string) => (s === "Present" ? new Date() : new Date(Number(s.split(" ")[1]), MONTHS[s.split(" ")[0]] ?? 0, 1));

/** "1 yr 3 mos", inclusive of the start month. */
function tenure(start: string, end: string) {
  const a = parse(start), b = parse(end);
  const months = Math.max(1, (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth()) + 1);
  const y = Math.floor(months / 12), m = months % 12;
  return [y ? `${y} yr${y > 1 ? "s" : ""}` : "", m ? `${m} mo${m > 1 ? "s" : ""}` : ""].filter(Boolean).join(" ");
}

const initials = (company: string) => company.split(/\s+/).filter((w) => /^[A-Za-z]/.test(w)).slice(0, 2).map((w) => w[0].toUpperCase()).join("");

function Card({ role, index }: { role: Role; index: number }) {
  const ref = useRef<HTMLLIElement>(null);
  const [shown, setShown] = useState(false);
  const current = role.end === "Present";
  const left = index % 2 === 0; // desktop zig-zag: even cards left of the line

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Root extended far upward so content already scrolled past still counts as seen.
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting || e.boundingClientRect.bottom < 0) { setShown(true); io.disconnect(); } }, { threshold: 0.25, rootMargin: "100000px 0px 0px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <li ref={ref} data-shown={shown} className={cn("tl-card relative pl-14 md:w-1/2 md:pl-0", left ? "md:pr-14 md:text-left" : "md:ml-auto md:pl-14")} style={{ "--from": left ? "-32px" : "32px" } as CSSProperties}>
      {/* node + connector: side-specific positioning only, so the classes never compete */}
      <span aria-hidden="true" className={cn("absolute top-7 left-[1.15rem] size-3.5 -translate-x-1/2 rounded-full border-2 border-accent bg-bg", left ? "md:left-auto md:right-0 md:translate-x-1/2" : "md:left-0 md:-translate-x-1/2", current && "node-pulse bg-accent")} />
      <span aria-hidden="true" className={cn("absolute top-[2.15rem] left-[1.15rem] h-px w-9 bg-border-strong md:w-14", left ? "md:left-auto md:right-0" : "md:left-0")} />

      <article className="group relative rounded-md border border-border bg-surface p-6 transition-[transform,border-color,box-shadow] duration-base ease-out hover:-translate-y-1 hover:border-accent/60 hover:shadow-[0_24px_48px_-24px_var(--accent)]">
        <header className="tl-item flex items-start gap-4" style={{ "--i": 0 } as CSSProperties}>
          {/* Real company logo where the company has one; plain initials otherwise. */}
          <span className={cn("flex size-12 shrink-0 items-center justify-center overflow-hidden border border-border bg-surface-raised transition-transform duration-base group-hover:scale-105", role.logoRound ? "rounded-full" : "rounded-md")}>
            {role.logo ? (
              <Image
                src={role.logo}
                alt=""
                width={48}
                height={48}
                unoptimized={role.logo.endsWith(".svg")}
                className={cn("size-12", role.logoRound ? "rounded-full object-cover" : "object-contain", role.logoTone === "mono" && "logo-mono")}
                style={{ transform: `scale(${role.logoScale ?? 0.82})` }}
              />
            ) : (
              <span className="font-display text-lede font-bold tracking-tight text-text" style={role.mark ? { color: role.mark.color } : undefined}>
                {role.mark?.text ?? initials(role.company)}
              </span>
            )}
          </span>
          <div className="min-w-0">
            <h3 className="font-display text-h3 font-bold leading-tight text-text">{role.title}</h3>
            <p className="mt-1 font-mono text-mono font-medium text-accent">{role.company}</p>
          </div>
        </header>

        {/* Plain typographic meta — dates, tenure, place, type — no glyphs. */}
        <p className="tl-item mt-5 font-mono text-mono text-text-muted" style={{ "--i": 1 } as CSSProperties}>
          <span className="text-text">{role.start} — {role.end}</span>
          <span className="mx-2 text-text-faint" aria-hidden="true">·</span>
          {tenure(role.start, role.end)}
          <span className="mx-2 text-text-faint" aria-hidden="true">·</span>
          {role.location}
          {role.kind && (
            <>
              <span className="mx-2 text-text-faint" aria-hidden="true">·</span>
              {role.kind}
            </>
          )}
          {current && (
            <span className="ml-3 inline-flex items-center gap-1.5 text-accent">
              <span aria-hidden="true" className="relative inline-flex size-2 rounded-full bg-accent"><span className="absolute inset-0 animate-ping rounded-full bg-accent opacity-60" /></span>
              Current
            </span>
          )}
        </p>

        <ul className="mt-5 space-y-2.5">
          {role.points.map((pt, i) => (
            <li key={pt} className="tl-item relative pl-6 text-body text-text-muted before:absolute before:left-0 before:top-[0.2em] before:font-mono before:text-accent before:content-['▹']" style={{ "--i": i + 2 } as CSSProperties}>
              {pt}
            </li>
          ))}
        </ul>

        {role.stack && (
          <ul className="tl-item mt-5 flex flex-wrap gap-2" style={{ "--i": role.points.length + 2 } as CSSProperties}>
            {role.stack.map((s) => (
              <li key={s} className="rounded-sm border border-border bg-surface-raised px-2.5 py-1 font-mono text-label text-text transition-colors group-hover:border-accent/40">{s}</li>
            ))}
          </ul>
        )}
      </article>
    </li>
  );
}

/** Vertical timeline; the line's drawn length follows scroll. Zig-zag from md, single column below. */
export function Timeline() {
  const wrap = useRef<HTMLOListElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const anchor = window.innerHeight * 0.65;
        setProgress(Math.min(1, Math.max(0, (anchor - r.top) / r.height)));
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => { window.removeEventListener("scroll", update); window.removeEventListener("resize", update); cancelAnimationFrame(raf); };
  }, []);

  return (
    <ol ref={wrap} className="relative space-y-10 md:space-y-14" style={{ "--progress": progress } as CSSProperties}>
      <span aria-hidden="true" className="absolute inset-y-0 left-[1.15rem] w-0.5 -translate-x-1/2 bg-border md:left-1/2" />
      <span aria-hidden="true" className="timeline-line absolute inset-y-0 left-[1.15rem] w-0.5 -translate-x-1/2 bg-accent md:left-1/2" />
      {experience.map((role, i) => <Card key={`${role.company}-${role.start}`} role={role} index={i} />)}
    </ol>
  );
}
