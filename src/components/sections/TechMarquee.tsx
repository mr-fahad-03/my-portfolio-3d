import { technologies, waysOfWorking } from "@/content/site";
import { TechIcon, techColor } from "./TechIcon";

/** Two counter-scrolling rows: logos, then ways of working. Pauses on hover; static under reduced motion. */
export function TechMarquee() {
  const logos = [...technologies, ...technologies]; // duplicated so the -50% loop is seamless
  const ways = [...waysOfWorking, ...waysOfWorking, ...waysOfWorking, ...waysOfWorking];
  return (
    <div className="mt-16 space-y-4" aria-hidden="true">
      <div className="marquee overflow-hidden">
        <div className="marquee-track gap-3 motion-reduce:animate-none" style={{ "--marquee-duration": "55s" } as React.CSSProperties}>
          {logos.map((t, i) => (
            <span key={`${t.name}-${i}`} className="flex items-center gap-2.5 rounded-full border border-border bg-surface px-4 py-2 font-mono text-mono text-text-muted">
              <TechIcon name={t.icon} className="size-4" style={{ color: techColor(t.icon) }} />
              {t.name}
            </span>
          ))}
        </div>
      </div>
      <div className="marquee overflow-hidden">
        <div className="marquee-track gap-8 motion-reduce:animate-none" data-reverse="true" style={{ "--marquee-duration": "45s" } as React.CSSProperties}>
          {ways.map((w, i) => (
            <span key={`${w}-${i}`} className="flex items-center gap-8 font-display text-h3 font-bold text-text-faint">
              {w}
              <span className="size-1.5 rounded-full bg-accent" />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
