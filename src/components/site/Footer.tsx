import { person, socials } from "@/content/site";
import { SocialIcon } from "./SocialIcon";

/** Socials for viewports without the side rails, plus the credit line. */
export function Footer() {
  return (
    <footer className="px-6 pb-8 pt-4 text-center">
      <ul className="mb-6 flex items-center justify-center gap-2 lg:hidden">
        {socials.map((s) => (
          <li key={s.label}>
            <a
              href={s.href}
              target={s.href.startsWith("http") ? "_blank" : undefined}
              rel={s.href.startsWith("http") ? "noopener noreferrer" : undefined}
              aria-label={s.label}
              className="inline-flex size-11 items-center justify-center rounded-sm text-accent transition-[transform,background-color] hover:-translate-y-1 hover:bg-accent-subtle"
            >
              <SocialIcon name={s.icon} size={20} strokeWidth={2.25} aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>
      <p className="font-mono text-label text-text-muted">
        Designed &amp; built by {person.name} · {person.location} · © {new Date().getFullYear()}
      </p>
    </footer>
  );
}
