"use client";

import { useRef } from "react";
import { useFrame, ThreeEvent } from "@react-three/fiber";
import { Sphere } from "@react-three/drei";
import type { Mesh } from "three";

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
      {/* Sun core */}
      <Sphere ref={sunRef} args={[2, 30, 30]} position={[0, 0, 0]}>
        <meshStandardMaterial
          color="#FDB813"
          emissive="#FDB813"
          emissiveIntensity={2}
          toneMapped={false}
        />
      </Sphere>

      {/* Light sources */}
      <pointLight
        position={[0, 0, 0]}
        intensity={2.5}
        distance={100}
        decay={2}
      />
      <pointLight
        position={[0, 0, 0]}
        intensity={1}
        distance={50}
        decay={1.5}
      />
    </group>
  );
}
