import Image from "next/image";
import { Section } from "@/components/ui/Section";
import { about, logo, person } from "@/content/site";

export function About() {
  return (
    <Section id="about" number="01" title="About Me" narrow>
      <div className="grid gap-12 md:grid-cols-[3fr_2fr] md:gap-14">
        <div className="text-body text-text-muted">
          {about.paragraphs.map((p) => (
            <p key={p} className="mb-4">
              {p}
            </p>
          ))}
        </div>

        {/* Photo with the reference's teal offset frame. Hover: frame shifts, image loses its tint. */}
        <div className="group relative mx-auto w-full max-w-[300px] self-start md:mx-0 md:mt-2">
          <div className="absolute inset-0 translate-x-4 translate-y-4 rounded-sm border-2 border-accent transition-transform duration-base ease-out group-hover:translate-x-2.5 group-hover:translate-y-2.5" aria-hidden="true" />
          <div className="relative aspect-square overflow-hidden rounded-sm bg-accent transition-transform duration-base ease-out group-hover:-translate-x-1 group-hover:-translate-y-1">
            {about.photo ? (
              <Image
                src={about.photo}
                alt={`Portrait of ${person.name}`}
                fill
                sizes="(min-width: 768px) 300px, 80vw"
                // Face sits at ~(51%, 34%) of the source (Vision-detected); zoom 1.35× anchored just below it — the user wanted a step wider than 1.5.
                className="origin-[51%_43%] scale-[1.35] object-cover mix-blend-multiply grayscale contrast-100 transition-[filter] duration-base group-hover:mix-blend-normal group-hover:grayscale-0"
              />
            ) : (
              <div
                className="flex size-full items-center justify-center bg-surface-raised font-mono text-display font-bold text-accent mix-blend-multiply transition-[filter] duration-base group-hover:mix-blend-normal"
                role="img"
                aria-label={`${person.name} — photo coming soon`}
              >
                {logo.open}{logo.name}{logo.close}
              </div>
            )}
          </div>
        </div>
      </div>
    </Section>
  );
}
