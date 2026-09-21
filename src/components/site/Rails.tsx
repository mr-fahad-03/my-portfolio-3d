import { person, socials } from "@/content/site";
import { SocialIcon } from "./SocialIcon";

/** Fixed side rails from lg: socials bottom-left, email vertical bottom-right. */
export function Rails() {
  return (
    <>
      <aside className="enter-up fixed bottom-0 left-10 z-30 hidden flex-col items-center lg:flex" style={{ "--base": "900ms" } as React.CSSProperties}>
        <ul className="flex flex-col items-center gap-1">
          {socials.map((s) => {
            return (
              <li key={s.label}>
                <a
                  href={s.href}
                  target={s.href.startsWith("http") ? "_blank" : undefined}
                  rel={s.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  aria-label={s.label}
                  className="inline-flex size-11 items-center justify-center text-accent transition-[color,transform] hover:-translate-y-1 hover:text-accent-hover"
                >
                  <SocialIcon name={s.icon} size={22} strokeWidth={2.25} aria-hidden="true" />
                </a>
              </li>
            );
          })}
        </ul>
        <span className="mt-4 block h-24 w-px bg-accent/60" aria-hidden="true" />
      </aside>

      <aside className="enter-up fixed bottom-0 right-10 z-30 hidden flex-col items-center lg:flex" style={{ "--base": "900ms" } as React.CSSProperties}>
        <a
          href={`mailto:${person.email}`}
          className="p-3 font-mono text-label font-medium tracking-widest text-accent no-underline transition-[color,transform] [writing-mode:vertical-rl] hover:-translate-y-1 hover:text-accent-hover"
        >
          {person.email}
        </a>
        <span className="mt-4 block h-24 w-px bg-accent/60" aria-hidden="true" />
      </aside>
    </>
  );
}
