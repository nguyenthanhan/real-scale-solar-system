"use client";

import { Ring } from "@react-three/drei";
import * as THREE from "three";

interface PlanetRingsProps {
  scaledSize: number;
  ringColor?: string;
  ringTilt?: number;
}

export function PlanetRings({
  scaledSize,
  ringColor = "#CDCDCD",
  ringTilt = 0,
}: PlanetRingsProps) {
  return (
    <Ring
      args={[scaledSize * 1.4, scaledSize * 2.2, 64]}
      rotation={[Math.PI / 2, ringTilt, 0]}
    >
      <meshStandardMaterial
        color={ringColor}
        side={THREE.DoubleSide}
        transparent
        opacity={0.8}
        metalness={0.3}
        roughness={0.7}
      />
    </Ring>
  );
}
