import { ImageResponse } from "next/og";
import { hero, person } from "@/content/site";
import { brand } from "@/lib/brand";

export const alt = `${person.name} — ${person.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: brand.bg,
          color: brand.text,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 28, color: brand.accent, fontFamily: "monospace" }}>Hi, my name is</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ fontSize: 104, lineHeight: 1.05, letterSpacing: -3, color: brand.bright, fontWeight: 700 }}>{`${person.name}.`}</div>
          <div style={{ fontSize: 72, lineHeight: 1.1, letterSpacing: -2, color: brand.muted, fontWeight: 700 }}>{hero.taglines[0]}</div>
        </div>
        <div style={{ fontSize: 26, color: brand.muted }}>{`${person.stackLine} · Available for remote roles worldwide`}</div>
      </div>
    ),
    size,
  );
}
