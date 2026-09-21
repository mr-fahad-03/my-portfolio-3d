import type { CSSProperties } from "react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { SceneLoader } from "@/components/scene/SceneLoader";
import { hero } from "@/content/site";
import { TypingTagline } from "./TypingTagline";

const stagger = (i: number) => ({ "--i": i, "--base": "300ms" }) as CSSProperties;

/** Splits the lede so the highlighted phrases render in the accent colour (no links). */
function Lede({ text, highlights }: { text: string; highlights: readonly string[] }) {
  const re = new RegExp(`(${highlights.map((n) => n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "g");
  return (
    <>
      {text.split(re).map((part, i) =>
        highlights.includes(part) ? (
          <span key={i} className="text-accent">
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

export function Hero() {
  return (
    <section id="top" aria-labelledby="hero-title" className="relative flex min-h-dvh items-center overflow-hidden">
      <SceneLoader />

      {/* Portrait: the bottom padding is the orb's room (it renders centred in that space). */}
      <div className="relative z-10 mx-auto w-full max-w-content px-6 pb-[22rem] pt-32 md:px-12 md:pb-16 lg:px-0 lg:pb-24">
        <p className="enter-up mb-6 font-mono text-mono font-medium text-accent md:mb-8 md:text-sm" style={stagger(1)}>
          {hero.greeting}
        </p>
        <h1 id="hero-title" className="enter-up font-display text-hero font-bold text-text-bright" style={stagger(2)}>
          {hero.name}
        </h1>
        {/* Reserve the longest phrase's height (2 lines below lg, 1 from lg) so the rotating tagline never shifts layout. */}
        <p className="enter-up mt-3 min-h-[2.4em] font-display text-tagline font-bold text-text-muted md:mt-4 lg:min-h-[1.2em]" style={stagger(3)}>
          <TypingTagline phrases={hero.taglines} />
        </p>
        <p className="enter-up mt-6 max-w-[34rem] text-lede font-medium text-text-muted md:mt-8" style={stagger(4)}>
          <Lede text={hero.lede} highlights={hero.ledeHighlights} />
        </p>
        <div className="enter-up mt-12 md:mt-14" style={stagger(5)}>
          <ButtonLink href={hero.cta.href}>{hero.cta.label}</ButtonLink>
        </div>
      </div>
    </section>
  );
}
