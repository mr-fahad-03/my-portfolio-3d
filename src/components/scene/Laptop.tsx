"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { CanvasTexture, SRGBColorSpace, type Group } from "three";

type Props = { accent: string; body: string; screenBg: string; muted: string };

const W = 1.9; // laptop width (world units)
const D = 1.25; // base depth
const H = 1.2; // lid height
const T = 0.06; // base thickness
const LID_T = 0.045;
const LID_ANGLE = -1.85; // ~106° open

/** Seeded PRNG so the "code" on screen is identical every render. */
function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Draws an editor-like screen: dark ground, teal/slate code bars, a caret. */
function makeScreen(accent: string, bg: string, muted: string) {
  const w = 512, h = 320;
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  const ctx = c.getContext("2d");
  if (ctx) {
    ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
    // title bar + traffic lights
    ctx.fillStyle = "rgba(255,255,255,0.04)"; ctx.fillRect(0, 0, w, 28);
    for (const [x, col] of [[18, "#ff5f57"], [38, "#febc2e"], [58, "#28c840"]] as const) { ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, 14, 5, 0, Math.PI * 2); ctx.fill(); }
    // line numbers gutter
    ctx.fillStyle = "rgba(255,255,255,0.03)"; ctx.fillRect(0, 28, 40, h - 28);
    const rand = rng(42);
    let y = 48;
    let indent = 0;
    for (let i = 0; i < 14 && y < h - 16; i++) {
      ctx.fillStyle = muted; ctx.globalAlpha = 0.5; ctx.fillRect(12, y + 4, 14, 4); ctx.globalAlpha = 1;
      let x = 56 + indent * 28;
      const segs = 2 + Math.floor(rand() * 3);
      for (let s = 0; s < segs; s++) {
        const len = 30 + rand() * 110;
        ctx.fillStyle = rand() < 0.45 ? accent : muted;
        ctx.globalAlpha = rand() < 0.45 ? 0.95 : 0.6;
        ctx.beginPath(); ctx.roundRect(x, y, len, 10, 3); ctx.fill();
        x += len + 12;
      }
      ctx.globalAlpha = 1;
      const r = rand();
      if (r < 0.3 && indent < 3) indent++; else if (r > 0.8 && indent > 0) indent--;
      y += 20;
    }
    // caret on the last line
    ctx.fillStyle = accent; ctx.fillRect(56 + indent * 28, y, 3, 12);
  }
  const tex = new CanvasTexture(c);
  tex.colorSpace = SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

/**
 * Stylised MacBook built from primitives: base, keyboard well, trackpad,
 * hinged lid, and an emissive screen. No external model, no loader code.
 */
export function Laptop({ accent, body, screenBg, muted }: Props) {
  const group = useRef<Group>(null);
  const screen = useMemo(() => makeScreen(accent, screenBg, muted), [accent, screenBg, muted]);
  useEffect(() => () => screen.dispose(), [screen]);

  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    g.rotation.y = -0.45 + Math.sin(t * 0.35) * 0.12; // slow sway, three-quarter view
    g.rotation.x = 0.22 + Math.sin(t * 0.5) * 0.02;
  });

  return (
    <group ref={group} position={[0, -0.4, 0]} scale={1.3}>
      {/* base */}
      <mesh castShadow>
        <boxGeometry args={[W, T, D]} />
        <meshStandardMaterial color={body} metalness={0.25} roughness={0.45} emissive={body} emissiveIntensity={0.3} />
      </mesh>
      {/* keyboard well */}
      <mesh position={[0, T / 2 + 0.002, -0.12]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[W * 0.78, D * 0.42]} />
        <meshStandardMaterial color={screenBg} metalness={0.2} roughness={0.8} />
      </mesh>
      {/* trackpad */}
      <mesh position={[0, T / 2 + 0.003, D * 0.3]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[W * 0.32, D * 0.24]} />
        <meshStandardMaterial color={body} metalness={0.2} roughness={0.5} emissive={body} emissiveIntensity={0.15} />
      </mesh>
      {/* lid, hinged at the back edge */}
      <group position={[0, T / 2, -D / 2]} rotation={[LID_ANGLE, 0, 0]}>
        <mesh position={[0, 0, H / 2]}>
          <boxGeometry args={[W, LID_T, H]} />
          <meshStandardMaterial color={body} metalness={0.25} roughness={0.45} emissive={body} emissiveIntensity={0.3} />
        </mesh>
        {/* screen face: the lid's local -y side, which after the hinge rotation faces the camera */}
        <mesh position={[0, -(LID_T / 2 + 0.002), H / 2]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[W * 0.92, H * 0.86]} />
          <meshStandardMaterial map={screen} emissiveMap={screen} emissive="#ffffff" emissiveIntensity={0.9} roughness={0.6} metalness={0} />
        </mesh>
      </group>
    </group>
  );
}
