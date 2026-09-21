import Image from "next/image";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { projects } from "@/content/site";
import { cn } from "@/lib/cn";

/**
 * Featured projects as alternating rows, as in the reference: a tinted
 * screenshot on one side, an overlapping description card on the other.
 * Rows fade up as they enter; the tint lifts and the image scales on hover.
 */
export function Work() {
  return (
    <Section id="work" number="04" title="Selected Work">
      <ol className="space-y-24 md:space-y-28">
        {projects.map((p, i) => {
          const flip = i % 2 === 1; // odd rows: image right, text left
          return (
            <Reveal key={p.domain} as="li" className="group relative grid items-center md:grid-cols-12">
                {/* screenshot */}
                <a
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open ${p.name} (${p.domain}) in a new tab`}
                  className={cn("relative z-0 col-span-full block overflow-hidden rounded-md border border-border md:col-span-7 md:row-start-1", flip ? "md:col-start-6" : "md:col-start-1")}
                >
                  <span aria-hidden="true" className="absolute inset-0 z-10 bg-accent/80 mix-blend-multiply transition-opacity duration-slow ease-out group-hover:opacity-0 md:bg-accent/70" />
                  <Image
                    src={p.image}
                    alt={`Screenshot of ${p.name}`}
                    width={1440}
                    height={720}
                    sizes="(min-width: 768px) 60vw, 100vw"
                    className="block aspect-[2/1] w-full object-cover object-top grayscale contrast-100 transition-[transform,filter] duration-slow ease-out group-hover:scale-[1.03] group-hover:grayscale-0"
                  />
                </a>

                {/* text — overlaps the image on desktop, sits on a card over it on mobile */}
                <div className={cn("relative z-10 -mt-16 mx-4 md:col-span-6 md:row-start-1 md:m-0", flip ? "md:col-start-1 md:text-left" : "md:col-start-7 md:text-right")}>
                  <p className="font-mono text-mono font-medium text-accent">Featured Project</p>
                  <h3 className="mt-2 font-display text-h3 font-bold text-text md:text-[1.75rem]">
                    <a href={p.href} target="_blank" rel="noopener noreferrer" className="no-underline transition-colors hover:text-accent">
                      {p.name}
                    </a>
                  </h3>
                  <div className="mt-5 rounded-md border border-border bg-surface p-6 text-body text-text-muted shadow-header transition-[transform,border-color] duration-slow ease-out group-hover:border-accent/40 md:group-hover:-translate-y-1">
                    {/* One paragraph, in the user's own wording: what it is, then what they built. */}
                    <p>
                      {p.what} Built the {p.built}
                    </p>
                  </div>
                  <ul className={cn("mt-5 flex flex-wrap gap-x-5 gap-y-2 font-mono text-mono text-text-muted", !flip && "md:justify-end")}>
                    {p.tags.map((t) => <li key={t}>{t}</li>)}
                  </ul>
                  <p className={cn("mt-4 font-mono text-mono", !flip && "md:text-right")}>
                    <a href={p.href} target="_blank" rel="noopener noreferrer" className="link-inline font-medium">
                      {p.domain} ↗<span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </p>
                </div>
            </Reveal>
          );
        })}
      </ol>
    </Section>
  );
}
