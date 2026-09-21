"use client";

import { useRef, type RefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import type { Group } from "three";
import { Laptop } from "./Laptop";

type Props = { accent: string; body: string; screenBg: string; muted: string; wireAlpha: number; pointer: RefObject<{ x: number; y: number }> };

/**
 * The hero object: a wireframe icosahedron around a stylised MacBook, with one
 * thin orbit ring. Sits in the right third of the viewport on desktop.
 */
export function TechOrb({ accent, body, screenBg, muted, wireAlpha, pointer }: Props) {
  const group = useRef<Group>(null);
  const shell = useRef<Group>(null);
  const ring = useRef<Group>(null);
  const width = useThree((s) => s.viewport.width);
  const height = useThree((s) => s.viewport.height);
  const aspect = useThree((s) => s.viewport.aspect);
  const portrait = aspect < 1;
  // Anchored to the right edge: ring radius 2.1 × scale plus a margin that
  // clears the fixed email rail. Shrinks on narrower windows but never below 55%.
  // Landscape: shrinks with aspect, never below 55%. Portrait: sized to the canvas width.
  const scale = portrait ? Math.min(0.8, (width * 0.42) / 2.1) : Math.min(1, Math.max(0.55, (aspect - 0.9) / 0.7));
  const RING = 2.1;
  const RAIL_MARGIN = 1.0;

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;
    if (shell.current) {
      shell.current.rotation.y += dt * 0.25;
      shell.current.rotation.x += dt * 0.1;
    }
    if (ring.current) ring.current.rotation.z += dt * 0.35;
    const k = 1 - Math.pow(0.001, dt);
    const px = pointer.current?.x ?? 0;
    const py = pointer.current?.y ?? 0;
    g.rotation.y += (px * 0.35 - g.rotation.y) * k;
    g.rotation.x += (py * 0.25 - g.rotation.x) * k;
    if (portrait) {
      // Centred in the space the hero reserves under its text (see Hero's mobile padding).
      g.position.x = 0;
      g.position.y = -height / 2 + RING * scale + 0.5 + Math.sin(t * 0.9) * 0.12;
    } else {
      g.position.y = -1.1 + Math.sin(t * 0.9) * 0.15;
      g.position.x = width / 2 - RAIL_MARGIN - RING * scale;
    }
    g.scale.setScalar(scale);
  });

  return (
    <group ref={group}>
      <group ref={shell}>
        <mesh>
          <icosahedronGeometry args={[1.7, 1]} />
          <meshBasicMaterial color={accent} wireframe transparent opacity={wireAlpha} />
        </mesh>
      </group>
      <Laptop accent={accent} body={body} screenBg={screenBg} muted={muted} />
      <group ref={ring} rotation={[Math.PI / 2.6, 0.4, 0]}>
        <mesh>
          <torusGeometry args={[2.1, 0.01, 8, 128]} />
          <meshBasicMaterial color={accent} transparent opacity={0.7} />
        </mesh>
        <mesh position={[2.1, 0, 0]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshBasicMaterial color={accent} />
        </mesh>
      </group>
    </group>
  );
}
