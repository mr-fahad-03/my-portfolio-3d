"use client";

import { useMemo, useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { CanvasTexture, type Points, type PointsMaterial } from "three";

type Props = { count: number; color: string; opacity: number; size: number; pointer: RefObject<{ x: number; y: number }> };

/** Seeded PRNG (mulberry32): pure, so the field is identical every render. */
function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Drifting point field behind the hero. One draw call. */
/** Soft round dot, so points never render as hard squares on a light ground. */
function makeSprite() {
  const n = 64;
  const c = document.createElement("canvas");
  c.width = c.height = n;
  const ctx = c.getContext("2d");
  if (ctx) {
    const grad = ctx.createRadialGradient(n / 2, n / 2, 0, n / 2, n / 2, n / 2);
    grad.addColorStop(0, "rgba(255,255,255,1)");
    grad.addColorStop(0.4, "rgba(255,255,255,0.8)");
    grad.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, n, n);
  }
  return new CanvasTexture(c);
}

export function Particles({ count, color, opacity, size, pointer }: Props) {
  const ref = useRef<Points>(null);
  const sprite = useMemo(() => makeSprite(), []);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    const rand = rng(1337);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (rand() - 0.5) * 28;
      arr[i * 3 + 1] = (rand() - 0.5) * 16;
      arr[i * 3 + 2] = (rand() - 0.5) * 10 - 2;
    }
    return arr;
  }, [count]);

  useFrame((state, delta) => {
    const p = ref.current;
    if (!p) return;
    const dt = Math.min(delta, 0.05);
    p.rotation.y += dt * 0.03;
    p.rotation.x = Math.sin(state.clock.elapsedTime * 0.08) * 0.05;
    (p.material as PointsMaterial).opacity = opacity * (0.85 + 0.15 * Math.sin(state.clock.elapsedTime * 1.3));
    const k = 1 - Math.pow(0.001, dt);
    const px = pointer.current?.x ?? 0;
    const py = pointer.current?.y ?? 0;
    p.position.x += (px * 0.6 - p.position.x) * k;
    p.position.y += (-py * 0.4 - p.position.y) * k;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial map={sprite} alphaMap={sprite} color={color} size={size * 2.4} sizeAttenuation transparent opacity={opacity} depthWrite={false} />
    </points>
  );
}
