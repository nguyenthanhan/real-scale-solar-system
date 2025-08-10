"use client";

import { useRef } from "react";
import { useFrame, ThreeEvent } from "@react-three/fiber";
import { Sphere } from "@react-three/drei";
import type { Mesh } from "three";
import { sunData } from "@/data/planet-data";
import { usePlanetMaterial } from "@/hooks/usePlanetMaterial";

interface SunProps {
  onClick?: () => void;
  simulationSpeed: number;
}

export function Sun({ onClick, simulationSpeed }: SunProps) {
  const sunRef = useRef<Mesh | null>(null);
  const glowRef = useRef<Mesh | null>(null);
  const sunMaterial = usePlanetMaterial(sunData);

  useFrame(({ clock }) => {
    if (sunRef.current) {
      // Sun rotates once every 25.38 Earth days
      // Use elapsed time for smoother rotation
      const baseRotationSpeed = (2 * Math.PI) / (25.38 * 24 * 60 * 60); // radians per second
      const sunRotationSpeed = baseRotationSpeed * simulationSpeed;
      sunRef.current.rotation.y = sunRotationSpeed * clock.getElapsedTime();
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
        <primitive object={sunMaterial} attach="material" />
      </Sphere>

      {/* Light sources */}
      <pointLight
        position={[0, 0, 0]}
        intensity={1.5}
        distance={3000}
        decay={1}
      />
    </group>
  );
}
