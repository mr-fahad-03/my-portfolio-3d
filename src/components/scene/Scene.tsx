"use client";

import { useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Particles } from "./Particles";
import { TechOrb } from "./TechOrb";
import { ShootingStars } from "./ShootingStars";
import { useCssToken } from "./hooks/useCssToken";
import type { SceneTier } from "./hooks/useSceneTier";
import { brand } from "@/lib/brand";

type Props = {
  tier: Exclude<SceneTier, "poster">;
  active: boolean;
  onReady: () => void;
  onContextLost: () => void;
};

/** The one canvas: a particle field across the hero and the orb — right of the text on desktop, under it on portrait. */
export default function Scene({ tier, active, onReady, onContextLost }: Props) {
  const accent = useCssToken("--accent", brand.accent);
  const core = useCssToken("--scene-core", brand.sceneCore);
  const screenBg = useCssToken("--scene-screen", brand.bg);
  const muted = useCssToken("--text-muted", brand.muted);
  const particleAlpha = parseFloat(useCssToken("--scene-particle-alpha", "0.55"));
  const particleSize = parseFloat(useCssToken("--scene-particle-size", "0.05"));
  const wireAlpha = parseFloat(useCssToken("--scene-wire-alpha", "0.35"));
  const starAlpha = parseFloat(useCssToken("--scene-star-alpha", "0.6"));
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (tier !== "full") return;
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [tier]);

  return (
    <Canvas
      dpr={tier === "lite" ? 1 : [1, 2]}
      camera={{ position: [0, 0, 9], fov: 45 }}
      frameloop={active ? "always" : "never"}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      events={undefined}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener("webglcontextlost", (e) => {
          e.preventDefault();
          onContextLost();
        });
        onReady();
      }}
    >
      {/* White key so the core keeps its own colour; accent only as a rim. */}
      <ambientLight intensity={0.8} />
      <pointLight position={[6, 5, 7]} intensity={45} />
      <pointLight position={[-6, -3, 4]} intensity={14} color={accent} />
      <Particles count={tier === "full" ? 1600 : 600} color={accent} opacity={particleAlpha} size={particleSize} pointer={pointer} />
      <ShootingStars color={accent} count={tier === "full" ? 3 : 2} opacity={starAlpha} />
      <TechOrb accent={accent} body={core} screenBg={screenBg} muted={muted} wireAlpha={wireAlpha} pointer={pointer} />
    </Canvas>
  );
}
