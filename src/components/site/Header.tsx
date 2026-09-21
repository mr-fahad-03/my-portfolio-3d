"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { logo, nav, person, resume } from "@/content/site";
import { cn } from "@/lib/cn";
import { ThemeToggle } from "./ThemeToggle";
import { MobileNav } from "./MobileNav";

const stagger = (i: number) => ({ "--i": i }) as CSSProperties;

/**
 * Fixed header. Transparent at the top; once scrolled it gains a surface,
 * blur and shadow, hides on scroll down and returns on scroll up.
 */
export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  // While an in-page anchor navigation is easing to its target, the header stays
  // visible: that scroll is the user's choice, not a reason to hide the nav.
  const pinnedUntil = useRef(0);
  const settle = useRef(0);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 8);
        if (performance.now() < pinnedUntil.current) {
          setHidden(false);
          lastY.current = y;
          // extend the pin while the eased scroll is still moving
          window.clearTimeout(settle.current);
          settle.current = window.setTimeout(() => { pinnedUntil.current = 0; lastY.current = window.scrollY; }, 200);
          return;
        }
        // Only react to meaningful movement: eased (Lenis) scrolling arrives in
        // sub-pixel steps, and tiny deltas must not flip the header back.
        const dy = y - lastY.current;
        if (Math.abs(dy) > 6) {
          setHidden(dy > 0 && y > 120);
          lastY.current = y;
        }
        if (y <= 120) setHidden(false);
      });
    };
    const pin = () => {
      pinnedUntil.current = performance.now() + 2500;
      setHidden(false);
    };
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('a[href^="#"]');
      if (a) pin();
    };
    document.addEventListener("click", onClick, true);
    window.addEventListener("hashchange", pin);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("hashchange", pin);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
      window.clearTimeout(settle.current);
    };
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 flex h-20 items-center px-6 md:px-10 lg:h-24 lg:px-12",
        "transition-[transform,background-color,box-shadow,height] duration-250 ease-out",
        scrolled &&
          "h-16 bg-surface/85 shadow-header backdrop-blur-sm lg:h-[4.5rem]",
        hidden && "-translate-y-full",
      )}
    >
      <nav
        aria-label="Primary"
        className="flex w-full items-center justify-between"
      >
        {/* Animation lives on the wrapper: a fill-mode animation on the link itself would pin its transform and defeat the hover lift. */}
        <div className="enter-down" style={stagger(0)}>
          <a
            href="#top"
            aria-label={`${person.name} — home`}
            className="btn-offset inline-flex min-h-11 items-center rounded-sm border-2 border-accent px-3 font-mono text-sm font-bold text-accent no-underline"
          >
            <span aria-hidden="true">
              <span className="opacity-70">{logo.open}</span>
              <span>{logo.name}</span>
              <span className="opacity-70">{logo.close}</span>
            </span>
          </a>
        </div>

        <div className="flex items-center gap-2 lg:gap-6">
          <ol className="hidden items-center gap-6 font-mono text-mono font-medium md:flex lg:gap-8">
            {nav.map((item, i) => (
              <li key={item.href} className="enter-down" style={stagger(i + 1)}>
                <a
                  href={item.href}
                  className="inline-flex min-h-11 items-center gap-1.5 text-text no-underline transition-colors hover:text-accent"
                >
                  <span className="text-accent">
                    {String(i + 1).padStart(2, "0")}.
                  </span>
                  {item.label}
                </a>
              </li>
            ))}
            <li className="enter-down" style={stagger(nav.length + 1)}>
              <a
                href={resume.href}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-offset inline-flex min-h-11 items-center rounded-sm border-2 border-accent px-4 font-bold text-accent no-underline"
              >
                {resume.label}
              </a>
            </li>
          </ol>
          <div className="enter-down" style={stagger(nav.length + 2)}>
            <ThemeToggle />
          </div>
          <MobileNav />
        </div>
      </nav>
    </header>
  );
}
