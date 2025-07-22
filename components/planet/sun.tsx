"use client";

import { useRef } from "react";
import { useFrame, ThreeEvent } from "@react-three/fiber";
import { Sphere } from "@react-three/drei";
import type { Mesh } from "three";
import { sunData } from "@/data/planet-data";

interface SunProps {
  onClick?: () => void;
}

export function Sun({ onClick }: SunProps) {
  const sunRef = useRef<Mesh | null>(null);
  const glowRef = useRef<Mesh | null>(null);

  useFrame(({ clock }) => {
    if (sunRef.current) {
      sunRef.current.rotation.y += 0.001;
    }

    if (glowRef.current) {
      // Subtle pulsing effect for the glow
      const pulse = Math.sin(clock.getElapsedTime() * 0.5) * 0.05 + 1;
      glowRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  const handleSunClick = (e: ThreeEvent<PointerEvent>): void => {
    e.stopPropagation();
    if (onClick) onClick();
  };

  return (
    <group onClick={handleSunClick}>
      {/* Sun core - TRUE TO SCALE */}
      <Sphere
        ref={sunRef}
        args={[109.2, 64, 64]} // Real scale: Sun = 109.2x Earth diameter
        position={[0, 0, 0]}
      >
        <meshStandardMaterial
          color={sunData.color}
          emissive={sunData.color}
          emissiveIntensity={2}
          toneMapped={false}
        />
      </Sphere>

      {/* Light sources */}
      <pointLight
        position={[0, 0, 0]}
        intensity={3.0}
        distance={5000}
        decay={1}
      />
      <pointLight
        position={[0, 0, 0]}
        intensity={1.5}
        distance={3000}
        decay={1}
      />
    </group>
  );
}
