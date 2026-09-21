import type { CSSProperties } from "react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Reveal } from "@/components/ui/Reveal";
import { person } from "@/content/site";
import { CopyEmail } from "./CopyEmail";

const stagger = (i: number) => ({ "--i": i } as CSSProperties);

/** Centred closing block, as in the reference, with direct details underneath. */
export function Contact() {
  return (
    <Reveal as="section" className="contact mx-auto w-full max-w-[40rem] px-6 pb-32 pt-24 text-center md:px-12 lg:px-0 lg:pt-32">
      <div id="contact" aria-labelledby="contact-title" className="scroll-mt-24">
        <p className="c-item font-mono text-mono font-medium text-accent" style={stagger(0)}>
          05. What&apos;s Next?
        </p>
        <h2 id="contact-title" className="c-item mt-4 font-display text-hero font-bold text-text-bright" style={stagger(1)}>
          Get In Touch
        </h2>
        <p className="c-item mx-auto mt-6 max-w-[34rem] text-body text-text-muted" style={stagger(2)}>
          I&apos;m open to remote full-stack roles worldwide and to relocation to the UK, US or EU with sponsorship. If you&apos;re hiring, or have a project in mind, my inbox is open — I&apos;ll get back to you.
        </p>
        <div className="c-item mt-12" style={stagger(3)}>
          <ButtonLink href={`mailto:${person.email}`} className="btn-offset">
            Say Hello
          </ButtonLink>
        </div>

        {/* Intrinsic-width items that wrap — fixed columns let the email overflow under its neighbour and block the Copy button. */}
        <dl className="c-item mt-16 flex flex-col items-center gap-x-12 gap-y-8 border-t border-border pt-10 sm:flex-row sm:flex-wrap sm:items-start sm:justify-center" style={stagger(4)}>
          <div className="text-center">
            <dt className="font-mono text-label uppercase tracking-wider text-text-faint">Email</dt>
            <dd className="mt-2">
              <CopyEmail email={person.email} />
            </dd>
          </div>
          <div className="text-center">
            <dt className="font-mono text-label uppercase tracking-wider text-text-faint">Phone</dt>
            <dd className="mt-2">
              <a href={person.phoneHref} className="link-inline font-mono text-sm font-medium">
                {person.phone}
              </a>
            </dd>
          </div>
          <div className="text-center">
            <dt className="font-mono text-label uppercase tracking-wider text-text-faint">LinkedIn</dt>
            <dd className="mt-2">
              <a href={person.linkedin.href} target="_blank" rel="noopener noreferrer" className="link-inline font-mono text-sm font-medium">
                {person.linkedin.label.replace("linkedin.com/in/", "in/")}<span className="sr-only"> (opens in a new tab)</span>
              </a>
            </dd>
          </div>
        </dl>
      </div>
    </Reveal>
  );
}
