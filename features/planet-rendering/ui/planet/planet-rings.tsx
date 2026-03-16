"use client";

import { Ring } from "@react-three/drei";
import * as THREE from "three";

interface PlanetRingsProps {
  scaledSize: number;
  ringColor: string;
  ringTilt: number;
  axialTilt: number;
}

export function PlanetRings({
  scaledSize,
  ringColor,
  ringTilt,
  axialTilt,
}: PlanetRingsProps) {
  return (
    <Ring
      args={[scaledSize * 1.4, scaledSize * 2.2, 64]}
      rotation={[
        Math.PI / 2 + (axialTilt * Math.PI) / 180,
        (ringTilt * Math.PI) / 180,
        0,
      ]}
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
