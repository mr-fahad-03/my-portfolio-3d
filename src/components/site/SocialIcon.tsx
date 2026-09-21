import { Mail, Phone } from "lucide-react";

type IconProps = { size?: number; strokeWidth?: number } & React.SVGProps<SVGSVGElement>;

/** lucide dropped brand icons; these are drawn inline on the same 24-unit / 1.5-stroke grid. */
function Brand({ size = 22, strokeWidth = 2.25, children, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...rest}>
      {children}
    </svg>
  );
}
const Github = (p: IconProps) => (
  <Brand {...p}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </Brand>
);
const Instagram = (p: IconProps) => (
  <Brand {...p}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </Brand>
);
const Linkedin = (p: IconProps) => (
  <Brand {...p}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </Brand>
);

const icons = { github: Github, instagram: Instagram, linkedin: Linkedin, mail: Mail, phone: Phone } as const;

export type SocialIconName = keyof typeof icons;

/** Social icon by key; used by the desktop rail and the mobile drawer. */
export function SocialIcon({ name, ...props }: { name: SocialIconName } & IconProps) {
  const Icon = icons[name];
  return <Icon {...props} />;
}
