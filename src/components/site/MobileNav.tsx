"use client";

import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { Menu, X } from "lucide-react";
import { logo, nav, resume, socials } from "@/content/site";
import { cn } from "@/lib/cn";
import { SocialIcon } from "./SocialIcon";

const stagger = (i: number) => ({ "--i": i }) as CSSProperties;

/**
 * Right-hand drawer for < md. Wordmark on top, numbered links that slide in
 * one after another, Resume, and the socials along the bottom. Closes on
 * Escape, backdrop tap and link activation; focus returns to the trigger.
 */
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLAnchorElement>("ol a")?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  function close() {
    setOpen(false);
    triggerRef.current?.focus();
  }

  return (
    <div className="md:hidden">
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => (open ? close() : setOpen(true))}
        className="relative z-50 inline-flex size-11 items-center justify-center rounded-sm text-accent transition-colors hover:bg-accent-subtle"
      >
        {open ? <X size={26} strokeWidth={2} aria-hidden="true" /> : <Menu size={26} strokeWidth={2} aria-hidden="true" />}
      </button>

      <div
        onClick={close}
        aria-hidden="true"
        className={cn("fixed inset-0 z-40 bg-bg/70 backdrop-blur-sm transition-opacity duration-slow", open ? "opacity-100" : "pointer-events-none opacity-0")}
      />

      <div
        id={panelId}
        ref={panelRef}
        data-lenis-prevent
        aria-hidden={!open}
        data-open={open}
        className={cn(
          "drawer fixed inset-y-0 right-0 z-40 flex w-[min(78vw,22rem)] flex-col bg-surface px-8 pb-8 pt-6 shadow-header",
          "border-l border-border transition-transform duration-slow ease-out",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        {/* soft teal glow behind the links */}
        <div aria-hidden="true" className="pointer-events-none absolute -right-24 top-1/3 size-72 rounded-full bg-accent/10 blur-3xl" />

        <a href="#top" onClick={close} tabIndex={open ? 0 : -1} className="drawer-item relative self-start font-mono text-sm font-bold text-accent no-underline" style={stagger(0)}>
          <span className="opacity-70">{logo.open}</span>{logo.name}<span className="opacity-70">{logo.close}</span>
        </a>

        {/* The header already provides the <nav> landmark; this is just layout. */}
        <div className="relative mt-12 flex-1">
          <ol className="flex flex-col gap-2">
            {nav.map((item, i) => (
              <li key={item.href} className="drawer-item" style={stagger(i + 1)}>
                <a
                  href={item.href}
                  onClick={close}
                  tabIndex={open ? 0 : -1}
                  className="group flex min-h-12 items-baseline gap-4 rounded-sm py-2 font-display text-h3 font-bold text-text no-underline transition-[color,transform] duration-base hover:translate-x-2 hover:text-accent"
                >
                  <span className="font-mono text-mono font-medium text-accent">{String(i + 1).padStart(2, "0")}.</span>
                  {item.label}
                  <span aria-hidden="true" className="ml-auto h-px w-6 origin-right scale-x-0 bg-accent transition-transform duration-base group-hover:scale-x-100" />
                </a>
              </li>
            ))}
          </ol>
        </div>

        <div className="drawer-item relative mt-8 border-t border-border pt-6" style={stagger(nav.length + 1)}>
          <a
            href={resume.href}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={open ? 0 : -1}
            className="btn-offset inline-flex min-h-12 w-full items-center justify-center rounded-sm border-2 border-accent font-mono text-sm font-bold text-accent no-underline"
          >
            {resume.label}
          </a>
          <ul className="mt-6 flex items-center justify-between">
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target={s.href.startsWith("http") ? "_blank" : undefined}
                  rel={s.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  aria-label={s.label}
                  tabIndex={open ? 0 : -1}
                  className="inline-flex size-11 items-center justify-center rounded-sm text-accent transition-[color,transform,background-color] hover:-translate-y-1 hover:bg-accent-subtle"
                >
                  <SocialIcon name={s.icon} size={22} strokeWidth={2.25} aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
