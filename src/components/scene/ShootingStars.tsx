"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { AdditiveBlending, CanvasTexture, type Mesh, type MeshBasicMaterial } from "three";

type Props = { color: string; count?: number; opacity?: number };

type Star = { active: boolean; x: number; y: number; vx: number; vy: number; life: number; maxLife: number; cooldown: number };

/** Streak texture: transparent tail → bright head, so a plain plane reads as a meteor. */
function makeStreak() {
  const w = 256, h = 8;
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  const ctx = c.getContext("2d");
  if (ctx) {
    const g = ctx.createLinearGradient(0, 0, w, 0);
    g.addColorStop(0, "rgba(255,255,255,0)");
    g.addColorStop(0.7, "rgba(255,255,255,0.35)");
    g.addColorStop(0.96, "rgba(255,255,255,1)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  }
  return new CanvasTexture(c);
}

/**
 * A few shooting stars crossing the hero every 2–6 s. Each is one thin plane
 * with a gradient alpha map, spawned at the top edge and travelling down and
 * across; opacity eases in and out over its life. Additive, low alpha — a glint.
 */
export function ShootingStars({ color, count = 3, opacity = 0.6 }: Props) {
  const width = useThree((s) => s.viewport.width);
  const height = useThree((s) => s.viewport.height);
  const meshes = useRef<Array<Mesh | null>>([]);
  const texture = useMemo(() => makeStreak(), []);
  useEffect(() => () => texture.dispose(), [texture]);

  const stars = useRef<Star[]>(
    Array.from({ length: count }, (_, i) => ({ active: false, x: 0, y: 0, vx: 0, vy: 0, life: 0, maxLife: 1, cooldown: 1.5 + i * 1.7 })),
  );

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    stars.current.forEach((s, i) => {
      const m = meshes.current[i];
      if (!m) return;
      if (!s.active) {
        s.cooldown -= dt;
        m.visible = false;
        if (s.cooldown <= 0) {
          // Spawn along the top / upper-left edge, heading down-right (mostly).
          const fromLeft = Math.random() < 0.35;
          s.x = fromLeft ? -width / 2 - 1 : (Math.random() - 0.5) * width;
          s.y = fromLeft ? (Math.random() * 0.5 + 0.2) * height / 2 : height / 2 + 0.5;
          const speed = 8 + Math.random() * 5;
          const angle = -Math.PI / 4 + (Math.random() - 0.5) * 0.5; // ~45° down-right
          s.vx = Math.cos(angle) * speed;
          s.vy = Math.sin(angle) * speed;
          s.life = 0;
          s.maxLife = 0.9 + Math.random() * 0.5;
          s.active = true;
          m.rotation.z = Math.atan2(s.vy, s.vx);
        }
        return;
      }
      s.life += dt;
      s.x += s.vx * dt;
      s.y += s.vy * dt;
      const t = s.life / s.maxLife;
      const fade = t < 0.2 ? t / 0.2 : t > 0.7 ? 1 - (t - 0.7) / 0.3 : 1;
      m.visible = true;
      m.position.set(s.x, s.y, -1.5);
      (m.material as MeshBasicMaterial).opacity = Math.max(0, fade) * opacity;
      if (t >= 1 || s.y < -height / 2 - 2) {
        s.active = false;
        s.cooldown = 2 + Math.random() * 4;
      }
    });
  });

  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <mesh
          key={i}
          ref={(el) => {
            meshes.current[i] = el;
          }}
          visible={false}
        >
          <planeGeometry args={[2.8, 0.05]} />
          <meshBasicMaterial map={texture} alphaMap={texture} color={color} transparent opacity={0} depthWrite={false} blending={AdditiveBlending} />
        </mesh>
      ))}
    </>
  );
}
