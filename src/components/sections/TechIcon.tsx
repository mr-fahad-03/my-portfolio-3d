import { Cloud, KeyRound, Waypoints } from "lucide-react";
import {
  siCss,
  siDocker,
  siExpress,
  siFlutter,
  siGit,
  siGithubactions,
  siHtml5,
  siJavascript,
  siMongodb,
  siMongoose,
  siMysql,
  siNestjs,
  siNextdotjs,
  siNodedotjs,
  siPostgresql,
  siPrisma,
  siPython,
  siReact,
  siRedux,
  siTailwindcss,
  siTypescript,
  siVercel,
} from "simple-icons";

type Simple = { path: string; hex: string; title: string };

const simple: Record<string, Simple> = {
  react: siReact, nextjs: siNextdotjs, typescript: siTypescript, javascript: siJavascript, redux: siRedux,
  tailwind: siTailwindcss, html: siHtml5, css: siCss, node: siNodedotjs, express: siExpress, nestjs: siNestjs,
  postgres: siPostgresql, mysql: siMysql, mongodb: siMongodb, mongoose: siMongoose, prisma: siPrisma,
  docker: siDocker, vercel: siVercel, git: siGit, githubactions: siGithubactions, python: siPython, flutter: siFlutter,
};

/** Concepts without a logo, and AWS (removed from simple-icons) — lucide glyphs in a brand-ish colour. */
const glyph: Record<string, { Icon: typeof Cloud; hex: string }> = {
  aws: { Icon: Cloud, hex: "FF9900" },
  api: { Icon: Waypoints, hex: "64FFDA" },
  auth: { Icon: KeyRound, hex: "64FFDA" },
};

/** Brand colour for the hover state, as a CSS colour string. Black logos get the page's light ink instead. */
export function techColor(key: string): string {
  const hex = simple[key]?.hex ?? glyph[key]?.hex ?? "64FFDA";
  return ["000000", "0A0A0A", "181717", "2D3748"].includes(hex) ? "var(--text-bright)" : `#${hex}`;
}

export function TechIcon({ name, className, style }: { name: string; className?: string; style?: React.CSSProperties }) {
  const s = simple[name];
  if (s) {
    return (
      <svg viewBox="0 0 24 24" className={className} style={style} aria-hidden="true" focusable="false" fill="currentColor">
        <path d={s.path} />
      </svg>
    );
  }
  const g = glyph[name];
  if (g) return <g.Icon className={className} style={style} strokeWidth={1.75} aria-hidden="true" />;
  return null;
}
